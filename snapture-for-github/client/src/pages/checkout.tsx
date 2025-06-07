import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ type, memoryId }: { type: string; memoryId?: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}?payment=success&type=${type}${memoryId ? `&memoryId=${memoryId}` : ''}`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: type === 'premium' ? "Welcome to Snapture Premium!" : "Memory unlocked!",
      });
      setLocation('/');
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Processing..." : `Pay ${type === 'premium' ? '€4.99' : '€0.99'}`}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [, setLocation] = useLocation();
  
  // Parse URL params
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get('type') || 'single';
  const memoryId = urlParams.get('memoryId');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const amount = type === 'premium' ? 499 : 99; // in cents
    
    apiRequest("POST", "/api/create-payment-intent", { 
      amount, 
      type,
      memoryId: memoryId ? parseInt(memoryId) : undefined 
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
        setLocation('/');
      });
  }, [type, memoryId, setLocation]);

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Snapture</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => {
              sessionStorage.setItem('returnedFromCheckout', 'true');
              setLocation('/');
            }}
            className="text-gray-600 mb-4"
          >
            ← Back to Memory
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {type === 'premium' ? 'Go Premium' : 'Unlock Memory'}
            </CardTitle>
            <div className="text-center text-gray-600">
              {type === 'premium' ? (
                <div>
                  <p className="text-2xl font-bold text-purple-600">€4.99/month</p>
                  <p className="text-sm">Unlimited HD memories, no watermarks</p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-blue-600">€0.99</p>
                  <p className="text-sm">Unlock this memory in HD</p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm type={type} memoryId={memoryId || undefined} />
            </Elements>
          </CardContent>
        </Card>

        {type === 'premium' && (
          <div className="mt-6 bg-white rounded-xl p-4">
            <h3 className="font-semibold mb-3 text-center">Premium Features</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Unlimited memories</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>HD downloads</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>No watermarks</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Memory history</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
