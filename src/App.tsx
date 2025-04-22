import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Property from "./pages/Property";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AgentDashboard from "./pages/AgentDashboard";
import AddListing from "./pages/AddListing";
import AdminDashboard from "./pages/AdminDashboard";
import MyListings from "./pages/MyListings";
import AllAgents from './pages/AllAgents';
import PendingListings from './pages/PendingListings';
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  // Protect routes that require authentication
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session) {
      return <Navigate to="/auth" replace />;
    }
    return <>{children}</>;
  };

  // Protect agent routes
  const AgentRoute = ({ children }: { children: React.ReactNode }) => {
    const [isAgent, setIsAgent] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAgentRole = async () => {
        if (!session) {
          setIsLoading(false);
          return;
        }
        
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAgent(data?.role === 'agent');
        setIsLoading(false);
      };

      checkAgentRole();
    }, [session]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (!session || !isAgent) {
      return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
  };

  // Protect admin routes
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAdmin, isLoading } = useUserRole();

    if (!session) {
      return <Navigate to="/auth" replace />;
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout session={session}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/property/:id" element={<Property />} />
              <Route path="/search" element={<Search />} />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agent-dashboard" 
                element={
                  <AgentRoute>
                    <AgentDashboard />
                  </AgentRoute>
                } 
              />
              <Route 
                path="/add-listing" 
                element={
                  <AgentRoute>
                    <AddListing />
                  </AgentRoute>
                } 
              />
              <Route 
                path="/my-listings" 
                element={
                  <AgentRoute>
                    <MyListings />
                  </AgentRoute>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/all-agents" 
                element={<AllAgents />} 
              />
              <Route 
                path="/admin/pending-listings" 
                element={<PendingListings />} 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
