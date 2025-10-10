import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bell,
  Search,
  Sun,
  Moon,
  ChevronDown,
  GraduationCap, 
  User, 
  Settings, 
  LogOut,
  BookOpen,
  Clock,
  BarChart3
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useAuth } from "@/contexts/AuthContext.tsx";

const MCQQuestionBank = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [showQuiz, setShowQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Load quizzes from Firebase
  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const querySnapshot = await getDocs(collection(getFirestore(), 'quizzes'));
      const quizList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizList);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  const handleStartQuiz = (quiz) => {
    setShowQuiz(quiz);
    setQuizAnswers({});
  };

  const handleQuizAnswer = (qIdx, optIdx) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!showQuiz) return;
    let score = 0;
    showQuiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) score++;
    });
    alert(`Quiz completed! Your score: ${score}/${showQuiz.questions.length}`);
    setShowQuiz(null);
    setQuizAnswers({});
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

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Enhanced Navbar with better glass effect */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        isDarkMode 
          ? 'bg-slate-900/80 border-blue-800/30 shadow-2xl shadow-blue-900/10' 
          : 'bg-white/95 border-blue-200/20 shadow-2xl shadow-blue-200/10'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.history.back()}
                className={`group transition-all duration-200 ${
                  isDarkMode 
                    ? 'hover:bg-blue-800/20 text-blue-300 border border-blue-800/30' 
                    : 'hover:bg-blue-100 text-blue-700 border border-blue-200'
                } rounded-lg`}
              >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
            </div>

            {/* Center - Enhanced Search */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-500'
                }`} />
                <Input
                  placeholder="Search quizzes by title or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-12 pr-4 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-slate-800/40 border-blue-700/30 focus:border-blue-500 text-white placeholder-blue-300/70' 
                      : 'bg-white/90 border-blue-200/50 focus:border-blue-400 text-gray-900 placeholder-blue-500/70'
                  } focus:scale-[1.02] focus:shadow-lg`}
                />
              </div>
            </div>

            {/* Right side - Enhanced */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <div className={`flex items-center space-x-3 p-2.5 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'bg-slate-800/40 border-blue-700/30' 
                  : 'bg-white/80 border-blue-200/50'
              }`}>
                <Sun className={`h-4 w-4 transition-colors ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-500'
                }`} />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  className="data-[state=checked]:bg-blue-600"
                />
                <Moon className={`h-4 w-4 transition-colors ${
                  isDarkMode ? 'text-blue-400' : 'text-indigo-500'
                }`} />
              </div>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm"
                className={`relative p-2.5 rounded-xl border transition-all ${
                  isDarkMode 
                    ? 'hover:bg-blue-800/20 text-blue-300 border-blue-800/30' 
                    : 'hover:bg-blue-100 text-blue-700 border-blue-200'
                }`}
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </Button>

              {/* Enhanced Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center space-x-3 p-2.5 rounded-xl border transition-all duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-slate-800/60 border-blue-800/30' 
                      : 'hover:bg-white border-blue-200'
                  } ${profileDropdownOpen ? (isDarkMode ? 'bg-slate-800/60' : 'bg-white shadow-lg') : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 ring-2 ring-blue-500/20' 
                      : 'bg-gradient-to-br from-blue-500 to-indigo-500 ring-2 ring-blue-200'
                  }`}>
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>

                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-400">
                      {user?.name?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {user?.year || 'Student'}
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                {profileDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border backdrop-blur-xl py-2 z-50 ${
                    isDarkMode 
                      ? 'bg-slate-800/95 border-blue-700/30' 
                      : 'bg-white/95 border-blue-200/30'
                  }`}>
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-400">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.college || 'College'}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full justify-start rounded-lg mx-2 mt-1 dark:text-gray-400">
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start rounded-lg mx-2 dark:text-gray-400">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout} 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mx-2"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Header */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 mb-6 shadow-2xl">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-6xl font-bold mb-6 bg-gradient-to-r ${
            isDarkMode 
              ? 'from-blue-400 via-indigo-300 to-purple-400' 
              : 'from-blue-600 via-indigo-600 to-purple-700'
          } bg-clip-text text-transparent`}>
            Quiz Center
          </h1>
          <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-blue-200/90' : 'text-blue-700/90'
          }`}>
            Challenge yourself with interactive quizzes and track your learning progress
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <Card className={`group transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'bg-slate-800/40 border-blue-800/20 backdrop-blur-sm' 
              : 'bg-white/80 border-blue-200/20 backdrop-blur-sm'
          } hover:shadow-xl border`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Total Quizzes
                  </p>
                  <p className={`text-3xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {quizzes.length}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                }`}>
                  <BookOpen className={`h-6 w-6 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-500'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`group transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'bg-slate-800/40 border-indigo-800/20 backdrop-blur-sm' 
              : 'bg-white/80 border-indigo-200/20 backdrop-blur-sm'
          } hover:shadow-xl border`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
                  }`}>
                    Active Now
                  </p>
                  <p className={`text-3xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {quizzes.filter(q => q.type === 'manual').length}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'
                }`}>
                  <Clock className={`h-6 w-6 ${
                    isDarkMode ? 'text-indigo-400' : 'text-indigo-500'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`group transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'bg-slate-800/40 border-purple-800/20 backdrop-blur-sm' 
              : 'bg-white/80 border-purple-200/20 backdrop-blur-sm'
          } hover:shadow-xl border`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-600'
                  }`}>
                    Google Forms
                  </p>
                  <p className={`text-3xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {quizzes.filter(q => q.type === 'gform').length}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <BarChart3 className={`h-6 w-6 ${
                    isDarkMode ? 'text-purple-400' : 'text-purple-500'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quizzes Section */}
        <div className="space-y-8">
          {showQuiz ? (
            <div className={`max-w-4xl mx-auto p-8 rounded-2xl shadow-2xl border backdrop-blur-sm ${
              isDarkMode ? 'bg-slate-800/50 border-blue-800/30' : 'bg-white/90 border-blue-200/30'
            }`}>
              <div className="flex items-center gap-6 mb-8">
                {showQuiz.thumbnail && (
                  <img 
                    src={showQuiz.thumbnail} 
                    alt={showQuiz.title} 
                    className="w-24 h-24 object-cover rounded-2xl shadow-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {showQuiz.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {showQuiz.type === 'manual' ? 'Interactive Quiz' : 'Google Form'}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {showQuiz.questions?.length || 0} questions
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {showQuiz.questions?.map((q, idx) => (
                  <div key={idx} className={`p-6 rounded-xl border transition-all ${
                    isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`font-semibold mb-4 text-lg ${isDarkMode ? 'text-blue-200' : 'text-gray-900'}`}>
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm mr-3 ${
                        isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {idx + 1}
                      </span>
                      {q.question}
                    </div>
                    <div className="grid gap-3">
                      {q.options?.map((opt, oIdx) => (
                        <label key={oIdx} className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all border-2 ${
                          quizAnswers[idx] === oIdx
                            ? isDarkMode 
                              ? 'bg-blue-900/30 border-blue-600 shadow-lg shadow-blue-900/20' 
                              : 'bg-blue-50 border-blue-400 shadow-lg shadow-blue-200/20'
                            : isDarkMode 
                              ? 'bg-slate-600/30 border-slate-500 hover:bg-slate-600/50' 
                              : 'bg-white border-gray-300 hover:bg-gray-100'
                        }`}>
                          <input
                            type="radio"
                            name={`quiz-q${idx}`}
                            checked={quizAnswers[idx] === oIdx}
                            onChange={() => handleQuizAnswer(idx, oIdx)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`flex-1 ${isDarkMode ? 'text-blue-100' : 'text-gray-900'}`}>
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="outline"
                  onClick={() => setShowQuiz(null)}
                  className={`rounded-lg px-8 py-2.5 ${
                    isDarkMode 
                      ? 'border-blue-700 text-blue-300 hover:bg-blue-800/30' 
                      : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  Cancel
                </Button>
                <Button 
                  className="rounded-lg px-8 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                  onClick={handleSubmitQuiz}
                >
                  Submit Quiz
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizzes.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    isDarkMode ? 'bg-slate-700/50' : 'bg-gray-200'
                  }`}>
                    <BookOpen className={`h-8 w-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <p className={`text-xl mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No quizzes available yet
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Check back later for new quizzes
                  </p>
                </div>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <Card key={quiz.id} className={`group transition-all duration-300 hover:scale-105 hover:shadow-2xl border backdrop-blur-sm ${
                    isDarkMode 
                      ? 'bg-slate-800/40 border-blue-800/20 hover:bg-slate-800/60' 
                      : 'bg-white/80 border-blue-200/20 hover:bg-white shadow-lg'
                  }`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        {quiz.thumbnail && (
                          <img 
                            src={quiz.thumbnail} 
                            alt={quiz.title} 
                            className="w-16 h-16 object-cover rounded-xl flex-shrink-0 shadow-md"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <CardTitle className={`text-lg leading-tight mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {quiz.title}
                          </CardTitle>
                          <CardDescription className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {quiz.description || 'Test your knowledge with this interactive quiz'}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className={`flex items-center ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                            <BookOpen className="h-4 w-4 mr-1" />
                            {quiz.questions?.length || 0} Questions
                          </span>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                            {quiz.type === 'manual' ? 'Interactive' : 'Google Form'}
                          </span>
                        </div>
                        {quiz.category && (
                          <div className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${
                            isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {quiz.category}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardContent className="pt-0">
                      {quiz.type === 'manual' ? (
                        <Button 
                          className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                          onClick={() => handleStartQuiz(quiz)}
                        >
                          Start Quiz
                        </Button>
                      ) : quiz.gformLink ? (
                        <a 
                          href={quiz.gformLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full block"
                        >
                          <Button className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all">
                            Open Google Form
                          </Button>
                        </a>
                      ) : null}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MCQQuestionBank;