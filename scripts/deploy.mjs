#!/usr/bin/env node
/**
 * 部署脚本：构建静态站点并推送到 gh-pages 分支
 *
 * 采用「临时目录隔离」方案，避免污染主工作区：
 * 1. npm run generate  → 生成静态文件到 .output/public/
 * 2. 创建临时目录，复制构建产物
 * 3. 在临时目录内 git init + commit
 * 4. git push --force 到 origin/gh-pages
 * 5. 删除临时目录
 *
 * 主仓库的 main 分支和工作区完全不受影响。
 *
 * 用法：npm run deploy
 */

import { execSync } from "node:child_process";
import {
  existsSync,
  rmSync,
  cpSync,
  readdirSync,
  statSync,
  writeFileSync,
  mkdtempSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const ROOT = resolve(import.meta.dirname, "..");
const OUTPUT_DIR = join(ROOT, ".output", "public");
const REMOTE_URL = execSync("git remote get-url origin", {
  cwd: ROOT,
  encoding: "utf8",
}).trim();

function run(cmd, opts = {}) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...opts });
}

function ensureOutput() {
  if (!existsSync(OUTPUT_DIR)) {
    console.error("\n✘ 构建产物 .output/public/ 不存在");
    process.exit(1);
  }
  const files = readdirSync(OUTPUT_DIR);
  if (files.length === 0) {
    console.error("\n✘ 构建产物 .output/public/ 为空");
    process.exit(1);
  }
  console.log(`\n✓ 构建产物就绪（${files.length} 个顶层条目）`);
}

function main() {
  console.log(`\n远程仓库: ${REMOTE_URL}`);

  // 1. 构建静态站点
  console.log("\n=== 第 1 步：构建静态站点 ===");
  run("npm run generate", { cwd: ROOT });

  ensureOutput();

  // 2. 创建临时目录并复制构建产物
  console.log("\n=== 第 2 步：复制构建产物到临时目录 ===");
  const tmpDir = mkdtempSync(join(tmpdir(), "essay-chat-deploy-"));
  console.log(`临时目录: ${tmpDir}`);

  const entries = readdirSync(OUTPUT_DIR);
  for (const entry of entries) {
    const src = join(OUTPUT_DIR, entry);
    const dst = join(tmpDir, entry);
    const stat = statSync(src);
    if (stat.isDirectory()) {
      cpSync(src, dst, { recursive: true });
    } else {
      cpSync(src, dst);
    }
  }

  // 添加 .nojekyll（防止 Gitee Pages 忽略 _ 开头的目录，如 _nuxt）
  writeFileSync(join(tmpDir, ".nojekyll"), "");
  console.log("✓ 已复制构建产物 + .nojekyll");

  // 3. 在临时目录内初始化 git 并提交
  console.log("\n=== 第 3 步：初始化 git 并提交 ===");
  run("git init", { cwd: tmpDir, stdio: "pipe" });
  run("git checkout -b gh-pages", { cwd: tmpDir, stdio: "pipe" });
  run("git add -A", { cwd: tmpDir, stdio: "pipe" });

  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  execSync(`git commit -m "deploy: ${timestamp}"`, {
    cwd: tmpDir,
    encoding: "utf8",
  });
  console.log(`✓ 已提交: deploy: ${timestamp}`);

  // 4. 推送到 origin/gh-pages
  console.log("\n=== 第 4 步：推送到 origin/gh-pages ===");
  run(`git push --force "${REMOTE_URL}" gh-pages:gh-pages`, { cwd: tmpDir });

  // 5. 清理临时目录
  console.log("\n=== 第 5 步：清理临时目录 ===");
  rmSync(tmpDir, { recursive: true, force: true });
  console.log("✓ 临时目录已删除");

  console.log("\n✓ 部署完成！");
  console.log("\n下一步：");
  console.log("  1. 进入 Gitee 仓库 → 服务 → Gitee Pages");
  console.log("  2. 部署分支选 gh-pages，目录留空（根目录）");
  console.log("  3. 点击「启动」");
  console.log(`  4. 访问 https://chunshan0.gitee.io/essay-chat`);
}

main();
