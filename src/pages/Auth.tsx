import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNavigate, useLocation } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success('Logged in successfully');
        navigate(from, { replace: true });
      } else {
        // Sign Up
        console.log('Starting signup process...');
        
        // First check if email already exists in users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .single();

        if (existingUser) {
          throw new Error('An account with this email already exists');
        }

        // Create auth user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          console.error('Signup error:', signUpError);
          throw signUpError;
        }

        if (!authData?.user?.id) {
          throw new Error('Failed to create user account: No user ID received');
        }

        console.log('Auth signup successful:', authData);

        // Create user record in the database
        const { error: dbError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email,
              role: 'user',
              name: email.split('@')[0], // Default name from email
              phone: null,
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (dbError) {
          // If database insert fails, we should clean up the auth user
          await supabase.auth.signOut();
          console.error('Database error details:', dbError);
          throw new Error(
            dbError.code === '23505' 
              ? 'An account with this email already exists' 
              : `Failed to create user account: ${dbError.message}`
          );
        }
        
        toast.success('Account created successfully. Please check your email to confirm.');
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Full error object:', error);
      const errorMessage = error.message || error.error_description || error.details || 'An error occurred during authentication';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">{isLogin ? 'Login' : 'Sign Up'}</h1>
      
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            disabled={isLoading}
          />
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            disabled={isLoading}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
        </Button>
        
        <div className="text-center mt-4">
          <Button 
            type="button" 
            variant="link" 
            onClick={() => setIsLogin(!isLogin)}
            disabled={isLoading}
          >
            {isLogin 
              ? 'Need an account? Sign Up' 
              : 'Already have an account? Login'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
