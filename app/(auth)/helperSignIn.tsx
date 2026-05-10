import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { signIn } from '../../services/authService';
import { useRouter, Link } from 'expo-router';

export default function HelperSignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in Email and Password");
      return;
    }

    setLoading(true);
    const { user, error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Sign In Failed", error);
    } else {
      // The global auth guard will handle redirection to the correct dashboard
      router.replace('/(helper)/dashboard');
    }
  };

  return (
    <View className="flex-1 bg-slate-900 p-6 justify-center">
      <View>
        <Text className="text-4xl font-bold text-white mb-2">Helper Login</Text>
        <Text className="text-slate-400 mb-10 text-lg">Hospital & Emergency Responder Portal</Text>
        
        <View className="space-y-4">
          <View>
            <Text className="text-slate-400 mb-1 ml-1 text-xs font-bold uppercase tracking-widest">Work Email</Text>
            <TextInput
              className="border border-slate-700 p-4 rounded-xl bg-slate-800 text-white"
              placeholder="name@hospital.com"
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
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">{loading ? "Authenticating..." : "Sign In to Portal"}</Text>
        </TouchableOpacity>

        <Link href="/helperSignUp" asChild>
          <TouchableOpacity className="mt-6">
            <Text className="text-slate-400 text-center font-medium">
              New Hospital? <Text className="text-red-500 font-bold">Register Now</Text>
            </Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/signIn" asChild>
          <TouchableOpacity className="mt-10 border border-slate-800 p-4 rounded-xl">
            <Text className="text-slate-500 text-center text-xs">Switch to Citizen Side</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
