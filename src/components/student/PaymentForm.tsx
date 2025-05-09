import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CreditCard, CheckCircle } from 'lucide-react';

// Note: Replaced PaypalLogo with a text-based PayPal option as the icon isn't available

const PaymentForm = ({ sessionId, amount, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to continue."
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing (replace with actual payment gateway integration)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update session payment status in Supabase
      const { data, error } = await supabase
        .from('sessions')
        .update({ payment_status: 'completed' })
        .eq('id', sessionId);

      if (error) {
        console.error("Payment update error:", error);
        throw error;
      }

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully."
      });
      setIsComplete(true);
      onPaymentComplete();
    } catch (error) {
      console.error("Payment processing error:", error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Complete your payment to confirm the session booking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isComplete ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-medium">Payment Successful!</h3>
            <p className="text-muted-foreground mt-2">
              Your session has been confirmed. You can now close this window.
            </p>
          </div>
        ) : (
          <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Credit Card
              </TabsTrigger>
              <TabsTrigger value="paypal" className="flex items-center gap-2">
                {/* Text-based PayPal option instead of icon */}
                <span className="font-bold text-blue-600">Pay</span>
                <span className="font-bold text-blue-800">Pal</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="card" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="Enter your card number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input
                  id="card-name"
                  placeholder="Enter your name as it appears on the card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input
                    id="expiry-date"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="paypal">
              <p className="text-muted-foreground">
                You will be redirected to PayPal to complete your payment securely.
              </p>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter>
        {!isComplete && (
          <Button 
            className="w-full" 
            onClick={handlePayment}
            disabled={isProcessing || (paymentMethod === 'card' && (!cardNumber || !cardName || !expiryDate || !cvc))}
          >
            {isProcessing ? "Processing..." : `Pay $${amount}`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
