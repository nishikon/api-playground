async function getPost() {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
  
    console.log(response);
  }
  
  getPost();