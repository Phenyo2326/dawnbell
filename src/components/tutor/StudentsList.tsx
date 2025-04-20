import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ChatInterface from '../chat/ChatInterface';
import { Button } from '@/components/ui/button';

const StudentsList = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; full_name: string } | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('sessions')
        .select('profiles!sessions_student_id_fkey(id, full_name, avatar_url)')
        .eq('tutor_id', user.id);

      if (!error && data) {
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

  if (selectedStudent) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setSelectedStudent(null)}
          className="mb-4"
        >
          Back to Students List
        </Button>
        <ChatInterface 
          recipientId={selectedStudent.id}
          recipientName={selectedStudent.full_name}
        />
      </div>
    );
  }

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
            {students.map((student) => (
              <div 
                key={student.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedStudent({ id: student.id, full_name: student.full_name })}
              >
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
