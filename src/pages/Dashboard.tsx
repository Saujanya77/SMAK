import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import {
  BookOpen,
  Video,
  FileText,
  Bookmark,
  User,
  Settings,
  LogOut,
  Calendar,
  Users,
  Mail,
  TrendingUp,
  Clock,
  Star,
  Download,
  Play,
  Eye,
  Heart,
  MessageCircle,
  Upload,
  Stethoscope,
  Home,
  Menu,
  X,
  Plus,
  Search,
  Bell,
  ChevronDown,
  Activity,
  Brain,
  Microscope,
  Clipboard,
  Phone,
  Image,
  TestTube,
  BookMarked,
  HelpCircle,
  Zap,
  Target,
  MonitorSpeaker,
  GraduationCap,
  LibraryBig,
  FlaskConical,
  Sun,
  Moon,
  Award,
  BarChart3,
  Timer,
  CheckCircle,
  Flame,
  BookmarkCheck,
  PlusCircle,
  ChevronRight,
  PlayCircle,
  FileDown,
  Users2,
  MessageSquare,
  Sparkles,
  Shield,
  Coffee,
  Lightbulb,
  Globe,
  Laptop,
  Headphones,
  Camera,
  Wifi,
  Battery,
  Palette
} from 'lucide-react';
import Login from './Login';
import { useAuth } from '../contexts/AuthContext'; // adjust path as needed
import Logo from '../Images/Logo.jpg'
const MedicalDashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, loading } = useAuth();

  // Initialize theme from state (not localStorage)
  useEffect(() => {
    setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Mock user data
  const userData = {
    name: user.name,
    year: user.year,
    college: user.college,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face" // You can add avatar to your user profile later
  };


  const sidebarItems = [
    {
      id: 'home',
      label: 'Home',
      icon: () => (
        <img src={Logo} alt="Home" className="h-5 w-5 rounded" style={{ objectFit: 'cover' }} />
      ),
      route: '/',
    },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    {
      id: 'content-hub',
      label: 'Content Hub',
      icon: LibraryBig,
      route: '/Contenthub',

      subItems: [
        { id: 'video-lectures', label: 'Video Lectures', icon: Video, route: '/video-lectures' },
        { id: 'subject-notes', label: 'Subject-wise Notes', icon: BookOpen, route: '/SubjectNotes' },
        { id: 'mcq-bank', label: 'MCQ & Q-Bank', icon: HelpCircle, route: '/mcq-bank' },
      ]
    },
    {
      id: 'clinical-corner',
      label: 'Clinical Corner',
      icon: Stethoscope,
      route: '/Clinicalcorner',
      subItems: [
        { id: 'clinical-cases', label: 'Clinical Cases', icon: Clipboard, route: '/clinical-cases' },
        { id: 'emergency-protocols', label: 'Emergency Protocols', icon: Zap, route: '/Emergency_Protocols' },
        { id: 'lab-imaging', label: 'Lab & Imaging Interpretation', icon: TestTube, route: '/Lab_Imaging' },
      ]
    },
    { id: 'journals', label: 'Journals', icon: FileText, route: '/journals' },
    { id: 'blogs', label: 'Blogs', icon: BookMarked, route: '/blogs' },
  ];

  const handleNavigation = (pageId, route = null) => {
    if (route) {
      navigate(route);
    } else {
      setCurrentPage(pageId);
      setSidebarOpen(false);
    }
  };
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      setProfileDropdownOpen(false);

      // Call Firebase logout
      await logout();

      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate even if logout fails
      navigate('/login');
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Enhanced Navigation Header Component
  const NavigationHeader = () => (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 lg:hidden transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-3">
            <a href="/" className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500">
              <img
                src={Logo}
                alt="SMAK Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </a>
            <a href="/">
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                  SMAK
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Learning Platform</p>
              </div>
            </a>
          </div>

        </div>


        <div className="flex items-center space-x-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search medical content..."
              className="w-72 pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all duration-200"
            />
          </div>

          {/* Professional Theme Toggle */}
          <div className="relative">
            <Toggle
              pressed={darkMode}
              onPressedChange={toggleTheme}
              className={`relative p-2.5 rounded-lg transition-all duration-300 border ${darkMode
                ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-blue-50'
                }`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="flex items-center space-x-2">
                {darkMode ? (
                  <>
                    <Moon className="h-4 w-4" />
                    <span className="text-xs font-medium">Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" />
                    <span className="text-xs font-medium">Light</span>
                  </>
                )}
              </div>
            </Toggle>
          </div>

          <button className="relative p-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200">
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </div>
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-slate-600 flex items-center justify-center ring-2 ring-blue-100 dark:ring-slate-600">
                <span className="text-sm font-semibold text-blue-800 dark:text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {user.name.split(' ')[0]}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {user.year}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500 transition-transform duration-200" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    {user.college}
                  </p>
                </div>
                {/* Admin Panel link for admin users only */}
                {['admin@example.com', 'anotheradmin@example.com'].includes(user?.email) && (
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
                    onClick={() => { setProfileDropdownOpen(false); navigate('/adminpanel'); }}
                  >
                    <User className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </button>
                )}
                <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200">
                  <User className="h-4 w-4" />
                  <span>View Profile</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200">
                  <Coffee className="h-4 w-4" />
                  <span>Study Mode</span>
                </button>
                <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                  <button
                    onClick={handleLogout}  // ✅ This will redirect to login
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  // Enhanced Sidebar Component
  const Sidebar = () => (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-all duration-300 z-50 lg:translate-x-0 shadow-lg ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 lg:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">SMAK</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Learning Platform</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-full pb-20">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleNavigation(item.id, item.route)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${currentPage === item.id || currentPage.startsWith(item.id)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {item.subItems && (
                  <ChevronRight className={`h-4 w-4 ml-auto transition-transform duration-200 ${(currentPage === item.id || item.subItems.some(sub => currentPage === sub.id)) ? 'rotate-90' : ''
                    }`} />
                )}
              </button>

              {item.subItems && (currentPage === item.id || item.subItems.some(sub => currentPage === sub.id)) && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleNavigation(subItem.id, subItem.route)}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left text-sm transition-all duration-200 ${currentPage === subItem.id
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700'
                        }`}
                    >
                      <subItem.icon className="h-4 w-4" />
                      <span>{subItem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );

  // Enhanced Dashboard Page
  const DashboardPage = () => {
    const dashboardStats = [
      {
        title: "Total Articles Read",
        value: "127",
        icon: BookOpen,
        trend: "+12 this week",
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=100&fit=crop"
      },
      {
        title: "Research Papers",
        value: "23",
        icon: FileText,
        trend: "+3 new",
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=100&fit=crop"
      },
      {
        title: "Videos Watched",
        value: "45",
        icon: Video,
        trend: "8.5h this month",
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=100&fit=crop"
      },
      {
        title: "Notes Saved",
        value: "89",
        icon: Bookmark,
        trend: "+15 recently",
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=100&fit=crop"
      }
    ];

    const quickAccessItems = [
      {
        title: "Video Lectures",
        description: "Educational videos and surgical demos",
        icon: Video,
        route: "/video-lectures",
        color: "bg-blue-600",
        count: "500+ Videos",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop",
        additionalIcon: PlayCircle
      },
      {
        title: "Subject Notes",
        description: "Comprehensive study materials",
        icon: BookOpen,
        route: "/SubjectNotes",
        color: "bg-blue-600",
        count: "200+ Notes",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
        additionalIcon: Brain
      },
      {
        title: "Clinical Cases",
        description: "Real patient cases and scenarios",
        icon: Clipboard,
        route: "/clinical-cases",
        color: "bg-blue-600",
        count: "75+ Cases",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
        additionalIcon: Microscope
      },
      {
        title: "MCQ Bank",
        description: "Practice questions and mock tests",
        icon: HelpCircle,
        route: "/mcq-bank",
        color: "bg-blue-600",
        count: "1000+ Questions",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
        additionalIcon: Target
      }
    ];

    const recentActivities = [
      {
        type: "video",
        title: "Cardiovascular System Overview",
        description: "Watched 45 minutes ago",
        icon: PlayCircle,
        color: "text-blue-600",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=50&h=50&fit=crop"
      },
      {
        type: "note",
        title: "Pharmacology Chapter 5",
        description: "Added to bookmarks",
        icon: BookmarkCheck,
        color: "text-blue-600",
        image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=50&h=50&fit=crop"
      },
      {
        type: "mcq",
        title: "Anatomy Practice Test",
        description: "Scored 85% - 2 hours ago",
        icon: CheckCircle,
        color: "text-blue-600",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=50&h=50&fit=crop"
      },
      {
        type: "case",
        title: "Respiratory Case Study",
        description: "Completed analysis",
        icon: Clipboard,
        color: "text-blue-600",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=50&h=50&fit=crop"
      }
    ];

    const achievements = [
      { title: "Study Streak", value: "7 days", icon: Flame, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
      { title: "Videos Completed", value: "12 this week", icon: PlayCircle, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
      { title: "Quiz Score", value: "92% avg", icon: Award, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
      { title: "Hours Studied", value: "28.5h", icon: Timer, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" }
    ];

    return (
      <div className="space-y-8">
        {/* Professional Welcome Banner */}
        <div className="relative bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 text-white overflow-hidden">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <Stethoscope className="h-6 w-6 text-blue-100" />
                <Brain className="h-6 w-6 text-blue-100" />
                <BookOpen className="h-6 w-6 text-blue-100" />
              </div>
              <h1 className="text-4xl font-bold mb-3">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                Ready to continue your medical learning journey? Here's what's new today.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Flame className="h-4 w-4 text-blue-100" />
                  <span className="font-semibold">7-day streak</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Clock className="h-4 w-4 text-blue-100" />
                  <span>Last: Today, 9:30 AM</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Globe className="h-4 w-4 text-blue-100" />
                  <span>Online</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=220&h=160&fit=crop&crop=center"
                  alt="Medical illustration"
                  className="w-52 h-40 object-cover rounded-2xl shadow-2xl border-4 border-white/20"
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="relative h-24 overflow-hidden">
                <img
                  src={stat.image}
                  alt={stat.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 ${stat.bgColor} opacity-90`}></div>
                <div className="absolute top-2 right-2">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-xs bg-white border-blue-200 text-blue-600">This Week</Badge>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Grid with proper routing */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Quick Access</h2>
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessItems.map((item, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-md overflow-hidden"
                onClick={() => navigate(item.route)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 ${item.color} opacity-80`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <item.icon className="h-12 w-12 text-white mb-2 mx-auto" />
                      <item.additionalIcon className="h-6 w-6 text-white/70 mx-auto" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-600">
                      {item.count}
                    </Badge>
                    <div className="flex space-x-1">
                      <Eye className="h-4 w-4 text-slate-400" />
                      <Heart className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-blue-50 dark:bg-slate-700">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <span>Recent Activity</span>
                <Badge className="ml-auto bg-blue-600">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-md transition-all duration-200 group">
                  <div className="relative flex-shrink-0">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 rounded-full shadow-lg">
                      <activity.icon className={`h-3 w-3 ${activity.color}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              ))}
              <Button variant="outline" className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 text-blue-600">
                <Eye className="h-4 w-4 mr-2" />
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-blue-50 dark:bg-slate-700">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <span>Your Progress</span>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${achievement.bgColor} rounded-lg`}>
                      <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                      {achievement.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {achievement.value}
                    </span>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              ))}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Featured Content */}
        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="bg-blue-50 dark:bg-slate-700">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <span>Featured Content</span>
              <Badge className="bg-blue-600 text-white">Trending</Badge>
            </CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <span>Handpicked resources for your current study level</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Advanced Cardiac Life Support",
                  type: "Video Course",
                  duration: "2.5 hours",
                  image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=150&fit=crop",
                  difficulty: "Advanced",
                  icon: Heart,
                  rating: 4.9
                },
                {
                  title: "Pharmacology Quick Reference",
                  type: "Study Notes",
                  pages: "45 pages",
                  image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=150&fit=crop",
                  difficulty: "Intermediate",
                  icon: FlaskConical,
                  rating: 4.7
                },
                {
                  title: "Clinical Case: Respiratory Failure",
                  type: "Case Study",
                  complexity: "High",
                  image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=150&fit=crop",
                  difficulty: "Expert",
                  icon: Microscope,
                  rating: 4.8
                }
              ].map((content, index) => (
                <div key={index} className="group cursor-pointer bg-white dark:bg-slate-700 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={content.image}
                      alt={content.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-blue-600/20"></div>
                    <Badge className="absolute top-3 right-3 bg-white text-slate-800">
                      {content.difficulty}
                    </Badge>
                    <div className="absolute bottom-3 left-3">
                      <content.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                        {content.title}
                      </h4>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 font-medium">
                      {content.type}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {content.duration || content.pages || content.complexity}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-blue-600 fill-current" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {content.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Page renderer - Only shows dashboard, other pages are placeholders
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;

      default:
        // Professional placeholder for other pages
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-md">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <Stethoscope className="h-10 w-10 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                Coming Soon! 🚀
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                This page is under development with exciting new features and content designed specifically for medical students.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => handleNavigation('dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <Button variant="outline" className="hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 text-blue-600">
                  <Bell className="h-4 w-4 mr-2" />
                  Get Notified
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <Sidebar />

      <div className="flex-1 lg:ml-72">
        <NavigationHeader />

        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default MedicalDashboard;
