import type { Article } from "./api";

type ArticleListProps = {
    articles: Article[];
};

export function ArticleList({ articles }: ArticleListProps) {
    if (articles.length === 0) {
        return <p>記事がありません</p>;
    }

    return (
        <ul>
            {articles.map((article) => (
                <li key={article.id}>{article.title}</li>
            ))}
        </ul>
    );
}