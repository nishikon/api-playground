import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    startAfter,
  } from "firebase/firestore";
  
  import { db } from "./firebase.js";
  
  async function main() {
    const articlesRef = collection(db, "articles");
  
    const firstQuery = query(
      articlesRef,
      orderBy("id", "asc"),
      limit(5)
    );
  
    const firstSnapshot = await getDocs(firstQuery);
  
    console.log("1ページ目");
  
    firstSnapshot.forEach((doc) => {
      console.log(doc.id, doc.data().title);
    });
  
    const lastDoc = firstSnapshot.docs.at(-1);
  
    if (!lastDoc) {
      console.log("記事がありません");
      return;
    }
  
    const secondQuery = query(
      articlesRef,
      orderBy("id", "asc"),
      startAfter(lastDoc),
      limit(5)
    );
  
    const secondSnapshot = await getDocs(secondQuery);
  
    console.log("2ページ目");
  
    secondSnapshot.forEach((doc) => {
      console.log(doc.id, doc.data().title);
    });
  }
  
  main().catch(console.error);