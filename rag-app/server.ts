import { createServer } from "node:http";

const server = createServer((req, res) => {
  if (req.url === "/api/hello" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
    });

    res.end(
      JSON.stringify({
        message: "こんにちは！Node.js APIです",
      })
    );

    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(3001, "127.0.0.1", () => {
  console.log("APIサーバー: http://127.0.0.1:3001");
});