import React from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// Importamos tu tema (ajusta la ruta según tu estructura)
import { MyTheme } from '../../constants/theme'; 

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 1. Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color={MyTheme.primary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>All Deals</Text>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Ionicons name="cart-outline" size={24} color={MyTheme.primary} style={{ marginRight: 15 }} />
            </TouchableOpacity>
            <Image 
              source={{ uri: 'https://via.placeholder.com/40' }} 
              style={styles.profilePic} 
            />
          </View>
        </View>

        {/* 2. Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={MyTheme.accent} />
            <TextInput 
              placeholder="Search for product" 
              placeholderTextColor="#A0A0A0"
              style={styles.searchInput} 
            />
          </View>
          
          {/* Usamos el color secundario (naranja) para que el filtro resalte */}
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color={MyTheme.white} />
          </TouchableOpacity>
        </View>

        {/* 3. Marcador de posición para Banner y Categorías */}
        <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontFamily: 'Montserrat-Bold', color: MyTheme.primary, fontSize: 18 }}>
                Próximamente: Categorías y Banners
            </Text>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: MyTheme.background // Color 4: f5fefe
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { 
    fontSize: 22, 
    fontFamily: 'Montserrat-Bold', // Fuente primaria
    color: MyTheme.primary        // Color primario: 01406d
  },
  headerIcons: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  profilePic: { 
    width: 38, 
    height: 38, 
    borderRadius: 19,
    borderWidth: 2,
    borderColor: MyTheme.accent // Color 3 para resaltar el perfil
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: MyTheme.white,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    // Sombra suave para que el input "flote" sobre el fondo azulado
    elevation: 3,
    shadowColor: MyTheme.primary,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  searchInput: { 
    marginLeft: 10, 
    flex: 1,
    fontFamily: 'Inter-Regular', // Fuente secundaria
    color: MyTheme.text,
    fontSize: 15,
  },
  filterButton: {
    backgroundColor: MyTheme.secondary, // Color secundario: ff7a0f
    padding: 13,
    borderRadius: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});