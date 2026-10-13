import { useEffect, useState } from "react";
import { getHelloMessage } from "./api";
import { useArticleSearch } from "./useArticleSearch";
import { useArticles } from "./useArticles";
import { SearchInput } from "./SearchInput";
import { ArticleList } from "./ArticleList";

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

  const {
    keyword,
    searchResults,
    searchPending,
    searchError,
  } = useArticleSearch(searchText);

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



  return (
    <main>
      <h1>リサーチアプリ</h1>

      <h2>自作APIからのメッセージ</h2>
      <p>{apiMessage}</p>

      <SearchInput
        value={searchText}
        onChange={setSearchText}
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
              <ArticleList articles={searchResults} />
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

          <ArticleList articles={articles} />

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