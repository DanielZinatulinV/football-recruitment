import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Payment() {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Плейсхолдер: здесь должен быть реальный запрос к backend
    setTimeout(() => {
      setClientSecret(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    }, 500);
  }, []);

  if (!clientSecret) return <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">Loading payment...</div>;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-extrabold text-black mb-6 text-center uppercase">Payment</h1>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm />
        </Elements>
      </div>
    </div>
  );
} 