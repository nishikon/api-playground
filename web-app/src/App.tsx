import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
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

  useEffect(() => {
    let cancelled = false;

    async function fetchArticles() {
      try {
        const snapshot = await getDocs(collection(db, "articles"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: String(doc.data().title ?? ""),
        }));

        if (!cancelled) {
          setArticles(data);
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
              {filteredArticles.map((article) => (
                <li key={article.id}>{article.title}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );

export default App;