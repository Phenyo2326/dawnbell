
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ChatInterface from '../chat/ChatInterface';
import { Button } from '@/components/ui/button';

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

// Supabase response can be an error or a valid profile
type ProfileResponse = Profile | null;

interface SessionWithProfile {
  student_id: string;
  profiles: ProfileResponse;
}

const StudentsList = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; full_name: string } | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return;
      
      try {
        // Fetch sessions where this tutor is assigned
        const { data, error } = await supabase
          .from('sessions')
          .select(`
            student_id,
            profiles:student_id(
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('tutor_id', user.id);

        if (error) {
          console.error('Error fetching students:', error);
          return;
        }

        if (data) {
          // Filter out sessions where profiles is null or an error
          const validProfiles: Profile[] = [];
          
          // Safely extract valid profiles
          data.forEach((session: any) => {
            // Check if profiles exists and has the expected structure
            if (session.profiles && typeof session.profiles === 'object' && 'id' in session.profiles) {
              validProfiles.push(session.profiles as Profile);
            }
          });
          
          // Remove duplicates by creating a Map with profile id as key
          const uniqueStudents = Array.from(
            new Map(
              validProfiles.map(profile => [profile.id, profile])
            ).values()
          );
          
          setStudents(uniqueStudents);
        }
      } catch (error) {
        console.error('Error in fetchStudents:', error);
      } finally {
        setLoading(false);
      }
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
