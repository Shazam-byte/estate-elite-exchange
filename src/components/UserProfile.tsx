import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

interface UserData {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    id: "",
    email: "",
    fullName: "",
    role: ""
  });
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Authentication error');
      }
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Get user data from the users table
      const { data, error: profileError } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw profileError;
      }

      // If no profile exists, create one
      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email,
              name: '',
              role: 'user'
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          throw createError;
        }

        const newUserData = {
          id: newProfile.id,
          email: newProfile.email,
          fullName: newProfile.name || "",
          role: newProfile.role
        };
        setUserData(newUserData);
        setTempName(newUserData.fullName);
      } else {
        const existingUserData = {
          id: data.id,
          email: data.email,
          fullName: data.name || "",
          role: data.role
        };
        setUserData(existingUserData);
        setTempName(existingUserData.fullName);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error("Failed to load user data. Please try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (isEditing && tempName.trim() !== userData.fullName) {
      try {
        setIsLoading(true);

        if (!userData.id) {
          throw new Error('User ID not found');
        }

        // Update name in users table
        const { data, error: updateError } = await supabase
          .from('users')
          .update({ 
            name: tempName.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', userData.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating name:', updateError);
          throw updateError;
        }

        if (!data) {
          throw new Error('Failed to update name');
        }

        // Update local state with the confirmed data from the server
        setUserData({
          ...userData,
          fullName: data.name || ""
        });

        toast.success("Name updated successfully");
        setIsEditing(false);
      } catch (error: any) {
        console.error('Error updating name:', error);
        toast.error(error.message || "Failed to update name. Please try again.");
        // Revert changes
        setTempName(userData.fullName);
      } finally {
        setIsLoading(false);
      }
    } else if (!isEditing) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setTempName(userData.fullName);
    }
  };

  const handleCancel = () => {
    setTempName(userData.fullName);
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
          <p className="text-lg">{userData.email}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          {isEditing ? (
            <Input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your full name"
            />
          ) : (
            <p className="text-lg">{userData.fullName || "Not set"}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <p className="text-lg capitalize">{userData.role}</p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleEdit} 
            disabled={isLoading || (isEditing && !tempName.trim())}
          >
            {isEditing ? "Save Name" : "Edit Name"}
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