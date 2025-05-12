
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log(`Attempting to login with email: ${email}, role: ${role}`);
      
      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Auth error:', authError);
        toast.error('Login failed', {
          description: authError.message
        });
        setError(`Authentication failed: ${authError.message}`);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        console.error('No user data returned');
        toast.error('Login failed', {
          description: 'User not found'
        });
        setError('User not found after authentication');
        setLoading(false);
        return;
      }

      console.log('User authenticated successfully:', authData.user.id);

      // Fetch user profile to check if the selected role matches
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile error:', profileError);
        toast.error('Error fetching user profile', {
          description: profileError.message
        });
        // Sign out the user since profile fetch failed
        await supabase.auth.signOut();
        setError(`Error fetching profile: ${profileError.message}`);
        setLoading(false);
        return;
      }

      if (!profileData) {
        console.error('No profile found for user');
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
            console.error('Profile creation error:', insertError);
            toast.error('Failed to create profile', {
              description: insertError.message
            });
            await supabase.auth.signOut();
            setError(`Failed to create user profile: ${insertError.message}`);
            setLoading(false);
            return;
          }
        } else {
          console.error('Missing user metadata');
          toast.error('Cannot create profile without user data');
          await supabase.auth.signOut();
          setError('User data is incomplete, cannot create profile');
          setLoading(false);
          return;
        }
      } else if (profileData.role !== role) {
        // Profile exists but role doesn't match
        console.error(`Role mismatch: selected ${role}, profile has ${profileData.role}`);
        toast.error('Invalid role selected', {
          description: 'Please select the correct role for your account'
        });
        // Sign out the user since role doesn't match
        await supabase.auth.signOut();
        setError(`You selected "${role}" but this account is registered as a "${profileData.role}". Please select the correct role.`);
        setLoading(false);
        return;
      }

      console.log('Login successful, redirecting to dashboard');
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
      setError('An unexpected error occurred during login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center gradient-text">
          Log In to Dawnbell Academy
        </h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-800">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

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
            <label htmlFor="email" className="block mb-2">Username/Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your username or email"
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
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 border border-blue-200 rounded-md p-3 bg-blue-50">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Accounts</h3>
            <div className="space-y-2 text-xs text-blue-700">
              <p className="font-medium">Tutor accounts:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>marang.ngewa@dawnbell.edu / Dawnbell2023!</li>
                <li>katlego.darula@dawnbell.edu / Dawnbell2023!</li>
                <li>priya.patel@dawnbell.edu / Dawnbell2023!</li>
                <li>gift.tshekiso@dawnbell.edu / Dawnbell2023!</li>
              </ul>
            </div>
          </div>
        )}
        
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
