import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  StyleSheet, Alert, Modal, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { MyTheme } from '@/constants/theme';
import { BASE_URL } from '@/constants/config';
import { Category } from '@/constants/types';

// BIBLIOTECA EXPANDIDA DE ICONOS (REFILL)
const ICON_LIST = [
  'cart', 'code-slash', 'brush', 'megaphone', 'videocam', 'pencil', 'musical-notes', 
  'business', 'language', 'camera', 'rocket', 'bulb', 'construct', 'desktop', 
  'game-controller', 'headset', 'layers', 'color-palette', 'terminal', 'phone-portrait',
  'terminal', 'hardware-chip', 'server', 'cloud-upload', 'shield-checkmark', 'bug',
  'images', 'film', 'mic', 'play-circle', 'briefcase', 'analytics', 'pie-chart',
  'calculator', 'trending-up', 'wallet', 'receipt', 'newspaper', 'mail', 'calendar',
  'hammer', 'build', 'key', 'home', 'water', 'flashlight', 'trash', 'cut', 'medkit',
  'book', 'school', 'flask', 'earth', 'telescope', 'pricetag', 'gift', 'ribbon', 
  'star', 'flash', 'trophy', 'people', 'chatbubbles', 'car-sport', 'airplane', 'paw'
];

export default function CategoryAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [form, setForm] = useState({ name: '', icon: 'cube' }); 
  const [iconSearch, setIconSearch] = useState('');

  // Filtro de búsqueda de iconos en tiempo real
  const filteredIcons = useMemo(() => {
    return ICON_LIST.filter(icon => icon.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      console.error("Error al cargar categorías:", e);
    }
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setForm({ name: '', icon: 'cube' });
    setIconSearch('');
    setModalVisible(true);
  };

  const openEditModal = (category: Category) => {
    setIsCreating(false);
    setSelectedId(category.id_category);
    setForm({ name: category.name, icon: category.icon || 'cube' });
    setIconSearch('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return Alert.alert("Error", "El nombre es obligatorio");

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      const url = isCreating ? `${BASE_URL}/categories` : `${BASE_URL}/categories/${selectedId}`;
      const method = isCreating ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setModalVisible(false);
        fetchCategories();
        Alert.alert("¡Éxito!", isCreating ? "Categoría creada" : "Categoría actualizada");
      } else {
        const errorData = await res.json();
        Alert.alert("Error", errorData.message || "No se pudo guardar los cambios.");
      }
    } catch (e) {
      Alert.alert("Error", "Error de conexión con Laravel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER CON BOTÓN XL */}
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Control</Text>
        <TouchableOpacity style={styles.addMainBtn} onPress={openCreateModal}>
          <Ionicons name="add-circle" size={28} color="white" />
          <Text style={styles.addMainText}>Crear nueva categoría</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id_category.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem} onPress={() => openEditModal(item)}>
            <View style={styles.itemLeft}>
              <View style={styles.iconBg}>
                <Ionicons name={item.icon as any || 'cube'} size={24} color={MyTheme.primary} />
              </View>
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color="#CCC" />
          </TouchableOpacity>
        )}
      />

      {/* MODAL UNIFICADO  */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{isCreating ? "Nueva Categoría" : "Editar Categoría"}</Text>
            
            <Text style={styles.label}>Nombre de la Categoría</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: Programación"
              value={form.name} 
              onChangeText={(t) => setForm({...form, name: t})} 
            />

            <Text style={styles.label}>Biblioteca de Iconos</Text>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color="#999" />
              <TextInput 
                style={styles.searchInput}
                placeholder="Buscar por nombre..."
                value={iconSearch}
                onChangeText={setIconSearch}
              />
            </View>

            <View style={styles.iconGrid}>
              <FlatList
                data={filteredIcons}
                numColumns={4}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.iconBox, form.icon === item && styles.iconBoxActive]}
                    onPress={() => setForm({...form, icon: item})}
                  >
                    <Ionicons name={item as any} size={28} color={form.icon === item ? MyTheme.secondary : '#666'} />
                  </TouchableOpacity>
                )}
                style={{ maxHeight: 220 }}
                showsVerticalScrollIndicator={true}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveText}>Guardar Cambios</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MyTheme.background, paddingHorizontal: 20 },
  header: { marginBottom: 25, alignItems: 'center', paddingTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: MyTheme.primary },
  // ESTILO BOTÓN XL
  addMainBtn: { 
    backgroundColor: MyTheme.secondary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 18, 
    paddingHorizontal: 25, 
    borderRadius: 18, 
    marginTop: 20, 
    elevation: 5, 
    width: '100%', 
    justifyContent: 'center' 
  },
  addMainText: { color: 'white', fontWeight: 'bold', fontSize: 18, marginLeft: 12 },
  categoryItem: { backgroundColor: 'white', padding: 18, borderRadius: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 2 },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { width: 52, height: 52, backgroundColor: '#F0F2F5', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  categoryText: { marginLeft: 15, fontSize: 16, fontWeight: '700', color: '#333' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25, minHeight: '70%', paddingBottom: 50 },
  modalHandle: { width: 40, height: 5, backgroundColor: '#EEE', borderRadius: 10, alignSelf: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: MyTheme.primary },
  label: { fontSize: 13, fontWeight: '800', color: '#AAA', marginBottom: 10, marginTop: 15, textTransform: 'uppercase' },
  input: { backgroundColor: '#F5F7FA', borderRadius: 15, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#EEE' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA', borderRadius: 15, paddingHorizontal: 15, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  searchInput: { flex: 1, padding: 12, fontSize: 14 },
  iconGrid: { backgroundColor: '#F9FBFF', borderRadius: 20, padding: 10, borderWidth: 1, borderColor: '#EBF0F5' },
  iconBox: { flex: 1, height: 65, justifyContent: 'center', alignItems: 'center', margin: 4, borderRadius: 15 },
  iconBoxActive: { backgroundColor: '#FFF0E6', borderWidth: 1, borderColor: MyTheme.secondary },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 35, gap: 15 },
  cancelBtn: { flex: 1, padding: 20, alignItems: 'center' },
  cancelText: { color: '#BBB', fontWeight: 'bold' },
  saveBtn: { flex: 2, backgroundColor: MyTheme.primary, padding: 20, borderRadius: 18, alignItems: 'center', elevation: 4 },
  saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});