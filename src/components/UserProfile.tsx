import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface UserData {
  email: string;
  fullName: string;
}

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    email: "",
    fullName: ""
  });
  const [tempData, setTempData] = useState<UserData>(userData);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Get user data from the users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw profileError;
      }

      const userData = {
        email: user.email || "",
        fullName: userProfile?.name || ""
      };

      setUserData(userData);
      setTempData(userData);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try refreshing the page.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      try {
        setIsLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) throw new Error('No authenticated user found');

        // Update email in auth if it changed
        if (tempData.email !== userData.email) {
          const { error: emailError } = await supabase.auth.updateUser({
            email: tempData.email
          });
          if (emailError) throw emailError;
        }

        // Update name in users table
        const { error: updateError } = await supabase
          .from('users')
          .update({ name: tempData.fullName })
          .eq('id', user.id);

        if (updateError) throw updateError;

        setUserData(tempData);
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
      } catch (error) {
        console.error('Error updating user data:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        });
        // Revert changes
        setTempData(userData);
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setTempData(userData);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <p className="text-center">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Account Information</CardTitle>
        <p className="text-muted-foreground">Manage your personal information</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          {isEditing ? (
            <Input
              type="email"
              value={tempData.email}
              onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
              disabled={isLoading}
            />
          ) : (
            <p className="text-lg">{userData.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          {isEditing ? (
            <Input
              type="text"
              value={tempData.fullName}
              onChange={(e) => setTempData({ ...tempData, fullName: e.target.value })}
              disabled={isLoading}
            />
          ) : (
            <p className="text-lg">{userData.fullName || "Not set"}</p>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleEdit} disabled={isLoading}>
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
          {isEditing && (
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 