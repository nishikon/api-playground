import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

async function getArticles() {
  try {
    const snapshot = await getDocs(
      collection(db, "articles")
    );

    console.log(`記事数: ${snapshot.size}件`);

    snapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
    });

  } catch (error) {
    console.error("Firestoreの読み込みに失敗:", error);
  }
}

getArticles();