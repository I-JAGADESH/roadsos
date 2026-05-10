import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { signUpHelper } from '../../services/authService';
import { useRouter, Link } from 'expo-router';

export default function HelperSignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffName, setStaffName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !staffName || !hospitalName || !hospitalId) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const { user, error } = await signUpHelper(email, password, {
      staffName,
      hospitalName,
      hospitalId
    });
    setLoading(false);

    if (error) {
      Alert.alert("Sign Up Failed", error);
    } else {
      Alert.alert("Success", "Hospital Staff account created!");
      router.replace('/(helper)/dashboard');
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-900 p-6">
      <View className="mt-16">
        <Text className="text-3xl font-bold text-white text-center mb-2">Helper Portal</Text>
        <Text className="text-slate-400 text-center mb-10">Register your hospital/staff account</Text>
        
        <View className="space-y-4">
          <View>
            <Text className="text-slate-400 mb-1 ml-1 text-xs font-bold uppercase tracking-widest">Hospital Name</Text>
            <TextInput
              className="border border-slate-700 p-4 rounded-xl bg-slate-800 text-white"
              placeholder="e.g. City General Hospital"
              placeholderTextColor="#64748b"
              value={hospitalName}
              onChangeText={setHospitalName}
            />
          </View>

          <View>
            <Text className="text-slate-400 mb-1 ml-1 text-xs font-bold uppercase tracking-widest">Hospital ID</Text>
            <TextInput
              className="border border-slate-700 p-4 rounded-xl bg-slate-800 text-white"
              placeholder="HOSP-XXXX"
              placeholderTextColor="#64748b"
              value={hospitalId}
              onChangeText={setHospitalId}
            />
          </View>

          <View className="h-px bg-slate-800 my-4" />

          <View>
            <Text className="text-slate-400 mb-1 ml-1 text-xs font-bold uppercase tracking-widest">Staff Name</Text>
            <TextInput
              className="border border-slate-700 p-4 rounded-xl bg-slate-800 text-white"
              placeholder="Dr. Jane Doe"
              placeholderTextColor="#64748b"
              value={staffName}
              onChangeText={setStaffName}
            />
          </View>
          
          <View>
            <Text className="text-slate-400 mb-1 ml-1 text-xs font-bold uppercase tracking-widest">Staff Email</Text>
            <TextInput
              className="border border-slate-700 p-4 rounded-xl bg-slate-800 text-white"
              placeholder="jane@hospital.com"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View>
            <Text className="text-slate-400 mb-1 ml-1 text-xs font-bold uppercase tracking-widest">Password</Text>
            <TextInput
              className="border border-slate-700 p-4 rounded-xl bg-slate-800 text-white"
              placeholder="••••••••"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity 
          className={`mt-10 p-5 rounded-2xl items-center shadow-lg ${loading ? 'bg-slate-700' : 'bg-red-600'}`}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">{loading ? "Registering..." : "Create Helper Account"}</Text>
        </TouchableOpacity>

        <Link href="/helperSignIn" asChild>
          <TouchableOpacity className="mt-6 mb-10">
            <Text className="text-slate-400 text-center font-medium">Already registered? <Text className="text-red-500 font-bold">Sign In</Text></Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
