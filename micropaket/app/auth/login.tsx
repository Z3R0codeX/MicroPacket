// app/(auth)/login.tsx
import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MyTheme } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido de nuevo</Text>
      <Text style={styles.subtitle}>Ingresa tus datos para continuar</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput placeholder="ejemplo@correo.com" style={styles.input} placeholderTextColor="#A0A0A0" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput placeholder="********" secureTextEntry style={styles.input} placeholderTextColor="#A0A0A0" />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.footerText}>¿No tienes cuenta? <Text style={styles.link}>Regístrate</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MyTheme.background, padding: 30, justifyContent: 'center' },
  title: { fontFamily: 'Montserrat-Bold', fontSize: 28, color: MyTheme.primary, marginBottom: 5 },
  subtitle: { fontFamily: 'Inter-Regular', fontSize: 16, color: '#666', marginBottom: 40 },
  inputGroup: { marginBottom: 20 },
  label: { fontFamily: 'Inter-Medium', color: MyTheme.primary, marginBottom: 8 },
  input: { backgroundColor: MyTheme.white, padding: 15, borderRadius: 12, fontFamily: 'Inter-Regular', borderWidth: 1, borderColor: '#DDD' },
  loginButton: { backgroundColor: MyTheme.secondary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20, elevation: 3 },
  loginButtonText: { fontFamily: 'Montserrat-Bold', color: MyTheme.white, fontSize: 16 },
  footerText: { textAlign: 'center', marginTop: 30, color: MyTheme.primary, fontFamily: 'Inter-Regular' },
  link: { color: MyTheme.secondary, fontWeight: 'bold' },
});