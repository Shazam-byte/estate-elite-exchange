
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, User, LogIn } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export function Layout({ 
  children, 
  session 
}: { 
  children: React.ReactNode, 
  session: Session | null 
}) {
  const location = useLocation();
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error logging out');
    } else {
      toast.success('Logged out successfully');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-30 bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span>Estate Elite</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              to="/search" 
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Search className="h-5 w-5" />
              <span className="hidden md:inline">Search</span>
            </Link>
            
            {session ? (
              <>
                <Link 
                  to="/favorites" 
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span className="hidden md:inline">Favorites</span>
                </Link>
                <Link 
                  to="/profile"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">Profile</span>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="hover:text-destructive"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link 
                to="/auth"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <LogIn className="h-5 w-5" />
                <span className="hidden md:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-6 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Estate Elite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
