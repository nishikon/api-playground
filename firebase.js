import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { doc, getDoc, getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";



// Firebase Consoleに表示された設定情報
const firebaseConfig = {
    // ここに自分のFirebase設定を入れる
    apiKey: "AIzaSyBJOGskyaAvXQR3bbofws2mkNXB6jjezSo",
    authDomain: "api-playground-bb700.firebaseapp.com",
    projectId: "api-playground-bb700",
    storageBucket: "api-playground-bb700.firebasestorage.app",
    messagingSenderId: "1037427630943",
    appId: "1:1037427630943:web:65c4041587f2b3b2bfccea"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getFirestorePost() {
    try {
        const postRef = doc(db, "posts", "post1");
        const snapshot = await getDoc(postRef);

        if (snapshot.exists()) {
            console.log(snapshot.id, snapshot.data());
        } else {
            console.log("投稿が見つかりません");
        }
    } catch (error) {
        console.error("Firestore取得エラー:", error);
    }
}

getFirestorePost();

console.log("Firebaseの初期化に成功しました");