# 首钢园 · 两山实践档案

“习近平新时代中国特色社会主义思想概论”课程社会实践项目的展示网站。

以“从十里钢城到生态秀场”为主线，用 8 篇档案式文章、四个转化、一条时间线、五点位调研路线和一组实地照片，记录首钢园从钢铁工业遗存到生态秀场的转型。

## 项目信息

- 学校：中国地质大学（北京）
- 学院：地球科学与资源学院
- 课程：习近平新时代中国特色社会主义思想概论 · 社会实践
- 展示日期：2026.10.24
- 团队：两山实践调研队（成员名单与指导教师待补充）

## 技术栈

- Next.js 16 App Router + TypeScript
- Tailwind CSS v4
- MDX（`@mdx-js/mdx`）
- Pagefind 全文搜索
- next-themes 深浅色主题
- 纯静态导出（`output: "export"`），部署到 GitHub Pages

## 本地运行

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # next build + postbuild（.nojekyll、Pagefind、404 校验）
npm run preview    # 零依赖静态服务器，默认 http://localhost:4173
npm run typecheck
npm run lint
```

搜索索引在构建后生成；开发模式下搜索面板会提示索引尚未生成，这是预期行为。

`next.config.ts` 将静态生成限制为 2 个 worker（`experimental.cpus: 2`），适合笔记本/低配设备；性能更好的机器可以调高。图片优化脚本也把 `sharp` 限制为单线程，避免整机满载发热。

## 页面结构

| 页面 | 路径 | 内容 |
| --- | --- | --- |
| 首页 | `/` | 主题 hero、四个转化、章节入口、时间线、数据账本、图集/路线预览、团队 |
| 调研档案 | `/archive` | 按五个篇目分组的 8 篇章节 |
| 章节 | `/archive/<slug>` | 文章正文、封面、目录、上下章、主题标签 |
| 时间线 | `/timeline` | 1919—2025 的 19 个节点，含 10 张历史/现场影像 |
| 实地图集 | `/gallery` | 园区沙盘 + 44 张照片，分类筛选 + 灯箱 |
| 调研路线 | `/route` | 五点位路线、观察任务、低碳公约 |
| 团队 | `/team` | 课程背景、分工、现场手记 |
| 参考资料 | `/sources` | A/B/C 证据分级、43 条参考文献、图片与数据说明 |
| 主题索引 | `/tags` | 8 个主题的过滤页 |

## 内容写作

章节是扁平结构，文件名就是 URL slug：

```text
content/zh/docs/
  why-shougang.mdx        -> /archive/why-shougang
  method.mdx              -> /archive/method
  three-turns.mdx         -> /archive/three-turns
  minerals.mdx            -> /archive/minerals
  ecology.mdx             -> /archive/ecology
  geotourism.mdx          -> /archive/geotourism
  four-transformations.mdx
  youth.mdx
```

Frontmatter 示例：

```yaml
---
title: 为什么是首钢园
description: 从安吉余村到一座百年钢城，我们为什么选择首钢园作为“两山”理念的观察样本。
chapter: "01"
part: "缘起与设计"
date: 2026-10-01
updated: 2026-10-24
tags: [theory, fieldwork]
order: 10
cover: /images/chapters/01.jpg
coverAlt: 首钢园鸟瞰
coverCredit: 资料图，来源于小组汇报 PPT，仅作课堂展示
---
```

- `part` 决定档案页的篇目分组；可选值为 `src/data/parts.ts` 中的五个篇目。
- `chapter` 显示在文章元信息里。
- `cover` 是章节封面；`coverCredit` 会显示在封面下方。
- 主题标签必须先在 `src/config/tags.ts` 注册。

正文可用的 MDX 组件：

- `<Callout type="note|tip|warning|danger" title="...">...</Callout>`
- `<Figure src="/images/..." alt="..." caption="..." credit="..." />`
- `<PullQuote source="...">...</PullQuote>`

## 数据与素材

- `src/data/timeline.ts`：时间线节点与历史影像
- `src/data/stats.ts`：首页数据账本
- `src/data/route.ts`：五点位路线与低碳公约
- `src/data/team.ts`：团队信息与分工（学校/学院/课程/地点读取 `src/config/site.ts`）
- `src/data/field-notes.ts`：现场手记（基于照片与公开资料的展示化整理，非逐字访谈）
- `src/data/references.json`：43 条参考文献
- `src/data/gallery.json`：图集索引（由脚本生成）
- `public/images/`：优化后的网页图片
- `public/images/timeline/`：时间线历史/现场影像
- `public/images/map/`：园区沙盘图
- `refer/`：原始 PPTX/DOCX 与实地照片，**不参与网站构建**，已加入 `.gitignore`，不进入仓库

### 素材提取（可选）

```bash
python -I scripts/extract_office.py --out refer/extracted \
  "refer/首钢园两山理念社会实践调研报告.docx" \
  "refer/首钢园两山理念社会实践汇报PPT.pptx"

python -I scripts/structure_report.py
python -I scripts/extract_references.py
node scripts/optimize-images.mjs
```

- 文档是 Office 文本型文件，直接解析文本层，比 OCR 更准确。
- `scripts/optimize-images.mjs` 读取 `refer/figures/` 与 PPT 内嵌图，生成 `public/images/` 与 `src/data/gallery.json`；依赖 `sharp`。
- 如果替换了原始照片，重新运行图片脚本即可；不要手工改 `gallery.json`。

## 需要替换的占位信息

- 学校 / 学院 / 课程 / 地点 / 展示日期：`src/config/site.ts`（团队页与页脚同步读取）。
- 指导教师与团队成员名单：`src/data/team.ts` 中的 `instructor` 与 `roles`；`instructor` 为“待补充”时会自动隐藏。
- 章节文案：`content/zh/docs/`。
- 现场手记：`src/data/field-notes.ts`。当前是展示化整理文本，如有真实访谈/现场记录可直接替换。
- 图片来源与版权说明：`src/views/sources-view.tsx` 与各章节的 `coverCredit`。

## 图片与版权

- 实地照片由小组在首钢园拍摄，用于课程展示。
- 部分高清资料图来自小组汇报 PPT，仅作课堂展示；原始版权归原作者，如涉版权请联系删除。
- 公开数据与文献来源见 `/sources`；不新增无来源的数据。

## 双站同步（Gitee 主源）

Gitee 是主源仓库，GitHub 是镜像并负责 GitHub Pages 自动部署。第一版不配置 Gitee Pages。

- Gitee 主源：<https://gitee.com/ko_kuverse/shougang-park>
- GitHub 镜像：<https://github.com/ko-kuverse/shougang-archive>

首次接入：

```bash
npm run gitee:setup -- https://gitee.com/ko_kuverse/shougang-park.git
git push -u gitee main
git branch --set-upstream-to=gitee/main main
```

首次 `git push` 会由你手动完成 Gitee 登录；项目不会保存你的 Gitee 凭据。之后每次同步：

```bash
npm run sync
```

`npm run sync` 会先推 Gitee，再推 GitHub。推 GitHub 会触发 `Deploy docs` 工作流并更新 GitHub Pages。脚本要求当前分支为 `main` 且工作区已提交干净。

## 部署到 GitHub Pages

1. GitHub 仓库作为镜像（当前为 `ko-kuverse/shougang-archive`），推送 `main`。
2. Settings → Pages → Source 选择 **GitHub Actions**。
3. 工作流使用 `actions/configure-pages` 自动取得 `base_path` / `base_url`。

当前 Pages 已启用并上线：<https://ko-kuverse.github.io/shougang-archive/>。日常更新推荐走上面的 `npm run sync`，让 Gitee 主源和 GitHub 镜像保持一致。

本地模拟项目站子路径：

```bash
MSYS_NO_PATHCONV=1 \
NEXT_PUBLIC_BASE_PATH=/repo \
NEXT_PUBLIC_SITE_URL=https://user.github.io/repo \
npm run build

MSYS_NO_PATHCONV=1 BASE_PATH=/repo npm run preview
```

Windows Git Bash 需要 `MSYS_NO_PATHCONV=1`，否则 `/repo` 会被转换成 Windows 路径；Linux/macOS 可去掉。

`postbuild` 会写入 `out/.nojekyll`、执行 Pagefind，并在 Windows 上为 Next 16 的分段 RSC 载荷生成扁平别名（已知 Next 16 Windows 导出缺陷；Linux CI 不受影响）。

不要给 `configure-pages` 传 `static_site_generator: next`，它会重写 `next.config.ts` 并丢掉 `trailingSlash`。

## 目录速览

```text
content/zh/docs/       8 篇章节 Markdown/MDX
src/app/(zh)/          中文路由（首页、档案、图集、时间线、路线、团队、来源）
src/views/             页面实现
src/components/        布局、档案卡片、图集灯箱、MDX 组件
src/data/              时间线、数据、路线、团队、参考资料
src/lib/               MDX 编译、内容层、SEO、主题
public/images/         优化后的图片
scripts/               文档提取、图片优化、构建后处理、静态预览
refer/                 原始素材（不参与构建）
```
