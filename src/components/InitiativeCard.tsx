import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Initiative {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface InitiativeCardProps {
  initiative: Initiative;
}

export function InitiativeCard({ initiative }: InitiativeCardProps) {
  const { title, status, description } = initiative;

  const getStatusColor = () => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'text-blue-400';
      case 'DELIVERED':
        return 'text-green-400';
      case 'BLOCKED':
        return 'text-red-400';
      case 'NEW':
        return 'text-yellow-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className={getStatusColor()}>Status: {status.replace('_', ' ')}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      </CardContent>
    </Card>
  );
}