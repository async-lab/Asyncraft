# Asyncraft

Asyncraft的网站源码

基于[Docusaurus](https://docusaurus.io/)构建

## 图片优化工具 (Image Optimizer)

站点内置了基于 [Sharp](https://sharp.pixelplumbing.com/) 的图片优化工具（位于 `plugins/image-optimizer/`）。

- **构建自动执行**：在 `pnpm build`（即 Docusaurus `postBuild` 阶段）时，会自动对打包产物执行同格式原位压缩（保留原格式与路径，体积未缩减时自动跳过）。
- **手动优化源文件**：支持通过 CLI 命令行或 JS 函数对 `static/` 源码目录中的图片进行原位压缩或转码为 AVIF/WebP。

### 命令行调用 (CLI)

```bash
# 1. 对 static/img 目录下的源文件进行同格式原地压缩
pnpm optimize:images static/img

# 2. 将单张图片转为 AVIF 格式（生成同名 .avif 文件，默认保留原图）
pnpm optimize:images static/img/组织/scmcu.jpg --format=avif

# 3. 批量将目录内图片转为 AVIF 并删除原文件
pnpm optimize:images static/img/活动 --format=avif --remove-original

# 4. 指定压缩质量与强制重压
pnpm optimize:images static/img/oopz.png --format=webp --quality=85 --force
```

#### CLI 参数说明

| 参数 | 说明 | 默认值 |
| :--- | :--- | :--- |
| `<path>` | 必填，目标文件路径或目录路径 | - |
| `--format=<keep\|avif\|webp\|jpeg\|png>` | 目标格式。`keep` 为保持原格式就地压缩 | `keep` |
| `--remove-original` | 转换为新格式后删除源文件（原格式同路径时不生效） | `false` |
| `--force` | 强制压缩（跳过 BPP 像素密度阈值和体积增加保护） | `false` |
| `--quality=<number>` | 覆盖预设的各格式压缩质量 | 预设质量 |
| `--silent` | 静默模式，只在最后输出汇总报告 | `false` |

### 代码调用 (Node.js API)

```javascript
const { optimizeImage, optimizePath } = require("./plugins/image-optimizer/optimizer");

// 优化单张图片
await optimizeImage("static/img/组织/scmcu.jpg", {
  format: "avif",          // 可选: 'keep' | 'avif' | 'webp' | 'jpeg' | 'png'
  removeOriginal: false,   // 是否删除原文件
  force: false,            // 是否跳过 BPP 阈值判断
});

// 批量优化整个目录
await optimizePath("static/img/活动", {
  format: "avif",
  removeOriginal: true,
});
```
