module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        // The React Compiler (React 19+) works alongside NativeWind
        plugins: [
            "react-native-reanimated/plugin" 
        ],
    };
};