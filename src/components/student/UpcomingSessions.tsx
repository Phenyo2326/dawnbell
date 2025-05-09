
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, CreditCard, X, CheckCircle, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PaymentForm from './PaymentForm';

const UpcomingSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const { toast } = useToast();

  const fetchSessions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        subjects(name),
        profiles!sessions_tutor_id_fkey(full_name)
      `)
      .eq('student_id', user.id)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Error fetching sessions:', error);
    }
    
    if (data) {
      console.log('Fetched sessions:', data);
      setSessions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const handleCancelSession = async (sessionId: string) => {
    const { error } = await supabase
      .from('sessions')
      .update({ status: 'cancelled' })
      .eq('id', sessionId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: "There was an error cancelling your session."
      });
      return;
    }

    toast({
      title: "Session Cancelled",
      description: "Your tutoring session has been cancelled."
    });

    // Refresh sessions
    fetchSessions();
  };

  const handlePaymentRequest = (session: any) => {
    setSelectedSession(session);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentDialog(false);
    setSelectedSession(null);
    fetchSessions();
  };

  const handleViewFeedback = (session: any) => {
    setSelectedSession(session);
    setShowFeedbackDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
      case 'confirmed':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Confirmed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Cancelled</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Completed</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Paid</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Payment Required</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading sessions...</p>
          ) : sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="p-4 bg-gray-50 rounded-lg border">
                  <p className="font-medium">
                    {session.subjects?.name || "Subject Not Available"}
                  </p>
                  <p className="text-sm text-gray-600">
                    with {session.profiles?.full_name || "Unknown Tutor"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(session.start_time), 'PPP')} at {format(new Date(session.start_time), 'p')}
                  </p>
                  <div className="flex items-center mt-2 gap-2">
                    <div>
                      {getStatusBadge(session.status)}
                    </div>
                    {session.payment_status && (
                      <div>{getPaymentBadge(session.payment_status)}</div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      {session.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleCancelSession(session.id)}
                        >
                          <X className="h-3 w-3 mr-1" /> Cancel
                        </Button>
                      )}
                      
                      {session.status === 'confirmed' && session.payment_status === 'pending' && (
                        <Button 
                          size="sm" 
                          className="text-xs bg-green-500 hover:bg-green-600"
                          onClick={() => handlePaymentRequest(session)}
                        >
                          <CreditCard className="h-3 w-3 mr-1" /> Pay Now
                        </Button>
                      )}
                      
                      {session.status === 'completed' && session.tutor_feedback && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleViewFeedback(session)}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" /> View Feedback
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No upcoming sessions</p>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <PaymentForm 
              sessionId={selectedSession.id} 
              amount={25} // In a real app, this would come from the session or subject data
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPaymentDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tutor Feedback</DialogTitle>
          </DialogHeader>
          {selectedSession && selectedSession.tutor_feedback && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium mb-1">Feedback from {selectedSession.profiles?.full_name}</p>
                  <p className="text-sm">{selectedSession.tutor_feedback}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Completed on {selectedSession.completed_at ? format(new Date(selectedSession.completed_at), 'PPP') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpcomingSessions;
