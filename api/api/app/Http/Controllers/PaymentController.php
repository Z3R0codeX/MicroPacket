<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request, $orderId)
    {
        $user = Auth::user();

        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        if ($order->id_user !== $user->id_user) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($order->payment_status !== 'pending') {
            return response()->json(['error' => 'Order already paid or invalid status'], 400);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => (int)($order->price * 100),
                'currency' => 'mxn',
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                'metadata' => [
                    'order_id' => $order->id_order,
                ],
            ]);

            $order->update([
                'stripe_payment_intent_id' => $paymentIntent->id,
                'payment_status' => 'intent_created',
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
