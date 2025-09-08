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
                `  ✅ Optimized: ${path.basename(imagePath)} (saved ${(
                  savedBytes / 1024
                ).toFixed(2)} KB)`
              );
            }
          } catch (error) {
            console.error(`  ❌ Failed to optimize ${imagePath}:`, error);
          }
        })
      );

      // 6. 打印最终的优化报告
      const totalSavedMB = (totalSavedBytes / (1024 * 1024)).toFixed(2);
      console.log(`\n🎉 [Image Optimizer]: Finished!`);
      console.log(`   Optimized ${optimizedCount} images.`);
      console.log(`   Total savings: ${totalSavedMB} MB.`);
    },
  };
};
