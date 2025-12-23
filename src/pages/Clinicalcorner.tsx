import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Images/Logo.jpg';
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
import { useAuth } from '../contexts/AuthContext';

const ClinicalCorner = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('clinical-corner');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();

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

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, route: '/dashboard' },
    {
      id: 'content-hub',
      label: 'Content Hub',
      icon: LibraryBig,
      route: '/Contenthub',
      subItems: [
        { id: 'video-lectures', label: 'Video Lectures', icon: Video, route: '/video-lectures' },
        { id: 'subject-notes', label: 'Subject-wise Notes', icon: BookOpen, route: '/SubjectNotes' },
      ]
    },
    { id: 'mcq-tests', label: 'Quiz Club', icon: HelpCircle, route: '/mcq-bank' },
    {
      id: 'clinical-corner',
      label: 'Clinical Corner',
      icon: Stethoscope,
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

  const handleLogout = async () => {
    try {
      setProfileDropdownOpen(false);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Navigation Header Component
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

          {/* <button className="relative p-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200">
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </div>
          </button> */}

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
                {(() => {
                  const ADMIN_EMAILS = [
                    'admin@example.com',
                    'anotheradmin@example.com',
                    'smak.founder@gmail.com',
                    'smak.researchclub@gmail.com',
                    'smak.quizclub@gmail.com',
                    'sjmsr.journal@gmail.com',
                    'team.smak2025@gmail.com',
                    'khushal.smak@gmail.com',
                    'samudra.smak@gmail.com'
                  ];
                  const normalizedAdminEmails = ADMIN_EMAILS.map(e => e.toLowerCase().trim());
                  const normalizedUserEmail = (user?.email || '').toLowerCase().trim();
                  return normalizedAdminEmails.includes(normalizedUserEmail);
                })() && (
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
                      onClick={() => { setProfileDropdownOpen(false); navigate('/adminpanel'); }}
                    >
                      <User className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </button>
                  )}
                {/* <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200">
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
                </button> */}
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

  // Sidebar Component
  const Sidebar = () => (
    <>
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <Sidebar />

      <div className="flex-1 lg:ml-72">
        <NavigationHeader />

        <main className="p-6">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 rounded-2xl p-8 text-white overflow-hidden">
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <Stethoscope className="h-8 w-8 text-blue-100" />
                    <Microscope className="h-8 w-8 text-blue-100" />
                    <TestTube className="h-8 w-8 text-blue-100" />
                  </div>
                  <h1 className="text-4xl font-bold mb-3">
                    Clinical Corner 🏥
                  </h1>
                  <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                    Your comprehensive clinical learning hub. Explore real-world medical scenarios, emergency protocols,
                    and master the art of clinical interpretation.
                  </p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                      <Clipboard className="h-4 w-4 text-blue-100" />
                      <span className="font-semibold">75+ Clinical Cases</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                      <Zap className="h-4 w-4 text-blue-100" />
                      <span>50+ Emergency Protocols</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                      <TestTube className="h-4 w-4 text-blue-100" />
                      <span>200+ Lab & Imaging Studies</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=280&h=200&fit=crop&crop=center"
                      alt="Clinical Corner"
                      className="w-64 h-48 object-cover rounded-2xl shadow-2xl border-4 border-white/20"
                    />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Clinical Cases */}
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-md overflow-hidden">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
                    alt="Clinical Cases"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-blue-600/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Clipboard className="h-16 w-16 text-white mb-4 mx-auto" />
                      <Badge className="bg-white/20 text-white border-white/30">
                        Daily Cases
                      </Badge>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <ChevronRight className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                    Clinical Cases
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    Explore real patient scenarios with detailed case presentations, differential diagnoses,
                    and treatment plans. New cases added daily.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-slate-700 dark:text-slate-300">Case of the Day feature</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-slate-700 dark:text-slate-300">Interactive case discussions</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-slate-700 dark:text-slate-300">Expert analysis & insights</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/clinical-cases')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Clipboard className="h-4 w-4 mr-2" />
                    Explore Clinical Cases
                  </Button>
                </CardContent>
              </Card>

              {/* Emergency Protocols */}
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-md overflow-hidden">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop"
                    alt="Emergency Protocols"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-red-600/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Zap className="h-16 w-16 text-white mb-4 mx-auto" />
                      <Badge className="bg-white/20 text-white border-white/30">
                        Emergency Ready
                      </Badge>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <ChevronRight className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                    Emergency Protocols
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    Master critical emergency situations with step-by-step protocols,
                    ACLS guidelines, and life-saving procedures.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-slate-700 dark:text-slate-300">ACLS & BLS protocols</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-slate-700 dark:text-slate-300">Trauma management guides</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-slate-700 dark:text-slate-300">Quick reference cards</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/Emergency_Protocols')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    View Emergency Protocols
                  </Button>
                </CardContent>
              </Card>

              {/* Lab & Imaging Interpretation */}
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-md overflow-hidden">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
                    alt="Lab & Imaging"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-green-600/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <TestTube className="h-16 w-16 text-white mb-4 mx-auto" />
                      <Badge className="bg-white/20 text-white border-white/30">
                        Diagnostic Tools
                      </Badge>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <ChevronRight className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                    Lab & Imaging Interpretation
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    Master the art of interpreting X-rays, ECGs, blood work, and other
                    diagnostic studies with expert guidance.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-slate-700 dark:text-slate-300">X-ray interpretation guides</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-slate-700 dark:text-slate-300">ECG analysis tutorials</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-slate-700 dark:text-slate-300">Lab values reference</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/Lab_Imaging')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Study Lab & Imaging
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Active Cases", value: "75+", icon: Clipboard, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
                { title: "Emergency Protocols", value: "50+", icon: Zap, color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-900/20" },
                { title: "Imaging Studies", value: "200+", icon: TestTube, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/20" },
                { title: "Expert Reviews", value: "1000+", icon: Award, color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-900/20" }
              ].map((stat, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{stat.value}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Featured Content */}
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-blue-50 dark:bg-slate-700">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                  <span>Featured This Week</span>
                  <Badge className="bg-blue-600 text-white">New</Badge>
                </CardTitle>
                <CardDescription>
                  Handpicked clinical content to enhance your learning experience
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "COVID-19 Management Protocol",
                      type: "Emergency Protocol",
                      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=150&fit=crop",
                      icon: Zap,
                      difficulty: "Advanced"
                    },
                    {
                      title: "Chest X-Ray Interpretation",
                      type: "Imaging Study",
                      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=150&fit=crop",
                      icon: TestTube,
                      difficulty: "Intermediate"
                    },
                    {
                      title: "Cardiac Arrest Case Study",
                      type: "Clinical Case",
                      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=150&fit=crop",
                      icon: Clipboard,
                      difficulty: "Expert"
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
                        <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors mb-2">
                          {content.title}
                        </h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {content.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClinicalCorner;
