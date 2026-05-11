import { db, auth } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { groq, SYSTEM_PROMPT, CHAT_MODEL } from "../config/groq";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Fetches user medical info from Firestore
 */
export const getUserMedicalInfo = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const docRef = doc(db, "userDetails", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        allergens: data.allergens || "None",
        medications: data.medications || "None",
        bloodGroup: data.bloodGroup || "Unknown",
        name: data.name || "User"
      };
    }
  } catch (error) {
    console.error("Error fetching medical info:", error);
  }
  return null;
};

/**
 * Sends a message to the Groq Chatbot
 */
export const getChatResponse = async (messages: ChatMessage[], medicalInfo: any) => {
  try {
    const medicalHistoryString = medicalInfo 
      ? `\nUser Medical History:\n- Allergens: ${medicalInfo.allergens}\n- Medications: ${medicalInfo.medications}\n- Blood Group: ${medicalInfo.bloodGroup}`
      : "\nUser Medical History: Not available.";

    const fullSystemPrompt = SYSTEM_PROMPT + medicalHistoryString;

    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: fullSystemPrompt },
        ...messages
      ],
      model: CHAT_MODEL,
    });

    return response.choices[0]?.message?.content || "No response from chatbot.";
  } catch (error) {
    console.error("Groq API Error:", error);
    return "Sorry, I am having trouble connecting to the medical service right now.";
  }
};
