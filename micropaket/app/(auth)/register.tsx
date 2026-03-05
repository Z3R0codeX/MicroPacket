import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MyTheme } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Botón de volver */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={MyTheme.primary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Crea tu cuenta</Text>
            <Text style={styles.subtitle}>
              Únete a la comunidad de <Text style={styles.brand}>MicroPacket</Text> y encuentra expertos para tu hogar.
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre Completo</Text>
              <TextInput 
                placeholder="Juan Pérez" 
                style={styles.input} 
                placeholderTextColor="#A0A0A0" 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput 
                placeholder="ejemplo@correo.com" 
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input} 
                placeholderTextColor="#A0A0A0" 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput 
                  placeholder="********" 
                  secureTextEntry={!showPassword} 
                  style={[styles.input, { flex: 1, borderBottomWidth: 0 }]} 
                  placeholderTextColor="#A0A0A0" 
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={MyTheme.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.registerButtonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.push('./login')}>
              <Text style={styles.footerText}>
                ¿Ya tienes una cuenta? <Text style={styles.link}>Inicia Sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: MyTheme.background // Color 4: f5fefe
  },
  scrollContent: { 
    padding: 25, 
    paddingTop: 10 
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 35,
  },
  title: { 
    fontFamily: 'Montserrat-Bold', 
    fontSize: 32, 
    color: MyTheme.primary, // Color 1: 01406d
    marginBottom: 10 
  },
  subtitle: { 
    fontFamily: 'Inter-Regular', 
    fontSize: 16, 
    color: '#555', 
    lineHeight: 22 
  },
  brand: {
    color: MyTheme.accent, // Color 3: 01b4ba
    fontFamily: 'Montserrat-Bold',
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: { 
    marginBottom: 18 
  },
  label: { 
    fontFamily: 'Inter-Medium', 
    color: MyTheme.primary, 
    marginBottom: 8,
    fontSize: 14,
  },
  input: { 
    backgroundColor: MyTheme.white, 
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12, 
    fontFamily: 'Inter-Regular', 
    borderWidth: 1, 
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: MyTheme.primary,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MyTheme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
  registerButton: { 
    backgroundColor: MyTheme.secondary, // Color 2: ff7a0f
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginTop: 15,
    elevation: 4,
    shadowColor: MyTheme.secondary,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  registerButtonText: { 
    fontFamily: 'Montserrat-Bold', 
    color: MyTheme.white, 
    fontSize: 16 
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: { 
    fontFamily: 'Inter-Regular', 
    color: MyTheme.primary,
    fontSize: 14 
  },
  link: { 
    color: MyTheme.secondary, 
    fontFamily: 'Inter-Medium' 
  },
});