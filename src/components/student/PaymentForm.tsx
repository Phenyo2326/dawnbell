
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, PaypalLogo } from 'lucide-react';

interface PaymentFormProps {
  sessionId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm = ({ sessionId, amount, onSuccess, onCancel }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiration: '',
    cvc: '',
    name: '',
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // In a real application, you would integrate with a payment processor here
      // This is a simplified mock implementation
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase
        .from('payments')
        .insert({
          session_id: sessionId,
          student_id: userData.user.id,
          amount: amount,
          currency: 'USD',
          payment_method: paymentMethod,
          payment_status: 'paid',
          transaction_id: 'mock-' + Math.random().toString(36).substring(2, 15)
        });

      if (error) throw error;

      // Update session payment status
      await supabase
        .from('sessions')
        .update({ payment_status: 'paid' })
        .eq('id', sessionId);

      toast({
        title: "Payment Successful",
        description: `Your payment of $${amount} has been processed successfully.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was a problem processing your payment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>Select your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as 'card' | 'paypal')}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" /> Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.146-.043.29-.067.433-.023.143-.05.288-.073.437-.51 3.323-2.688 5.73-6.13 6.86a12.11 12.11 0 0 1-2.573.508c-2.574.283-4.053.5-5.288.832-1.95.526-2.253 1.457-2.564 3.894-.032.244-.087.484-.161.708a.932.932 0 0 1-.229.467"></path>
                    <path d="M23.923 7.64c.573 3.26-1.492 7.086-5.409 9.259a13.25 13.25 0 0 1-5.356 1.62c-.068.007-.139.013-.209.02-2.22.22-4.556-.255-6.07-1.413-1.916-1.465-2.287-3.855-1.38-7.17a.732.732 0 0 1 .717-.563h4.8c.235 0 .438.167.48.398.144.825.53 1.4 1.262 1.86.72.452 1.705.573 2.87.325 1.336-.285 2.377-1.067 2.924-2.197.293-.605.4-1.195.513-1.686.258-1.113-.506-1.93-1.887-1.93H7.997a.734.734 0 0 1-.724-.62L7.051 4.89a.73.73 0 0 1 .72-.845h8.38c.297 0 .587.012.87.037 2.199.19 3.894 1.322 4.31 3.098.223.943.224 1.89-.407 2.969-.219.376-.504.693-.803 1.05-.214.255-.434.517-.654.835-.16.238-.164.558-.011.791.108.164.29.273.487.273h3.635a.5.5 0 0 1 .493.58l-.044.198z"></path>
                  </svg>
                  PayPal
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456" 
                    value={cardDetails.cardNumber}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiration">Expiration Date</Label>
                    <Input 
                      id="expiration" 
                      name="expiration"
                      placeholder="MM/YY" 
                      value={cardDetails.expiration}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input 
                      id="cvc" 
                      name="cvc"
                      placeholder="123" 
                      value={cardDetails.cvc}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Name on Card</Label>
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="John Smith" 
                    value={cardDetails.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p className="text-sm text-gray-600">You will be redirected to PayPal to complete your payment.</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-2xl font-bold mb-2">${amount.toFixed(2)}</p>
            <p className="text-gray-500 text-sm">Total payment amount</p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isProcessing}>
          {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
