// plugins/my-image-optimizer/index.js

const path = require("path");
const fs = require("fs/promises");
const { glob } = require("glob");
const sharp = require("sharp");

const compressionOptions = {
  jpeg: { quality: 90, mozjpeg: true },
  png: { compressionLevel: 9, palette: true },
  webp: { quality: 90 },
  avif: { quality: 90 },
};

/**
 * 自定义 Docusaurus 插件，用于在构建后优化图片
 */
module.exports = function (context, options) {
  return {
    // 插件的名称
    name: "image-optimizer",

    // 实现 Docusaurus 的 postBuild 生命周期钩子
    // 这个函数会在 `docusaurus build` 命令成功执行后被调用
    async postBuild({ outDir }) {
      console.log("🖼️  [Image Optimizer]: Starting image optimization...");

      // 1. 定义要查找的图片文件模式
      const imagePattern = "**/*.{png,jpg,jpeg,webp,avif}";

      // 2. 使用 glob 查找 build 输出目录中的所有图片
      const images = await glob(
        path.join(outDir, imagePattern).replace(/\\/g, "/")
      );

      if (images.length === 0) {
        console.log("✅ [Image Optimizer]: No images found to optimize.");
        return;
      }

      console.log(
        `🔍 [Image Optimizer]: Found ${images.length} images to process.`
      );

      let totalSavedBytes = 0;
      let optimizedCount = 0;

      // 3. 并行处理所有找到的图片
      await Promise.all(
        images.map(async (imagePath) => {
          try {
            const originalBuffer = await fs.readFile(imagePath);
            const originalSize = originalBuffer.length;

            const ext = path.extname(imagePath).toLowerCase();
            let optimizedBuffer;

            switch (ext) {
              case ".jpg":
              case ".jpeg":
                optimizedBuffer = await sharp(originalBuffer)
                  .jpeg(compressionOptions.jpeg)
                  .toBuffer();
                break;
              case ".png":
                optimizedBuffer = await sharp(originalBuffer)
                  .png(compressionOptions.png)
                  .toBuffer();
                break;
              case ".webp":
                optimizedBuffer = await sharp(originalBuffer)
                  .webp(compressionOptions.webp)
                  .toBuffer();
                break;
              case ".avif":
                optimizedBuffer = await sharp(originalBuffer)
                  .avif(compressionOptions.avif)
                  .toBuffer();
                break;
              default:
                return; // 跳过不支持的格式
            }

            const optimizedSize = optimizedBuffer.length;
            const savedBytes = originalSize - optimizedSize;

            // 5. 只有在压缩后体积变小的情况下，才覆盖原文件
            if (savedBytes > 0) {
              await fs.writeFile(imagePath, optimizedBuffer);
              totalSavedBytes += savedBytes;
              optimizedCount++;
              console.log(
                `  ✅ Optimized: ${path
                  .basename(imagePath)
                  .padEnd(50)} ${bytesToHuman(originalSize)} → ${bytesToHuman(
                  optimizedSize
                )}`
              );
            }
          } catch (error) {
            console.error(`  ❌ Failed to optimize ${imagePath}:`, error);
          }
        })
      );

      // 6. 打印最终的优化报告
      console.log(`\n🎉 [Image Optimizer]: Finished!`);
      console.log(`   Optimized ${optimizedCount} images.`);
      console.log(`   Total savings: ${bytesToHuman(totalSavedBytes)}.`);
    },
  };
};

/**
 * 将字节数转换为人类可读的格式。
 *
 * @param {number} bytes - 要转换的字节数。
 * @param {number} [decimals=2] - 保留的小数位数，默认是2。
 * @returns {string} - 转换后的字符串，包含数值和单位。
 */
function bytesToHuman(bytes, decimals = 2) {
  if (!Number.isInteger(bytes) || bytes < 0) {
    throw new Error("输入必须是非负整数");
  }

  if (bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
