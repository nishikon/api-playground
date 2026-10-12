import { useEffect, useState } from "react";
import { searchArticles, type Article } from "./api";

export function useArticleSearch(searchText: string) {
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [searchError, setSearchError] = useState("");

  const keyword = searchText.trim();

  useEffect(() => {
    if (keyword === "") return;

    let cancelled = false;
    const controller = new AbortController();

    const timer = setTimeout(() => {
      async function runSearch() {
        try {
          const data = await searchArticles(
            keyword,
            controller.signal
          );

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
              err instanceof Error
                ? err.message
                : "検索に失敗しました"
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

  const searchPending =
    keyword !== "" && searchedKeyword !== keyword;

  return {
    keyword,
    searchResults,
    searchPending,
    searchError,
  };
}