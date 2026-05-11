import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ChatMessage, getChatResponse, getUserMedicalInfo } from '../../services/chatservice';

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [medicalInfo, setMedicalInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
 

  useEffect(() => {
    loadMedicalInfo();
  }, []);

  const loadMedicalInfo = async () => {
    const info = await getUserMedicalInfo();
    setMedicalInfo(info);
    
    // Initial greeting
    setMessages([
      { 
        role: 'assistant', 
        content: `Hello ${info?.name || 'there'}! I am your RoadSOS First Aid Assistant. How can I help you today?` 
      }
    ]);
  };

  const handleSend = async () => {
    if (inputText.trim() === '' || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: inputText };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    // Get response from service
    const response = await getChatResponse(updatedMessages, medicalInfo);
    
    setMessages([...updatedMessages, { role: 'assistant', content: response }]);
    setLoading(false);
    
    // Scroll to bottom
  
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View className={`mb-4 max-w-[85%] ${item.role === 'user' ? 'self-end' : 'self-start'}`}>
      <View className={`p-4 rounded-2xl ${
        item.role === 'user' 
          ? 'bg-red-600 rounded-tr-none' 
          : 'bg-gray-100 border border-gray-200 rounded-tl-none'
      }`}>
        <Text className={`${item.role === 'user' ? 'text-white font-medium' : 'text-gray-800'} text-base leading-6`}>
          {item.content}
        </Text>
      </View>
    </View>
  );

  return (
 <SafeAreaView
  style={{
    flex: 1,
    backgroundColor: 'white',
  }}
>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
       <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {/* Header */}
          <View className="py-4 border-b border-gray-100 flex-row items-center">
            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="medical" size={20} color="#dc2626" />
            </View>
            <View>
              <Text className="text-xl font-bold text-gray-900">First Aid AI</Text>
              <Text className="text-xs text-gray-500">Always active for your safety</Text>
            </View>
          </View>

          {/* Alert Message */}
          <View className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 flex-row items-start">
            <Ionicons name="warning" size={18} color="#dc2626" className="mr-2" />
            <Text className="text-xs text-red-800 flex-1 ml-2">
              <Text className="font-bold">Disclaimer:</Text> This AI provides first-aid guidance based on your medical profile. For severe emergencies, call emergency services immediately.
            </Text>
          </View>

          {/* Chat area */}
 
<ScrollView
  style={{ flex: 1 }}
  contentContainerStyle={{
    paddingTop: 20,
    paddingBottom: 120,
  }}
  nestedScrollEnabled={true}
  showsVerticalScrollIndicator={true}
  keyboardShouldPersistTaps="handled"
>
  {messages.map((item, index) => (
    <View key={index}>
      {renderMessage({ item })}
    </View>
  ))}
</ScrollView>

          {loading && (
            <View className="flex-row items-center mb-6 ml-2">
              <ActivityIndicator size="small" color="#dc2626" />
              <Text className="ml-2 text-gray-400 text-sm italic">AI is generating first-aid steps...</Text>
            </View>
          )}

          {/* Input Area */}
          <View className="pb-4 pt-2">
            <View className="flex-row items-end bg-gray-50 rounded-3xl px-4 py-2 border border-gray-200">
             <TextInput
  className="flex-1 text-base text-gray-800 py-2 max-h-32"
  placeholder="Describe the medical situation..."
  placeholderTextColor="#94a3b8"
  value={inputText}
  onChangeText={setInputText}
  multiline={false}
  returnKeyType="send"
  onSubmitEditing={handleSend}
/>
              <TouchableOpacity 
                onPress={handleSend} 
                disabled={loading || inputText.trim() === ''}
                className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${
                  inputText.trim() === '' ? 'bg-gray-200' : 'bg-red-600'
                }`}
              >
                <Ionicons 
                  name="arrow-up" 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chatbot;
