import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import {logOut, UserProfile } from '../../services/authService';
import { useRouter } from 'expo-router';

/**
 * Dashboard Screen
 * Displays the logged-in user's medical profile retrieved from Firestore.
 */
export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Fetch the user's profile data from the 'userDetails' collection.
   */
  const fetchProfileData = async () => {
    try {
      const user = auth.currentUser;

      // If no user is found, the global Auth Guard in _layout.tsx will handle the redirect.
      if (!user) return;

      const userDocRef = doc(db, "userDetails", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setProfile(userDocSnap.data() as UserProfile);
      } else {
        console.warn("No user profile found in Firestore for UID:", user.uid);
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Data Error", "Could not load your profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  /**
   * Handle user logout and cleanup session.
   */
  const handleSignOut = async () => {
    const { error } = await logOut();
    if (error) {
      Alert.alert("Logout Error", error);
    } else {
      // _layout.tsx will automatically redirect to signIn when user becomes null
      router.replace('/');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-slate-500">Retrieving medical profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="p-6 pt-16">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-3xl font-bold text-slate-800">Dashboard</Text>
            <Text className="text-slate-500">Emergency Medical Profile</Text>
          </View>
          <TouchableOpacity onPress={handleSignOut} className="bg-slate-200 px-4 py-2 rounded-xl">
            <Text className="text-slate-700 font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Information Card */}
        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6 border border-slate-100">
          <Text className="text-slate-400 uppercase text-[10px] font-extrabold tracking-widest mb-1">PATIENT NAME</Text>
          <Text className="text-2xl font-bold text-slate-800 mb-4">{profile?.name || 'N/A'}</Text>

          <View className="flex-row items-center justify-between border-t border-slate-50 pt-4">
            <View>
              <Text className="text-slate-400 uppercase text-[10px] font-extrabold tracking-widest mb-1">BLOOD GROUP</Text>
              <Text className="text-2xl font-bold text-red-600">{profile?.bloodGroup || 'N/A'}</Text>
            </View>
            <View className="items-end">
              <Text className="text-slate-400 uppercase text-[10px] font-extrabold tracking-widest mb-1">ACCOUNT TYPE</Text>
              <Text className="text-lg font-bold text-blue-600 capitalize">{profile?.role || 'Citizen'}</Text>
            </View>
          </View>
        </View>

        {/* Detailed Medical Info */}
        <View className="space-y-4">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <Text className="text-orange-500 uppercase text-[10px] font-extrabold tracking-widest mb-2">KNOWN ALLERGENS</Text>
            <Text className="text-slate-700 text-lg font-medium leading-6">
              {profile?.allergens || 'None reported.'}
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <Text className="text-blue-500 uppercase text-[10px] font-extrabold tracking-widest mb-2">CURRENT MEDICATIONS</Text>
            <Text className="text-slate-700 text-lg font-medium leading-6">
              {profile?.medications || 'None listed.'}
            </Text>
          </View>
        </View>

        {/* Safety Footer */}
        <View className="mt-10 p-5 bg-slate-800 rounded-3xl">
          <Text className="text-slate-400 text-xs text-center mb-1">REGISTERED EMAIL</Text>
          <Text className="text-white text-center font-bold">{profile?.email}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
