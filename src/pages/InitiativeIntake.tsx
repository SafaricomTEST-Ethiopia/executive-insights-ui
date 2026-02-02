import React, { useState } from 'react';
import apiClient from '@/api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const InitiativeIntake: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [priority, setPriority] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('You must be logged in to create an initiative.');
      toast.error('Authentication required.');
      return;
    }

    try {
      const initiativeData = {
        title,
        description,
        department_id: parseInt(departmentId, 10),
        priority: parseInt(priority, 10),
      };

      await apiClient.post('/api/initiatives/', initiativeData);
      toast.success('Initiative created successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setDepartmentId('');
      setPriority('');

    } catch (err) {
      setError('Failed to create initiative. Please try again.');
      toast.error('Failed to create initiative.');
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10">
        <Card className="w-full max-w-2xl">
        <CardHeader>
            <CardTitle>Create New Initiative</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-6">
                <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Initiative Title" required />
                </div>

                <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the initiative" />
                </div>

                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="department">Department</Label>
                     <Select onValueChange={setDepartmentId} value={departmentId} required>
                        <SelectTrigger id="department">
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="1">CVM</SelectItem>
                            <SelectItem value="2">Digital</SelectItem>
                            <SelectItem value="3">ESB</SelectItem>
                            <SelectItem value="4">Ops</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col space-y-1.5">
                <Label htmlFor="priority">Priority</Label>
                <Input id="priority" type="number" value={priority} onChange={(e) => setPriority(e.target.value)} placeholder="e.g., 10" required />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full">Create Initiative</Button>
            </div>
            </form>
        </CardContent>
        </Card>
    </div>
  );
};

export default InitiativeIntake;