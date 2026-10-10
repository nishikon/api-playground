import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { collection, getFirestore, addDoc, doc, deleteDoc, updateDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
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

function renderFirestorePosts(snapshot) {
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

            const editButton = document.createElement("button");
            editButton.textContent = "編集";

            editButton.addEventListener("click", async () => {
                // 現在のタイトルと本文を初期値として表示
                const newTitle = prompt("新しいタイトル", post.title);

                if (newTitle === null) {
                    return;
                }

                const newBody = prompt("新しい本文", post.body);

                if (newBody === null) {
                    return;
                }

                const title = newTitle.trim();
                const body = newBody.trim();

                if (!title || !body) {
                    alert("タイトルと本文を入力してください");
                    return;
                }

                if (title.length > 100 || body.length > 2000) {
                    alert("タイトルは100文字以内、本文は2000文字以内にしてください");
                    return;
                }

                editButton.disabled = true;

                const success = await updateFirestorePost(doc.id, title, body);

                if (success) {
                    titleElement.textContent = title;
                    bodyElement.textContent = body;

                    // 次に編集するときのために値を更新
                    post.title = title;
                    post.body = body;
                } else {
                    alert("更新に失敗しました");
                }

                editButton.disabled = false;
            });

            card.appendChild(editButton);
        }

        container.appendChild(card);
    });
}





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
            userId: user.uid,
            createdAt: serverTimestamp()
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

        watchFirestorePosts();



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

async function updateFirestorePost(postId, newTitle, newBody) {
    try {
        const postRef = doc(db, "posts", postId);

        await updateDoc(postRef, {
            title: newTitle,
            body: newBody
        });

        console.log("Firestoreの投稿を更新しました:", postId);
        return true;

    } catch (error) {
        console.error("Firestore更新エラー:", error);
        return false;
    }
}

function watchFirestorePosts() {
    onSnapshot(
        collection(db, "posts"),

        (snapshot) => {
            console.log("Firestoreのデータを取得しました");
            renderFirestorePosts(snapshot);
        },

        (error) => {
            console.error("Firestoreの監視エラー:", error);
        }
    );
}