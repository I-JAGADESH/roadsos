import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import "../globals.css";

/**
 * RootLayout acts as the central gatekeeper for the application.
 * It manages the authentication state and handles global role-based redirection.
 */
export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'citizen' | 'helper' | null>(null);
  
  const router = useRouter();
  const segments = useSegments();

  /**
   * Listen for changes in the user's authentication state and fetch their role.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // 1. Check if user is a Citizen (userDetails)
          const citizenDoc = await getDoc(doc(db, "userDetails", firebaseUser.uid));
          if (citizenDoc.exists()) {
            setUserRole('citizen');
          } else {
            // 2. Check if user is a Helper (staffRegistry)
            const staffDoc = await getDoc(doc(db, "staffRegistry", firebaseUser.uid));
            if (staffDoc.exists()) {
              setUserRole('helper');
            }
          }
        } catch (error) {
          console.error("Layout Auth Check Error:", error);
        }
      } else {
        setUserRole(null);
      }

      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Global Auth Guard logic.
   * Handles redirection based on auth state and user role.
   */
  useEffect(() => {
    if (initializing) return;

    const currentSegment = segments[0];
    const isInsideAuth = currentSegment === '(auth)';
    const isInsideTabs = currentSegment === '(tabs)';
    const isInsideHelper = currentSegment === '(helper)';

    // 1. Not Logged In
    if (!user) {
      // If not in auth and not at the root landing page, redirect to sign-in
      if (!isInsideAuth && segments.length > 0) {
        router.replace('/');
      }
      return;
    }

    // 2. Logged In - Wait for role data
    if (!userRole) return;

    if (userRole === 'citizen') {
      // Citizens stay in (tabs). If they are in (auth) or (helper), move them.
      if (isInsideAuth || isInsideHelper) {
        router.replace('/(tabs)/sos');
      }
    } else if (userRole === 'helper') {
      // Helpers stay in (helper). If they are in (auth) or (tabs), move them.
      if (isInsideAuth || isInsideTabs) {
        router.replace('/(helper)/dashboard');
      }
    }
  }, [user, userRole, initializing, segments]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(helper)" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
