import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator } from 'react-native';
import { MyTheme } from '@/constants/theme';

export default function RootIndex() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        // Buscamos el token que guardamos en el Login
        const token = await SecureStore.getItemAsync('user_token');
        console.log("Token encontrado en SecureStore:", token);
        setUserToken(token);
      } catch (e) {
        console.error("Error recuperando token", e);
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
  }, []);

  // Mientras comprueba el SecureStore, mostramos un cargando
  // para que no se vea el "flicker" o salto de pantallas
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: MyTheme.background }}>
        <ActivityIndicator size="large" color={MyTheme.primary} />
      </View>
    );
  }

  // LÓGICA DE REDIRECCIÓN:
  // Si hay token, mándalo directo a la App principal
  // Si no hay token, mándalo al Welcome (o Login)
  //return userToken ? <Redirect href="/(tabs)" /> : <Redirect href="/welcome" />;
}