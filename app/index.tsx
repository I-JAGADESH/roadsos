import "../globals.css"
import { Text, View } from "react-native";
import {Link} from "expo-router";

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-blue-500">
            <Text className="text-xl font-bold text-white">
                Welcome to RoadSOS!
            </Text>
            <Link href = "/(auth)/signIn">Sign in</Link>
            <Link href = "/(auth)/helperSignIn">Sign in as Helper</Link>

        </View>
    );
}