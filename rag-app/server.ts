import { createServer } from "node:http";
import { adminDb } from "./admin.js";

const server = createServer(async (req, res) => {
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

  if (req.url === "/api/articles" && req.method === "GET") {
    try {
      const snapshot = await adminDb
        .collection("articles")
        .where("userId", "==", 1)
        .orderBy("id", "desc")
        .limit(3)
        .get();

      const articles = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: String(doc.data().title ?? ""),
      }));

      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify(articles));
    } catch (error) {
      console.error(error);
      res.writeHead(500, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify({ error: "記事の取得に失敗しました" }));
    }
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(3001, "127.0.0.1", () => {
  console.log("APIサーバー: http://127.0.0.1:3001");
});