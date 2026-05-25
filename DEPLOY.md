# 发布成网址

这个项目已经整理成静态站点。运行 `node build.mjs` 会生成 `dist/`，里面就是可以发布到网上的版本。

## 推荐方案：GitHub Pages

适合长期维护和免费发布。部署完成后会得到一个公开网址，格式通常是：

```text
https://你的用户名.github.io/仓库名/
```

### 你需要做的步骤

1. 登录 GitHub，新建一个仓库，例如 `guitar-chord-site`。
2. 在本地项目目录初始化 Git 并推送：

```bash
git init
git branch -M main
git add .
git commit -m "Initial guitar chord site"
git remote add origin https://github.com/你的用户名/guitar-chord-site.git
git push -u origin main
```

3. 打开 GitHub 仓库页面，进入 `Settings`。
4. 左侧打开 `Pages`。
5. 在 `Build and deployment` 里把 `Source` 选为 `GitHub Actions`。
6. 打开仓库的 `Actions` 页面，等待 `Deploy to GitHub Pages` 跑完。
7. 回到 `Settings -> Pages`，复制页面显示的网址。

以后每次改完代码，运行：

```bash
/Users/magicbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node build.mjs
git add .
git commit -m "Update site"
git push
```

GitHub 会自动重新部署。

## 临时最快方案：上传 dist

如果你不想先学 Git，也可以把 `dist/` 文件夹上传到 Netlify Drop 或 Vercel。这个方式最快，但后续维护不如 GitHub 仓库清晰。

## 曲谱保存提醒

网站发布后，曲谱库仍然会自动保存在当前浏览器里。要长期保存或换设备，请在网页里点击 `导出`，保存 JSON 文件；需要恢复时点击 `导入`。
