# 部署指南 · Gitee Pages

## 部署原理

本项目是 Nuxt 3 静态站点，构建产物在 `.output/public/`（被 .gitignore 忽略，不进 main 分支）。
Gitee 免费版 Pages 不支持自动构建，因此采用**双分支方案**：

- `main` 分支：源码（Markdown / Vue 组件 / 配置）
- `gh-pages` 分支：构建产物（纯静态 HTML/CSS/JS）

部署脚本 `npm run deploy` 会自动完成：构建 → 临时目录隔离 → 推送 gh-pages。

## 前置准备

1. 注册 [Gitee](https://gitee.com) 账号并完成**实名认证**（开通 Pages 必须）
2. 安装 Git（推荐 [Git for Windows](https://git-scm.com)）
3. 本项目已关联远程仓库：`https://gitee.com/ChunShan0/essay-chat.git`

## 首次部署

### 1. 构建并推送 gh-pages 分支

```bash
npm run deploy
```

脚本会自动（临时目录隔离，不污染主工作区）：
- 运行 `nuxt generate` 生成静态文件
- 创建临时目录，复制 `.output/public/` 内容 + `.nojekyll`
- 在临时目录内 git init + commit
- `git push --force` 到 `origin/gh-pages`

### 2. 在 Gitee 开通 Pages 服务

1. 打开 https://gitee.com/ChunShan0/essay-chat
2. 点击顶部 **「服务」** → **「Gitee Pages」**
3. 配置：
   - 部署分支：`gh-pages`
   - 部署目录：留空（即根目录）
4. 点击 **「启动」**

### 3. 访问博客

启动成功后访问：

```
https://chunshan0.gitee.io/essay-chat
```

## 日常更新流程

写完文章后，两条命令搞定：

```bash
# 1. 部署静态站点到 gh-pages
npm run deploy

# 2. 源码提交到 main（保存文章源文件）
git add .
git commit -m "新增文章: xxx"
git push origin main
```

然后去 Gitee Pages 页面点 **「更新」**（Pro 版会自动更新）。

## Gitee Pages Pro（可选）

- 价格：约 99 元/年
- 优势：推送后**自动部署**，无需手动点「更新」
- 还支持：自定义域名、强制 HTTPS

## 常见问题

### Q: 为什么需要两个分支？
A: Gitee 免费版 Pages 不支持构建，只能托管现成的静态文件。`main` 分支是源码，`gh-pages` 分支是构建产物，职责分离。

### Q: 部署脚本会污染我的工作区吗？
A: 不会。脚本使用临时目录方案，所有 git 操作在临时目录内完成，主工作区的 main 分支和文件完全不受影响。

### Q: 推送时提示需要账号密码？
A: Windows 首次推送会弹出 Git Credential Manager 登录窗口，输入 Gitee 账号密码即可，之后会自动记住。

### Q: 访问出现 404？
A: 检查：
1. Gitee Pages 服务是否已启动
2. 部署分支是否选了 `gh-pages`
3. 是否点了「更新」按钮

### Q: 仓库需要实名认证？
A: 是的，Gitee 要求实名认证后才能开通 Pages。在 Gitee 设置 → 实名认证 里完成。
