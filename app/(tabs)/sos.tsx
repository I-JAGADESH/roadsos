import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { auth } from '../../config/firebase';
import { createAlert, AlertSeverity } from '../../services/alertService';
import { Ionicons } from '@expo/vector-icons';

/**
 * SOS Screen
 * Provides three severity buttons for immediate emergency reporting.
 */
export default function SosScreen() {
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  }, []);

  const handleSosPress = async (severity: AlertSeverity) => {
    if (!locationPermission) {
      Alert.alert(
        "Permission Denied",
        "Location access is required to send an SOS alert. Please enable it in your settings."
      );
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Authentication Error", "You must be logged in to send an alert.");
      return;
    }

    setLoading(true);

    try {
      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const result = await createAlert(user.uid, severity, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (result.success) {
        Alert.alert(
          "Alert Sent",
          `A ${severity.toUpperCase()} severity alert has been broadcasted. Help is on the way.`
        );
      } else {
        Alert.alert("Error", "Failed to send alert: " + result.error);
      }
    } catch (error: any) {
      console.error("SOS Press Error:", error);
      Alert.alert("Error", "An unexpected error occurred while sending the alert.");
    } finally {
      setLoading(false);
    }
  };

  if (locationPermission === false) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Ionicons name="location-outline" size={64} color="#ef4444" />
        <Text className="text-xl font-bold text-slate-800 text-center mt-4">Location Access Required</Text>
        <Text className="text-slate-500 text-center mt-2">
          We need your location to send emergency services to your exact position.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <View className="items-center mb-12">
        <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="megaphone" size={40} color="#ef4444" />
        </View>
        <Text className="text-3xl font-bold text-slate-800">Emergency SOS</Text>
        <Text className="text-slate-500 text-center mt-2">
          Select the severity of your emergency to notify nearby responders.
        </Text>
      </View>

      <View className="space-y-4">
        {/* HIGH SEVERITY - RED */}
        <TouchableOpacity
          onPress={() => handleSosPress('high')}
          disabled={loading}
          className="bg-red-600 p-6 rounded-3xl flex-row items-center justify-between shadow-lg shadow-red-200"
          style={styles.buttonShadow}
        >
          <View className="flex-row items-center">
            <View className="bg-white/20 p-3 rounded-2xl mr-4">
              <Ionicons name="flame" size={32} color="white" />
            </View>
            <View>
              <Text className="text-white text-xl font-bold">High Severity</Text>
              <Text className="text-red-100 text-sm">Life-threatening / Critical</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>

        {/* MEDIUM SEVERITY - YELLOW */}
        <TouchableOpacity
          onPress={() => handleSosPress('medium')}
          disabled={loading}
          className="bg-amber-500 p-6 rounded-3xl flex-row items-center justify-between shadow-lg shadow-amber-200"
          style={styles.buttonShadow}
        >
          <View className="flex-row items-center">
            <View className="bg-white/20 p-3 rounded-2xl mr-4">
              <Ionicons name="warning" size={32} color="white" />
            </View>
            <View>
              <Text className="text-white text-xl font-bold">Medium Severity</Text>
              <Text className="text-amber-500 text-sm" style={{ color: '#fffbeb' }}>Urgent / Non-Critical</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>

        {/* LOW SEVERITY - GREEN */}
        <TouchableOpacity
          onPress={() => handleSosPress('low')}
          disabled={loading}
          className="bg-emerald-500 p-6 rounded-3xl flex-row items-center justify-between shadow-lg shadow-emerald-200"
          style={styles.buttonShadow}
        >
          <View className="flex-row items-center">
            <View className="bg-white/20 p-3 rounded-2xl mr-4">
              <Ionicons name="shield-checkmark" size={32} color="white" />
            </View>
            <View>
              <Text className="text-white text-xl font-bold">Low Severity</Text>
              <Text className="text-emerald-100 text-sm">Minor Incident / Precautionary</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading && (
        <View className="absolute inset-0 bg-white/60 flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ef4444" />
          <Text className="mt-4 text-slate-800 font-bold">Broadcasting SOS...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonShadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  }
});
