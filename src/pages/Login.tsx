
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error('Login failed', {
        description: error.message
      });
      setLoading(false);
      return;
    }

    // Fetch the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('User not found');
      setLoading(false);
      return;
    }

    // Fetch user profile to determine which dashboard to redirect to
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle(); // Using maybeSingle() instead of single() to avoid errors

    if (profileError) {
      toast.error('Error fetching user profile', {
        description: profileError.message
      });
      setLoading(false);
      return;
    }

    if (!profileData) {
      toast.error('Profile not found', {
        description: 'Your user account might not have a complete profile'
      });
      setLoading(false);
      return;
    }

    toast.success('Successfully logged in');
    
    // Redirect based on user role
    if (profileData.role === 'student') {
      navigate('/student-dashboard');
    } else if (profileData.role === 'tutor') {
      navigate('/tutor-dashboard');
    } else {
      toast.error('Invalid user role');
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
