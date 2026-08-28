# 西安外国语大学 · 2026 新生通关宝典 — 开发说明文档（Agent 交接手册）

> 本文档面向后续接手的任何 AI Agent / 开发者。**先读本文档再动手**，可以避免重复调研和破坏既有功能。
> 最后更新：2026-08（视觉升级三：Hero 双栏封面 / 地图相框+放大 / 通关激励系统 / 暗色补齐 / 阅读呼吸感）

---

## 1. 项目速览

| 项 | 值 |
|---|---|
| 项目名称 | 西外新生通关宝典（非官方，民间整理） |
| 线上地址 | https://xzt1118.github.io/xisu-guide-2026/ |
| GitHub 仓库 | https://github.com/XZT1118/xisu-guide-2026（公开，main 分支） |
| 托管 | GitHub Pages（legacy / 从分支部署，根目录 `./`） |
| 技术形态 | **纯静态单页网站**：HTML + CSS + 原生 JS，无构建工具、无框架、无包管理器 |
| 受众 | 西安外国语大学 2026 级新生（移动端为主，微信/QQ 转发传播） |
| 内容性质 | 官方 2026 入学指南整理 + 联网调研补充；宿舍/军训等时效信息需以学校官方为准 |

## 2. 硬性约束（任何改动都必须遵守）

1. **不改动、不删减任何文字内容、链接和信息结构**：10 个模块及顺序保持不变（除非用户明确要求）。
2. **不破坏既有功能**（完整清单见 §7，改完必须逐项回归）：
   - 清单勾选 + localStorage 持久化
   - 6 种格式导出（txt/md/csv/png/json/html）
   - scrollspy 导航高亮、已读标记、闯关进度面板
   - 移动端抽屉导航、桌面端悬浮 TOC
   - 阅读进度条、卡片 stagger 渐入、Hero 倒计时/逐字/数字滚动
   - 暗色模式（系统偏好 + 手动切换 + localStorage）
   - 清单 100% 撒花、分享按钮、返回顶部、打印样式、details 折叠
   - SEO/OG/JSON-LD 标签、不蒜子访问统计、自定义 404、PWA manifest
3. **文案气质**：学长学姐口吻 + 闯关游戏化。所有用户可见文案用中文。
4. **响应式**：移动端（≤760px）/ 桌面端（含 ≥1280px TOC 变体）。
5. **动效克制**：150–400ms、ease-out、只用 transform/opacity；`prefers-reduced-motion: reduce` 时全部禁用。
6. **内容真实性**：官方信息与"学生经验帖（未官方核实）"严格区分并标注；查不到的写"未找到可靠来源"，禁止编造（详见 §9）。

## 3. 目录结构

```
xisu-guide/
├── index.html                # 主页面（全部内容与结构，~1110 行；head 有"防闪白"内联主题脚本）
├── assets/
│   ├── css/style.css         # 全站样式（~1480 行，含多段"追加层"，末层为"2026 视觉升级（三）"）
│   ├── js/app.js             # 全部交互逻辑（~810 行，单 IIFE）
│   └── img/
│       ├── campus-map.jpg    # 地图原图（196KB，保留备用）
│       ├── campus-map.webp   # 线上使用的地图（62KB）
│       ├── og-share.png      # 微信/QQ 分享图 1200×630（书法+印章风格）
│       ├── apple-touch-icon.png  # iOS 图标 180×180
│       └── icon-192.png / icon-512.png  # PWA 图标
├── manifest.webmanifest      # PWA 清单（名称/图标/主题色）
├── 404.html                  # 自定义 404（西外红风格）
├── sitemap.xml / robots.txt  # SEO
├── README.md                 # 简短说明（面向普通用户）
└── DEVELOPMENT.md            # 本文档（面向开发者/Agent）
```

## 4. 技术栈与实现约定

- **零依赖**：无 npm、无 CDN 库（唯一外部资源是 Google Fonts 展示字体 + 不蒜子统计脚本）。
- **纯原生 JS**：`app.js` 是一个大 IIFE（`(function(){ 'use strict'; ... })()`），所有状态在闭包内。
- **CSS 分层**：`style.css` 由多段组成：基础主题 → 组件 → 打印 → **"2026 视觉升级（追加层）"** → **"2026 视觉升级（二）"** → **"2026 视觉升级（三）"**（追加在后，覆盖前面的同名规则；第三层含暗色补漏/呼吸感/Hero 双栏/地图相框/lightbox/金徽章/证书/抽屉进度）。修改样式时优先在追加层覆盖，避免大改。
- **无内联样式键**：动态样式用 CSS 变量（`--i` 动画延迟、`--p` 进度环、`--sec-c` 模块色）。
- **字体栈**：
  - 展示字体（大标题）：`--font-display: "Ma Shan Zheng", "Kaiti SC", "KaiTi", "Microsoft YaHei", ...`（Google Fonts 加载，`display=swap`，不可用时回退系统字体）
  - 正文：系统字体栈（PingFang SC / Microsoft YaHei）
  - 注意：**小标题类元素回退系统字体**（书法体小字号不可读），规则在 style.css 的 `--font-display` 应用列表之后。

## 5. 设计系统

### 5.1 配色（CSS 变量，浅/深两套）
| 变量 | 浅色 | 暗色（`html[data-theme="dark"]`） |
|---|---|---|
| `--red` | `#c8102e`（西外红） | 不变 |
| `--red-dark` | `#6f0a1a` | 不变 |
| `--red-deep` | `#9e0c24` | 不变 |
| `--gold` / `--gold-deep` | `#f4b83e` / `#e09c14` | 不变 |
| `--ink` | `#33303c` | `#e9e4ec` |
| `--ink-soft` | `#6b6675` | `#a39cac` |
| `--paper` / `--background` | `#fbf6f1` | `#17131a` |
| `--card` | `#ffffff` | `#221c29` |
| `--line` | `#f1e4e0` | `#322a38` |
| `--red-soft` / `--gold-soft` / `--green-soft` | `#fdeef0` / `#fff4d9` / `#e8f6ee` | `#3a1a20` / `#3a2e15` / `#16291f` |
| `--shadow` | `0 6px 16px rgba(158,12,36,.06)` | `0 6px 18px rgba(0,0,0,.45)` |

- **模块主题色**：每个 `<section>` 定义 `--sec-c`（know/checkin/scam=红，campus/transfer=蓝 `#2a6cb8`，dorm/military=绿 `#1f7a4d`，food/checklist/services=金 `#c98a0b`），卡片顶部 4px 色条用 `box-shadow: ..., inset 0 4px 0 var(--sec-c)` 实现（跟随圆角，适配暗色）。
- **深红大面积只出现在 Hero 与页脚**，内容区用米白纸底。

### 5.2 图标体系
- 全部为**内联线性 SVG**（`class="ic"`，24 viewBox，`stroke: currentColor; stroke-width: 2; round caps`），无外部 sprite。
- 分类：导航芯片（15px）、模块头图标（30px，彩色渐变圆底 `icon-red/gold/green/blue`）、按钮（1em）、目录点（14px）。
- 无法替换的 emoji（内容性图标）加**圆底托**：`.emoji-orb` + `orb-red/gold/green/blue`；位置类 emoji（place-emoji/mini-emoji/contact-emoji/fact-emoji）用 CSS 圆底渐变（见 style.css 追加层）。
- ⚠️ 新增图标时保持同一风格（2 号描边、圆角线帽），颜色用 `currentColor`。

### 5.3 动效清单（含时长）
| 动效 | 实现 | 时长 |
|---|---|---|
| Hero 标题逐字入场 | `.hero-title .char`，JS 拆分字符并设 `--i` 延迟 | 0.5s + 55ms×i |
| 统计数字滚动 | `animateStat()`，easeOutCubic | 900ms |
| Hero 漂浮装饰 | `.hero-deco-1/2` 浮动 keyframes | 9s/13s infinite |
| 卡片渐入 | `.reveal` + `.in`，IntersectionObserver | 0.4s + 40ms×i（i 为兄弟序号%6） |
| 抽屉导航 | `.nav.open` transform | 0.28s |
| 进度条/进度环 | transition width / `--p` | 0.3–0.4s |
| 撒花庆祝 | 手写 canvas，90 粒子 | 1.6s |
所有动效在 `prefers-reduced-motion: reduce` 下关闭（style.css 末尾有集中规则）。

### 5.4 字体应用范围
展示字体（Ma Shan Zheng）只用于大标题：`.hero-title / .section-head h2 / .sub-title / .brand-text / .stat b`，以及 TOC 徽章的 `.toc-dot` 提示（无字体）。**小标题（`.acc summary`、`.cl-group-name` 等）显式 `font-family: inherit` 回退**。

## 6. 页面结构（index.html）

```
<html lang="zh-CN">
<head> meta/viewport/theme-color/title/description + OG/Twitter + apple-touch-icon
      + manifest + favicon(SVG data URI) + Google Fonts(preconnect×2 + css2 Ma+Shan+Zheng)
      + style.css + JSON-LD(WebSite + FAQPage 7 问)
<body>
  <div id="read-bar">            阅读进度条（fixed 3px 金色）
  <header class="topbar">
    <button id="nav-toggle">     汉堡（仅移动端显示）
    <a class="brand">            XISU 徽标 + 站名
    <nav id="nav">               10 个 .nav-chip（内联 SVG + data-sec + .chip-done✓ + 清单进度#nav-progress）
    <button id="theme-toggle">   月/日图标（CSS 按 data-theme 切换显隐）
    <div id="nav-backdrop" hidden>  抽屉遮罩（仅移动端）
  <section class="hero" id="top">  badge/标题(新生<span>通关宝典</span>)/副标题/chips(含 #hero-countdown)
      + 3 个按钮(#share-btn 等) + .hero-stats(4 个 <b data-count>)
  <main>
    <div class="card quest-card" id="quest-card">  闯关进度面板（已读 x/10 + 清单 y%）
    <section id="know">…</section>  10 个模块 section，每个含 .section-head(印章kicker + 彩色图标)
      ……
    <section id="services">…</section>
    <div class="footer-stats">    不蒜子统计（busuanzi_value_site_pv/uv/page_pv）
  <nav id="toc-rail">             桌面端悬浮目录（10 个 .toc-dot，≥1280px 显示）
  <footer class="footer">         品牌信息 + 免责声明 + 统计区
  <button id="back-top">          返回顶部
  <script src="assets/js/app.js">  + 不蒜子脚本 + 统计兜底脚本
```

**10 个模块 section id 与顺序（勿动）**：`know → campus → dorm → food → checkin → checklist → military → transfer → scam → services`（外加 `quest-card` 总览、`#top` hero）。

## 7. 功能实现细节（含 DOM id、函数名、localStorage key）

所有 JS 在 `app.js` 单 IIFE 内。**本机的三个 localStorage key 及格式**：

| Key | 格式 | 用途 |
|---|---|---|
| `xisu2026-checklist-v1` | `{checked: [id,...], updatedAt: 时间戳}` | 清单勾选（loadChecked/save） |
| `xisu2026-viewed` | `["know","campus",...]` | 已读模块（markViewed/saveViewed） |
| `xisu2026-theme` | `"dark"` \| `"light"` | 主题偏好（applyTheme） |

| 功能 | 关键实现 |
|---|---|
| 导航高亮 | `sectionObserver`（IntersectionObserver，rootMargin `-30% 0px -60%`）同时更新 .nav-chip/.toc-dot active 与已读标记 |
| 已读标记 | `markViewed(sec)`：写 viewed → 显示对应 chip 的 `.chip-done`；**初始化调用在脚本末尾**（见 §11 bug1） |
| 抽屉导航 | `nav-toggle`/`nav-backdrop`/`closeNav()`；点击芯片后自动收起 |
| 阅读进度条 | scroll 监听 + rAF 节流 `updateReadBar()` |
| Hero 倒计时 | 目标 `2026-09-10T00:00:00+08:00`，按差值显示"还有 N 天/报到进行中/新学期开始" |
| 数字滚动 | `animateStat()`，滚动进 hero 触发一次 |
| 标题逐字 | JS 拆分 `.hero-title` 文本节点与 span → `.char`（span 内加 `.accent`） |
| 闯关面板 | `updateQuest()`：读 viewed.length 与清单 pct → 进度条+状态文案；由 markViewed 与 updateProgress 调用 |
| 清单渲染 | `CHECKLIST` 数组（7 分类 47 项，见 `renderChecklist()`）；分类 emoji 加 `.emoji-orb orb-{红金绿蓝}` |
| 清单进度 | `updateProgress()`：总进度环（conic-gradient `--p`）、分类小条、导航 %、100% 触发 `fireConfetti()`（celebrated 标志防重复） |
| 6 格式导出 | `cl-format` select + `cl-download`；`buildLines/mdContent/csvContent/jsonContent/htmlContent/pngBlob`（png 用 canvas 手绘，csv 带 BOM 防 Excel 乱码），文件名 `西外新生通关宝典-必备清单-YYYY-MM-DD.ext` |
| 重置 | `cl-reset`，confirm 后清空 |
| 打印 | `beforeprint` 展开全部 `details.acc`；`@media print` 规则在 style.css（隐藏交互元素、黑白降级、清单绿色保留 `print-color-adjust: exact`） |
| 分享 | `share-btn`：`navigator.share` → 失败/不支持回退 `navigator.clipboard` → 再回退 `window.prompt`；复制成功按钮文案临时变"链接已复制 ✓" |
| 主题 | `initTheme()`：localStorage > `prefers-color-scheme`；`theme-toggle` 切换 `html[data-theme]` + meta theme-color；图标由 CSS 切换显隐。**head 内联脚本提前设 `data-theme` 防暗色首屏闪白**（与 initTheme 同一套存储，属"无内联样式键"规范的唯一脚本例外） |
| 地图相框+放大 | `.map-figure` 相框（宣纸底/双线框/「长安校区」印章角标，浅深两套）；点击图片开 `#map-lightbox` 全屏遮罩（JS 动态创建，Esc/点击遮罩/×关闭，`beforeprint` 也关闭）；`.map-hint` 为放大提示 |
| Hero 双栏封面 | `.hero-copy`（左：badge/标题/chips/按钮）+ `.hero-visual`（右：`.hero-map-card` 地图缩略卡 + `.hero-seal` 金印章，`aria-hidden`）；仅 ≥1024px 生效 grid 双栏，移动端 `.hero-visual` 隐藏；`.hero-stats` 跨双栏通栏 |
| 金色通关徽章 | `.chip-done` 金渐变（16px）；全部模块已读时 JS 给 `body` 加 `all-done` 类 → `::before` 金色呼吸光圈（纯 opacity 动画）；TOC 圆点同步加 `.done` 金色 |
| 通关证书 | `#cert-card`（`hidden`，清单 100% 时 `updateQuest()` 显示并填 `#cert-meta` 日期）；「保存证书图片」`#cert-save` 用 canvas 绘制 900×560 PNG 下载；`certIn` 入场动画 |
| 抽屉进度摘要 | `#nav` 首子元素 `.drawer-progress`（仅 ≤760px 显示），`dp-modules/dp-list` 双条由 `updateQuest()` 同步更新 |
| 导语结构 | `.li-lead`（模块 05）与 `.lead-list li > b:first-child`（模块 08）块级导语；`.li-warn` 红边警示条目；`.li-group/.li-group-name`（模块 07 军训三组，取 `--sec-c` 模块色，暗色固定 `#7ed3a5`） |
| 撒花 | `fireConfetti()`：动态创建 `#confetti-canvas`，90 粒子重力动画 |
| 统计 | 不蒜子脚本自动填充三个 span；兜底脚本 8s 未返回则显示"—" |
| 返回顶部 | `back-top`，滚动 >500px 显示 |

## 8. 内容区块速查（改内容去哪里）

| 内容 | 位置 |
|---|---|
| 10 模块全部正文 | index.html 对应 `<section id="...">`，每段有中文注释 |
| 清单条目（新增/删改） | app.js 顶部 `CHECKLIST` 数组（含 id/emoji/name/items[{id,text,note}]）；**id 必须全局唯一**（作为 checkbox 的 id/label for） |
| 重要网址 | index.html 末尾 `link-grid`（"重要网址收藏"） |
| FAQ（SEO 富结果） | index.html head 的 JSON-LD（7 问） |
| 分享图/图标 | assets/img（生成脚本不保留；重新生成用 System.Drawing，见 §12） |
| 站名/描述/OG | index.html head |
| 免责声明/投诉电话 | index.html footer |

## 9. 内容真实性规范（重要！）

- **官方信息**（学校官网/迎新网/官方指南）→ 正常引用，可加链接。
- **学生经验帖**（小红书/知乎/贴吧）→ 必须标注"学生经验帖，未官方核实"（卡片用 `.src-note`，段落用 `⚠️ 可靠性说明`）。
- **查不到的**（如限电瓦数、洗衣价格）→ 明确写"未找到可靠来源，以开学后现场/官方通知为准"。**禁止编造数字与政策。**
- 时效信息（选宿舍时间、军训安排、转专业政策）→ 注明"以当年官方通知为准"，并尽量更新为最新年份（2026 迎新公告要点：迎新系统+企业微信认证 8/25 上午 9 点开放、学号查询 8/24 开放、先查学号再登录、手册《迎新系统使用手册 2026 版》info/1002/1126.htm、《新生加入企业微信步骤》info/1002/1116.htm）。
- 官方网站入口：迎新网 `yingxin.xisu.edu.cn`（本机沙箱 https 握手失败时用 `http://` 抓取）、公寓中心 `gyzx.xisu.edu.cn`、教务处 `jwc.xisu.edu.cn` 等（index.html 有完整收藏）。

## 10. 本地开发与验证方法

1. **本地预览**：双击 `index.html` 即开（无构建）。注意 `file://` 下 localStorage 按文件路径隔离，正常。
2. **静态校验（每轮必做）**：
   - `node --check assets/js/app.js`（JS 语法）
   - PowerShell 检查 HTML 标签配平（`div/section/a/li/...` 开闭数量一致；**path/circle/img/meta/link/input 是无闭合元素，不算错**）
   - CSS 花括号配平（`{` 数 = `}` 数）
   - 新 DOM id 与 JS `getElementById` 一一对应
3. **运行时复现（重要）**：本机沙箱**无浏览器渲染能力**（Edge headless 截图失败、无截图工具）。写 Node + DOM 桩驱动 app.js 可查运行时错误——**项目曾用它找到两个线上崩溃 bug**（见 §11）。排查"第二次访问/特定 localStorage 状态"问题必须用这种方法（桩要点：localStorage 预置数据；document/window/IntersectionObserver/localStorage/navigator.clipboard/URL.createObjectURL/Blob/canvas.getContext 都要提供）。
4. **发布后验证**：`curl.exe` 抓 `https://xzt1118.github.io/xisu-guide-2026/` 检查关键标志；`gh api repos/XZT1118/xisu-guide-2026/contents/...` 核对仓库内容（api.github.com 通道比 github.io 稳定）。

## 11. 历史 Bug 与修复（引以为戒）

| Bug | 根因 | 修复 |
|---|---|---|
| **移动端抽屉打不开**（点击汉堡 ReferenceError，后续初始化全部中断） | `navToggle` click 处理器引用了未定义变量 `navEl`（正确变量是顶部的 `nav`） | `navEl` → `nav`（2026-08 视觉升级三修复） |
| **二次访问崩溃**（清单/闯关面板不显示、主题无法切换） | 初始化早期 `viewed.forEach(markViewed)` 调 `updateQuest → flattenItems`，此时 `CHECKLIST` 尚未赋值（undefined）→ TypeError 中断整个 IIFE | 已读初始化移到脚本末尾；`updateQuest` 首行 `if (!CHECKLIST) return` 防护 |
| **浅色模式 TOC 悬浮提示文字不可见** | 提示文字 `color: var(--background)`，浅色 `:root` 未定义该变量 → 回退继承深色 → 深字深底 | 补 `--background: #fbf6f1`；提示改用显式高对比色（浅：深底白字/暗：浅底深字） |
| **已读✓徽章"未读"时也显示** | `.chip-done { display:inline-flex }` 覆盖了 UA 的 `[hidden]` 规则 | 加 `.chip-done[hidden]{display:none}` |

**经验**：① 访问其他变量（CHECKLIST/sections 等）前确认其声明与初始化时机；② 变量未定义导致的"文字看不见"问题，用显式颜色而非依赖未定义变量；③ 自定义 `display` 会绕过 `hidden` 属性，需要 `[hidden]` 专用规则。

## 12. 部署与发布流程

```powershell
Set-Location C:\Users\XZ\Desktop\test\xisu-guide
git add -A
git commit -m "说明"
# 网络规避（本机沙箱 schannel/openssl 证书间歇故障，必须用此方式）：
$token = gh auth token; $env:GH_TOKEN = $token
@"
@echo off
echo %1 | findstr /i "username" >nul
if %errorlevel%==0 (echo XZT1118) else (echo %GH_TOKEN%)
"@ | Set-Content _askpass.cmd -Encoding Ascii
$env:GIT_ASKPASS = "$PWD\_askpass.cmd"
git -c http.sslBackend=openssl -c http.sslVerify=false push origin main
Remove-Item _askpass.cmd; Remove-Item Env:GIT_ASKPASS,Env:GH_TOKEN
```
- 推送后 GitHub Pages 自动重建，**约 1 分钟**生效（等待后再验证）。
- 本机网络到 github.com / github.io **间歇性失败**：push 失败就等 15–30s 重试（最多 5 次）；验证失败不代表部署失败，可用 `gh api` 核对仓库内容。
- 仓库凭据：`gh auth setup-git` 已配置（如果失效，git push 报 `SEC_E_NO_CREDENTIALS`，执行一次 `gh auth setup-git` 即可，需要写全局 gitconfig）。

## 13. 已知限制与未来方向

**已知限制**
- Google Fonts 在部分国内网络可能加载慢/失败（`display=swap` + 字体栈回退保证可读；如需稳定可自托管字体，但 Ma Shan Zheng 全量约 1–2MB，需子集化）。
- 不蒜子为免费服务，计数有误差、偶发不可达（有兜底显示"—"）；无访问明细。
- 沙箱内无法截图/渲染预览，UI 微调需用户浏览器确认。
- 深色模式下地图图片用滤镜柔化（兼容但非完美）。

**待办/可选方向（用户点名再做）**
- ~~Hero 双栏封面化~~（✅ 2026-08 完成）
- ~~已读徽章升级为"通关"金色徽章；清单 100% 后"通关证书"卡片~~（✅ 2026-08 完成）
- ~~移动端抽屉顶部进度摘要~~（✅ 2026-08 完成）
- ~~地图卷轴/相框化~~（✅ 2026-08 完成，含 lightbox）
- 各模块"分享本模块"（锚点链接）
- CSS 重构合并（当前 ~1480 行含三层追加，功能无问题但注释了"追加层"）
- TOC 增强：tooltip 键盘 focus 可见；761–1279px 断档无导航辅助
- 打印细节：`afterprint` 恢复 acc 折叠状态；表格 `min-width` 打印态取消
- 字体自托管子集（消除 Google Fonts 依赖与标题二次跳变）

## 14. 常用命令速查

```powershell
Set-Location C:\Users\XZ\Desktop\test\xisu-guide
node --check assets/js/app.js      # JS 语法
git status                         # 工作区状态
git log --oneline -10              # 提交历史
gh api repos/XZT1118/xisu-guide-2026/contents/index.html --jq .content   # 核对线上仓库文件（base64）
curl.exe -s -o NUL -w '%{http_code}' https://xzt1118.github.io/xisu-guide-2026/   # 线上状态
```

## 15. 给你的第一份注意事项（接手清单）

1. 先跑一遍 `node --check` 与 §10 的静态校验；改动前先 `git status` 确认干净。
2. **不要移动/重命名任何现有 DOM id**（scrollspy、清单、面板、主题都依赖 id 硬编码）。
3. 新增 JS 事件与初始化：**凡访问 `CHECKLIST`/`checked` 等后定义数据的初始化代码，必须放在脚本末尾 `renderChecklist()` 之前**（§11）。
4. 新增 CSS 变量：浅色 `:root` 与 `html[data-theme="dark"]` **两处都要定义**（§11 bug2）。
5. 新增自定义 `display` 的元素，若需要可隐藏，记得处理 `[hidden]`（§11 bug3）。
6. 修改用户可见文案时，保持"学长学姐 + 闯关"口吻；标注来源。
7. 每次改完：静态校验 → 推送 → 等 1 分钟 → curl/gh api 验证 → 告知用户"需要浏览器确认"的视觉点。
