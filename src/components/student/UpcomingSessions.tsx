import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PaymentForm from "./PaymentForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UpcomingSessions = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          tutors:tutor_id (
            name,
            avatar
          ),
          subjects:subject_id (
            name
          )
        `)
        .eq('student_id', user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);
      
      if (error) {
        console.error('Error fetching sessions:', error);
      } else {
        setSessions(data || []);
      }
      setLoading(false);
    };

    fetchSessions();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePayment = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    setSelectedSession(session);
    setPaymentModalOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading your sessions...</p>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div 
                key={session.id} 
                className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session.tutors?.avatar} alt={session.tutors?.name} />
                  <AvatarFallback>{session.tutors?.name?.charAt(0) || 'T'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{session.tutors?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {session.subjects?.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>
                      {format(new Date(session.start_time), 'PPP')} at {format(new Date(session.start_time), 'p')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(session.status)}
                  {session.payment_status === 'pending' && session.status === 'confirmed' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePayment(session.id)}
                      className="gap-1"
                    >
                      <DollarSign className="h-3 w-3" />
                      Pay
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No upcoming sessions</p>
            <Button className="mt-2" variant="outline" onClick={() => window.location.href = '#tutors-section'}>
              Find a Tutor
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent>
          {selectedSession && (
            <PaymentForm 
              sessionId={selectedSession.id} 
              amount={99.99}
              onPaymentComplete={() => {
                // Update the session status
                const updatedSessions = sessions.map(s => 
                  s.id === selectedSession.id 
                    ? {...s, payment_status: 'paid'} 
                    : s
                );
                setSessions(updatedSessions);
                setPaymentModalOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UpcomingSessions;
