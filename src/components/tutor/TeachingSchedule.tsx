
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Check, X, Calendar, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const TeachingSchedule = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  const fetchSessions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        profiles!sessions_student_id_fkey(full_name),
        subjects(name)
      `)
      .eq('tutor_id', user.id)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(10);

    if (!error && data) {
      setSessions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const handleSessionResponse = async (sessionId: string, accept: boolean) => {
    setUpdating(sessionId);
    try {
      const newStatus = accept ? 'confirmed' : 'cancelled';
      
      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus })
        .eq('id', sessionId);
        
      if (error) throw error;
      
      toast({
        title: accept ? "Session Confirmed" : "Session Declined",
        description: accept 
          ? "You have accepted this tutoring request" 
          : "You have declined this tutoring request",
      });
      
      // Refresh sessions list
      fetchSessions();
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error updating the session status."
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleCompleteSession = (session: any) => {
    setSelectedSession(session);
    setShowFeedbackDialog(true);
  };

  const submitFeedback = async () => {
    if (!selectedSession) return;
    
    setUpdating(selectedSession.id);
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          tutor_feedback: feedback 
        })
        .eq('id', selectedSession.id);
        
      if (error) throw error;
      
      toast({
        title: "Session Completed",
        description: "Feedback has been submitted and the session marked as complete.",
      });
      
      // Close dialog and reset
      setShowFeedbackDialog(false);
      setFeedback('');
      setSelectedSession(null);
      
      // Refresh sessions list
      fetchSessions();
    } catch (error) {
      console.error('Error completing session:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error completing the session."
      });
    } finally {
      setUpdating(null);
    }
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

  // Check if session is happening now (within an hour of start time and not yet completed)
  const isSessionActive = (session: any) => {
    const sessionStart = new Date(session.start_time);
    const sessionEnd = new Date(session.end_time);
    const now = new Date();
    
    // Session is happening now if current time is between start and end times
    // or within 15 minutes of start time
    const isNearStartTime = sessionStart.getTime() - now.getTime() < 15 * 60 * 1000;
    const isOngoing = now >= sessionStart && now <= sessionEnd;
    
    return (isNearStartTime || isOngoing) && session.status === 'confirmed';
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
            <p>Loading schedule...</p>
          ) : sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{session.subjects?.name || "Subject Not Available"}</p>
                      <p className="text-sm text-gray-600">
                        with {session.profiles?.full_name || "Unknown Student"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(session.start_time), 'PPP')} at {format(new Date(session.start_time), 'p')}
                      </p>
                      <div className="mt-1">
                        {getStatusBadge(session.status)}
                        {session.payment_status === 'paid' && (
                          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Paid
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {session.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-green-50 hover:bg-green-100"
                          disabled={updating === session.id}
                          onClick={() => handleSessionResponse(session.id, true)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-red-50 hover:bg-red-100"
                          disabled={updating === session.id}
                          onClick={() => handleSessionResponse(session.id, false)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                    
                    {isSessionActive(session) && (
                      <Button 
                        size="sm"
                        onClick={() => handleCompleteSession(session)}
                        disabled={updating === session.id}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Complete Session
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No upcoming sessions</p>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Session</DialogTitle>
            <DialogDescription>
              {selectedSession && (
                <p>
                  Provide feedback for your session with {selectedSession.profiles?.full_name} on {format(new Date(selectedSession.start_time), 'PPP')}
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-primary mr-2" />
                <p className="font-medium">Session Feedback</p>
              </div>
              <Textarea 
                placeholder="Write your feedback about the session. This will be visible to the student..." 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowFeedbackDialog(false);
                  setFeedback('');
                }}
                disabled={updating === selectedSession?.id}
              >
                Cancel
              </Button>
              <Button
                onClick={submitFeedback}
                disabled={updating === selectedSession?.id}
              >
                {updating === selectedSession?.id ? "Saving..." : "Complete Session"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeachingSchedule;
