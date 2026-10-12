import { collection, getDocs, query, where, } from "firebase/firestore";
import { db } from "./firebase.js";

async function getArticles() {
  try {
    const articlesRef = collection(db, "articles");

const q = query(
  articlesRef,
  where("userId", "==", 1)
);

const snapshot = await getDocs(q);

    console.log(`記事数: ${snapshot.size}件`);

    snapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
    });

  } catch (error) {
    console.error("Firestoreの読み込みに失敗:", error);
  }
}

getArticles();