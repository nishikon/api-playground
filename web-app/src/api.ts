export type Article = {
    id: string;
    title: string;
  };
  
  export type ArticlesResponse = {
    articles: Article[];
    hasMore: boolean;
    nextCursor: string | null;
  };
  
  async function requestJson<T>(
    url: string,
    signal?: AbortSignal
  ): Promise<T> {
    const response = await fetch(url, { signal });
  
    if (!response.ok) {
      const errorData: { error?: string } = await response
        .json()
        .catch(() => ({}));
  
      throw new Error(
        errorData.error ?? `APIエラー（HTTP ${response.status}）`
      );
    }
  
    return response.json() as Promise<T>;
  }
  
  export async function getHelloMessage() {
    return requestJson<{ message: string }>("/api/hello");
  }
  
  export async function getArticles(after?: string) {
    const url =
      after === undefined
        ? "/api/articles"
        : `/api/articles?after=${encodeURIComponent(after)}`;
  
    return requestJson<ArticlesResponse>(url);
  }

  export async function searchArticles(
    keyword: string,
    signal?: AbortSignal
  ) {
    const url = `/api/articles/search?q=${encodeURIComponent(keyword)}`;
  
    return requestJson<{ articles: Article[] }>(url, signal);
  }

  export async function createArticle(id: number, title: string) {
    const response = await fetch("/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title }),
    });
  
    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("その記事IDはすでに使われています");
      }
  
      throw new Error(`登録に失敗しました（HTTP ${response.status}）`);
    }
  
    return response.json() as Promise<Article>;
  }