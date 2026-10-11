type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
  };
  
  async function getPosts() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=20"
      );
  
      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }
  
      const data: Post[] = await response.json();
  
      const keyword = "qui";
  
      const results = data.filter((post) => {
        return post.title.includes(keyword);
      });
  
      console.log(`検索結果: ${results.length}件`);
  
      results.forEach((post) => {
        console.log(`${post.id}. ${post.title}`);
      });
  
    } catch (error) {
      console.error("取得に失敗しました:", error);
    }
  }
  
  getPosts();