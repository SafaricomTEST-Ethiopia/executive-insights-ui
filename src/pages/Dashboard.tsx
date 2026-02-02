import { useEffect, useState } from 'react';
import apiClient from '@/api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Define interfaces for the data we expect from the API
interface Initiative {
  id: number;
  title: string;
  priority: number;
  status: string;
}

interface InitiativesByStatus {
  status: string;
  count: number;
}

interface BlockedInitiative {
  id: number;
  title: string;
  days_blocked: number;
}

interface InitiativesByDepartment {
  department: string;
  count: number;
}

interface MonthlyTrend {
  month: string;
  count: number;
}

export default function Dashboard() {
  const [topInitiatives, setTopInitiatives] = useState<Initiative[]>([]);
  const [initiativesByStatus, setInitiativesByStatus] = useState<InitiativesByStatus[]>([]);
  const [blockedInitiatives, setBlockedInitiatives] = useState<BlockedInitiative[]>([]);
  const [initiativesByDept, setInitiativesByDept] = useState<InitiativesByDepartment[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [topRes, statusRes, blockedRes, deptRes, trendRes] = await Promise.all([
          apiClient.get('/api/dashboard/top-initiatives'),
          apiClient.get('/api/dashboard/initiatives-by-status'),
          apiClient.get('/api/dashboard/blocked-initiatives'),
          apiClient.get('/api/dashboard/initiatives-by-department'),
          apiClient.get('/api/dashboard/monthly-trend'),
        ]);

        setTopInitiatives(topRes.data);
        setInitiativesByStatus(statusRes.data);
        setBlockedInitiatives(blockedRes.data);
        setInitiativesByDept(deptRes.data);
        setMonthlyTrend(trendRes.data);

      } catch (err) {
        setError('Failed to fetch dashboard data. Please make sure you are logged in as an EXECUTIVE.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><p>Loading dashboard...</p></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Executive Execution Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top 5 Initiatives by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topInitiatives.map(item => (
                <li key={item.id} className="flex justify-between items-center bg-muted p-2 rounded-md">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-sm text-primary font-semibold">P{item.priority}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Initiatives by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={initiativesByStatus}>
                <XAxis dataKey="status" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip wrapperClassName="!bg-background !border-border" cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Blocked Initiatives</CardTitle>
          </CardHeader>
          <CardContent>
            {blockedInitiatives.length > 0 ? (
              <ul className="space-y-2">
                {blockedInitiatives.map(item => (
                  <li key={item.id} className="flex justify-between items-center p-2 rounded-md border">
                    <span className="font-medium text-destructive">{item.title}</span>
                    <span className="text-sm text-muted-foreground">Blocked for {item.days_blocked} days</span>
                  </li>
                ))}
              </ul>
            ) : <p>No blocked initiatives.</p>}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Initiatives by Department</CardTitle>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
              <BarChart data={initiativesByDept} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="department" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip wrapperClassName="!bg-background !border-border" cursor={{ fill: 'hsl(var(--muted))' }} />
                <Legend />
                <Bar dataKey="count" name="Initiatives" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Trend (New Initiatives)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                <Tooltip wrapperClassName="!bg-background !border-border" cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </>
  );
}