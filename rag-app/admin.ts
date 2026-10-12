import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (process.env.FIRESTORE_EMULATOR_HOST !== "127.0.0.1:8080") {
  throw new Error("Firestore Emulator以外への接続は禁止しています");
}

const app =
  getApps()[0] ??
  initializeApp({
    projectId: "api-playground-bb700",
  });

export const adminDb = getFirestore(app);