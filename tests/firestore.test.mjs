import {
    initializeTestEnvironment,
    assertFails,
    assertSucceeds,
} from "@firebase/rules-unit-testing";

import { readFileSync } from "node:fs";

import {
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";

// セキュリティルールを読み込む
const rules = readFileSync("firestore.rules", "utf8");

// テスト用のFirestore環境を作る
const testEnv = await initializeTestEnvironment({
    projectId: "demo-api-playground",
    firestore: {
        host: "127.0.0.1",
        port: 8080,
        rules,
    },
});

await testEnv.clearFirestore();

try {
    // ログインしていないユーザーを作る
    const context = testEnv.unauthenticatedContext();

    // 未ログイン状態のFirestoreを取得
    const db = context.firestore();

    // 保存先のドキュメントを指定
    const postRef = doc(db, "posts", "test-post-1");

    // 保存が拒否されることを確認する
    await assertFails(
        setDoc(postRef, {
            title: "テスト投稿",
            body: "未ログインで保存できる？",
            userId: "test-user",
            createdAt: new Date(),
        })
    );

    console.log("テスト成功：未ログインの保存が拒否されました");

    // ログイン済みユーザーを作る
    const userContext = testEnv.authenticatedContext("user123");

    // このユーザーのFirestoreを取得
    const userDb = userContext.firestore();

    // 保存先のドキュメントを指定
    const userPostRef = doc(userDb, "posts", "test-post-2");

    // 本人の投稿が保存できることを確認
    await assertSucceeds(
        setDoc(userPostRef, {
            title: "ログイン済みユーザーの投稿",
            body: "本人なら保存できるはず",
            userId: "user123",
            createdAt: serverTimestamp(),
        })
    );

    console.log("テスト成功：ログインした本人は保存できました");

    // 他人のUIDを使った投稿を試す
    const otherPostRef = doc(userDb, "posts", "test-post-3");

    // user123でログインしているのに、
    // user999の投稿として保存しようとする
    await assertFails(
        setDoc(otherPostRef, {
            title: "なりすまし投稿",
            body: "他人のUIDで保存できる？",
            userId: "user999",
            createdAt: serverTimestamp(),
        })
    );

    console.log("テスト成功：他人のUIDでは保存できませんでした");

    // 別のログイン済みユーザーを作る
    const anotherContext = testEnv.authenticatedContext("user999");
    const anotherDb = anotherContext.firestore();

    // user123が作成した投稿を、user999が編集しようとする
    const targetPostRef = doc(anotherDb, "posts", "test-post-2");

    await assertFails(
        updateDoc(targetPostRef, {
            title: "他人が書き換えたタイトル",
        })
    );

    console.log("テスト成功：他人の投稿を編集できませんでした");

    // user123が自分の投稿を編集する
    await assertSucceeds(
        updateDoc(userPostRef, {
            title: "本人が編集したタイトル",
            body: "本人による更新テスト",
        })
    );

    console.log("テスト成功：本人は自分の投稿を編集できました");

    // 本人が投稿の所有者を変更しようとする
    await assertFails(
        updateDoc(userPostRef, {
            userId: "user999",
        })
    );

    console.log(
        "テスト成功：本人でもuserIdを変更できませんでした"
    );

    // user999がuser123の投稿を削除しようとする
    await assertFails(
        deleteDoc(targetPostRef)
    );

    console.log(
        "テスト成功：他人の投稿を削除できませんでした"
    );

    // user123が自分の投稿を削除する
    await assertSucceeds(
        deleteDoc(userPostRef)
    );

    console.log(
        "テスト成功：本人は自分の投稿を削除できました"
    );

    // 100文字を超えるタイトルで投稿しようとする
    await assertFails(
        setDoc(doc(userDb, "posts", "too-long-title"), {
            title: "あ".repeat(101),
            body: "本文です",
            userId: "user123",
            createdAt: serverTimestamp(),
        })
    );

    console.log("テスト成功：長すぎるタイトルを拒否しました");

    // 想定外のフィールドを追加して保存しようとする
    await assertFails(
        setDoc(doc(userDb, "posts", "invalid-field"), {
            title: "テスト投稿",
            body: "本文です",
            userId: "user123",
            createdAt: serverTimestamp(),
            isAdmin: true,
        })
    );

    console.log(
        "テスト成功：想定外のフィールドを拒否しました"
    );

} finally {
    // テスト環境を終了する
    await testEnv.cleanup();
}