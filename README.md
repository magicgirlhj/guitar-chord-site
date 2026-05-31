# Guitar Songbook

一个轻量 React 工具：默认是基于六弦按法输入的个人曲谱记录工具，同时保留和弦搜索与反向识别。

## 运行

```bash
npm install
npm run dev
```

然后打开终端显示的本地地址，默认是 `http://localhost:4173`。

## 构建发布版

```bash
npm run build
```

发布文件会生成在 `dist/`。具体发布步骤见 [DEPLOY.md](./DEPLOY.md)。

## 跨设备同步

曲谱默认会保存到当前浏览器。要跨设备同步，可以接 Supabase；数据库和 GitHub Secrets 设置见 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)。

## 支持

- 曲谱记录：多曲谱、多段落、按法输入、编辑和弦块、拖动排序、批量输入、复制段落、批量选择操作
- 标准调弦：E A D G B e
- Chord Tools：和弦查询 C、Am、F#7、Bbmaj7、Dsus4、Cadd9、Bm7b5 等
- Reverse Finder：点击和弦图输入按法，识别可能和弦
