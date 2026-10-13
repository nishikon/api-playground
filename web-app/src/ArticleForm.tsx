import { useState, type FormEvent } from "react";
import { createArticle } from "./api";

export function ArticleForm() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const articleId = Number(id);

    if (
      !Number.isSafeInteger(articleId) ||
      articleId <= 0 ||
      title.trim().length === 0 ||
      title.trim().length > 100
    ) {
      setError("正しいIDと1〜100文字のタイトルを入力してください");
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await createArticle(articleId, title.trim());

      setMessage("記事を登録しました！");
      setId("");
      setTitle("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "登録に失敗しました"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)}>
      <h2>記事を登録する</h2>

      <div>
        <label htmlFor="article-id">記事ID</label>
        <input
          id="article-id"
          type="number"
          min="1"
          step="1"
          required
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="article-title">記事タイトル</label>
        <input
          id="article-title"
          type="text"
          maxLength={100}
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <button type="submit" disabled={saving}>
        {saving ? "登録中..." : "記事を登録する"}
      </button>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
    </form>
  );
}