import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  Alert, ActivityIndicator, ScrollView, Platform 
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { MyTheme } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '@/constants/config';

export default function ProfileScreen() {
  const router = useRouter();
  
  // Estado inicial con personalización incluida
  const [userData, setUserData] = useState({
    username: 'Cargando...',
    email: '',
    bio: '',
    seller_rating: '0.0',
    role: 'user',
    profile_icon: 'person-circle',
    profile_color: MyTheme.primary, // Color por defecto
  });
  const [isLoading, setIsLoading] = useState(true);

  // 1. OBTENER PERFIL ACTUALIZADO
  const fetchProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (!token) return setIsLoading(false);

      const response = await fetch(`${BASE_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUserData({
          username: data.username,
          email: data.email,
          bio: data.bio || 'Sin biografía disponible',
          seller_rating: data.seller_rating || '5.0',
          role: data.role || 'user',
          profile_icon: data.profile_icon || 'person-circle',
          profile_color: data.profile_color || MyTheme.primary,
        });
      }
    } catch (error) {
      console.error("Error al sincronizar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresco automático al volver de editar
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchProfile();
    }, [])
  );

  // 2. CAMBIO DE CUENTA (Limpieza total)
  const handleSwitchAccount = async () => {
    try {
      await SecureStore.deleteItemAsync('user_token');
      await SecureStore.deleteItemAsync('user_session');
      router.replace('/login'); 
    } catch (e) {
      router.replace('/login');
    }
  };

  // 3. LOGOUT OFICIAL
  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Salir", 
        style: "destructive",
        onPress: async () => {
          try {
            const token = await SecureStore.getItemAsync('user_token');
            await fetch(`${BASE_URL}/logout`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            await handleSwitchAccount();
          } catch (e) {
            await handleSwitchAccount();
          }
        } 
      }
    ]);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={MyTheme.primary} />
      </View>
    );
  }

  // Definimos el color de marca del usuario para usarlo en el diseño
  const userBrandColor = userData.profile_color;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Banner Dinámico con el color del usuario */}
        <View style={[styles.headerBanner, { backgroundColor: userBrandColor }]}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
        </View>

        <View style={styles.profileCard}>
          {/* Avatar con Icono Personalizado */}
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarContainer, { borderColor: 'white', borderWidth: 4 }]}>
              <Ionicons 
                name={userData.profile_icon as any} 
                size={100} 
                color={userBrandColor} 
              />
              <View style={[styles.ratingBadge, { backgroundColor: MyTheme.secondary }]}>
                <Ionicons name="star" size={12} color="white" />
                <Text style={styles.ratingText}>{userData.seller_rating}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.nameRow}>
            <Text style={styles.userName}>@{userData.username}</Text>
            <TouchableOpacity 
              onPress={() => router.push('/update-profile' as any)} 
              style={[styles.editIcon, { backgroundColor: `${userBrandColor}15` }]}
            >
              <Ionicons name="create-outline" size={18} color={userBrandColor} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userEmail}>{userData.email}</Text>
          <Text style={styles.bioText}>{userData.bio}</Text>

         
        </View>

        {/* Menú de Navegación */}
        <View style={styles.menuContainer}>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleSwitchAccount}>
            <Ionicons name="log-in-outline" size={22} color="#3498DB" />
            <Text style={[styles.menuText, { color: '#3498DB' }]}>Cambiar de Cuenta</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          {userData.role === 'admin' && (
            <TouchableOpacity 
              style={[styles.menuItem, styles.adminItem]} 
              onPress={() => router.push('/categories')}
            >
              <Ionicons name="shield-checkmark-outline" size={22} color={MyTheme.secondary} />
              <Text style={[styles.menuText, { fontWeight: 'bold' }]}>Panel de Categorías</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/my-services' as any)}>
            <Ionicons name="briefcase-outline" size={22} color={MyTheme.primary} />
            <Text style={styles.menuText}>Mis Servicios</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#E74C3C" />
            <Text style={[styles.menuText, { color: '#E74C3C' }]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>MicroPacket v1.0.0 • Z3R0_codeX</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerBanner: { 
    height: 140, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginTop: -30 },
  profileCard: { 
    backgroundColor: 'white', 
    marginHorizontal: 20, 
    borderRadius: 30, 
    padding: 20, 
    marginTop: -50, 
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  avatarWrapper: { marginTop: -70 },
  avatarContainer: { position: 'relative', backgroundColor: 'white', borderRadius: 60, padding: 5 },
  ratingBadge: {
    position: 'absolute', bottom: 2, right: 2,
    flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
    borderWidth: 2, borderColor: 'white'
  },
  ratingText: { color: 'white', fontSize: 11, fontWeight: 'bold', marginLeft: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50' },
  editIcon: { marginLeft: 12, padding: 6, borderRadius: 10 },
  userEmail: { fontSize: 14, color: '#7F8C8D', marginBottom: 15 },
  bioText: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 21, paddingHorizontal: 15 },
  statsRow: { 
    flexDirection: 'row', 
    marginTop: 25, 
    paddingTop: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#F0F0F0',
    width: '100%' 
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#F0F0F0' },
  statNumber: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 11, color: '#95A5A6', marginTop: 3, textTransform: 'uppercase' },
  menuContainer: { 
    backgroundColor: 'white', 
    marginHorizontal: 20, 
    borderRadius: 25, 
    elevation: 5, 
    overflow: 'hidden', 
    marginTop: 25,
    marginBottom: 40
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 22, borderBottomWidth: 1, borderBottomColor: '#F9F9F9' },
  adminItem: { backgroundColor: '#FFFBF8' },
  menuText: { flex: 1, fontSize: 16, marginLeft: 15, color: '#2C3E50', fontWeight: '500' },
  versionText: { textAlign: 'center', marginBottom: 40, fontSize: 11, color: '#BDC3C7', letterSpacing: 1.5 }
});