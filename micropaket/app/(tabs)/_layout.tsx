import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MyTheme } from '@/constants/theme'; 

export default function TabLayout() {
  const router = useRouter(); //

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: MyTheme.secondary, // Naranja #ff7a0f
        tabBarInactiveTintColor: '#A0A0A0',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: MyTheme.white,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 10,
        },
      }}>
      
      {/* 1. Inicio */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          ),
        }}
      />

      {/* 2. Publicar (Acceso a Admin/Create) */}
      <Tabs.Screen
        name="create-package"
        options={{
          title: 'Publicar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={26} color={color} />
          ),
        }}
        />
        

      {/* 3. Pedidos (Acceso a Admin/Orders) */}
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "cart" : "cart-outline"} size={24} color={color} />
          ),
        }}
       
      />
      {/* 4. categorias */}
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categorías',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "list" : "list-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* 5. Mi Perfil (Sincronizado con Laravel) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}