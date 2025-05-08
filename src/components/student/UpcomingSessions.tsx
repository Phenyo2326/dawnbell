
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const UpcomingSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
                  {format(new Date(session.start_time), 'PPp')}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    {getStatusBadge(session.status)}
                  </div>
                  {session.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleCancelSession(session.id)}
                    >
                      Cancel
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
  );
};

export default UpcomingSessions;
