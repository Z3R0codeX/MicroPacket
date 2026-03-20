import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MyTheme } from '@/constants/theme';
import * as SecureStore from 'expo-secure-store'; // Para guardar el token
import { BASE_URL } from '@/constants/config';

export default function LoginIndexScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  // 1. ESTADOS PARA EL LOGIN
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. FUNCIÓN DE INICIO DE SESIÓN
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atención', 'Ingresa tu correo y contraseña.');
      return;
    }

    setIsLoading(true);

    try {
      // Recuerda usar tu IP LOCAL (ej: 192.168.1.XX)
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
  // 1. Extraemos los datos con los nombres correctos según tu consola
  const token = data.token;
  const userName = data.user.username; // Cambiado de 'name' a 'username'

  // 2. Verificamos que existan antes de guardar para evitar que la app truene
  if (token && userName) {
    if (Platform.OS !== 'web') {
      // Usamos String() por si el token o nombre llegaran como números por error
      await SecureStore.setItemAsync('userToken', String(token));
      await SecureStore.setItemAsync('userName', String(userName));
    } else {
      localStorage.setItem('userToken', String(token));
      localStorage.setItem('userName', String(userName));
    }
    
    router.replace('/(tabs)');
  } else {
    Alert.alert('Error', 'El servidor no devolvió todos los datos necesarios.');
  }
} else {
        // --- ERROR DE CREDENCIALES ---
        Alert.alert('Error', data.message || 'Credenciales incorrectas.');
      }
    } catch (error) {
      console.error("ERROR",error);
      Alert.alert('Error de red', 'No se pudo conectar con el servidor de Laravel.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Bienvenido de nuevo</Text>
            <Text style={styles.subtitle}>
              Inicia sesión para gestionar tus servicios en <Text style={styles.brand}>MicroPacket</Text>.
            </Text>
          </View>

          <View style={styles.form}>
            {/* EMAIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput 
                placeholder="ejemplo@correo.com" 
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input} 
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput 
                  placeholder="********" 
                  secureTextEntry={!showPassword} 
                  style={[styles.input, { flex: 1, borderWidth: 0 }]} 
                  placeholderTextColor="#A0A0A0"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={MyTheme.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && { opacity: 0.7 }]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={MyTheme.white} />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.push('./register')}>
              <Text style={styles.footerText}>
                ¿No tienes cuenta? <Text style={styles.link}>Regístrate aquí</Text>
              </Text>
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
  title: { fontFamily: 'Montserrat-Bold', fontSize: 32, color: MyTheme.primary, marginBottom: 10 },
  subtitle: { fontFamily: 'Inter-Regular', fontSize: 16, color: '#555', lineHeight: 22 },
  brand: { color: MyTheme.accent, fontFamily: 'Montserrat-Bold' },
  form: { marginBottom: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontFamily: 'Inter-Medium', color: MyTheme.primary, marginBottom: 8 },
  input: { 
    backgroundColor: MyTheme.white, paddingHorizontal: 15, paddingVertical: 15, 
    borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', fontSize: 16, color: MyTheme.primary 
  },
  passwordContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: MyTheme.white, 
    borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' 
  },
  eyeIcon: { paddingHorizontal: 15 },
  loginButton: { 
    backgroundColor: MyTheme.secondary, padding: 18, borderRadius: 15, 
    alignItems: 'center', marginTop: 20, elevation: 4 
  },
  loginButtonText: { fontFamily: 'Montserrat-Bold', color: MyTheme.white, fontSize: 18 },
  footer: { marginTop: 30, alignItems: 'center' },
  footerText: { fontFamily: 'Inter-Regular', color: MyTheme.primary },
  link: { color: MyTheme.secondary, fontFamily: 'Inter-Medium' },
});