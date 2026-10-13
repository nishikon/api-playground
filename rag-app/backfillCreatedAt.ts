import { adminDb } from "./admin.js";
import { Timestamp } from "firebase-admin/firestore";

async function backfillCreatedAt() {
  const snapshot = await adminDb.collection("articles").get();
  let count = 0;

  for (const doc of snapshot.docs) {
    if (doc.get("createdAt") !== undefined) continue;

    const createdAt = doc.createTime ?? Timestamp.now();

    await doc.ref.update({ createdAt });
    count++;
  }

  console.log(`${count}件の記事に登録日時を補完しました`);
}

backfillCreatedAt().catch(console.error);