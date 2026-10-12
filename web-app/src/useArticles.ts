import { useEffect, useState } from "react";
import { getArticles, type Article } from "./api";

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadInitialArticles() {
      try {
        const data = await getArticles();

        if (!cancelled) {
          setArticles(data.articles);
          setHasMore(data.hasMore);
          setNextCursor(data.nextCursor);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("APIから記事を取得できませんでした");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialArticles();

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

  return {
    articles,
    loading,
    error,
    hasMore,
    loadingMore,
    loadMoreError,
    loadMore,
  };
}