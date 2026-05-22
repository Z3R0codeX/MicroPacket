import React, { useState, useEffect } from 'react';
import { 
  ScrollView, View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, Image, ActivityIndicator 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router'; // <--- CAMBIO: Usar useRouter de Expo
import { MyTheme } from '@/constants/theme';
import { BASE_URL } from '@/constants/config';

interface Category {
  id_category: number;
  name: string;
}

export default function CreatePackage() {
  const router = useRouter(); // <--- CAMBIO: Inicializar el router
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    delivery_days: '',
    id_category: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/categories`);
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setForm(prev => ({ ...prev, id_category: data[0].id_category.toString() }));
        }
      } catch (error) {
        console.error("Error categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      price: '',
      delivery_days: '',
      id_category: categories.length > 0 ? categories[0].id_category.toString() : ''
    });
    setImage(null);
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
    }
  };

  const handleCreate = async () => {
    if (!form.title || !form.price || !form.delivery_days) {
      Alert.alert("Atención", "Por favor llena los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      const session = await SecureStore.getItemAsync('user_session');

      if (!token || !session) {
        Alert.alert("Error", "Sesión no encontrada.");
        setLoading(false);
        return;
      }

      const userData = JSON.parse(session);
      const formData = new FormData();
      
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('delivery_days', form.delivery_days);
      formData.append('id_category', form.id_category);
      formData.append('id_user', String(userData.id_user));
      formData.append('status', 'active');

      if (image) {
        const imgStr = image as string;
         const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const ext = match ? match[1] : 'jpg';
        const type = `image/${ext=== 'jpg' ? 'jpeg' : ext}`;
        
        formData.append('img', { 
          uri: image, 
          name: filename || 'upload.jpg', 
          type: type
        } as any);
      }

      const response = await fetch(`${BASE_URL}/micro-packages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        resetForm();
        Alert.alert("¡Éxito!", "Servicio publicado correctamente.", [
          { text: "OK", onPress: () => router.back() } // <--- CAMBIO: Usar router.back()
        ]);
      } else {
        Alert.alert("Error", result.message || "No se pudo crear el servicio.");
      }
    } catch (error) {
      Alert.alert("Error de conexión", "No se pudo contactar con el servidor Laravel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.headerTitle}>Nuevo Servicio</Text>

      <Text style={styles.label}>Título del Servicio*</Text>
      <TextInput 
        style={styles.input} 
        value={form.title}
        placeholder="Ej: Diseño de logotipos" 
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
        placeholder="Describe tu trabajo..."
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
        style={[styles.btn, loading && { opacity: 0.7 }]} 
        onPress={handleCreate}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Publicar ahora</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: MyTheme.background },
  headerTitle: { fontFamily: 'Montserrat-Bold', fontSize: 24, color: MyTheme.primary, marginBottom: 20 },
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