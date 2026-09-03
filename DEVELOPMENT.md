# 西安外国语大学 · 2026 新生通关宝典 — 开发说明文档（Agent 交接手册）

> 本文档面向后续接手的任何 AI Agent / 开发者。**先读本文档再动手**，可以避免重复调研和破坏既有功能。
> 最后更新：2026-08（对应 git 提交 `936c12f`，学院墨青主题版）

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
| 当前主题 | **学院墨青主题**（墨青主色 + 古金 + 朱印红 `--stamp`，见 §5） |

## 2. 硬性约束（任何改动都必须遵守）

1. **不改动、不删减任何文字内容、链接和信息结构**：10 个模块及顺序保持不变（除非用户明确要求）。
2. **不破坏既有功能**（完整清单见 §7，改完必须逐项回归）：
   - 清单勾选 + localStorage 持久化
   - 6 种格式导出（txt/md/csv/png/json/html）
   - scrollspy 导航高亮、已读标记、闯关进度面板
   - 移动端抽屉导航、桌面端悬浮 TOC、阅读进度条、卡片 stagger 渐入
   - Hero（倒计时/逐字/数字滚动/双栏封面/地图放大）
   - 通关激励（金色徽章 + 100% 通关证书 + 抽屉进度）
   - 暗色模式（系统偏好 + 手动切换 + localStorage）
   - 清单 100% 撒花、分享按钮、返回顶部、打印样式、details 折叠
   - 页脚统计（不蒜子 + localStorage 缓存秒显 + 数字滚动 + 6s 兜底）
   - SEO/OG/JSON-LD、自定义 404、PWA manifest
3. **文案气质**：学长学姐口吻 + 闯关游戏化。所有用户可见文案用中文。
4. **响应式**：移动端（≤760px）/ 桌面端（含 ≥1280px TOC 变体、Hero 双栏）。
5. **动效克制**：150–400ms、ease-out、只用 transform/opacity；`prefers-reduced-motion: reduce` 时全部禁用。
6. **内容真实性**：官方信息与"学生经验帖（未官方核实）"严格区分并标注；查不到的写"未找到可靠来源"，禁止编造（详见 §9）。
7. **改完必须同步 `DEVELOPMENT.md`**（主题/结构/功能/行数任一变化都要更新，否则下一个 Agent 会拿到过时信息）。

## 3. 目录结构（当前行数）

```
xisu-guide/
├── index.html                # 主页面（全部内容与结构，~1172 行）
├── assets/
│   ├── css/style.css         # 全站样式（~1520 行，基础层 + 多段"追加层"）
│   ├── js/app.js             # 全部交互逻辑（~807 行，单 IIFE）
│   └── img/
│       ├── campus-map.jpg    # 地图原图（196KB，保留备用）
│       ├── campus-map.webp   # 线上使用的地图（62KB）
│       ├── og-share.png      # 微信/QQ 分享图 1200×630（书法+印章风格）
│       ├── apple-touch-icon.png  # iOS 图标 180×180
│       └── icon-192.png / icon-512.png  # PWA 图标
├── manifest.webmanifest      # PWA 清单（墨青 theme_color）
├── 404.html                  # 自定义 404（墨青+朱印风格）
├── sitemap.xml / robots.txt  # SEO
├── README.md                 # 简短说明（面向普通用户）
└── DEVELOPMENT.md            # 本文档（面向开发者/Agent）
```

## 4. 技术栈与实现约定

- **零依赖**：无 npm、无 CDN 库（唯一外部资源是 Google Fonts 马善政体 + 不蒜子统计脚本）。
- **纯原生 JS**：`app.js` 是单 IIFE（`(function(){ 'use strict'; ... })()`），所有状态在闭包内。
- **CSS 分层**：`style.css` 由基础主题 + 组件 + 打印 + 多段"追加层"（`2026 视觉升级（一）/（二）/…`）组成，追加层覆盖同名规则。修改样式优先在追加层覆盖，避免大改基础。
- **无内联样式键**：动态样式用 CSS 变量（`--i` 动画延迟、`--p` 进度环、`--sec-c` 模块色、`--track` 进度轨道）。
- **字体栈**：展示字体（大标题）`--font-display: "Ma Shan Zheng", "Kaiti SC", "KaiTi", "Microsoft YaHei", ...`（Google Fonts，`display=swap`，不可用回退系统）；正文系统字体栈。**小标题类元素显式 `font-family: inherit` 回退**（书法体小字号不可读）。

## 5. 设计系统（学院墨青主题）

### 5.1 配色（CSS 变量，浅/深两套）
> 本主题将**西外红降为朱印色 `--stamp`，仅用于印章/边框/警示**；主视觉由**墨青**主导。

| 变量 | 浅色 | 暗色（`html[data-theme="dark"]`） |
|---|---|---|
| `--red`（主色位=墨青） | `#1f4f5c` | 不变 |
| `--red-deep` / `--red-dark` | `#16414d` / `#0f2f38` | 不变 |
| `--red-soft` | `#e2eaee` | `#16242a` |
| `--stamp` / `--stamp-deep`（朱印红） | `#c8102e` / `#9e0c24` | `#ff6b7d` / `#c8102e` |
| `--stamp-soft` | `#fdeef0` | `#3a1a20` |
| `--gold`（古金）/ `--gold-deep` | `#c9a24a` / `#a8843a` | 不变 |
| `--gold-soft` | `#f6efdb` | `#2a2416` |
| `--ink` | `#26262c` | `#e6e2dc` |
| `--ink-soft` | `#5c5762` | `#9aa0a8` |
| `--paper` / `--background` | `#f6f3ee` | `#15171a` |
| `--card` | `#ffffff` | `#1e2126` |
| `--line` | `#e6e2dc` | `#2a2e34` |
| `--green` / `--green-soft` | `#2f9e63` / `#e8f6ee` | 同左 / `#16291f` |
| `--track`（进度轨道） | `#e4e0da` | `#2c3138` |
| `--shadow` | `0 8px 24px rgba(20,30,40,.08)` | `0 6px 18px rgba(0,0,0,.45)` |

- **模块主题色 `--sec-c`**：know/checkin/scam=墨青(`--red`)，campus/transfer=蓝 `#2a6cb8`，dorm/military=绿 `#1f7a4d`，food/checklist/services=古金(`--gold`)；卡片顶部 4px 色条 `box-shadow: ..., inset 0 4px 0 var(--sec-c)`。
- **墨青大面积**出现在顶栏/Hero/页脚/标题；内容区米白纸底（`--paper`）。朱印红 `--stamp` 只点缀印章（模块过关徽章、警示）。
- 404.html、manifest（theme_color 墨青）、favicon、confetti 粒子、导出 canvas 均已同步墨青配色。

### 5.2 图标体系
- 全部为**内联线性 SVG**（`class="ic"`，24 viewBox，`stroke: currentColor; stroke-width: 2; round caps`），无外部 sprite。
- 分类：导航芯片（15px）、模块头图标（30px，彩色渐变圆底 `icon-red/gold/green/blue`）、按钮（1em）、目录点（14px）。
- 无法替换的 emoji（内容性图标）加**圆底托**：`.emoji-orb` + `orb-red/gold/green/blue`；位置类 emoji（place-emoji/mini-emoji/contact-emoji/fact-emoji）用 CSS 圆底渐变。
- ⚠️ 新增图标保持同一风格（2 号描边、圆角线帽），颜色用 `currentColor`。

### 5.3 动效清单（含时长）
| 动效 | 实现 | 时长 |
|---|---|---|
| Hero 标题逐字入场 | `.hero-title .char`，JS 拆分字符并设 `--i` 延迟 | 0.5s + 55ms×i |
| 统计数字滚动 | `animateStat()`，easeOutCubic | 900ms |
| Hero 漂浮装饰 | `.hero-deco-1/2` 浮动 keyframes | 9s/13s infinite |
| 卡片渐入 | `.reveal` + `.in`，IntersectionObserver | 0.4s + 40ms×i |
| 抽屉导航 | `.nav.open` transform | 0.28s |
| 地图放大 lightbox | 遮罩 + 图片渐入/缩放 | 0.3s |
| 通关证书出现 | `.show` 淡入上移 | 0.45s |
| 进度条/进度环 | transition width / `--p` | 0.3–0.4s |
| 页脚统计呼吸加载态 | `···` 闪烁 keyframes | 循环（获取后停止） |
| 撒花庆祝 | 手写 canvas，90 粒子 | 1.6s |
所有动效在 `prefers-reduced-motion: reduce` 下关闭（style.css 末尾集中规则）。

### 5.4 字体应用范围
展示字体（Ma Shan Zheng）只用于大标题：`.hero-title / .section-head h2 / .sub-title / .brand-text / .stat b`。小标题（`.acc summary`、`.cl-group-name` 等）显式 `font-family: inherit` 回退。

## 6. 页面结构（index.html）

```
<html lang="zh-CN">
<head> meta/viewport/theme-color/title/description + OG/Twitter + apple-touch-icon
      + manifest + favicon(SVG data URI) + Google Fonts(preconnect×2 + css2 Ma+Shan+Zheng)
      + style.css + JSON-LD(WebSite + FAQPage)
<body>
  <div id="read-bar">            阅读进度条（fixed 3px 古金）
  <header class="topbar">
    <button id="nav-toggle">     汉堡（仅移动端）
    <a class="brand">            XISU 徽标 + 站名
    <nav id="nav">               10 个 .nav-chip（内联 SVG + data-sec + .chip-done✓ + #nav-progress）
    <button id="theme-toggle">   月/日图标（按 data-theme 切换显隐）
    <div id="nav-backdrop" hidden>
  <section class="hero" id="top">  ← 双栏：.hero-copy(文案) + .hero-visual(地图卡 + .hero-seal"2026通关")
      含 #hero-countdown、3 按钮(#share-btn 等)、.hero-stats(<b data-count>)
  <main>
    <div class="card quest-card" id="quest-card">  闯关进度面板（已读 x/10 + 清单 y%）
    <section id="know">…</section>  10 个模块 section（.section-head 印章kicker + 彩色图标）
      ……
    <section id="services">…</section>
  <nav id="toc-rail">             桌面端悬浮目录（10 个 .toc-dot，≥1280px）
  <footer class="footer">         品牌 + 免责声明 + 页脚统计
    <div class="footer-stats" id="footer-stats">  胶囊统计（fs-pill/fs-label/fs-num/fs-unit + fs-credit）
  <div id="cert-card" hidden>     通关证书（cert-frame/cert-kicker/cert-title/cert-line/cert-meta）
  <button id="back-top">          返回顶部
  <script src="assets/js/app.js"> + 不蒜子脚本 + 统计兜底/缓存脚本
```

**10 个模块 section id 与顺序（勿动）**：`know → campus → dorm → food → checkin → checklist → military → transfer → scam → services`（外加 `quest-card` 总览、`#top` hero、`#cert-card` 证书）。

## 7. 功能实现细节（DOM id / 函数名 / localStorage key）

**localStorage key（3 个）**：
| Key | 格式 | 用途 |
|---|---|---|
| `xisu2026-checklist-v1` | `{checked: [id,...], updatedAt}` | 清单勾选 |
| `xisu2026-viewed` | `["know","campus",...]` | 已读模块 |
| `xisu2026-theme` | `"dark"` \| `"light"` | 主题偏好 |

| 功能 | 关键实现 |
|---|---|
| 导航高亮 | `sectionObserver`（IntersectionObserver，rootMargin `-30% 0px -60%`）同更新 .nav-chip/.toc-dot active 与已读标记 |
| 已读标记 | `markViewed(sec)` → 写 viewed、显示 `.chip-done`；**初始化调用在脚本末尾**（见 §11 bug1） |
| 抽屉导航 | `nav-toggle`/`nav-backdrop`/`closeNav()`；**变量名必须是 `nav`，不要写成 `navEl`**（曾引发崩溃） |
| 阅读进度条 | scroll + rAF `updateReadBar()` |
| Hero 倒计时 | 目标 `2026-09-10T00:00:00+08:00`，按差值显示"还有 N 天/报到进行中/新学期开始" |
| Hero 数字滚动 | `animateStat()`，进入 hero 触发一次 |
| Hero 标题逐字 | JS 拆分 `.hero-title` 文本节点与 span → `.char`（span 内加 `.accent`） |
| **地图放大 lightbox** | JS 动态创建 `#map-lightbox`（role=dialog、关闭按钮、放大图），点地图打开；Esc/遮罩/关闭按钮关闭 |
| 闯关面板 | `updateQuest()`：viewed.length 与清单 pct → 进度条+状态文案；由 markViewed 与 updateProgress 调用；达成显示"🏆 全通关" |
| **通关证书** | 清单 100% 时亮出 `#cert-card`（`.show`），`#cert-meta` 写入日期；金色徽章标记 |
| 清单渲染 | `CHECKLIST`（7 分类 47 项，`renderChecklist()`）；分类 emoji 加 `.emoji-orb orb-{红金绿蓝}` |
| 清单进度 | `updateProgress()`：进度环（conic `--p`）、分类小条、导航 %、100% 触发 `fireConfetti()`（celebrated 防重复）+ 亮证书 |
| 6 格式导出 | `cl-format` + `cl-download`；`buildLines/mdContent/csvContent/jsonContent/htmlContent/pngBlob`（png 用 canvas 手绘并同步墨青配色，csv 带 BOM），文件名 `西外新生通关宝典-必备清单-YYYY-MM-DD.ext` |
| 重置 | `cl-reset`，confirm 后清空 |
| 打印 | `beforeprint` 展开全部 `details.acc`；`@media print`（隐藏交互元素、黑白降级、清单绿色保留） |
| 分享 | `share-btn`：`navigator.share` → 回退 `navigator.clipboard` → 回退 `window.prompt` |
| 主题 | `initTheme()`：localStorage > `prefers-color-scheme`；`theme-toggle` 切换 `html[data-theme]` + meta theme-color |
| 撒花 | `fireConfetti()`：动态建 `#confetti-canvas`，90 粒子重力 |
| **页脚统计** | 胶囊卡片（fs-pill）；不蒜子填 `busuanzi_site_pv/site_uv/today_pv`（`today_pv`=今日总访问量，**每天 00:00 自动重置**，纠正历史误用累计的 `page_pv`）；localStorage 缓存上次数字**秒显**（`···` 呼吸加载态），拿到新值后**数字滚动 + 千分位**；若 6s 未返回显示"—"兜底 |
| 返回顶部 | `back-top`，滚动 >500px 显示 |

## 8. 内容区块速查（改内容去哪里）

| 内容 | 位置 |
|---|---|
| 10 模块正文 | index.html 对应 `<section id="...">`，每段有中文注释 |
| 清单条目 | app.js 顶部 `CHECKLIST`（id 必须全局唯一） |
| 重要网址 | index.html 末尾 `link-grid` |
| FAQ（SEO） | index.html head JSON-LD（7 问） |
| 分享图/图标 | assets/img（生成脚本不保留；重新生成用 System.Drawing，见 §12） |
| 站名/描述/OG | index.html head |
| 免责声明/投诉电话 | index.html footer |
| 统计胶囊样式 | style.css `.footer-stats`/`.fs-*` 段 |

## 9. 内容真实性规范（重要！）

- **官方信息**（学校官网/迎新网/官方指南）→ 正常引用，可加链接。
- **学生经验帖**（小红书/知乎/贴吧）→ 必须标注"学生经验帖，未官方核实"（`.src-note` 或 `⚠️ 可靠性说明`）。
- **查不到的**（如限电瓦数、洗衣价格）→ 明确写"未找到可靠来源，以开学后现场/官方通知为准"。**禁止编造数字与政策。**
- 时效信息（选宿舍时间、军训安排、转专业政策）→ 注明"以当年官方通知为准"，并尽量更新为最新年份。
- 2026 迎新公告要点（已上站）：迎新系统+企业微信认证 **8/25 上午 9 点**开放、学号查询 **8/24** 开放、先查学号再登录、《迎新系统使用手册 2026 版》`yingxin.xisu.edu.cn/info/1002/1126.htm`、《新生加入企业微信步骤》`info/1002/1116.htm`；线上选宿舍入口公寓中心 `gyzx.xisu.edu.cn/XisuAm/WebMoudle/zxxf.html`。
- 官方入口：迎新网 `yingxin.xisu.edu.cn`（沙箱 https 握手失败时用 `http://` 抓取）、公寓中心 `gyzx.xisu.edu.cn`、教务处 `jwc.xisu.edu.cn` 等（index.html 有完整收藏）。

## 10. 本地开发与验证方法

1. **本地预览**：双击 `index.html` 即开（无构建）。`file://` 下 localStorage 按文件路径隔离。
2. **静态校验（每轮必做）**：`node --check assets/js/app.js`；HTML 标签配平（`div/section/a/li/...`，**path/circle/img/meta/link/input 是无闭合元素，不算错**）；CSS 花括号配平；新 DOM id 与 JS `getElementById` 一一对应。
3. **运行时复现（重要）**：本机沙箱**无浏览器渲染能力**（Edge headless 截图失败）。写 Node + DOM 桩驱动 app.js 可查运行时错误——**项目曾凭它找到"二次访问崩溃"bug**（见 §11）。排查"第二次访问/特定 localStorage 状态"问题必须用此法（桩要点：localStorage 预置数据；document/window/IntersectionObserver/localStorage/navigator.clipboard/URL.createObjectURL/Blob/canvas.getContext 都需提供）。
4. **发布后验证**：`curl.exe` 抓线上 HTML 查关键标志；`gh api repos/XZT1118/xisu-guide-2026/contents/...` 核对仓库（api.github.com 通道比 github.io 稳定）。

## 11. 历史 Bug 与修复（引以为戒）

| Bug | 根因 | 修复 |
|---|---|---|
| **二次访问崩溃**（清单/闯关面板不显示、主题无法切换） | 初始化早期 `viewed.forEach(markViewed)` 调 `updateQuest → flattenItems`，此时 `CHECKLIST` 尚未赋值 → TypeError 中断整个 IIFE | 已读初始化移到脚本末尾；`updateQuest` 首行 `if (!CHECKLIST) return` |
| **浅色模式 TOC 悬浮提示文字不可见** | 提示文字 `color: var(--background)`，浅色 `:root` 未定义该变量 → 深字深底 | 补 `--background`；提示改用显式高对比色 |
| **已读✓徽章"未读"时也显示** | `.chip-done{display:inline-flex}` 覆盖了 `[hidden]` | 加 `.chip-done[hidden]{display:none}` |
| **移动端抽屉 `navEl` 崩溃** | 抽屉关闭函数引用了未定义变量 `navEl` | 统一用 `nav`（变量名，勿改） |

**经验**：① 访问其他变量（CHECKLIST/sections 等）前确认其声明与初始化时机；② 变量未定义导致的"文字看不见"用显式颜色而非依赖未定义变量；③ 自定义 `display` 会绕过 `hidden`，需 `[hidden]` 专用规则；④ **一个 DOM 变量名写错就会崩整页**（`nav` ≠ `navEl`），改码后用模拟器跑一遍。

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
- 仓库凭据：若报 `SEC_E_NO_CREDENTIALS`，执行一次 `gh auth setup-git`（需写全局 gitconfig）。

## 13. 已知限制与未来方向

**已知限制**
- Google Fonts（马善政体）在部分国内网络可能加载慢/失败（`display=swap` + 字体栈回退保证可读；如需稳定可自托管，但全量约 1–2MB 需子集化）。
- 不蒜子为免费服务，计数有误差、偶发不可达（有缓存秒显 + 6s 兜底）；无访问明细。当前采用**官方 v3.6.9**（`cdn.busuanzi.cc`，已从旧 `busuanzi.ibruce.info/2.3` 升级），「今日访问」= `today_pv` 每天 00:00 自动重置；因新版本为 2025 年重发布服务、数据库重建过，**本站总量/访客数历史累计会从新库重新累计（数值回落属预期）**。
- 沙箱内无法截图/渲染预览，UI 微调需用户浏览器确认。
- 深色模式下地图图片用滤镜柔化（兼容但非完美）。

**已完成（勿重复做）**
- Hero 双栏封面、地图相框 + 点击放大、通关金徽章 + 100% 证书、抽屉进度、页脚统计胶囊 + 缓存 + 数字滚动、墨青主题、暗色补齐。

**待办/可选方向（用户点名再做）**
- 各模块"分享本模块"（锚点链接）
- 字体自托管（需要子集化工具）
- CSS 重构合并（当前 1520 行含多层追加，功能正常但维护成本高）
- 访问统计明细（需换百度统计/友盟等注册制服务）

## 14. 常用命令速查

```powershell
Set-Location C:\Users\XZ\Desktop\test\xisu-guide
node --check assets/js/app.js      # JS 语法
git status / git log --oneline -10 # 工作区/提交历史
gh api repos/XZT1118/xisu-guide-2026/contents/index.html --jq .content   # 核对线上仓库文件（base64）
curl.exe -s -o NUL -w '%{http_code}' https://xzt1118.github.io/xisu-guide-2026/   # 线上状态
```

## 15. 给你的第一份注意事项（接手清单）

1. 先跑一遍 `node --check` 与 §10 静态校验；改动前 `git status` 确认干净。
2. **不要移动/重命名任何现有 DOM id**（scrollspy、清单、面板、证书、主题都依赖 id 硬编码）。
3. 新增 JS 事件与初始化：**凡访问 `CHECKLIST`/`checked` 等后定义数据的初始化代码，必须放在脚本末尾 `renderChecklist()` 之前**（§11）。
4. 新增 CSS 变量：浅色 `:root` 与 `html[data-theme="dark"]` **两处都要定义**（§11）。
5. 新增自定义 `display` 的可隐藏元素，记得处理 `[hidden]`（§11）。
6. **抽屉变量名务必用 `nav`**，不要写成 `navEl`（§11）。
7. 修改用户可见文案保持"学长学姐 + 闯关"口吻，标注来源。
8. 每次改完：静态校验 → 推送 → 等 1 分钟 → curl/gh api 验证 → 告知用户"需要浏览器确认"的视觉点 → **同步更新本文档**。
