import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>リサーチアプリ</h1>
      <p>調査した記事を管理するアプリ</p>

      <p>表示した記事数：{count}</p>

      <button onClick={() => setCount(count + 1)}>
        記事を追加
      </button>
    </main>
  );
}

export default App;