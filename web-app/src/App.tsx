import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit, startAfter, type DocumentSnapshot, } from "firebase/firestore";
import { db } from "./firebase";

type Article = {
  id: string;
  title: string;
};

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [lastDoc, setLastDoc] =
    useState<DocumentSnapshot | null>(null);

  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchArticles() {
      try {
        const articlesQuery = query(
          collection(db, "articles"),
          where("userId", "==", 1),
          orderBy("id", "desc"),
          limit(3)
        );

        const snapshot = await getDocs(articlesQuery);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: String(doc.data().title ?? ""),
        }));

        if (!cancelled) {
          setArticles(data);
          setLastDoc(snapshot.docs.at(-1) ?? null);
          setHasMore(snapshot.docs.length === 3);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("記事の取得に失敗しました");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchArticles();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadMore() {
    if (!lastDoc || !hasMore || loadingMore) return;

    setLoadingMore(true);

    try {
      const nextQuery = query(
        collection(db, "articles"),
        where("userId", "==", 1),
        orderBy("id", "desc"),
        startAfter(lastDoc),
        limit(3)
      );

      const snapshot = await getDocs(nextQuery);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: String(doc.data().title ?? ""),
      }));

      setArticles((prev) => [...prev, ...data]);
      setLastDoc(snapshot.docs.at(-1) ?? null);
      setHasMore(snapshot.docs.length === 3);
    } catch (err) {
      console.error(err);
      setError("追加の記事の取得に失敗しました");
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
              {hasMore && !error && (
                <button
                  onClick={() => void loadMore()}
                  disabled={loadingMore}
                >
                  {loadingMore ? "取得中..." : "さらに読み込む"}
                </button>
              )}
              {filteredArticles.map((article) => (
                <li key={article.id}>{article.title}</li>
              ))}
            </ul>

          )}
        </>
      )}
    </main>
  );
}

export default App;