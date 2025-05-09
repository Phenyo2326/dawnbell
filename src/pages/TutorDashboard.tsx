
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import StudentsList from '@/components/tutor/StudentsList';
import TeachingSchedule from '@/components/tutor/TeachingSchedule';
import { MessageSquare, Upload, Book } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import StudyMaterialUploader from '@/components/tutor/StudyMaterialUploader';

const TutorDashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'materials'>('schedule');
  const navigate = useNavigate();

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

      if (data.role !== 'tutor') {
        navigate('/student-dashboard');
        return;
      }

      setProfile(data);
    };

    const getSubjects = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name')
        .eq('tutor_id', user.id);

      if (error) {
        console.error('Error fetching subjects:', error);
        return;
      }

      setSubjects(data || []);
    };

    getProfile();
    getSubjects();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {profile?.full_name || 'Tutor'}</p>
          </div>
          <Button onClick={signOut} variant="outline">Sign Out</Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button 
            variant={activeTab === 'schedule' ? 'default' : 'outline'}
            onClick={() => setActiveTab('schedule')}
            className="gap-2"
          >
            <Book className="h-4 w-4" />
            Teaching Schedule
          </Button>
          <Button 
            variant={activeTab === 'materials' ? 'default' : 'outline'}
            onClick={() => setActiveTab('materials')}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Study Materials
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTab === 'schedule' && (
            <>
              <div className="md:col-span-2">
                <TeachingSchedule />
              </div>
              <div>
                <StudentsList />
              </div>
            </>
          )}
          
          {activeTab === 'materials' && (
            <>
              <div className="md:col-span-2">
                <StudyMaterialUploader subjects={subjects} />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-5 w-5" />
                      Materials Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <p>
                        Upload learning materials for your students to access. Materials will be available to any student enrolled in the subject.
                      </p>
                      <div>
                        <p className="font-medium">Tips for effective materials:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Use clear, descriptive titles</li>
                          <li>Add detailed descriptions</li>
                          <li>Organize content by topic</li>
                          <li>Use PDF format for documents</li>
                          <li>Keep videos under 100MB</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
        
        <div className="md:col-span-3 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Coming soon: Chat with your students</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
