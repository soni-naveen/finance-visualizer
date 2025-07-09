"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

export async function createUser(userData) {
  try {
    const client = await clientPromise;
    const db = client.db("finance-app");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      email: userData.email.toLowerCase(),
    });

    if (existingUser) {
      return { success: false, error: "User already exists with this email" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const newUser = {
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    return {
      success: true,
      user: {
        id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function requestPasswordReset(email) {
  try {
    const client = await clientPromise;
    const db = client.db("finance-app");

    const user = await db.collection("users").findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      // Don't reveal if user exists or not
      return {
        success: true,
        message: "If an account exists, a reset email has been sent",
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
          updatedAt: new Date(),
        },
      }
    );

    // Send email (implement this based on your email service)
    await sendPasswordResetEmail(user.email, resetToken);

    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { success: false, error: "Failed to send reset email" };
  }
}

export async function resetPassword(token, newPassword) {
  try {
    const client = await clientPromise;
    const db = client.db("finance-app");

    const user = await db.collection("users").findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return { success: false, error: "Invalid or expired reset token" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetToken: "",
          resetTokenExpiry: "",
        },
      }
    );

    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
