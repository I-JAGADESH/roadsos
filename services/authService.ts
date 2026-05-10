import { auth, db } from "../config/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";

/**
 * Sign Up a Citizen
 * Saves to root 'userDetails' collection.
 */
export const signUp = async (
  email: string, 
  password: string, 
  profileData: { name: string; allergens: string; medications: string; bloodGroup: string }
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile = {
      uid: user.uid,
      email: email,
      name: profileData.name,
      allergens: profileData.allergens,
      medications: profileData.medications,
      bloodGroup: profileData.bloodGroup,
      role: 'citizen',
      createdAt: Date.now(),
    };

    await setDoc(doc(db, "userDetails", user.uid), userProfile);
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

/**
 * Sign Up a Helper (Hospital Staff)
 * Structure: 
 * 1. hospitals/{hospitalId} -> Hospital Info
 * 2. hospitals/{hospitalId}/staff/{uid} -> Staff Profile
 * 3. staffRegistry/{uid} -> Quick lookup for hospitalId
 */
export const signUpHelper = async (
  email: string,
  password: string,
  helperData: { staffName: string; hospitalName: string; hospitalId: string }
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 1. Ensure Hospital document exists
    await setDoc(doc(db, "hospitals", helperData.hospitalId), {
      name: helperData.hospitalName,
      hospitalId: helperData.hospitalId
    }, { merge: true });

    // 2. Save Staff Detail inside the Hospital
    const staffRef = doc(db, "hospitals", helperData.hospitalId, "staff", user.uid);
    await setDoc(staffRef, {
      uid: user.uid,
      email: email,
      name: helperData.staffName,
      role: 'helper',
      createdAt: Date.now()
    });

    // 3. Create a registry entry for quick lookup during login
    await setDoc(doc(db, "staffRegistry", user.uid), {
      hospitalId: helperData.hospitalId,
      role: 'helper'
    });

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

/**
 * Common Sign In
 */
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

/**
 * Sign Out
 */
export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
