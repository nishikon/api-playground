import { readFile } from "node:fs/promises";
import { adminDb } from "./admin.js";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

async function saveArticle() {
  const json = await readFile(
    new URL("./posts.json", import.meta.url),
    "utf-8"
  );

  const posts: Post[] = JSON.parse(json);
  const articles = posts.slice(0, 10);

if (articles.length === 0) {
  throw new Error("記事がありません");
}

const batch = adminDb.batch();

for (const article of articles) {
  const docRef = adminDb
    .collection("articles")
    .doc(String(article.id));

  batch.set(docRef, article);
}

await batch.commit();

console.log(`${articles.length}件の記事を保存しました`);
}

saveArticle().catch(console.error);