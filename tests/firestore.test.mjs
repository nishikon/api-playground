import {
    initializeTestEnvironment,
    assertFails,
    assertSucceeds,
} from "@firebase/rules-unit-testing";

import { readFileSync } from "node:fs";

import {
    doc,
    setDoc,
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

} finally {
    // テスト環境を終了する
    await testEnv.cleanup();
}