import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'GitHub Users & Repos explorer',
          headerStyle: {
            backgroundColor: '#0d9',
          },
          headerTintColor: '#089',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
