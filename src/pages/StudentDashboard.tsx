
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import EnrolledCourses from '@/components/student/EnrolledCourses';
import UpcomingSessions from '@/components/student/UpcomingSessions';
import TutorGrid from '@/components/TutorGrid';
import SubjectsExplorer from '@/components/SubjectsExplorer';
import StudyMaterialsList from '@/components/student/StudyMaterialsList';
import TutorsList from '@/components/TutorsList';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Book } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tutors' | 'materials' | 'accounts'>('tutors');

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
    setActiveTab('tutors');
    // Auto-scroll to tutors section
    const tutorsSection = document.getElementById('tutors-section');
    if (tutorsSection) {
      tutorsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isDevelopment = process.env.NODE_ENV === 'development';

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

        {isDevelopment && (
          <Card className="mb-6 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Development Environment Detected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-2">
                All tutors have been created in the Supabase database and can be accessed with these credentials:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800">
                <li>marang.ngewa@dawnbell.edu / Dawnbell2023!</li>
                <li>katlego.darula@dawnbell.edu / Dawnbell2023!</li>
                <li>priya.patel@dawnbell.edu / Dawnbell2023!</li>
                <li>david.wilson@dawnbell.edu / Dawnbell2023!</li>
                <li>jasmine.williams@dawnbell.edu / Dawnbell2023!</li>
                <li>gift.tshekiso@dawnbell.edu / Dawnbell2023!</li>
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <UpcomingSessions />
          </div>
          <div>
            <SubjectsExplorer onSubjectSelect={handleSubjectSelect} />
          </div>
        </div>
        
        {/* Study Materials Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Study Materials</h2>
          <StudyMaterialsList />
        </div>
        
        {/* Tabs for booking tutors or accessing materials */}
        <div id="tutors-section" className="mt-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <Button 
              variant={activeTab === 'tutors' ? 'default' : 'outline'}
              onClick={() => setActiveTab('tutors')}
              className="gap-2"
            >
              Find Tutors
            </Button>
            <Button 
              variant={activeTab === 'materials' ? 'default' : 'outline'}
              onClick={() => setActiveTab('materials')}
              className="gap-2"
            >
              <Book className="h-4 w-4" />
              Resources
            </Button>
            {isDevelopment && (
              <Button 
                variant={activeTab === 'accounts' ? 'default' : 'outline'}
                onClick={() => setActiveTab('accounts')}
                className="gap-2"
              >
                Tutor Accounts
              </Button>
            )}
          </div>
          
          {activeTab === 'tutors' && (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                {selectedSubject ? `Tutors for ${selectedSubject}` : 'Find and Book Tutors'}
              </h2>
              <TutorGrid initialSubject={selectedSubject} />
            </>
          )}

          {activeTab === 'materials' && (
            <StudyMaterialsList />
          )}

          {activeTab === 'accounts' && isDevelopment && (
            <TutorsList />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
