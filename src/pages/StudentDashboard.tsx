
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import EnrolledCourses from '@/components/student/EnrolledCourses';
import UpcomingSessions from '@/components/student/UpcomingSessions';
import TutorGrid from '@/components/TutorGrid';
import SubjectsExplorer from '@/components/SubjectsExplorer';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data.role !== 'student') {
        navigate('/tutor-dashboard');
        return;
      }

      setProfile(data);
    };

    getProfile();
  }, [user, navigate]);

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    // Auto-scroll to tutors section
    const tutorsSection = document.getElementById('tutors-section');
    if (tutorsSection) {
      tutorsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {profile?.full_name || 'Student'}</p>
          </div>
          <Button onClick={signOut} variant="outline">Sign Out</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <UpcomingSessions />
          </div>
          <div>
            <SubjectsExplorer onSubjectSelect={handleSubjectSelect} />
          </div>
        </div>
        
        {/* Add Tutor Grid for booking sessions */}
        <div id="tutors-section" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedSubject ? `Tutors for ${selectedSubject}` : 'Find and Book Tutors'}
          </h2>
          <TutorGrid initialSubject={selectedSubject} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
