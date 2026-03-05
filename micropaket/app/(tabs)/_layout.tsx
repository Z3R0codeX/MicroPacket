import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
// Importamos tu tema personalizado
import { MyTheme } from '@/constants/theme'; 
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // El icono activo usará tu color naranja vibrante
        tabBarActiveTintColor: MyTheme.secondary,
        // El icono inactivo será tu azul primario con opacidad o gris suave
        tabBarInactiveTintColor: '#A0A0A0',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: MyTheme.white,
          borderTopWidth: 1,
          borderTopColor: MyTheme.accent, // Un detalle sutil en color 3
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          paddingTop: 8,
          // Sombra para que la barra se vea "urban" y elevada
          elevation: 10,
          shadowColor: MyTheme.primary,
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        // Aplicamos Inter a las etiquetas de la barra inferior
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      {/* Puedes agregar más pestañas como 'Cart' o 'Profile' aquí */}
    </Tabs>
  );
}