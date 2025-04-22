import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

interface Agent {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if user is admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData?.role !== 'admin') {
        navigate('/');
        return;
      }

      // Fetch all agents
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'agent')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: 'user' })
        .eq('id', agentId);

      if (error) throw error;
      
      setAgents(agents.filter(agent => agent.id !== agentId));
      toast.success('Agent role revoked successfully');
    } catch (error) {
      console.error('Error revoking agent role:', error);
      toast.error('Failed to revoke agent role');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{agent.email}</p>
                      <p className="text-sm text-gray-500">
                        Name: {agent.full_name || 'Not set'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Joined: {new Date(agent.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => handleRevokeAgent(agent.id)}
                    >
                      Revoke Agent Role
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {agents.length === 0 && (
              <p className="text-center text-gray-500">No agents found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 