import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { handler } from "./app.mjs";

const frontendFile = new URL("../frontend/index.html", import.meta.url);

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost:3000");

    if (req.method === "GET" && url.pathname === "/") {
      const html = await readFile(frontendFile);

      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
      });

      res.end(html);
      return;
    }

    const result = await handler({
      rawPath: url.pathname,
      requestContext: {
        http: { method: req.method },
      },
      queryStringParameters: Object.fromEntries(
        url.searchParams
      ),
    });

    res.writeHead(result.statusCode, result.headers);
    res.end(result.body);
  } catch (error) {
    console.error(error);

    res.writeHead(500, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify({
      message: "Internal server error",
    }));
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Open http://localhost:3000");
});