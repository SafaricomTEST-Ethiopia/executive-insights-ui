import { Link, Outlet, useLocation } from 'react-router-dom';
import { Bell, CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { cn } from '../lib/utils';

function NavLink({ to, children, icon }: { to: string, children: React.ReactNode, icon: React.ReactNode }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
            )}
        >
            {icon}
            {children}
        </Link>
    );
}

function MobileNavLink({ to, children, icon }: { to: string, children: React.ReactNode, icon: React.ReactNode }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                isActive && "bg-muted text-foreground"
            )}
        >
            {icon}
            {children}
        </Link>
    );
}

export default function Layout() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span>StrategyDash</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink to="/dashboard" icon={<Home className="h-4 w-4" />}>Dashboard</NavLink>
              <NavLink to="/cvm" icon={<ShoppingCart className="h-4 w-4" />}>CVM</NavLink>
              <NavLink to="/esb" icon={<Package className="h-4 w-4" />}>ESB</NavLink>
              <NavLink to="/intake" icon={<Users className="h-4 w-4" />}>Initiatives</NavLink>
              <NavLink to="#" icon={<LineChart className="h-4 w-4" />}>Metrics</NavLink>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link to="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Package2 className="h-6 w-6" />
                  <span>StrategyDash</span>
                </Link>
                <MobileNavLink to="/dashboard" icon={<Home className="h-5 w-5" />}>Dashboard</MobileNavLink>
                <MobileNavLink to="/cvm" icon={<ShoppingCart className="h-5 w-5" />}>CVM</MobileNavLink>
                <MobileNavLink to="/esb" icon={<Package className="h-5 w-5" />}>ESB</MobileNavLink>
                <MobileNavLink to="/intake" icon={<Users className="h-5 w-5" />}>Initiatives</MobileNavLink>
                <MobileNavLink to="#" icon={<LineChart className="h-5 w-5" />}>Metrics</MobileNavLink>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search initiatives..."
                  className="w-full appearance-none bg-transparent pl-8 shadow-none md:w-2/3 lg:w-1/3 focus:outline-none"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>My Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}