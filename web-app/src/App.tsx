import { useEffect, useState } from "react";

type Article = {
  id: string;
  title: string;
};

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [apiMessage, setApiMessage] = useState("読み込み中...");
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [helloResponse, articlesResponse] = await Promise.all([
          fetch("/api/hello"),
          fetch("/api/articles"),
        ]);

        if (!helloResponse.ok || !articlesResponse.ok) {
          throw new Error("API通信に失敗しました");
        }

        const helloData: { message: string } =
          await helloResponse.json();

        const articlesData: Article[] =
          await articlesResponse.json();

        if (!cancelled) {
          setApiMessage(helloData.message);
          setArticles(articlesData);
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
    if (loadingMore || !hasMore || articles.length === 0) return;

    setLoadingMore(true);
    setLoadMoreError("");

    try {
      const lastArticle = articles[articles.length - 1];

      const response = await fetch(
        `/api/articles?after=${encodeURIComponent(lastArticle.id)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: Article[] = await response.json();

      setArticles((prev) => [...prev, ...data]);
      setHasMore(data.length === 3);
    } catch (err) {
      console.error(err);
      setLoadMoreError("追加の記事を取得できませんでした");
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