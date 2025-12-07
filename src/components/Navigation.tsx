import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { Search, Menu, X, Sun, Moon, User, BookOpen, Video, FileText, Bookmark } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '../Images/Logo.jpg';
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { name: 'Home', path: '/', icon: null },
    { name: 'About SMAK', path: '/about', icon: null },
    { name: 'SMAK AI', path: '/smak-ai', icon: null },
    { name: 'Events', path: '/events', icon: null },
    { name: 'Journal', path: '/journal', icon: FileText },
    { name: 'Clinical Corner', path: '/Homeclinicalcorner', icon: FileText },
    { name: 'Research Club', path: '/research-hub', icon: null },
    { name: 'Members', path: '/members', icon: null },
    { name: 'Collaborate', path: '/collaborate', icon: null },
    { name: 'Contact Us', path: '/contact', icon: null },
  ];

  // Additional navigation items with icons (from second component)
  const additionalNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: null },
    { name: 'Blogs', path: '/blogs', icon: BookOpen },
    { name: 'Journals', path: '/journals', icon: FileText },
    { name: 'Videos', path: '/videos', icon: Video },
    { name: 'Notes', path: '/notes', icon: Bookmark },
  ];

  // Combine nav items (you can choose which set to use or merge them)
  const allNavItems = [...navItems, ...additionalNavItems];

  const isActive = (path: string) => location.pathname === path;
  const isActivePath = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      // Call logout function from context
      await logout();
      // Close any open menus
      setIsOpen(false);
      setIsMobileMenuOpen(false);

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login page
      navigate('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
              <img
                src="https://i.postimg.cc/LXmZbsWJ/Logo.jpg"
                alt="SMAK - Society For Medical Academia and Knowledge Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hidden sm:inline">
              SMAK
            </span>
          </Link>

          {/* Desktop Navigation - Horizontal scroll with better spacing */}
          <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto flex-1 max-w-4xl px-2 scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-1 whitespace-nowrap text-xs lg:text-sm font-medium px-2 lg:px-3 py-1.5 flex-shrink-0 ${isActive(item.path)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    }`}
                  asChild
                >
                  <Link to={item.path}>
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    <span>{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Search - Hidden on very small screens */}
            <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9">
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* Show Admin Panel link only for admin users */}
                  {['admin@example.com', 'anotheradmin@example.com'].includes(user?.email) && (
                    <DropdownMenuItem asChild>
                      <Link to="/adminpanel">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex gap-1.5">
                <Button variant="ghost" size="sm" asChild className="h-8 text-xs lg:text-sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="h-8 text-xs lg:text-sm">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col gap-1 p-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start gap-2 text-sm ${isActive(item.path)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      }`}
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to={item.path}>
                      {Icon && <Icon className="h-4 w-4" />}
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                );
              })}

              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-3 border-t border-border mt-2">
                  <Button variant="ghost" size="sm" asChild onClick={() => setIsOpen(false)}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild onClick={() => setIsOpen(false)}>
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
