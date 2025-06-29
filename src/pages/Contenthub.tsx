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
import { useAuth } from '../contexts/AuthContext';

const ContentHub = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();

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
    }
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm overflow-hidden bg-blue-600">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                SMAK
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Learning Platform</p>
            </div>
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
              className={`relative p-2.5 rounded-lg transition-all duration-300 border ${
                darkMode 
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
                    onClick={handleLogout}
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
      
      <aside className={`fixed left-0 top-0 h-full w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-all duration-300 z-50 lg:translate-x-0 shadow-lg ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  item.id === 'content-hub'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {item.subItems && (
                  <ChevronRight className={`h-4 w-4 ml-auto transition-transform duration-200 ${
                    item.id === 'content-hub' ? 'rotate-90' : ''
                  }`} />
                )}
              </button>
              
              {item.subItems && item.id === 'content-hub' && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleNavigation(subItem.id, subItem.route)}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left text-sm transition-all duration-200 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700"
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

  const contentSections = [
    {
      id: 'video-lectures',
      title: 'Medical Video Lectures',
      description: 'Access comprehensive video lectures covering all medical subjects with expert explanations and visual demonstrations.',
      icon: Video,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=300&fit=crop',
      features: [
        'High-quality recorded lectures',
        'Interactive video content',
        'Upload your own lectures',
        'Subject-wise categorization',
        'Progress tracking',
        'Downloadable content'
      ],
      stats: {
        total: '500+',
        recent: '15 new this week',
        duration: '300+ hours'
      },
      route: '/video-lectures'
    },
    {
      id: 'subject-notes',
      title: 'Subject-wise Notes',
      description: 'Comprehensive study notes organized by medical subjects with downloadable PDFs and interactive content.',
      icon: BookOpen,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop',
      features: [
        'Subject-wise organization',
        'PDF downloads available',
        'Interactive study materials',
        'Bookmarking system',
        'Search functionality',
        'Collaborative notes'
      ],
      stats: {
        total: '200+',
        recent: '8 updated recently',
        subjects: '25 subjects'
      },
      route: '/SubjectNotes'
    },
    {
      id: 'mcq-bank',
      title: 'MCQ & Question Bank',
      description: 'Extensive collection of multiple choice questions and practice tests to enhance your medical knowledge.',
      icon: HelpCircle,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop',
      features: [
        'Thousands of MCQs',
        'Subject-wise questions',
        'Timed practice tests',
        'Detailed explanations',
        'Performance analytics',
        'Mock examinations'
      ],
      stats: {
        total: '1000+',
        recent: '50 new questions',
        categories: '15 categories'
      },
      route: '/mcq-bank'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72">
        <NavigationHeader />
        
        <main className="p-6">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 text-white overflow-hidden">
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <LibraryBig className="h-8 w-8 text-blue-100" />
                  <BookOpen className="h-6 w-6 text-blue-100" />
                  <Video className="h-6 w-6 text-blue-100" />
                  <HelpCircle className="h-6 w-6 text-blue-100" />
                </div>
                <h1 className="text-4xl font-bold mb-3">
                  Content Hub 📚
                </h1>
                <p className="text-blue-100 mb-6 text-lg leading-relaxed max-w-3xl">
                  Your comprehensive medical learning resource center. Access video lectures, study notes, and practice questions all in one place.
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                    <PlayCircle className="h-4 w-4 text-blue-100" />
                    <span className="font-semibold">500+ Videos</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                    <FileText className="h-4 w-4 text-blue-100" />
                    <span>200+ Notes</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                    <Target className="h-4 w-4 text-blue-100" />
                    <span>1000+ MCQs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-12">
              {contentSections.map((section, index) => (
                <Card key={section.id} className="border-0 shadow-lg overflow-hidden">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                    {/* Image Section */}
                    <div className={`relative h-80 lg:h-auto ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                      <img 
                        src={section.image} 
                        alt={section.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-blue-600/20"></div>
                      <div className="absolute top-6 left-6">
                        <div className="p-3 bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-lg backdrop-blur-sm">
                          <section.icon className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      <div className="absolute bottom-6 right-6">
                        <Badge className="bg-white text-slate-800 shadow-lg">
                          {section.stats.total} Resources
                        </Badge>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={`p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center space-x-3 mb-4">
                            <section.icon className="h-6 w-6 text-blue-600" />
                            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600">
                              Featured
                            </Badge>
                          </div>
                          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                            {section.title}
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            {section.description}
                          </p>
                        </div>

                        {/* Features List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {section.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center space-x-6 py-4 border-t border-slate-200 dark:border-slate-700">
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                            <p className="font-bold text-slate-800 dark:text-white">{section.stats.total}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Recent</p>
                            <p className="font-bold text-slate-800 dark:text-white">{section.stats.recent}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Coverage</p>
                            <p className="font-bold text-slate-800 dark:text-white">{section.stats.duration || section.stats.subjects || section.stats.categories}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <Button 
                            onClick={() => navigate(section.route)}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                          >
                            <section.icon className="h-4 w-4 mr-2" />
                            Explore {section.title.split(' ')[1]}
                          </Button>
                          <Button 
                            variant="outline" 
                            className="hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 text-blue-600"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Stats Section */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-slate-700">
                <CardTitle className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <span>Content Overview</span>
                  <Badge className="bg-blue-600 text-white">Updated Daily</Badge>
                </CardTitle>
                <CardDescription>
                  Complete breakdown of available learning resources
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {contentSections.map((section) => (
                    <div key={section.id} className="text-center space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl inline-block">
                        <section.icon className="h-12 w-12 text-blue-600 mx-auto" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                          {section.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          {section.stats.total} available resources
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

export default ContentHub;