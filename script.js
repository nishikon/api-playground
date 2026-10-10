async function getPosts() {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
    );

    const data = await response.json();

    console.log(data);

    const postsElement = document.getElementById("posts");

    data.slice(0, 5).forEach((post) => {
        const titleElement = document.createElement("h2");
    
        titleElement.textContent = post.title;
    
        postsElement.appendChild(titleElement);
      });

}

getPosts();