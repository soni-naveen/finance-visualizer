import { auth } from "./config";

export async function getCurrentUserToken() {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    return await user.getIdToken();
  } catch (error) {
    console.error("Error getting user token:", error);
    return null;
  }
}

export function getCurrentUserId() {
  return auth.currentUser?.uid || null;
}
