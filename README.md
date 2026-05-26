# Guitar Chord Finder MVP

一个轻量 React MVP：输入和弦名查看多个吉他把位，或输入六根弦的品位识别可能的和弦。

## 运行

```bash
/Users/magicbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node server.mjs
```

然后打开终端显示的本地地址，默认是 `http://localhost:4173`。

## 构建发布版

```bash
/Users/magicbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node build.mjs
```

发布文件会生成在 `dist/`。具体发布步骤见 [DEPLOY.md](./DEPLOY.md)。

## 跨设备同步

曲谱默认会保存到当前浏览器。要跨设备同步，可以接 Supabase；数据库和 GitHub Secrets 设置见 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)。

## 支持

- 标准调弦：E A D G B e
- 和弦查询：C、Am、F#7、Bbmaj7、Dsus4、Cadd9、Bm7b5 等
- 反向识别：输入 `x` 表示闷音，数字表示品位，例如 `x 3 2 0 1 0`
# guitar-chord-site
# guitar-chord-site
