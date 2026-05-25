import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import vm from "node:vm";

const distDir = "dist";
const filesToCopy = [
  ["styles.css", "styles.css"],
  ["vendor/react.production.min.js", "vendor/react.production.min.js"],
  ["vendor/react-dom.production.min.js", "vendor/react-dom.production.min.js"],
];

async function write(target, content) {
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);
}

async function copyFileToDist(source, target) {
  const content = await readFile(source);
  await write(join(distDir, target), content);
}

async function buildApp() {
  const babelCode = await readFile("vendor/babel.min.js", "utf8");
  const appSource = await readFile("src/app.jsx", "utf8");
  const context = {};

  vm.createContext(context);
  vm.runInContext(babelCode, context);

  return context.Babel.transform(appSource, {
    comments: false,
    compact: false,
    presets: ["react"],
    sourceType: "script",
  }).code;
}

await rm(distDir, { force: true, recursive: true });
await mkdir(distDir, { recursive: true });

for (const [source, target] of filesToCopy) {
  await copyFileToDist(source, target);
}

await write(
  join(distDir, "index.html"),
  `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Guitar Chord Finder</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="./vendor/react.production.min.js"></script>
    <script src="./vendor/react-dom.production.min.js"></script>
    <script src="./assets/app.js"></script>
  </body>
</html>
`
);
await write(join(distDir, "assets/app.js"), await buildApp());
await write(join(distDir, ".nojekyll"), "");

console.log(`Built static site in ${distDir}/`);
