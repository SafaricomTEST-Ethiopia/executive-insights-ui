import { useEffect, useState } from 'react';
import apiClient from '@/api/axios';
import { InitiativeCard } from '@/components/InitiativeCard';
import { toast } from 'sonner';

interface Initiative {
  id: number;
  title: string;
  description: string;
  status: string;
  department: { name: string };
}

export default function Esb() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const response = await apiClient.get('/api/initiatives/');
        const esbInitiatives = response.data.filter((i: Initiative) => i.department.name === 'ESB');
        setInitiatives(esbInitiatives);
      } catch (error) {
        console.error('Failed to fetch initiatives', error);
        toast.error('Failed to load ESB initiatives.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitiatives();
  }, []);

  if (loading) return <div>Loading initiatives...</div>;

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">ESB Department Initiatives</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initiatives.length > 0 ? (
          initiatives.map(initiative => (
            <InitiativeCard key={initiative.id} initiative={initiative} />
          ))
        ) : (
          <p>No initiatives found for the ESB department.</p>
        )}
      </div>
    </>
  );
}