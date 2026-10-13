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
    if (url.pathname === "/api/articles/search" && req.method === "GET") {
        const values = url.searchParams.getAll("q");
        const keyword = values[0]?.trim() ?? "";

        if (values.length !== 1 || keyword.length === 0 || keyword.length > 80) {
            res.writeHead(400, {
                "Content-Type": "application/json; charset=utf-8",
            });
            res.end(
                JSON.stringify({
                    error: "検索キーワードは1〜80文字で指定してください",
                })
            );
            return;
        }

        try {
            const snapshot = await adminDb
                .collection("articles")
                .where("userId", "==", 1)
                .orderBy("id", "desc")
                .limit(100)
                .get();

            const articles = snapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    title: String(doc.data().title ?? ""),
                }))
                .filter((article) =>
                    article.title.toLowerCase().includes(keyword.toLowerCase())
                )
                .slice(0, 10);

            res.writeHead(200, {
                "Content-Type": "application/json; charset=utf-8",
            });

            res.end(JSON.stringify({ articles }));
        } catch (error) {
            console.error(error);

            res.writeHead(500, {
                "Content-Type": "application/json; charset=utf-8",
            });

            res.end(JSON.stringify({ error: "記事の検索に失敗しました" }));
        }

        return;
    }
    if (url.pathname === "/api/articles" && req.method === "GET") {
        const afterValues = url.searchParams.getAll("after");
        const after = afterValues[0] ?? null;

        const invalidAfter =
            afterValues.length > 1 ||
            (after !== null &&
                (!/^[1-9]\d*$/.test(after) ||
                    !Number.isSafeInteger(Number(after))));

        if (invalidAfter) {
            res.writeHead(400, {
                "Content-Type": "application/json; charset=utf-8",
            });
            res.end(
                JSON.stringify({
                    error: "afterには正の整数を1つだけ指定してください",
                })
            );
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

            const snapshot = await articlesQuery.limit(4).get();

            const hasMore = snapshot.docs.length > 3;

            const articles = snapshot.docs.slice(0, 3).map((doc) => ({
                id: doc.id,
                title: String(doc.data().title ?? ""),
            }));

            const nextCursor = hasMore
                ? (articles.at(-1)?.id ?? null)
                : null;

            res.writeHead(200, {
                "Content-Type": "application/json; charset=utf-8",
            });
            res.end(
                JSON.stringify({
                    articles,
                    hasMore,
                    nextCursor,
                })
            );
        } catch (error) {
            console.error(error);
            res.writeHead(500, {
                "Content-Type": "application/json; charset=utf-8",
            });
            res.end(JSON.stringify({ error: "記事の取得に失敗しました" }));
        }

        return;
    }

    if (url.pathname === "/api/articles" && req.method === "POST") {
        try {
            const chunks: Buffer[] = [];
            let size = 0;
    
            for await (const chunk of req) {
                const buffer = Buffer.from(chunk);
                size += buffer.length;
    
                if (size > 4096) {
                    res.writeHead(413);
                    res.end("Request too large");
                    return;
                }
    
                chunks.push(buffer);
            }
    
            const body: unknown = JSON.parse(
                Buffer.concat(chunks).toString("utf8")
            );
    
            if (typeof body !== "object" || body === null || Array.isArray(body)) {
                res.writeHead(400);
                res.end("Invalid JSON data");
                return;
            }
    
            const data = body as Record<string, unknown>;
            const id = data.id;
            const title = data.title;
    
            if (
                typeof id !== "number" ||
                !Number.isSafeInteger(id) ||
                id <= 0 ||
                typeof title !== "string" ||
                title.trim().length === 0 ||
                title.trim().length > 100
            ) {
                res.writeHead(400);
                res.end("Invalid article");
                return;
            }
    
            await adminDb.collection("articles").doc(String(id)).create({
                id,
                userId: 1,
                title: title.trim(),
            });
    
            res.writeHead(201, {
                "Content-Type": "application/json; charset=utf-8",
            });
            res.end(JSON.stringify({
                id: String(id),
                title: title.trim(),
            }));
        } catch (error) {
            if (error instanceof SyntaxError) {
                res.writeHead(400);
                res.end("Invalid JSON");
            } else if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                error.code === 6
            ) {
                res.writeHead(409);
                res.end("Article ID already exists");
            } else {
                console.error(error);
                res.writeHead(500);
                res.end("Failed to create article");
            }
        }
    
        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

server.listen(3001, "127.0.0.1", () => {
    console.log("APIサーバー: http://127.0.0.1:3001");
});