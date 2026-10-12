import { useEffect, useState } from "react";
import {
  getArticles,
  getHelloMessage,
  type Article,
} from "./api";



function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [apiMessage, setApiMessage] = useState("読み込み中...");
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [helloData, articlesData] = await Promise.all([
          getHelloMessage(),
          getArticles(),
        ]);
        if (!cancelled) {
          setApiMessage(helloData.message);
          setArticles(articlesData.articles);
          setHasMore(articlesData.hasMore);
          setNextCursor(articlesData.nextCursor);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("APIからデータを取得できませんでした");
          setApiMessage("APIとの通信に失敗しました");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadMore() {
    if (loadingMore || !hasMore || nextCursor === null) return;

    setLoadingMore(true);
    setLoadMoreError("");

    try {
      const data = await getArticles(nextCursor);

      setArticles((prev) => [...prev, ...data.articles]);
      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error(err);

      if (err instanceof TypeError) {
        setLoadMoreError("サーバーに接続できませんでした");
      } else if (err instanceof Error) {
        setLoadMoreError(err.message);
      } else {
        setLoadMoreError("追加の記事を取得できませんでした");
      }

    } finally {
      setLoadingMore(false);
    }
  }

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <main>
      <h1>リサーチアプリ</h1>

      <h2>自作APIからのメッセージ</h2>
      <p>{apiMessage}</p>

      <input
        type="text"
        placeholder="記事タイトルを検索..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {loading ? (
        <p>読み込み中...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <p>検索結果：{filteredArticles.length}件</p>

          {filteredArticles.length === 0 ? (
            <p>一致する記事がありません</p>
          ) : (
            <ul>
              {filteredArticles.map((article) => (
                <li key={article.id}>{article.title}</li>
              ))}
            </ul>
          )}
          {loadMoreError && <p role="alert">{loadMoreError}</p>}

          {hasMore && (
            <button onClick={() => void loadMore()} disabled={loadingMore}>
              {loadingMore ? "取得中..." : "さらに読み込む"}
            </button>
          )}
        </>
      )}
    </main>
  );
}

export default App;