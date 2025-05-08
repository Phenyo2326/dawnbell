
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TeachingSchedule = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Upcoming Sessions</CardTitle>
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
                    <p className="font-medium">{session.subjects.name}</p>
                    <p className="text-sm text-gray-600">
                      with {session.profiles.full_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(session.start_time), 'PPp')}
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(session.status)}
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No upcoming sessions</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TeachingSchedule;
