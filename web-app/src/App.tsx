import { useState } from "react";

type Article = {
  id: number;
  title: string;
};

function App() {
  const [articles, setArticles] = useState<Article[]>([
    { id: 1, title: "AI市場の調査" },
    { id: 2, title: "海外SaaSの競合分析" },
  ]);

  function addArticle() {
    const newArticle: Article = {
      id: articles.length + 1,
      title: `新しい記事 ${articles.length + 1}`,
    };

    setArticles([...articles, newArticle]);
  }

  return (
    <main>
      <h1>リサーチアプリ</h1>
      <p>記事数：{articles.length}件</p>

      <button onClick={addArticle}>記事を追加</button>

      <ul>
        {articles.map((article) => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;