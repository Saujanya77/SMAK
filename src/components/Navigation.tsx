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
    { name: 'Events', path: '/events', icon: null },
    { name: 'Journal', path: '/journal', icon: FileText },
    { name: 'Clinical Corner', path: '/Homeclinicalcorner', icon: FileText },
    { name: 'Research Hub', path: '/research-hub', icon: null },
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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          
<Link to="/" className="flex items-center space-x-3">
  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
    <img
      src= {Logo}
      alt="SMAK - Society For Medical Academia and Knowledge Logo" 
      className="w-10 h-10 object-contain"
    />
  </div>
  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
    SMAK
  </span>
</Link>

          {/* Desktop Navigation - Using enhanced button style from second component */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  }`}
                  asChild
                >
                  <Link to={item.path}>
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
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
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button - Enhanced from second component */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced with button styling from second component */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`w-full justify-start space-x-2 ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    }`}
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to={item.path}>
                      {Icon && <Icon className="h-4 w-4" />}
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  </Button>
                );
              })}
              
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-2 border-t border-border mt-2">
                  <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild onClick={() => setIsOpen(false)}>
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
