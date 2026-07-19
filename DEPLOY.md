# 部署指南 · GitHub Pages

## 部署原理

本项目是 Nuxt 3 静态站点，构建产物在 `.output/public/`（被 .gitignore 忽略，不进 main 分支）。
采用**双分支方案**：

- `main` 分支：源码（Markdown / Vue 组件 / 配置）
- `gh-pages` 分支：构建产物（纯静态 HTML/CSS/JS）

部署脚本 `npm run deploy` 会自动完成：构建 → 临时目录隔离 → 推送 gh-pages 到 GitHub。
GitHub Pages 检测到 gh-pages 分支更新后**自动部署**，无需手动点「更新」。

## 仓库结构

| remote | 地址 | 用途 |
|--------|------|------|
| `origin` | https://github.com/ChunShan0/essay-chat.git | 主仓库（GitHub Pages 部署源） |
| `gitee` | https://gitee.com/ChunShan0/essay-chat.git | 镜像备份（国内代码访问） |

## 前置准备

1. 注册 [GitHub](https://github.com) 账号
2. 安装 Git（推荐 [Git for Windows](https://git-scm.com)）
3. 本项目已关联远程仓库：`https://github.com/ChunShan0/essay-chat.git`

## 首次部署

### 1. 构建并推送 gh-pages 分支

```bash
npm run deploy
```

脚本会自动（临时目录隔离，不污染主工作区）：
- 运行 `nuxt generate` 生成静态文件
- 创建临时目录，复制 `.output/public/` 内容 + `.nojekyll`
- 在临时目录内 git init + commit
- `git push --force` 到 `origin/gh-pages`（即 GitHub）

### 2. 在 GitHub 开启 Pages 服务

1. 打开 https://github.com/ChunShan0/essay-chat
2. 点击 **Settings** → 左侧 **Pages**
3. 配置：
   - Source：**Deploy from a branch**
   - Branch：选 `gh-pages`，目录选 `/ (root)`
   - 点击 **Save**
4. 等待 1-2 分钟（页面顶部会显示部署状态）

### 3. 访问博客

部署成功后访问：

```
https://chunshan0.github.io/essay-chat
```

## 日常更新流程

写完文章后，两条命令搞定：

```bash
# 1. 部署静态站点到 gh-pages（GitHub Pages 会自动更新）
npm run deploy

# 2. 源码提交到 main（保存文章源文件）
git add .
git commit -m "新增文章: xxx"
git push origin main
```

GitHub Pages 推送后**自动部署**，1-2 分钟后即可看到更新，无需任何手动操作。

### 同步到 Gitee 镜像（可选）

```bash
git push gitee main
```

## 常见问题

### Q: 为什么需要两个分支？
A: GitHub Pages 只托管静态文件。`main` 分支是源码，`gh-pages` 分支是构建产物，职责分离。

### Q: 部署脚本会污染我的工作区吗？
A: 不会。脚本使用临时目录方案，所有 git 操作在临时目录内完成，主工作区的 main 分支和文件完全不受影响。

### Q: 推送时提示需要账号密码？
A: Windows 首次推送会弹出 Git Credential Manager 登录窗口，登录 GitHub 账号即可，之后会自动记住。

### Q: 访问出现 404？
A: 检查：
1. GitHub Pages 服务是否已开启（Settings → Pages）
2. Source 是否选了 `gh-pages` 分支
3. 是否等待了 1-2 分钟（首次部署需要构建时间）
4. 访问地址是否正确：`https://chunshan0.github.io/essay-chat`

### Q: GitHub Pages 是免费的吗？
A: 是的，GitHub Pages 对公开仓库完全免费，无流量限制，无实名认证要求。

### Q: 为什么不用 Gitee Pages？
A: Gitee Pages 已于 2024-05-01 永久下线（应监管要求），不再提供静态托管服务。Gitee 仓库仅作为代码镜像保留。
