async function getPosts() {
    const postsElement = document.getElementById("posts");


    loadButton.disabled = true;
    postsElement.textContent = "読み込み中...";

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts"
        );

        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }


        const data = await response.json();

        postsElement.replaceChildren();

        data.slice(0, 5).forEach((post) => {
            // カード全体を作成
            const cardElement = document.createElement("div");
            cardElement.className = "post-card";

            // タイトルを作成
            const titleElement = document.createElement("h2");
            titleElement.textContent = post.title;

            // 本文を作成
            const bodyElement = document.createElement("p");
            bodyElement.textContent = post.body;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "削除";

            deleteButton.addEventListener("click", async () => {
                deleteButton.disabled = true;
              
                const success = await deletePost(post.id);
              
                if (success) {
                  cardElement.remove();
                } else {
                  deleteButton.disabled = false;
                }
              });

            // タイトルと本文をカードの中に入れる
            cardElement.appendChild(titleElement);
            cardElement.appendChild(bodyElement);
            cardElement.appendChild(deleteButton);
            // カードを投稿一覧に追加
            postsElement.appendChild(cardElement);
        });

    } catch (error) {
        console.error("API通信でエラーが発生しました：", error);
        postsElement.textContent = "データの取得に失敗しました。";
    } finally {
        loadButton.disabled = false;
    }
}




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


const updatedPost = {
    id: 1,
    title: "APIの勉強（更新版）",
    body: "PUTリクエストを勉強しています",
    userId: 1
};

async function updatePost() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts/1",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedPost)
            }
        );

        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        const data = await response.json();

        console.log("PUTの結果:", data);

    } catch (error) {
        console.error("PUTエラー:", error);
    }
}

updatePost();


const patchedPost = {
    title: "PATCHでタイトルを変更しました"
};

async function patchPost() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts/1",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(patchedPost)
            }
        );

        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        const data = await response.json();

        console.log("PATCHの結果:", data);

    } catch (error) {
        console.error("PATCHエラー:", error);
    }
}

patchPost();


async function deletePost() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts/1",
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        console.log("DELETE成功:", response.status);

    } catch (error) {
        console.error("DELETEエラー:", error);
    }
}

deletePost();


const loadButton = document.getElementById("load-posts");

loadButton.addEventListener("click", () => {
    getPosts();
});


async function deletePost(postId) {
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${postId}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        console.log(`投稿ID ${postId} の削除に成功しました`);

        return true;

    } catch (error) {
        console.error("DELETEエラー:", error);
        return false;
    }
}