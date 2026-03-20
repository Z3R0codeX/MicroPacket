import React, { useState, useEffect } from 'react';
import { 
  ScrollView, View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, Image, ActivityIndicator 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MyTheme } from '@/constants/theme';
import { BASE_URL, STORAGE_URL } from '@/constants/config';

interface Category {
  id_category: number;
  name: string;
}

export default function EditService() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // ID del servicio a editar
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [isNewImage, setIsNewImage] = useState(false); // Para saber si subimos una foto nueva
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    delivery_days: '',
    id_category: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = await SecureStore.getItemAsync('user_token');
      // 1. Cargar Categorías y Datos del Servicio en paralelo
      const [catRes, packRes] = await Promise.all([
        fetch(`${BASE_URL}/categories`),
        fetch(`${BASE_URL}/micro-packages/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const catData = await catRes.json();
      const packData = await packRes.json();

      setCategories(catData);
      
      // 2. Llenar el formulario con los datos actuales
      setForm({
        title: packData.title,
        description: packData.description || '',
        price: packData.price.toString(),
        delivery_days: packData.delivery_days.toString(),
        id_category: packData.id_category.toString()
      });

      // 3. Mostrar la imagen actual del servidor
      if (packData.img) {
        setImage(`${STORAGE_URL}/${packData.img}`);
        setIsNewImage(false);
      }

    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la información.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setIsNewImage(true); // Marcamos que esta imagen es nueva y debe subirse
    }
  };

  const handleUpdate = async () => {
    if (!form.title || !form.price || !form.delivery_days) {
      Alert.alert("Atención", "Por favor llena los campos obligatorios.");
      return;
    }

    setSaving(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      const formData = new FormData();
      
      // TRUCO LARAVEL: spoofing de método PUT usando POST
      formData.append('_method', 'PUT'); 
      
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('delivery_days', form.delivery_days);
      formData.append('id_category', form.id_category);

      // Solo adjuntamos la imagen si el usuario seleccionó una nueva
      if (image && isNewImage) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;
        
        formData.append('img', { 
          uri: image, 
          name: filename || 'upload.jpg', 
          type 
        } as any);
      }

      const response = await fetch(`${BASE_URL}/micro-packages/${id}`, {
        method: 'POST', // Usamos POST + _method: PUT para que Laravel acepte el archivo
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("¡Éxito!", "Servicio actualizado correctamente.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Error", result.message || "No se pudo actualizar.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo contactar con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={MyTheme.primary} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.headerTitle}>Editar Servicio</Text>

      <Text style={styles.label}>Título del Servicio*</Text>
      <TextInput 
        style={styles.input} 
        value={form.title}
        onChangeText={(t) => setForm({...form, title: t})} 
      />

      <Text style={styles.label}>Categoría*</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.id_category}
          onValueChange={(val) => setForm({ ...form, id_category: val })}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat.id_category} label={cat.name} value={cat.id_category.toString()} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Descripción</Text>
      <TextInput 
        style={[styles.input, { height: 100 }]} 
        multiline 
        value={form.description}
        onChangeText={(t) => setForm({...form, description: t})} 
      />

      <View style={styles.row}>
        <View style={{ width: '45%' }}>
          <Text style={styles.label}>Precio (MXN)*</Text>
          <TextInput 
            style={styles.input} 
            value={form.price}
            keyboardType="numeric" 
            onChangeText={(t) => setForm({...form, price: t})} 
          />
        </View>
        <View style={{ width: '45%' }}>
          <Text style={styles.label}>Entrega (Días)*</Text>
          <TextInput 
            style={styles.input} 
            value={form.delivery_days}
            keyboardType="numeric" 
            onChangeText={(t) => setForm({...form, delivery_days: t})} 
          />
        </View>
      </View>

      <Text style={styles.label}>Imagen de Portada</Text>
      {image ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <TouchableOpacity onPress={pickImage}><Text style={styles.changeLink}>Cambiar foto</Text></TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          <Text style={styles.uploadText}>+ Seleccionar Imagen</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={[styles.btn, saving && { opacity: 0.7 }]} 
        onPress={handleUpdate}
        disabled={saving}
      >
        {saving ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Guardar Cambios</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: MyTheme.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: MyTheme.primary, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#EEE' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  pickerContainer: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#EEE', overflow: 'hidden' },
  uploadBox: { height: 120, borderWidth: 2, borderColor: '#DDD', borderStyle: 'dashed', borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0' },
  uploadText: { color: '#888' },
  previewContainer: { alignItems: 'center' },
  previewImage: { width: '100%', height: 180, borderRadius: 12 },
  changeLink: { color: '#007BFF', marginTop: 8 },
  btn: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 15, marginTop: 30, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});