import React, { useEffect, useState } from 'react';
import { 
  View, Text, Image, ScrollView, StyleSheet, 
  TouchableOpacity, ActivityIndicator, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MyTheme } from '@/constants/theme';
import { BASE_URL, STORAGE_URL } from '@/constants/config';
import { MicroPackage } from '@/constants/types';

export default function ServiceDetails() {
  const { id } = useLocalSearchParams(); // Obtenemos el ID de la URL
  const router = useRouter();
  const [service, setService] = useState<MicroPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const response = await fetch(`${BASE_URL}/micro-packages/${id}`);
        const data = await response.json();
        if (response.ok) {
          setService(data);
        } else {
          Alert.alert("Error", "No se encontró el servicio.");
          router.back();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color={MyTheme.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen de Portada con botón de regreso */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: service?.img ? `${STORAGE_URL}/${service.img}` : 'https://via.placeholder.com/400' }} 
            style={styles.mainImage} 
          />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Categoría y Título */}
          <Text style={styles.categoryLabel}>{service?.category?.name || 'Servicio'}</Text>
          <Text style={styles.title}>{service?.title}</Text>

          {/* Info del Vendedor */}
          <View style={styles.userRow}>
            <View style={styles.userIcon}>
              <Ionicons name="person" size={20} color={MyTheme.primary} />
            </View>
            <View>
              <Text style={styles.username}>{service?.user?.username || 'Experto de MicroPacket'}</Text>
              <Text style={styles.userRating}>⭐ {service?.user?.seller_rating || '5.0'} Calificación</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Descripción */}
          <Text style={styles.sectionTitle}>Sobre este servicio</Text>
          <Text style={styles.description}>
            {service?.description || 'El experto no proporcionó una descripción detallada todavía.'}
          </Text>

          {/* Stats Rápidas */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="time-outline" size={24} color={MyTheme.secondary} />
              <Text style={styles.statValue}>{service?.delivery_days} Días</Text>
              <Text style={styles.statLabel}>Entrega</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="shield-checkmark-outline" size={24} color={MyTheme.secondary} />
              <Text style={styles.statValue}>Protegido</Text>
              <Text style={styles.statLabel}>Pago Seguro</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer de Compra */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Precio total</Text>
          <Text style={styles.priceValue}>${service?.price} MXN</Text>
        </View>
        <TouchableOpacity style={styles.hireBtn} onPress={() => Alert.alert("Próximamente", "El sistema de pedidos estará listo pronto.")}>
          <Text style={styles.hireBtnText}>Contratar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { width: '100%', height: 300, position: 'relative' },
  mainImage: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 25 },
  content: { padding: 20 },
  categoryLabel: { color: MyTheme.secondary, fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 5 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  userIcon: { width: 40, height: 40, backgroundColor: '#F0F0F0', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  username: { fontWeight: 'bold', fontSize: 16 },
  userRating: { color: '#666', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', lineHeight: 24 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 },
  statBox: { alignItems: 'center' },
  statValue: { fontWeight: 'bold', marginTop: 5 },
  statLabel: { color: '#999', fontSize: 12 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { color: '#999', fontSize: 12 },
  priceValue: { fontSize: 22, fontWeight: 'bold', color: MyTheme.primary },
  hireBtn: { backgroundColor: '#FF6B00', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15 },
  hireBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});