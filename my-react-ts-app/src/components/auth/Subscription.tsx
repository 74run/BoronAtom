
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

interface SubscriptionFormProps {
  priceId: string;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ priceId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment method
      const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (cardError) {
        throw new Error(cardError.message);
      }

      // Create subscription
      const response = await fetch('http://localhost:3001/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          priceId,
          customerId: 'CUSTOMER_ID', // You'll need to implement customer creation
        }),
      });

      const { subscriptionId, error: backendError } = await response.json();

      if (backendError) {
        throw new Error(backendError.message);
      }

      // Handle successful subscription
      console.log('Subscription created:', subscriptionId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Subscribe'}
      </button>
    </form>
  );
};

// Wrap the form with Stripe Elements
const SubscriptionFormWrapper: React.FC = () => (
  <Elements stripe={stripePromise}>
    <SubscriptionForm priceId="YOUR_PRICE_ID" />
  </Elements>
);

export default SubscriptionFormWrapper;