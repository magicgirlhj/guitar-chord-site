import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const defaultRoot = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(process.env.PUBLIC_DIR || process.argv[2] || defaultRoot);
const rootWithSep = root.endsWith(sep) ? root : `${root}${sep}`;
const startPort = Number.parseInt(process.env.PORT || "4173", 10);
const host = "127.0.0.1";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const requested = decoded === "/" ? "/index.html" : decoded;
  const resolved = normalize(join(root, requested));
  return resolved === root || resolved.startsWith(rootWithSep) ? resolved : null;
}

function makeServer() {
  return createServer(async (req, res) => {
    const filePath = safePath(req.url || "/");

    if (!filePath) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    try {
      const data = await readFile(filePath);
      res.writeHead(200, {
        "Content-Type": types[extname(filePath)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(data);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
    }
  });
}

function listen(port) {
  const server = makeServer();

  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && port < startPort + 20) {
      listen(port + 1);
      return;
    }

    console.error(error);
    process.exit(1);
  });

  server.listen(port, host, () => {
    console.log(`Guitar Chord Finder running at http://${host}:${port}`);
    console.log(`Serving ${root}`);
  });
}

listen(startPort);
