import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Плейсхолдер: здесь будет реальная логика stripe.confirmCardPayment
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  if (success) {
    return <div className="text-center text-green-600 font-bold text-lg">Payment successful! 🎉</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-black font-semibold mb-2">Card details</label>
        <div className="rounded-lg border-2 border-yellow-300 p-3 bg-neutral-100">
          <CardElement options={{ style: { base: { fontSize: '18px', color: '#222' } } }} />
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" disabled={!stripe || loading} className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-lg px-6 py-3 flex items-center justify-center transition disabled:opacity-50">
        {loading ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
} 