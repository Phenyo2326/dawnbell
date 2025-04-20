
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

const TeachingSchedule = () => {
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
          profiles!sessions_student_id_fkey(full_name),
          subjects(name)
        `)
        .eq('tutor_id', user.id)
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
              <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{session.subjects.name}</p>
                <p className="text-sm text-gray-600">
                  with {session.profiles.full_name}
                </p>
                <p className="text-sm text-gray-600">
                  {format(new Date(session.start_time), 'PPp')}
                </p>
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
