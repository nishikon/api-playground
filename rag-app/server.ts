import { createServer } from "node:http";
import { adminDb } from "./admin.js";

const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1:3001");

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

    if (url.pathname === "/api/articles" && req.method === "GET") {
        const after = url.searchParams.get("after");
      
        if (
          after !== null &&
          (!/^\d+$/.test(after) || !Number.isSafeInteger(Number(after)))
        ) {
          res.writeHead(400, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(JSON.stringify({ error: "afterには整数を指定してください" }));
          return;
        }
      
        try {
          let articlesQuery = adminDb
            .collection("articles")
            .where("userId", "==", 1)
            .orderBy("id", "desc");
      
          if (after !== null) {
            articlesQuery = articlesQuery.startAfter(Number(after));
          }
      
          const snapshot = await articlesQuery.limit(3).get();
      
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