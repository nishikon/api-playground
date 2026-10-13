import { useState, type FormEvent } from "react";
import { searchStoredChunks, type ChunkResult } from "./api";

export function ChunkSearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<ChunkResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const query = keyword.trim();

    if (query.length === 0 || query.length > 80) {
      setError("検索キーワードは1〜80文字で入力してください");
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setSearched(false);

    try {
      const data = await searchStoredChunks(query);
      setResults(data.results);
      setSearched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "検索に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>記事本文を検索</h2>

      <form onSubmit={(e) => void handleSearch(e)}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="本文のキーワードを入力"
          maxLength={80}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "検索中..." : "検索する"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {searched && <p>検索結果：{results.length}件</p>}

      {results.map((chunk) => (
        <article key={`${chunk.articleId}-${chunk.index}`}>
          <h3>{chunk.title}</h3>
          <p>{chunk.content}</p>
        </article>
      ))}

      {searched && results.length === 0 && (
        <p>一致する文章がありません</p>
      )}
    </section>
  );
}