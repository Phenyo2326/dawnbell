
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ChatInterface from '../chat/ChatInterface';

const EnrolledCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<{ id: string; full_name: string } | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          subjects(
            id,
            name,
            description,
            tutor_id,
            profiles!subjects_tutor_id_fkey(id, full_name)
          )
        `)
        .eq('student_id', user.id);

      if (!error && data) {
        const uniqueCourses = Array.from(
          new Map(
            data
              .map(session => session.subjects)
              .filter(Boolean)
              .map(subject => [subject.id, subject])
          ).values()
        );
        
        setCourses(uniqueCourses);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [user]);

  if (selectedTutor) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setSelectedTutor(null)}
          className="mb-4"
        >
          Back to Courses
        </Button>
        <ChatInterface 
          recipientId={selectedTutor.id}
          recipientName={selectedTutor.full_name}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">My Courses</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length > 0 ? (
          <div className="space-y-4">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedTutor({ 
                  id: course.profiles.id, 
                  full_name: course.profiles.full_name 
                })}
              >
                <p className="font-medium">{course.name}</p>
                <p className="text-sm text-gray-600">
                  Tutor: {course.profiles.full_name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {course.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No enrolled courses yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EnrolledCourses;
