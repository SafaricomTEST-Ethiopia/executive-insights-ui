import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const linkClasses = 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary';
  const activeLinkClasses = 'text-primary';

  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <NavLink to="/dashboard" className={({ isActive }) => cn(linkClasses, { [activeLinkClasses]: isActive })}>
        Dashboard
      </NavLink>
      <NavLink to="/intake" className={({ isActive }) => cn(linkClasses, { [activeLinkClasses]: isActive })}>
        Initiative Intake
      </NavLink>
      <NavLink to="/cvm" className={({ isActive }) => cn(linkClasses, { [activeLinkClasses]: isActive })}>
        CVM
      </NavLink>
      <NavLink to="/esb" className={({ isActive }) => cn(linkClasses, { [activeLinkClasses]: isActive })}>
        ESB
      </NavLink>
    </nav>
  );
}