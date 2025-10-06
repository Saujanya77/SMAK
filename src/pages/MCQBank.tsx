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
  LogOut
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
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Enhanced Navbar */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        isDarkMode 
          ? 'bg-slate-900/90 border-blue-800/50 shadow-lg shadow-blue-900/20' 
          : 'bg-white/90 border-blue-200/50 shadow-lg shadow-blue-200/20'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.history.back()}
                className={`${isDarkMode ? 'hover:bg-blue-800/30 text-blue-300' : 'hover:bg-blue-100/50 text-blue-700'} transition-colors`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
            </div>

            {/* Center - Enhanced Search */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-500'
                }`} />
                <Input
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-blue-700/50 focus:border-blue-500 text-white placeholder-blue-300' 
                      : 'bg-white/80 border-blue-200 focus:border-blue-400 text-gray-900 placeholder-blue-500'
                  } transition-colors`}
                />
              </div>
            </div>

            {/* Right side - Enhanced */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <div className={`flex items-center space-x-2 p-2 rounded-lg ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-blue-50/50'
              }`}>
                <Sun className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-blue-600'}`} />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
                <Moon className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-gray-400'}`} />
              </div>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm"
                className={`relative ${isDarkMode ? 'hover:bg-blue-800/30 text-blue-300' : 'hover:bg-blue-100/50 text-blue-700'}`}
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* Enhanced Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-slate-600 flex items-center justify-center ring-2 ring-blue-100 dark:ring-slate-600">
                    <span className="text-sm font-semibold text-blue-800 dark:text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>

                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      {user?.name?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {user?.year || 'Student'}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500 transition-transform duration-200" />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.college || 'College'}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
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
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-6">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-5xl font-bold mb-4 bg-gradient-to-r ${
            isDarkMode 
              ? 'from-blue-400 to-indigo-300' 
              : 'from-blue-600 to-indigo-700'
          } bg-clip-text text-transparent`}>
            Quizzes
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDarkMode ? 'text-blue-200' : 'text-blue-700'
          }`}>
            Test your knowledge with interactive quizzes and assessments
          </p>
        </div>

        {/* Stats Card */}
        <div className="flex justify-center mb-12">
          <Card className={`max-w-md ${
            isDarkMode 
              ? 'bg-slate-800/50 border-blue-800/30 backdrop-blur-sm' 
              : 'bg-white/80 border-blue-200/30 backdrop-blur-sm shadow-lg'
          } hover:shadow-xl transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    Available Quizzes
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {quizzes.length}
                  </p>
                </div>
                <GraduationCap className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quizzes Section */}
        <div className="space-y-8">
          {showQuiz ? (
            <div className={`max-w-2xl mx-auto p-6 rounded-xl shadow-lg ${
              isDarkMode ? 'bg-slate-800/60 border border-blue-800/30' : 'bg-white/90 border border-blue-200/30'
            }`}>
              <div className="flex items-center gap-4 mb-6">
                {showQuiz.thumbnail && (
                  <img src={showQuiz.thumbnail} alt={showQuiz.title} className="w-20 h-20 object-cover rounded-lg" />
                )}
                <div>
                  <h3 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {showQuiz.title}
                  </h3>
                  <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {showQuiz.type === 'manual' ? 'Manual Quiz' : 'Google Form'}
                  </span>
                </div>
              </div>
              
              {showQuiz.questions?.map((q, idx) => (
                <div key={idx} className="mb-6">
                  <div className={`font-semibold mb-3 ${isDarkMode ? 'text-blue-200' : 'text-gray-900'}`}>
                    Q{idx + 1}. {q.question}
                  </div>
                  <div className="grid gap-3">
                    {q.options?.map((opt, oIdx) => (
                      <label key={oIdx} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        quizAnswers[idx] === oIdx
                          ? isDarkMode 
                            ? 'bg-blue-900/30 border border-blue-700' 
                            : 'bg-blue-50 border border-blue-300'
                          : isDarkMode 
                            ? 'bg-slate-700/30 border border-slate-600 hover:bg-slate-700/50' 
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}>
                        <input
                          type="radio"
                          name={`quiz-q${idx}`}
                          checked={quizAnswers[idx] === oIdx}
                          onChange={() => handleQuizAnswer(idx, oIdx)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className={isDarkMode ? 'text-blue-200' : 'text-gray-900'}>
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline"
                  onClick={() => setShowQuiz(null)}
                  className={isDarkMode ? 'border-blue-700 text-blue-300 hover:bg-blue-800/30' : 'border-blue-200 text-blue-700 hover:bg-blue-50'}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  onClick={handleSubmitQuiz}
                >
                  Submit Quiz
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizzes.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No quizzes available at the moment.
                  </p>
                </div>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <Card key={quiz.id} className={`group transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    isDarkMode 
                      ? 'bg-slate-800/60 border-blue-800/30 backdrop-blur-sm hover:bg-slate-800/80' 
                      : 'bg-white/90 border-blue-200/30 backdrop-blur-sm hover:bg-white shadow-lg'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        {quiz.thumbnail && (
                          <img 
                            src={quiz.thumbnail} 
                            alt={quiz.title} 
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <CardTitle className={`text-lg leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {quiz.title}
                          </CardTitle>
                          <CardDescription className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {quiz.description || 'Test your knowledge with this interactive quiz'}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className={isDarkMode ? 'text-blue-300' : 'text-blue-600'}>
                            {quiz.questions?.length || 0} Questions
                          </span>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                            {quiz.type === 'manual' ? 'Interactive' : 'Google Form'}
                          </span>
                        </div>
                        {quiz.category && (
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
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
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                          onClick={() => handleStartQuiz(quiz)}
                        >
                          Take Quiz
                        </Button>
                      ) : quiz.gformLink ? (
                        <a 
                          href={quiz.gformLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full block"
                        >
                          <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
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