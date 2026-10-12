import { useEffect, useState } from "react";
import { getHelloMessage } from "./api";
import { useArticles } from "./useArticles";

function App() {
  const {
    articles,
    loading,
    error,
    hasMore,
    loadingMore,
    loadMoreError,
    loadMore,
  } = useArticles();

  const [searchText, setSearchText] = useState("");
  const [apiMessage, setApiMessage] = useState("読み込み中...");

  useEffect(() => {
    let cancelled = false;

    async function fetchMessage() {
      try {
        const data = await getHelloMessage();

        if (!cancelled) {
          setApiMessage(data.message);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setApiMessage("APIとの通信に失敗しました");
        }
      }
    }

    void fetchMessage();

    return () => {
      cancelled = true;
    };
  }, []);

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
            <button
              onClick={() => void loadMore()}
              disabled={loadingMore}
            >
              {loadingMore ? "取得中..." : "さらに読み込む"}
            </button>
          )}
        </>
      )}
    </main>
  );
}

export default App;