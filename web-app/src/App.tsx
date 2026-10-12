import { useEffect, useState } from "react";
import { getHelloMessage, searchArticles, type Article } from "./api";
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
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [searchError, setSearchError] = useState("");

  const keyword = searchText.trim();

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

  useEffect(() => {
    if (keyword === "") return;

    let cancelled = false;
    const controller = new AbortController();

    const timer = setTimeout(() => {
      async function runSearch() {
        try {
          const data = await searchArticles(keyword, controller.signal);

          if (!cancelled) {
            setSearchResults(data.articles);
            setSearchError("");
            setSearchedKeyword(keyword);
          }
        } catch (err) {
          if (controller.signal.aborted) return;
          
          console.error(err);

          if (!cancelled) {
            setSearchError(
              err instanceof Error ? err.message : "検索に失敗しました"
            );
            setSearchedKeyword(keyword);
          }
        }
      }

      void runSearch();
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [keyword]);

  const searchPending = keyword !== "" && searchedKeyword !== keyword;

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

      {keyword !== "" ? (
        searchPending ? (
          <p>検索中...</p>
        ) : searchError ? (
          <p role="alert">{searchError}</p>
        ) : (
          <>
            <p>検索結果：{searchResults.length}件</p>

            {searchResults.length === 0 ? (
              <p>一致する記事がありません</p>
            ) : (
              <ul>
                {searchResults.map((article) => (
                  <li key={article.id}>{article.title}</li>
                ))}
              </ul>
            )}
          </>
        )
      ) : loading ? (
        <p>読み込み中...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <p>表示中の記事：{articles.length}件</p>

          <ul>
            {articles.map((article) => (
              <li key={article.id}>{article.title}</li>
            ))}
          </ul>

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