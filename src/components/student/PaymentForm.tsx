import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface PaymentFormProps {
  sessionId: any;
  amount: any;
  onPaymentComplete: any;
}

const PaymentForm = ({ sessionId, amount, onPaymentComplete }: PaymentFormProps) => {
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      // Simulate a successful payment process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Payment Successful!",
        description: `Payment for session ${sessionId} was successful.`,
      });

      onPaymentComplete();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground mb-4">
          Complete your payment to confirm the session.
        </p>
        <div className="mb-4">
          <p className="text-lg font-semibold">Amount: ${amount}</p>
        </div>
        <Button onClick={handlePayment}>
          Complete Payment
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
