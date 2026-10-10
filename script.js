async function getPosts() {
    const postsElement = document.getElementById("posts");

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts"
        );

        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }


        const data = await response.json();


        data.slice(0, 5).forEach((post) => {
            const titleElement = document.createElement("h2");

            titleElement.textContent = post.title;

            postsElement.appendChild(titleElement);
        });

    } catch (error) {
        console.error("API通信でエラーが発生しました：", error);
        postsElement.textContent = "データの取得に失敗しました。";
    }
}

getPosts();


const newPost = {
    title: "APIの勉強",
    body: "POSTリクエストの練習をしています",
    userId: 1
  };

  async function createPost() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newPost)
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }
  
      const data = await response.json();
  
      console.log(data);
  
    } catch (error) {
      console.error("POSTエラー:", error);
    }
  }
  
  createPost();