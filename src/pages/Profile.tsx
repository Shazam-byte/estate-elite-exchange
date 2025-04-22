import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/components/UserProfile";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
import { useState } from "react";
import { useUserRole } from "@/hooks/useUserRole";

const Profile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { isAgent, isAdmin, isLoading } = useUserRole();

  const makeAgent = async () => {
    try {
      setIsUpdating(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to become an agent");
        return;
      }

      // Update role in users table
      const { error } = await supabase
        .from('users')
        .update({ role: 'agent' })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("You are now an agent! Please refresh the page.");

      // Force reload to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error("Failed to update role. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UserProfile />
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your communication preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure when and how you'd like to be notified about new properties, price changes, and more.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Configure Notifications</Button>
            </CardFooter>
          </Card>

          {/* Only show Become an Agent card if user is not an agent, not an admin, and not loading */}
          {!isLoading && !isAgent && !isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Become an Agent</CardTitle>
                <CardDescription>Start listing properties on Estate Elite</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  As an agent, you can list properties, manage your listings, and connect with potential buyers.
                </p>
                <Button 
                  onClick={makeAgent} 
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Become an Agent"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
