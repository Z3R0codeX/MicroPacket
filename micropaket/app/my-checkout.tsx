import { useStripe } from '@stripe/stripe-react-native';
import { Button, Alert, ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '@/constants/config';

const MyCheckoutScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const fetchPaymentIntentParams = async () => {
    try {
      const token = await SecureStore.getItemAsync('user_token');
      const response = await fetch(`${BASE_URL}/orders/${orderId}/payment-intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el payment intent');
      }

      const data = await response.json();
      return {
        clientSecret: data.client_secret,
        paymentIntentId: data.payment_intent_id,
      };
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      throw error;
    }
  };

  const initializePaymentSheet = async () => {
    setLoading(true);
    try {
      const { clientSecret } = await fetchPaymentIntentParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'MicroPacket',
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        googlePay: {
          enabled: true,
        },
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      await presentPaymentSheet();
      Alert.alert('¡Éxito!', 'Tu pago ha sido confirmado.');
      router.back();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Button title="Pagar ahora" onPress={initializePaymentSheet} />;
};

export default MyCheckoutScreen;
