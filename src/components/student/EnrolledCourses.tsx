
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const EnrolledCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      
      // Using a different approach to get distinct courses
      // First, get all sessions for this student
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          subjects(
            id,
            name,
            description,
            profiles!subjects_tutor_id_fkey(full_name)
          )
        `)
        .eq('student_id', user.id);

      if (!error && data) {
        // Extract the subjects and remove duplicates by id
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
            {courses.map((course, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
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
