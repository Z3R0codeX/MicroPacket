import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MyTheme } from '@/constants/theme';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../_layout'; 
import { BASE_URL } from '@/constants/config';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('luis@mail.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      Alert.alert('Atención', 'Ingresa tu correo y contraseña.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // GUARDADO SINCRONIZADO: Usamos llaves con guión bajo
        const token = String(data.token);
        const userSession = JSON.stringify(data.user); // Guardamos el objeto completo del experto

        if (Platform.OS === 'web') {
          localStorage.setItem('user_token', token);
          localStorage.setItem('user_session', userSession);
        } else {
          await SecureStore.setItemAsync('user_token', token);
          await SecureStore.setItemAsync('user_session', userSession);
        }

        signIn(); 
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', data.message || 'Credenciales incorrectas.');
      }
    } catch (error) {
      Alert.alert('Error de red', 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicia sesión en <Text style={styles.brand}>MicroPacket</Text></Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput 
              placeholder="correo@ejemplo.com" 
              style={styles.input} 
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <Text style={[styles.label, { marginTop: 15 }]}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput 
                placeholder="********" 
                secureTextEntry={!showPassword} 
                style={[styles.input, { flex: 1, borderWidth: 0 }]} 
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={MyTheme.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.loginButtonText}>Entrar</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MyTheme.background },
  scrollContent: { padding: 25, justifyContent: 'center', flexGrow: 1 },
  header: { marginBottom: 40 },
  title: { fontSize: 32, color: MyTheme.primary, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#555' },
  brand: { color: MyTheme.secondary, fontWeight: 'bold' },
  form: { marginBottom: 20 },
  label: { color: MyTheme.primary, fontWeight: '600' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  eyeIcon: { paddingHorizontal: 15 },
  loginButton: { backgroundColor: MyTheme.secondary, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 30 },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});