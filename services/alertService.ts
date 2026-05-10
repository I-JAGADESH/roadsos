import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type AlertSeverity = 'low' | 'medium' | 'high';

export interface LocationData {
  latitude: number;
  longitude: number;
}

/**
 * Creates an emergency alert in the user's Alerts subcollection.
 * Path: userDetails/{userId}/Alerts
 */
export const createAlert = async (
  userId: string,
  severity: AlertSeverity,
  location: LocationData
) => {
  try {
    const alertsRef = collection(db, "userDetails", userId, "Alerts");
    
    const alertData = {
      severity,
      location,
      status: 'pending',
      helperId: null,
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(alertsRef, alertData);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error creating alert:", error);
    return { success: false, error: error.message };
  }
};
