async function getPost() {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
    );

    const data = await response.json();

    const postsElement = document.getElementById("posts");

    postsElement.textContent = data.title;

    console.log(data);
    console.log(data.length);

}

getPosts();