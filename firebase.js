import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { collection, getDocs, getFirestore, addDoc } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";


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
const auth = getAuth(app);

async function getFirestorePosts() {
    try {
        const postsRef = collection(db, "posts");
        const snapshot = await getDocs(postsRef);

        const container = document.getElementById("firestore-post");
        container.replaceChildren();

        snapshot.forEach((doc) => {
            const post = doc.data();

            const card = document.createElement("div");
            card.className = "post-card";

            const titleElement = document.createElement("h3");
            titleElement.textContent = post.title;

            const bodyElement = document.createElement("p");
            bodyElement.textContent = post.body;

            card.appendChild(titleElement);
            card.appendChild(bodyElement);

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Firestore取得エラー:", error);
    }
}

getFirestorePosts();

console.log("Firebaseの初期化に成功しました");

async function saveFirestorePost(title, body) {
    try {
      const user = auth.currentUser;
  
      if (!user) {
        console.log("ログインが必要です");
        return;
      }
  
      const postsRef = collection(db, "posts");
  
      const newPost = {
        title: title,
        body: body,
        userId: user.uid
      };
  
      const docRef = await addDoc(postsRef, newPost);
  
      console.log("保存成功:", docRef.id);
    } catch (error) {
      console.error("保存エラー:", error);
    }
  }


  async function loginAnonymously() {
    try {
      const result = await signInAnonymously(auth);
  
      console.log("匿名ログイン成功");
      console.log("ユーザーID:", result.user.uid);
  
      await saveFirestorePost(
        "初めてのアプリ投稿",
        "匿名認証を使ってFirestoreに保存しました"
      );
  
    } catch (error) {
      console.error("匿名ログインエラー:", error);
    }
  }
  
  loginAnonymously();