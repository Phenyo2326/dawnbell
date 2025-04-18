
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Calendar, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  role: 'student' | 'tutor';
  full_name: string;
}

const TutorDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role, full_name')
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

      setProfile(data as Profile);
    };

    getProfile();
  }, [user, navigate]);

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View and manage your students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Teaching Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage your teaching sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Communicate with your students</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
