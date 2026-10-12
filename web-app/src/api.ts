export type Article = {
    id: string;
    title: string;
  };
  
  export type ArticlesResponse = {
    articles: Article[];
    hasMore: boolean;
    nextCursor: string | null;
  };
  
  async function requestJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
  
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