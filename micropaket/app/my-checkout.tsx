import { useStripe } from '@stripe/stripe-react-native';
import { Button, Alert } from 'react-native';

const MyCheckoutScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const fetchPaymentSheetParams = async () => {
    // Llamada a tu backend
    const response = await fetch('https://tu-api.com/payment-sheet', { method: 'POST' });
    const { paymentIntent, customer } = await response.json();
    return { paymentIntent, customer };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Tu Negocio',
      paymentIntentClientSecret: paymentIntent,
      customerId: customer,
      allowsDelayedPaymentMethods: true,
    });

    if (!error) {
      const { error: paymentError } = await presentPaymentSheet();
      if (paymentError) Alert.alert(`Error: ${paymentError.code}`, paymentError.message);
      else Alert.alert('¡Éxito!', 'Tu pago ha sido confirmado.');
    }
  };

  return <Button title="Pagar ahora" onPress={initializePaymentSheet} />;
};

export default MyCheckoutScreen;
