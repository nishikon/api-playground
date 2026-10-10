import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { collection, getDocs, getFirestore, addDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
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
            
            const user = auth.currentUser;
            
            // 自分の投稿だけ削除ボタンを表示
            if (user && post.userId === user.uid) {
              const deleteButton = document.createElement("button");
              deleteButton.textContent = "削除";
            
              deleteButton.addEventListener("click", async () => {
                const confirmed = confirm("この投稿を削除しますか？");
            
                if (!confirmed) {
                  return;
                }
            
                deleteButton.disabled = true;
            
                const success = await deleteFirestorePost(doc.id);
            
                if (success) {
                  card.remove();
                } else {
                  alert("削除に失敗しました");
                  deleteButton.disabled = false;
                }
              });
            
              card.appendChild(deleteButton);
            }
            
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
            console.error("ログインが必要です");
            return false;
        }

        const postsRef = collection(db, "posts");

        const newPost = {
            title: title,
            body: body,
            userId: user.uid
        };

        const docRef = await addDoc(postsRef, newPost);

        console.log("保存成功:", docRef.id);
        return true;

    } catch (error) {
        console.error("保存エラー:", error);
        return false;
    }
}


async function loginAnonymously() {
    try {
        const result = await signInAnonymously(auth);

        console.log("匿名ログイン成功");
        console.log("ユーザーID:", result.user.uid);

        // ログイン完了後に投稿一覧を取得する
    await getFirestorePosts();

      

    } catch (error) {
        console.error("匿名ログインエラー:", error);
    }
}

loginAnonymously();

const firestoreForm = document.getElementById("firestore-form");
const firestoreTitle = document.getElementById("firestore-title");
const firestoreBody = document.getElementById("firestore-body");
const firestoreSubmit = document.getElementById("firestore-submit");
const firestoreMessage = document.getElementById("firestore-message");

firestoreForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = firestoreTitle.value.trim();
  const body = firestoreBody.value.trim();

  if (!title || !body) {
    firestoreMessage.textContent = "タイトルと本文を入力してください";
    return;
  }

  firestoreSubmit.disabled = true;
  firestoreMessage.textContent = "保存中です...";

  try {
    // ログイン処理が完了するまで待つ
    await auth.authStateReady();

    const success = await saveFirestorePost(title, body);

    if (success) {
      firestoreMessage.textContent = "保存に成功しました！";
      firestoreForm.reset();

      // Firestoreから最新の投稿一覧を取得
      await getFirestorePosts();
    } else {
      firestoreMessage.textContent = "保存に失敗しました";
    }
  } finally {
    firestoreSubmit.disabled = false;
  }
});

async function deleteFirestorePost(postId) {
    try {
      const postRef = doc(db, "posts", postId);
  
      await deleteDoc(postRef);
  
      console.log("Firestoreから削除しました:", postId);
      return true;
  
    } catch (error) {
      console.error("Firestore削除エラー:", error);
      return false;
    }
  }