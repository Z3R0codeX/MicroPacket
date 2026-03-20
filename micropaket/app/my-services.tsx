import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, Image, StyleSheet, 
  TouchableOpacity, Alert, ActivityIndicator, RefreshControl 
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyTheme } from '@/constants/theme';
import { BASE_URL, STORAGE_URL } from '@/constants/config';
import { MicroPackage } from '@/constants/types';

export default function MyServices() {
  const router = useRouter();
  const [services, setServices] = useState<MicroPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Cargar solo MIS servicios
  const fetchMyServices = async () => {
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (!token) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Usamos el endpoint específico para el usuario logueado
      const response = await fetch(`${BASE_URL}/my-packages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setServices(data);
      } else {
        console.error("Error fetching services:", data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 2. Auto-refresh al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchMyServices();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyServices();
  };

  // 3. Lógica para ELIMINAR un servicio
  const handleDelete = (id: number) => {
    Alert.alert(
      "Eliminar Servicio",
      "¿Estás seguro de que quieres borrar este paquete? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: async () => {
            try {
              const token = await SecureStore.getItemAsync('user_token');
              const response = await fetch(`${BASE_URL}/micro-packages/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
                },
              });

              if (response.ok) {
                // Actualizamos la lista local eliminando el servicio
                setServices(prev => prev.filter(s => s.id_micro_package !== id));
                Alert.alert("Éxito", "Servicio eliminado correctamente.");
              } else {
                Alert.alert("Error", "No se pudo eliminar el servicio.");
              }
            } catch (error) {
              console.error(error);
            }
          } 
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color={MyTheme.secondary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestión de Servicios</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(tabs)/create-package')}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id_micro_package.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MyTheme.secondary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>Aún no has publicado servicios.</Text>
            <TouchableOpacity style={styles.createFirstBtn} onPress={() => router.push('/(tabs)/create-package')}>
              <Text style={styles.createFirstText}>Crear mi primer servicio</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.serviceCard}>
            <Image 
              source={{ uri: item.img ? `${STORAGE_URL}/${item.img}` : 'https://via.placeholder.com/150' }} 
              style={styles.serviceImage} 
            />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceCategory}>{item.category?.name || 'Servicio'}</Text>
              <Text style={styles.serviceTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.servicePrice}>${item.price} MXN</Text>
            </View>
            
            {/* Acciones de gestión */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionBtn} 
                onPress={() => router.push({
                  pathname: "/edit-service/[id]",
                  params: { id: item.id_micro_package }
                })}
              >
                <Ionicons name="pencil-outline" size={20} color={MyTheme.accent} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item.id_micro_package)}>
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MyTheme.background },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: MyTheme.primary },
  addBtn: { backgroundColor: MyTheme.secondary, padding: 10, borderRadius: 20 },
  listContent: { padding: 20, paddingBottom: 40 },
  serviceCard: { backgroundColor: 'white', borderRadius: 15, marginBottom: 15, flexDirection: 'row', alignItems: 'center', elevation: 3, overflow: 'hidden' },
  serviceImage: { width: 90, height: 90 },
  serviceInfo: { flex: 1, padding: 12 },
  serviceCategory: { color: MyTheme.accent, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  serviceTitle: { fontSize: 15, fontWeight: '600', marginTop: 3, color: '#333' },
  servicePrice: { fontSize: 16, fontWeight: 'bold', marginTop: 5, color: MyTheme.primary },
  actionsContainer: { paddingHorizontal: 10, borderLeftWidth: 1, borderLeftColor: '#EEE' },
  actionBtn: { padding: 8 },
  deleteBtn: { marginTop: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#888', marginTop: 20, fontSize: 16, textAlign: 'center' },
  createFirstBtn: { backgroundColor: MyTheme.secondary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginTop: 20 },
  createFirstText: { color: 'white', fontWeight: 'bold' }
});