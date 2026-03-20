import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MyTheme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '@/constants/types';
import { BASE_URL } from '@/constants/config'; // Importamos la URL base desde config

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/orders`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id_order.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.statusRow}>
              <Text style={styles.packageTitle}>{item.micro_package?.title}</Text>
              <View style={[styles.badge, { backgroundColor: item.status === 'completed' ? '#2ECC71' : MyTheme.secondary }]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.priceText}>Monto: ${item.price}</Text>
            <View style={styles.footer}>
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text style={styles.dateText}>Inicia: {item.start_day || 'Pendiente'}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MyTheme.background, padding: 15 },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 15, elevation: 3 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  packageTitle: { fontFamily: 'Montserrat-Bold', color: MyTheme.primary, fontSize: 16, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: 'white', fontSize: 10, textTransform: 'uppercase', fontFamily: 'Inter-Bold' },
  priceText: { fontFamily: 'Inter-Medium', color: MyTheme.accent, fontSize: 15 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 },
  dateText: { fontSize: 12, color: '#666', marginLeft: 5 }
});