import { chunkText } from "./chunkText.js";

function searchChunks(chunks: string[], keyword: string): string[] {
  const query = keyword.trim().toLowerCase();

  if (query === "") {
    return [];
  }

  return chunks.filter((chunk) =>
    chunk.toLowerCase().includes(query)
  );
}

const text =
  "Reactは画面を作ります。Firebaseはデータを保存します。TypeScriptは型を扱います。";

const chunks = chunkText(text, 30, 10);

const results = searchChunks(chunks, "Firebase");

console.log("分割結果:", chunks);
console.log("検索結果:", results);