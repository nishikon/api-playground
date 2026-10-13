import { useState, type FormEvent } from "react";
import { createArticle } from "./api";

type ArticleFormProps = {
  onCreated: () => Promise<void>;
};

export function ArticleForm({ onCreated }: ArticleFormProps) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
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
      await createArticle(title.trim());

      setTitle("");

      try {
        await onCreated();
        setMessage("記事を登録し、一覧を更新しました！");
      } catch {
        setMessage("記事は登録されましたが、一覧の更新に失敗しました");
      }
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