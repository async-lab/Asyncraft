# Image Optimizer Plugin

Docusaurus 构建后图片压缩插件 & 手动图片转码工具。

## 目录结构

- `index.js`: Docusaurus 插件入口，注册 `postBuild` 生命周期钩子。
- `optimizer.js`: 核心优化模块，导出 API 并支持 CLI 独立调用。

## 功能特性

1. **同格式原位压缩**：默认情况下（`format: 'keep'`），保持原图片格式和文件名不变，仅在体积减小时覆写，防止产物路径断裂（404）。
2. **现代格式转换**：支持按需将 PNG / JPG 转码为 AVIF 或 WebP。
3. **BPP 智能跳过**：依据图片分辨率和像素大小（Bytes Per Pixel）检测，低于阈值（已经是高压缩比）的图片自动跳过，避免无效计算。
4. **灵活调用**：
   - 随 `pnpm build` 自动触发
   - 终端命令 `pnpm optimize:images <path> [flags]`
   - Node.js 模块导入 `const { optimizeImage, optimizePath } = require('./optimizer')`
