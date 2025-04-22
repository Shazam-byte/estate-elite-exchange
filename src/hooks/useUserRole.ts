import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Cache for role to prevent multiple checks
let roleCache: { 
  role: string | null, 
  email: string | null 
} | null = null;

export function useUserRole() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAgent, setIsAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          setIsAgent(false);
          setIsLoading(false);
          return;
        }

        // If we already checked this user's role, use the cached result
        if (roleCache && roleCache.email === user.email) {
          console.log('Using cached role:', roleCache.role);
          setIsAdmin(roleCache.role === 'admin');
          setIsAgent(roleCache.role === 'agent');
          setIsLoading(false);
          return;
        }

        // Check if admin directly
        if (user.email === 'admin@example.com') {
          console.log('Admin user detected - setting role');
          setIsAdmin(true);
          setIsAgent(false);
          
          // Cache the result
          roleCache = { role: 'admin', email: user.email };
          setIsLoading(false);
          return;
        }

        // Otherwise query the database
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        const role = data?.role || null;
        
        // Cache the result
        roleCache = { role, email: user.email };
        
        setIsAdmin(role === 'admin');
        setIsAgent(role === 'agent');
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking role:', error);
        setIsAdmin(false);
        setIsAgent(false);
        setIsLoading(false);
      }
    };

    checkRole();
  }, []);

  return { isAdmin, isAgent, isLoading };
} 