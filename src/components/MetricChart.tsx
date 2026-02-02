import { BarChart, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, Line, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MetricChartProps {
  title: string;
  chartType?: 'bar' | 'line';
}

const barData = [
  { name: 'Q1', revenue: 4000, spend: 2400 },
  { name: 'Q2', revenue: 3000, spend: 1398 },
  { name: 'Q3', revenue: 9800, spend: 2000 },
  { name: 'Q4', revenue: 3908, spend: 2780 },
];

const lineData = [
  { name: 'Jan', p95: 120, p99: 150 },
  { name: 'Feb', p95: 130, p99: 160 },
  { name: 'Mar', p95: 110, p99: 140 },
  { name: 'Apr', p95: 140, p99: 170 },
];

export function MetricChart({ title, chartType = 'bar' }: MetricChartProps) {
  const data = chartType === 'bar' ? barData : lineData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'bar' ? (
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip wrapperClassName="!bg-background !border-border" cursor={{ fill: 'hsl(var(--muted))' }} />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spend" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip wrapperClassName="!bg-background !border-border" cursor={{ stroke: 'hsl(var(--muted))' }} />
              <Legend />
              <Line type="monotone" dataKey="p95" stroke="hsl(var(--primary))" />
              <Line type="monotone" dataKey="p99" stroke="hsl(var(--secondary))" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}