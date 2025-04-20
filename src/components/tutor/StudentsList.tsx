
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const StudentsList = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return;
      
      // Using a different approach to get distinct students
      // First, get all sessions for this tutor
      const { data, error } = await supabase
        .from('sessions')
        .select('profiles!sessions_student_id_fkey(full_name, avatar_url, id)')
        .eq('tutor_id', user.id);

      if (!error && data) {
        // Extract the profiles and remove duplicates by id
        const uniqueStudents = Array.from(
          new Map(
            data
              .map(session => session.profiles)
              .filter(Boolean)
              .map(profile => [profile.id, profile])
          ).values()
        );
        
        setStudents(uniqueStudents);
      }
      setLoading(false);
    };

    fetchStudents();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">My Students</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading students...</p>
        ) : students.length > 0 ? (
          <div className="space-y-4">
            {students.map((student, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div>
                  <p className="font-medium">{student.full_name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No students yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentsList;
