import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState, createContext, useContext } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native';
import { MyTheme } from '@/constants/theme';

// 1. Creamos el contexto para compartir el estado de auth
const AuthContext = createContext({
  signIn: () => {},
  signOut: () => {},
  isAuthed: false,
});

// Hook para usar el contexto en otras pantallas
export const useAuth = () => useContext(AuthContext);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Bold': Montserrat_700Bold,
    'Montserrat-Regular': Montserrat_400Regular,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
  });

  const [isReady, setIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // Función para verificar sesión (Web y Móvil)
  const checkAuth = async () => {
    try {
      const token = Platform.OS === 'web' 
        ? localStorage.getItem('user_token') 
        : await SecureStore.getItemAsync('user_token');
      
      setIsAuthed(!!token);
    } catch (e) {
      console.error("Error inicializando auth", e);
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isReady || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inWelcome = segments[0] === 'welcome';

    // LÓGICA DE PROTECCIÓN DE RUTAS
    if (!isAuthed && !inAuthGroup && !inWelcome) {
      // Si no estoy logueado y trato de entrar a tabs -> al welcome
      router.replace('/welcome');
    } else if (isAuthed && (inAuthGroup || inWelcome)) {
      // Si ya estoy logueado y trato de ir a login/welcome -> a las tabs
      router.replace('/(tabs)');
    }

    SplashScreen.hideAsync();
  }, [isAuthed, isReady, fontsLoaded, segments]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <StripeProvider publishableKey="tu_pk_test_...">
      <AuthContext.Provider value={{ 
        isAuthed,
        signIn: () => setIsAuthed(true), 
        signOut: async () => {
          if (Platform.OS === 'web') localStorage.removeItem('user_token');
          else await SecureStore.deleteItemAsync('user_token');
          setIsAuthed(false);
        } 
      }}>
        <StatusBar style="light" backgroundColor={MyTheme.primary} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
          <Stack.Screen name="index" /> 
        </Stack>
      </AuthContext.Provider>
    </StripeProvider>
  );
}