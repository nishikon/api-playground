async function getPost() {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
    );

    const data = await response.json();

    const postsElement = document.getElementById("posts");

    postsElement.textContent = data.title;

}

getPost();