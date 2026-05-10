import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { signIn } from '../../services/authService';
import { useRouter, Link } from 'expo-router';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both Email and Password");
      return;
    }

    setLoading(true);
    const { user, error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Sign In Failed", error);
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <View>
        <Text className="text-4xl font-bold text-slate-800 mb-2">Welcome Back</Text>
        <Text className="text-slate-500 mb-10 text-lg">Sign in to continue to Road SOS</Text>
        
        <View className="space-y-4">
          <View>
            <Text className="text-slate-600 mb-1 ml-1 font-medium">Email Address</Text>
            <TextInput
              className="border border-slate-200 p-4 rounded-xl bg-slate-50"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View>
            <Text className="text-slate-600 mb-1 ml-1 font-medium">Password</Text>
            <TextInput
              className="border border-slate-200 p-4 rounded-xl bg-slate-50"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity 
          className={`mt-10 p-4 rounded-2xl items-center shadow-md ${loading ? 'bg-slate-300' : 'bg-blue-600'}`}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">{loading ? "Signing In..." : "Sign In"}</Text>
        </TouchableOpacity>

        <Link href="/signUp" asChild>
          <TouchableOpacity className="mt-6">
            <Text className="text-slate-500 text-center font-medium">
              Don't have an account? <Text className="text-blue-600 font-bold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
