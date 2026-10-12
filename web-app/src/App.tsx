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

  return (
    <main>
      <h1>リサーチアプリ</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <p>記事数：{articles.length}件</p>
          <ul>
            {articles.map((article) => (
              <li key={article.id}>{article.title}</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

export default App;