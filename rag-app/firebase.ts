import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  projectId: "api-playground-bb700",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

connectFirestoreEmulator(db, "127.0.0.1", 8080);