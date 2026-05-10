import { db } from "../config/firebase";
import { collection, serverTimestamp, query, where, onSnapshot, doc, writeBatch } from "firebase/firestore";

export type AlertSeverity = 'low' | 'medium' | 'high';

export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface ActiveAlert {
  id: string;
  userId: string;
  severity: AlertSeverity;
  location: LocationData;
  status: string;
  timestamp: any;
}

/**
 * Creates an emergency alert in both the user's Alerts subcollection
 * and the root 'liveAlerts' collection for efficient querying.
 */
export const createAlert = async (
  userId: string,
  severity: AlertSeverity,
  location: LocationData
) => {
  try {
    // Create references with the same ID for both locations
    const userAlertRef = doc(collection(db, "userDetails", userId, "Alerts"));
    const liveAlertRef = doc(db, "liveAlerts", userAlertRef.id);
    
    const alertData = {
      userId, // Explicitly store userId for root-level querying
      severity,
      location,
      status: 'pending',
      helperId: null,
      timestamp: serverTimestamp(),
    };

    // Use a batch to ensure atomicity across both collections
    const batch = writeBatch(db);
    batch.set(userAlertRef, alertData);
    batch.set(liveAlertRef, alertData);
    
    await batch.commit();

    return { success: true, id: userAlertRef.id };
  } catch (error: any) {
    console.error("Error creating alert:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Listens to all active alerts using the optimized root-level collection.
 */
export const listenToActiveAlerts = (callback: (alerts: ActiveAlert[]) => void) => {
  const alertsQuery = query(
    collection(db, 'liveAlerts'),
    where('status', '==', 'pending')
  );

  return onSnapshot(alertsQuery, (snapshot) => {
    const alerts = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as ActiveAlert;
    });

    // Client-side sort: newest first
    alerts.sort((a, b) => {
      const timeA = a.timestamp?.toMillis() || 0;
      const timeB = b.timestamp?.toMillis() || 0;
      return timeB - timeA;
    });

    callback(alerts);
  }, (error) => {
    console.error("Error listening to alerts:", error);
  });
};
