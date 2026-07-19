# 部署指南 · Gitee Pages

## 前置准备

1. 注册 [Gitee](https://gitee.com) 账号并完成实名认证（开通 Pages 必须）
2. 新建仓库，例如 `essay-chat`
3. 安装 Git（推荐 [Git for Windows](https://git-scm.com)）

## 初次部署

```bash
# 1. 关联 Gitee 远程仓库
git remote add origin https://gitee.com/<你的用户名>/essay-chat.git

# 2. 生成静态站点（输出到 dist/）
npm run generate

# 3. 提交并推送
git add .
git commit -m "v1.0.0"
git push origin master

# 4. 到 Gitee 仓库页面 → 服务 → Gitee Pages
#    选择部署分支 master，部署目录 dist，点击「启动」
#    Pro 用户可选择「强制使用 HTTPS」和「自动部署」
```

## 日常更新流程

```bash
# 1. 在 content/articles/ 下新增或修改 Markdown 文件
# 2. 本地预览（可选）
npm run dev

# 3. 重新生成静态站点
npm run generate

# 4. 提交并推送
git add .
git commit -m "新增文章: xxx"
git push origin master

# 5. 到 Gitee Pages 页面点击「更新」（Pro 版自动）
```

## 访问地址

- **免费版**: `https://<用户名>.gitee.io/essay-chat`
- **Pro 版**: 可绑定自定义域名

## 项目结构

```
essay-chat/
├── content/             ← 所有文章和内容（Markdown）
│   ├── articles/        ← 文章目录
│   └── about.md         ← 关于页面
├── pages/               ← 页面组件（Nuxt 路由）
├── components/          ← 通用组件
├── layouts/             ← 布局
├── assets/css/          ← 样式
├── profile.md           ← AI 画像文件
├── nuxt.config.ts       ← Nuxt 配置
└── package.json         ← 依赖
```

## 注意事项

- **免费版**：推送后需手动在 Gitee Pages 页面点击「更新」
- **Pro 版**（99元/年）：自动部署 + 自定义域名 + HTTPS 强制
- **仓库大小**：建议单个 Markdown 文件不超过 1MB，总仓库控制在 500MB 内
- **路径大小写**：Gitee Pages 路径区分大小写
