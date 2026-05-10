import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { logOut } from '../../services/authService';
import { useRouter } from 'expo-router';

/**
 * Helper Dashboard (Hospital Portal)
 * Every staff member of the same hospital sees this shared view.
 */
export default function HelperDashboard() {
  const [hospitalInfo, setHospitalInfo] = useState<any>(null);
  const [staffInfo, setStaffInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Fetch both the staff member's individual info and their shared hospital data.
   */
  const loadHospitalData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // 1. Get the Hospital ID from the registry
      const registrySnap = await getDoc(doc(db, "staffRegistry", user.uid));
      if (!registrySnap.exists()) {
        throw new Error("You are not registered as a hospital staff member.");
      }
      
      const { hospitalId } = registrySnap.data();

      // 2. Fetch shared Hospital Details (Dashboard info)
      const hospitalSnap = await getDoc(doc(db, "hospitals", hospitalId));
      if (hospitalSnap.exists()) {
        setHospitalInfo(hospitalSnap.data());
      }

      // 3. Fetch specific Staff Info
      const staffSnap = await getDoc(doc(db, "hospitals", hospitalId, "staff", user.uid));
      if (staffSnap.exists()) {
        setStaffInfo(staffSnap.data());
      }

    } catch (error: any) {
      console.error("Dashboard Load Error:", error);
      Alert.alert("Access Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitalData();
  }, []);

  /**
   * Log out the staff member.
   */
  const handleSignOut = async () => {
    await logOut();
    // Redirection is handled by the RootLayout
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="#ef4444" />
        <Text className="mt-4 text-slate-400">Connecting to hospital portal...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-6">
      <View className="mt-16">
        {/* Hospital Header - SHARED by all staff at this hospital */}
        <View className="flex-row justify-between items-start mb-8">
          <View className="flex-1">
            <Text className="text-red-500 text-xs font-bold uppercase tracking-[2px] mb-1">Emergency Command Center</Text>
            <Text className="text-white text-3xl font-bold leading-tight">{hospitalInfo?.name || 'Emergency Center'}</Text>
            <View className="bg-slate-800 self-start px-2 py-1 rounded mt-2">
              <Text className="text-slate-400 text-[10px] font-mono">ID: {hospitalInfo?.hospitalId}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleSignOut} className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
            <Text className="text-slate-400 font-bold text-xs uppercase">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Staff Identity Section - Individual to the logged-in user */}
        <View className="bg-slate-900 rounded-3xl p-6 border border-slate-800 mb-8 flex-row items-center">
          <View className="w-12 h-12 bg-red-600/20 rounded-2xl items-center justify-center mr-4">
            <Text className="text-red-500 font-bold text-lg">{staffInfo?.name?.charAt(0)}</Text>
          </View>
          <View>
            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Active Staff Responder</Text>
            <Text className="text-white text-xl font-semibold">{staffInfo?.name}</Text>
          </View>
        </View>

        {/* Emergency Feed (This will be shared across all staff) */}
        <View>
          <View className="flex-row items-center mb-6">
            <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
            <Text className="text-white text-xl font-bold uppercase tracking-tighter">Live Incident Feed</Text>
          </View>
          
          <View className="bg-slate-900/50 rounded-3xl p-12 border-2 border-dashed border-slate-800 items-center justify-center">
            <Text className="text-slate-500 text-center font-medium">
              Waiting for incoming reports...
            </Text>
            <Text className="text-slate-700 text-[10px] text-center mt-3 uppercase tracking-widest font-bold">
              Real-time synchronization active
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
