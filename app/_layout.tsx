import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#090909" },
        headerTintColor: "#fff",
        contentStyle: { backgroundColor: "#090909" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "NBA Players" }} />
      <Stack.Screen name="player/[id]" options={{ title: "Player Detail" }} />
    </Stack>
  );
}