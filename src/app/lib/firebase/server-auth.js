import { adminAuth } from "./admin";
import { headers } from "next/headers";

export async function verifyAuthToken() {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return null;
    }

    const token = authorization.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error("Error verifying auth token:", error);
    return null;
  }
}

export async function getCurrentUserIdFromCookies() {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");

    if (!cookieHeader) return null;

    // Extract Firebase auth token from cookies
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {});

    const token = cookies["firebase-auth-token"];
    if (!token) return null;

    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error("Error getting user from cookies:", error);
    return null;
  }
}
