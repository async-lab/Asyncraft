const { optimizePath } = require("./optimizer");

/**
 * 自定义 Docusaurus 插件，用于在构建后优化图片
 */
module.exports = function imageOptimizerPlugin() {
  return {
    name: "image-optimizer",

    async postBuild({ outDir }) {
      console.log("🖼️  [Image Optimizer]: Starting post-build image optimization...");
      await optimizePath(outDir, {
        format: "keep",
        logPrefix: "🖼️  [Image Optimizer]:",
      });
    },
  };
};
