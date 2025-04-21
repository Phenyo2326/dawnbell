
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        toast.error('Login failed', {
          description: authError.message
        });
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error('Login failed', {
          description: 'User not found'
        });
        setLoading(false);
        return;
      }

      // Fetch user profile to check if the selected role matches
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        toast.error('Error fetching user profile', {
          description: profileError.message
        });
        // Sign out the user since profile fetch failed
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (!profileData) {
        // Profile not found - we need to create one based on auth metadata
        const { data: userData } = await supabase.auth.getUser();
        const userMeta = userData?.user?.user_metadata;
        
        if (userMeta) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: authData.user.id,
              full_name: userMeta.full_name || 'User',
              role: role
            });
            
          if (insertError) {
            toast.error('Failed to create profile', {
              description: insertError.message
            });
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }
        } else {
          toast.error('Cannot create profile without user data');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
      } else if (profileData.role !== role) {
        // Profile exists but role doesn't match
        toast.error('Invalid role selected', {
          description: 'Please select the correct role for your account'
        });
        // Sign out the user since role doesn't match
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      toast.success('Welcome back', {
        description: `Logged in as ${profileData?.full_name || 'User'}`
      });
      
      // Redirect based on role
      if (role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/tutor-dashboard');
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast.error('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center gradient-text">
          Log In to Dawnbell Academy
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-3">
            <Label>I am a:</Label>
            <RadioGroup
              value={role}
              onValueChange={setRole}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tutor" id="tutor" />
                <Label htmlFor="tutor">Tutor</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <label htmlFor="email" className="block mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
        <div className="text-center mt-4">
          <p>
            Don't have an account? {' '}
            <Link 
              to="/signup" 
              className="text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
