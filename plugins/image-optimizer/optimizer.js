const path = require("path");
const fs = require("fs/promises");
const { existsSync } = require("fs");
const { glob } = require("glob");
const sharp = require("sharp");

const MIN_BYTES_PER_PIXEL = 0.2;
const MIN_BPP_BY_FORMAT = {
  ".jpg": 0.2,
  ".jpeg": 0.2,
  ".png": 0.5,
  ".webp": 0.15,
  ".avif": 0.1,
};

const COMPRESSION_OPTIONS = {
  jpeg: { quality: 85, mozjpeg: true },
  png: { compressionLevel: 9, palette: true },
  webp: { quality: 90 },
  avif: { quality: 80 },
};

/**
 * 将字节数转换为人类可读的字符串
 */
function bytesToHuman(bytes, decimals = 2) {
  if (!Number.isInteger(bytes) || bytes < 0) {
    return "0 B";
  }
  if (bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * 优化单张图片
 * @param {string} imagePath - 原图片路径
 * @param {object} options
 * @param {'keep'|'avif'|'webp'|'jpeg'|'png'} [options.format='keep'] - 目标格式，'keep' 表示保持原格式
 * @param {string} [options.outputPath] - 指定输出路径，未指定则根据 format 推导
 * @param {boolean} [options.force=false] - 是否强制优化（跳过 bpp 阈值与体积增加保护）
 * @param {boolean} [options.removeOriginal=false] - 转换为新格式后是否删除原文件（同路径覆盖不受影响）
 * @param {object} [options.compressionOptions] - 自定义压缩参数，与默认参数合并
 * @param {boolean} [options.silent=false] - 是否静默模式
 * @returns {Promise<{success: boolean, originalPath: string, outputPath: string, originalSize: number, optimizedSize: number, savedBytes: number, skipped?: boolean, reason?: string}>}
 */
async function optimizeImage(imagePath, options = {}) {
  const {
    format = "keep",
    outputPath: customOutputPath,
    force = false,
    removeOriginal = false,
    compressionOptions = {},
    silent = false,
  } = options;

  const mergedCompression = {
    jpeg: { ...COMPRESSION_OPTIONS.jpeg, ...(compressionOptions.jpeg || {}) },
    png: { ...COMPRESSION_OPTIONS.png, ...(compressionOptions.png || {}) },
    webp: { ...COMPRESSION_OPTIONS.webp, ...(compressionOptions.webp || {}) },
    avif: { ...COMPRESSION_OPTIONS.avif, ...(compressionOptions.avif || {}) },
  };

  const originalBuffer = await fs.readFile(imagePath);
  const originalSize = originalBuffer.length;
  const originalExt = path.extname(imagePath).toLowerCase();

  // 确定目标格式与输出路径
  let targetFormat = format === "keep" ? originalExt.replace(/^\./, "") : format.toLowerCase().replace(/^\./, "");
  if (targetFormat === "jpg") targetFormat = "jpeg";

  const targetExt = targetFormat === "jpeg" ? (originalExt === ".jpeg" ? ".jpeg" : ".jpg") : `.${targetFormat}`;
  const outputPath = customOutputPath || (
    format === "keep"
      ? imagePath
      : path.join(
          path.dirname(imagePath),
          `${path.basename(imagePath, originalExt)}${targetExt}`
        )
  );

  // 原格式压缩时的最小 bpp 检查
  if (!force && format === "keep") {
    const minBpp = MIN_BPP_BY_FORMAT[originalExt] ?? MIN_BYTES_PER_PIXEL;
    const metadata = await sharp(originalBuffer).metadata();
    const { width, height } = metadata;
    if (width && height) {
      const bytesPerPixel = originalSize / (width * height);
      if (bytesPerPixel < minBpp) {
        if (!silent) {
          console.log(
            `  ⚠️ Skipped: ${path.basename(imagePath).padEnd(45)} BPP ${bytesPerPixel.toFixed(3)} < ${minBpp}`
          );
        }
        return {
          success: true,
          skipped: true,
          reason: `bpp_below_threshold (${bytesPerPixel.toFixed(3)} < ${minBpp})`,
          originalPath: imagePath,
          outputPath,
          originalSize,
          optimizedSize: originalSize,
          savedBytes: 0,
        };
      }
    }
  }

  // 执行 Sharp 转码
  let pipeline = sharp(originalBuffer);
  switch (targetFormat) {
    case "jpeg":
      pipeline = pipeline.jpeg(mergedCompression.jpeg);
      break;
    case "png":
      pipeline = pipeline.png(mergedCompression.png);
      break;
    case "webp":
      pipeline = pipeline.webp(mergedCompression.webp);
      break;
    case "avif":
      pipeline = pipeline.avif(mergedCompression.avif);
      break;
    default:
      throw new Error(`Unsupported target format: ${targetFormat}`);
  }

  const optimizedBuffer = await pipeline.toBuffer();
  const optimizedSize = optimizedBuffer.length;
  const savedBytes = originalSize - optimizedSize;

  // 如果体积没有减小且没有开启 force，并且是同路径覆盖，则不覆盖
  const isSameFile = path.resolve(imagePath) === path.resolve(outputPath);
  if (isSameFile && savedBytes <= 0 && !force) {
    if (!silent) {
      console.log(
        `  ⚠️ Skipped: ${path.basename(imagePath).padEnd(45)} no size reduction (${bytesToHuman(originalSize)} → ${bytesToHuman(optimizedSize)})`
      );
    }
    return {
      success: true,
      skipped: true,
      reason: "no_size_reduction",
      originalPath: imagePath,
      outputPath,
      originalSize,
      optimizedSize: originalSize,
      savedBytes: 0,
    };
  }

  // 确保目标目录存在
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, optimizedBuffer);

  // 如果转码为新文件且要求删除原文件
  if (!isSameFile && removeOriginal) {
    await fs.unlink(imagePath);
  }

  if (!silent) {
    console.log(
      `  ✅ Optimized: ${path.basename(imagePath).padEnd(45)} ${bytesToHuman(originalSize)} → ${bytesToHuman(optimizedSize)} (${savedBytes >= 0 ? "-" : "+"}${bytesToHuman(Math.abs(savedBytes))})`
    );
  }

  return {
    success: true,
    skipped: false,
    originalPath: imagePath,
    outputPath,
    originalSize,
    optimizedSize,
    savedBytes,
  };
}

/**
 * 递归或按路径批量优化图片
 * @param {string} targetPath - 目标文件路径或目录路径
 * @param {object} options - 与 optimizeImage 相同的选项
 * @returns {Promise<{processedCount: number, skippedCount: number, totalSavedBytes: number, results: Array}>}
 */
async function optimizePath(targetPath, options = {}) {
  const { logPrefix = "[Image Optimizer]", silent = false } = options;

  if (!existsSync(targetPath)) {
    throw new Error(`Target path does not exist: ${targetPath}`);
  }

  const stat = await fs.stat(targetPath);
  let files = [];

  if (stat.isDirectory()) {
    const pattern = path.join(targetPath, "**/*.{png,jpg,jpeg,webp,avif}").replace(/\\/g, "/");
    files = await glob(pattern, { nodir: true });
  } else {
    files = [targetPath];
  }

  if (files.length === 0) {
    if (!silent) console.log(`${logPrefix} No images found in ${targetPath}`);
    return { processedCount: 0, skippedCount: 0, totalSavedBytes: 0, results: [] };
  }

  if (!silent) {
    console.log(`${logPrefix} Processing ${files.length} images in ${targetPath}...`);
  }

  let totalSavedBytes = 0;
  let processedCount = 0;
  let skippedCount = 0;
  const results = [];

  // 并行处理图片
  await Promise.all(
    files.map(async (file) => {
      try {
        const res = await optimizeImage(file, options);
        results.push(res);
        if (res.skipped) {
          skippedCount++;
        } else {
          processedCount++;
          totalSavedBytes += Math.max(0, res.savedBytes);
        }
      } catch (err) {
        console.error(`  ❌ Failed to optimize ${file}:`, err.message);
        results.push({ success: false, originalPath: file, error: err.message });
      }
    })
  );

  if (!silent) {
    console.log(`\n🎉 ${logPrefix} Finished!`);
    console.log(`   Optimized: ${processedCount} images`);
    console.log(`   Skipped:   ${skippedCount} images`);
    console.log(`   Saved:     ${bytesToHuman(totalSavedBytes)}`);
  }

  return {
    processedCount,
    skippedCount,
    totalSavedBytes,
    results,
  };
}

// 支持 CLI 命令行直接运行：node plugins/image-optimizer/optimizer.js <path> [flags]
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
Usage:
  node plugins/image-optimizer/optimizer.js <path-or-file> [options]

Options:
  --format=<keep|avif|webp|jpeg|png>  Target format (default: keep)
  --force                             Force recompression even if size increases or BPP is low
  --remove-original                   Remove the source file when converting to a different format
  --quality=<number>                  Override compression quality
  --silent                            Suppress per-file output

Examples:
  # In-place optimize all images in static/img
  node plugins/image-optimizer/optimizer.js static/img

  # Convert a specific image to AVIF
  node plugins/image-optimizer/optimizer.js static/img/组织/scmcu.jpg --format=avif

  # Convert folder to AVIF and delete original JPG/PNG
  node plugins/image-optimizer/optimizer.js static/img/活动 --format=avif --remove-original
`);
    process.exit(0);
  }

  const targetPath = args.find((arg) => !arg.startsWith("--"));
  const formatArg = args.find((arg) => arg.startsWith("--format="));
  const qualityArg = args.find((arg) => arg.startsWith("--quality="));
  const force = args.includes("--force");
  const removeOriginal = args.includes("--remove-original");
  const silent = args.includes("--silent");

  const format = formatArg ? formatArg.split("=")[1] : "keep";
  const quality = qualityArg ? parseInt(qualityArg.split("=")[1], 10) : undefined;

  const compressionOptions = quality
    ? {
        jpeg: { quality },
        webp: { quality },
        avif: { quality },
      }
    : {};

  optimizePath(targetPath, {
    format,
    force,
    removeOriginal,
    compressionOptions,
    silent,
  }).catch((err) => {
    console.error("Execution failed:", err);
    process.exit(1);
  });
}

module.exports = {
  optimizeImage,
  optimizePath,
  bytesToHuman,
  COMPRESSION_OPTIONS,
  MIN_BPP_BY_FORMAT,
};
