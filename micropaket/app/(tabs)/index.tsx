import React, { useEffect, useState, useCallback } from 'react';
import { 
  StyleSheet, ScrollView, View, Text, TextInput, Image, 
  TouchableOpacity, FlatList, ActivityIndicator, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router'; 

import { MyTheme } from '../../constants/theme'; 
import { Category, MicroPackage } from '@/constants/types';
import { BASE_URL, STORAGE_URL } from '@/constants/config'; 

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [packages, setPackages] = useState<MicroPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [catRes, packRes] = await Promise.all([
        fetch(`${BASE_URL}/categories`),
        fetch(`${BASE_URL}/micro-packages`)
      ]);
      
      const catData = await catRes.json();
      const packData = await packRes.json();
      
      setCategories(catData);
      setPackages(packData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[MyTheme.secondary]} 
            tintColor={MyTheme.secondary}
          />
        }
      >
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MicroPacket</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={MyTheme.accent} />
            <TextInput placeholder="¿Qué servicio buscas?" placeholderTextColor="#A0A0A0" style={styles.searchInput} />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color={MyTheme.white} />
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={MyTheme.primary} style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* Listado de Categorías */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categorías</Text>
              <TouchableOpacity><Text style={styles.seeAll}>Ver todas</Text></TouchableOpacity>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              keyExtractor={(item) => item.id_category.toString()}
              contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.categoryCard}>
                  <View style={styles.categoryIcon}>
                    {/* CAMBIO: Ahora usamos item.icon que viene de Laravel */}
                    <Ionicons 
                      name={(item.icon as any) || 'cube'} 
                      size={26} 
                      color={MyTheme.primary} 
                    />
                  </View>
                  <Text style={styles.categoryName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Servicios Destacados */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Servicios Destacados</Text>
            </View>
            <View style={styles.packagesContainer}>
              {packages.map((item) => (
                <TouchableOpacity 
                    key={item.id_micro_package} 
                    style={styles.packageCard}
                    onPress={() => router.push({
                      pathname: "/details/[id]",
                      params: { id: item.id_micro_package }
                    })}
                >
                  <Image 
                    source={{ 
                      uri: item.img 
                        ? `${STORAGE_URL}/${item.img}` 
                        : 'https://via.placeholder.com/150' 
                    }} 
                    style={styles.packageImage} 
                    resizeMode="cover"
                  />
                  <View style={styles.packageInfo}>
                    <Text style={styles.packageTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.packageUser}>Por: {item.user?.username || 'Experto'}</Text>
                    <View style={styles.packageFooter}>
                      <Text style={styles.packagePrice}>${item.price}</Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color={MyTheme.secondary} />
                        <Text style={styles.ratingText}>{item.user?.seller_rating || '0.0'}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (Los estilos se mantienen igual)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MyTheme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: MyTheme.primary },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: MyTheme.white, borderRadius: 12, alignItems: 'center', paddingHorizontal: 15, height: 50, elevation: 3 },
  searchInput: { marginLeft: 10, flex: 1, color: MyTheme.text, fontSize: 15 },
  filterButton: { backgroundColor: MyTheme.secondary, padding: 13, borderRadius: 12, marginLeft: 10, justifyContent: 'center', alignItems: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 15, alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: MyTheme.primary },
  seeAll: { color: MyTheme.accent, fontSize: 14 },
  categoryCard: { alignItems: 'center', marginRight: 20 },
  categoryIcon: { width: 60, height: 60, backgroundColor: 'white', borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 2, marginBottom: 8 },
  categoryName: { fontSize: 13, color: MyTheme.primary, fontWeight: '500' },
  packagesContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  packageCard: { backgroundColor: 'white', borderRadius: 15, marginBottom: 15, overflow: 'hidden', elevation: 4 },
  packageImage: { width: '100%', height: 160 },
  packageInfo: { padding: 12 },
  packageTitle: { fontSize: 16, fontWeight: 'bold', color: MyTheme.primary },
  packageUser: { fontSize: 12, color: '#666', marginVertical: 4 },
  packageFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  packagePrice: { fontSize: 18, fontWeight: 'bold', color: MyTheme.secondary },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 4, fontWeight: 'bold', fontSize: 14, color: MyTheme.primary },
});