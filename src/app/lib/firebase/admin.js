import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

const adminApp =
  getApps().find((app) => app.name === "admin") ||
  initializeApp(firebaseAdminConfig, "admin");

export const adminAuth = getAuth(adminApp);
export default adminApp;
