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
  const article = posts[0];

  if (!article) {
    throw new Error("記事がありません");
  }

  await adminDb
    .collection("articles")
    .doc(String(article.id))
    .set(article);

  console.log("保存成功:", article.title);
}

saveArticle().catch(console.error);