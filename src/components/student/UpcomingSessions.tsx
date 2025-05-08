
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

const UpcomingSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

      if (!error && data) {
        setSessions(data);
      }
      setLoading(false);
    };

    fetchSessions();
  }, [user]);

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
