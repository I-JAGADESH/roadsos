import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { signUp } from '../../services/authService';
import { useRouter, Link } from 'expo-router';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [allergens, setAllergens] = useState('');
  const [medications, setMedications] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in Name, Email and Password");
      return;
    }

    setLoading(true);
    const { user, error } = await signUp(email, password, {
      name,
      allergens,
      medications,
      bloodGroup
    });
    setLoading(false);

    if (error) {
      Alert.alert("Sign Up Failed", error);
    } else {
      Alert.alert("Success", "Account created successfully!");
      router.replace('/(tabs)/dashboard');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 bg-white p-6">
      <View className="mt-10">
        <Text className="text-3xl font-bold text-slate-800 text-center mb-8">Create Account</Text>
        
        <View className="space-y-4">
          <View>
            <Text className="text-slate-600 mb-1 ml-1 font-medium">Full Name</Text>
            <TextInput
              className="border border-slate-200 p-4 rounded-xl bg-slate-50"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View>
            <Text className="text-slate-600 mb-1 ml-1 font-medium">Email</Text>
            <TextInput
              className="border border-slate-200 p-4 rounded-xl bg-slate-50"
              placeholder="example@mail.com"
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

          <View className="pt-4 pb-2">
            <Text className="text-lg font-semibold text-slate-500 border-b border-slate-100 pb-1">Medical Details (Optional)</Text>
          </View>
          
          <View>
            <Text className="text-slate-600 mb-1 ml-1 font-medium">Blood Group</Text>
            <TextInput
              className="border border-slate-200 p-4 rounded-xl bg-slate-50"
              placeholder="e.g. O+"
              value={bloodGroup}
              onChangeText={setBloodGroup}
            />
          </View>

          <View>
            <Text className="text-slate-600 mb-1 ml-1 font-medium">Allergens</Text>
            <TextInput
              className="border border-slate-200 p-4 rounded-xl bg-slate-50 text-top"
              placeholder="Peanuts, Penicillin..."
              value={allergens}
              onChangeText={setAllergens}
              multiline
              numberOfLines={3}
            />
          </View>

          <View>
            <Text className="text-slate-600 mb-1 ml-1 font-medium">Current Medications</Text>
            <TextInput
              className="border border-slate-200 p-4 rounded-xl bg-slate-50 text-top"
              placeholder="Insulin, Aspirin..."
              value={medications}
              onChangeText={setMedications}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <TouchableOpacity 
          className={`mt-10 p-4 rounded-2xl items-center shadow-sm ${loading ? 'bg-slate-300' : 'bg-blue-600'}`}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">{loading ? "Creating..." : "Sign Up"}</Text>
        </TouchableOpacity>

        <Link href="/signIn" asChild>
          <TouchableOpacity className="mt-6">
            <Text className="text-blue-600 text-center font-medium">Already have an account? Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
