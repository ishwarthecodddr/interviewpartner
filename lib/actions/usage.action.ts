"use server";

import { db } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

interface UsageRecord {
  userId: string;
  interviews: number;
  lastUsed: Date;
  createdAt: Date;
}

export async function checkUserUsage(userId: string) {
  try {
    const usageRef = db.collection("usage").doc(userId);
    const usageDoc = await usageRef.get();

    if (!usageDoc.exists) {
      // First time user
      await usageRef.set({
        userId,
        interviews: 0,
        lastUsed: new Date(),
        createdAt: new Date(),
      });
      return { canUse: true, remainingInterviews: 1 };
    }

    const usage = usageDoc.data() as UsageRecord;

    // Limit: 1 interview per user
    if (usage.interviews >= 1) {
      return { canUse: false, remainingInterviews: 0 };
    }

    return { canUse: true, remainingInterviews: 1 - usage.interviews };
  } catch (error) {
    console.error("Error checking user usage:", error);
    return { canUse: false, remainingInterviews: 0 };
  }
}

export async function incrementUserUsage(userId: string) {
  try {
    const usageRef = db.collection("usage").doc(userId);
    await usageRef.update({
      interviews: FieldValue.increment(1),
      lastUsed: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error incrementing user usage:", error);
    return false;
  }
}
