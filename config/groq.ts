import Groq from "groq-sdk";

/**
 * Initialize Groq with environment variable
 * In Expo, public environment variables must start with EXPO_PUBLIC_
 */
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || ""; 

export const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

export const SYSTEM_PROMPT = `The chatbot is only meant for first aid and nothing else. 
Consider the medical history provided. 
Give ordered step-by-step instructions only. 
If the situation is life-threatening, always advise calling emergency services immediately.`;

export const CHAT_MODEL = "openai/gpt-oss-120b";
