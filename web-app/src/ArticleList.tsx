import type { Article } from "./api";

type ArticleListProps = {
  articles: Article[];
};

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
}