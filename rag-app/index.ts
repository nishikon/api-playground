import { writeFile } from "node:fs/promises";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

async function getPosts() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=10"
    );

    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const data: Post[] = await response.json();

    await writeFile(
      "posts.json",
      JSON.stringify(data, null, 2),
      "utf-8"
    );

    console.log(`${data.length}件の記事を保存しました！`);

  } catch (error) {
    console.error("処理に失敗しました:", error);
  }
}

getPosts();