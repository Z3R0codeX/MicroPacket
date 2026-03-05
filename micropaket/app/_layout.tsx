import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { MyTheme } from '@/constants/theme';

// Evita que la pantalla de carga se oculte antes de que las fuentes estén listas
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 1. Carga de fuentes para la identidad visual de MicroPacket
  const [loaded, error] = useFonts({
    'Montserrat-Bold': Montserrat_700Bold,
    'Montserrat-Regular': Montserrat_400Regular,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
  });

  // 2. Manejo de la Splash Screen
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Si hay un error crítico en las fuentes, lo registramos
  if (error) {
    console.error("Error cargando las fuentes de MicroPacket:", error);
  }

  // No renderizamos nada hasta que las fuentes estén listas
  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      {/* Configuramos la barra de estado con tu color primario azul profundo */}
      <StatusBar style="light" backgroundColor={MyTheme.primary} />
      
      <Stack
        screenOptions={{
          headerShown: false, // Ocultamos el header por defecto para un look más limpio
          contentStyle: { backgroundColor: MyTheme.background }, // Color 4: f5fefe
          animation: 'fade_from_bottom', // Animación suave entre pantallas
        }}
      >
        {/* Pantalla de entrada (donde pondrás el Redirect a Welcome) */}
        <Stack.Screen name="index" />

        {/* Grupo de Autenticación (Welcome, Login, Register) */}
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            animation: 'slide_from_right',
          }} 
        />

        {/* Grupo Principal de la App (Tabs) */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            animation: 'fade',
          }} 
        />

        {/* Modales u otras pantallas independientes */}
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Información',
            headerTintColor: MyTheme.primary,
          }} 
        />
      </Stack>
    </>
  );
}