
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, User } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
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
