
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p>user@example.com</p>
              <p className="text-sm text-muted-foreground mt-4">Full Name</p>
              <p>John Doe</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Edit Profile</Button>
          </CardFooter>
        </Card>
        
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
