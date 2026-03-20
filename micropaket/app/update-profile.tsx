import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, ActivityIndicator, ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { MyTheme } from '@/constants/theme';
import { BASE_URL } from '@/constants/config';

const COLOR_PALETTE = ['#2C3E50', '#E74C3C', '#27AE60', '#F1C40F', '#8E44AD', '#E67E22', '#16A085'];
const ICON_OPTIONS = ['person-circle', 'ghost', 'rocket', 'code-slash', 'terminal', 'paw', 'flask', 'bulb'];

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    username: '', 
    bio: '', 
    profile_icon: 'person-circle', 
    profile_color: '#2C3E50' 
  });

  useEffect(() => { loadCurrentData(); }, []);

  const loadCurrentData = async () => {
    try {
      const session = await SecureStore.getItemAsync('user_session');
      if (session) {
        const user = JSON.parse(session);
        setForm({ 
          username: user.username || '', 
          bio: user.bio || '',
          profile_icon: user.profile_icon || 'person-circle',
          profile_color: user.profile_color || '#2C3E50'
        });
      }
    } catch (e) {
      console.error("Error cargando sesión local:", e);
    }
  };

  const handleUpdate = async () => {
    if (!form.username.trim()) return Alert.alert("Error", "El nombre de usuario es necesario.");

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      
      // LOG DE DEPURACIÓN: Verifica esto en tu terminal de Metro
      console.log("Intentando actualizar con Token:", token ? "Token encontrado" : "TOKEN NULO");

      const response = await fetch(`${BASE_URL}/user/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json', // <--- FUNDAMENTAL para evitar el error de la captura
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      console.log("Respuesta de Laravel:", result);

      if (response.ok) {
        // 1. Actualizamos la sesión local con los nuevos datos que devuelve Laravel
        await SecureStore.setItemAsync('user_session', JSON.stringify(result.user));
        
        Alert.alert("¡Éxito!", "Tu perfil ha sido actualizado.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        // Si Laravel devuelve un error de validación u otro
        Alert.alert("No se pudo actualizar", result.message || "Error de validación.");
      }
    } catch (e) {
      console.error("Error de conexión:", e);
      Alert.alert("Error de Red", "No se pudo conectar con el servidor MicroPacket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 25 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Personalizar</Text>
      </View>

      {/* Vista Previa Dinámica */}
      <View style={[styles.previewCard, { backgroundColor: form.profile_color }]}>
        <View style={styles.avatarCircle}>
          <Ionicons name={form.profile_icon as any} size={70} color={form.profile_color} />
        </View>
        <Text style={styles.previewName}>@{form.username || 'usuario'}</Text>
      </View>

      <Text style={styles.label}>Nombre de usuario</Text>
      <TextInput 
        style={styles.input} 
        value={form.username} 
        onChangeText={(t) => setForm({...form, username: t})}
        placeholder="Tu nombre de experto..."
      />

      <Text style={styles.label}>Color de Marca</Text>
      <View style={styles.optionRow}>
        {COLOR_PALETTE.map(color => (
          <TouchableOpacity 
            key={color} 
            style={[
              styles.colorCircle, 
              { backgroundColor: color },
              form.profile_color === color && { borderWidth: 3, borderColor: '#333' }
            ]} 
            onPress={() => setForm({...form, profile_color: color})}
          />
        ))}
      </View>

      <Text style={styles.label}>Icono de Perfil</Text>
      <View style={styles.optionRow}>
        {ICON_OPTIONS.map(icon => (
          <TouchableOpacity 
            key={icon} 
            style={[
              styles.iconBox, 
              { borderColor: form.profile_icon === icon ? form.profile_color : '#EEE' },
              form.profile_icon === icon && { backgroundColor: `${form.profile_color}10` }
            ]} 
            onPress={() => setForm({...form, profile_icon: icon})}
          >
            <Ionicons 
              name={icon as any} 
              size={24} 
              color={form.profile_icon === icon ? form.profile_color : '#CCC'} 
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Biografía</Text>
      <TextInput 
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
        multiline 
        numberOfLines={4}
        value={form.bio} 
        onChangeText={(t) => setForm({...form, bio: t})} 
        placeholder="Describe tus habilidades..."
      />

      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: form.profile_color }]} 
        onPress={handleUpdate} 
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Guardar Cambios</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { marginRight: 15 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#2C3E50' },
  previewCard: { padding: 30, borderRadius: 30, alignItems: 'center', marginBottom: 25, elevation: 5 },
  avatarCircle: { backgroundColor: 'white', padding: 15, borderRadius: 50 },
  previewName: { color: 'white', fontWeight: 'bold', marginTop: 15, fontSize: 20 },
  label: { fontSize: 12, fontWeight: '900', color: '#AAA', marginTop: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 15, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#EEE' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colorCircle: { width: 44, height: 44, borderRadius: 22 },
  iconBox: { padding: 15, borderRadius: 15, borderWidth: 2, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center', minWidth: 60 },
  btn: { padding: 20, borderRadius: 18, marginTop: 40, alignItems: 'center', elevation: 3 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});