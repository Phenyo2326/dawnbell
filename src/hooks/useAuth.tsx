
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event);
      
      // Update session and user state
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in successfully');
        toast.success('Signed in successfully');
      }
      
      setLoading(false);
    });

    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession) {
          console.log('Existing session found for:', currentSession.user.email);
          
          // Force a token refresh if the session exists but might be close to expiring
          if (currentSession.expires_at) {
            const expiresAt = new Date(currentSession.expires_at * 1000);
            const now = new Date();
            const timeUntilExpiry = expiresAt.getTime() - now.getTime();
            
            // If token expires in less than 10 minutes, refresh it
            if (timeUntilExpiry < 600000) {
              console.log('Token close to expiry, refreshing...');
              const { data, error } = await supabase.auth.refreshSession();
              
              if (error) {
                console.error('Error refreshing token:', error);
                // Don't logout automatically, just log the error
              } else if (data.session) {
                console.log('Session refreshed successfully');
                setSession(data.session);
                setUser(data.session.user);
              }
            }
          }
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Error signing out', { 
          description: error.message 
        });
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      toast.error('An unexpected error occurred while signing out');
    }
  };

  return { user, session, loading, signOut };
};
