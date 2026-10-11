import { readFile } from "node:fs/promises";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

async function searchPosts() {
  try {
    // JSONファイルを読み込む
    const file = await readFile("posts.json", "utf-8");

    // JSON文字列をJavaScriptの配列に変換
    const data: Post[] = JSON.parse(file);

    // 検索キーワード
    const keyword = "qui";

    // タイトルと本文を検索
    const results = data.filter((post) => {
      return (
        post.title.includes(keyword) ||
        post.body.includes(keyword)
      );
    });

    console.log(`検索結果: ${results.length}件`);

    results.forEach((post) => {
      console.log(`${post.id}. ${post.title}`);
    });

  } catch (error) {
    console.error("検索に失敗しました:", error);
  }
}

searchPosts();