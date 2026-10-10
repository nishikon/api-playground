import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";


// Firebase Consoleに表示された設定情報
const firebaseConfig = {
    // ここに自分のFirebase設定を入れる
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getFirestorePosts() {
    try {
        const postsRef = collection(db, "posts");
        const snapshot = await getDocs(postsRef);

        snapshot.forEach((doc) => {
            console.log(doc.id, doc.data());
        });
    } catch (error) {
        console.error("Firestore取得エラー:", error);
    }
}

getFirestorePosts();

console.log("Firebaseの初期化に成功しました");