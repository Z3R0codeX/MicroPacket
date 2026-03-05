// app/(auth)/welcome.tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { MyTheme } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logoText}>MicroPacket</Text>
        <Text style={styles.tagline}>Servicios para el hogar a un toque de distancia.</Text>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('./login')}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('./register')}
        >
          <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MyTheme.primary, justifyContent: 'center' },
  content: { padding: 30, alignItems: 'center' },
  logoText: { fontFamily: 'Montserrat-Bold', fontSize: 42, color: MyTheme.white, marginBottom: 10 },
  tagline: { fontFamily: 'Inter-Regular', fontSize: 18, color: MyTheme.accent, textAlign: 'center', marginBottom: 50 },
  primaryButton: { backgroundColor: MyTheme.secondary, width: '100%', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  buttonText: { fontFamily: 'Inter-Medium', color: MyTheme.white, fontSize: 16 },
  secondaryButton: { width: '100%', padding: 18, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: MyTheme.white },
  secondaryButtonText: { fontFamily: 'Inter-Medium', color: MyTheme.white, fontSize: 16 },
});