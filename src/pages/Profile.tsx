import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/components/UserProfile";

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UserProfile />
        
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
      </div>
    </div>
  );
};

export default Profile;
