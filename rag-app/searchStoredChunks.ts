import { adminDb } from "./admin.js";

async function searchStoredChunks(keyword: string) {
  const query = keyword.trim().toLowerCase();

  if (query === "") {
    throw new Error("検索キーワードを入力してください");
  }

  const articles = await adminDb
    .collection("articles")
    .where("userId", "==", 1)
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();

  for (const article of articles.docs) {
    const chunks = await article.ref
      .collection("chunks")
      .get();

    for (const chunk of chunks.docs) {
      const content = chunk.get("content");

      if (
        typeof content === "string" &&
        content.toLowerCase().includes(query)
      ) {
        console.log("記事:", article.get("title"));
        console.log("一致した文章:", content);
        console.log("---");
      }
    }
  }
}

searchStoredChunks("RAG").catch(console.error);