import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bell,
  Search,
  Sun,
  Moon,
  Upload,
  Eye,
  Plus,
  Edit,
  Trash2,
  Play,
  BookOpen,
  Brain,
  Users,
  Clock,
  FileText,
  Download,
  ChevronDown,
  GraduationCap, User, Settings, LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {db, storage} from "@/firebase.ts";
import {useAuth} from "@/contexts/AuthContext.tsx";



interface QuestionBank {
  id: string;
  title: string;
  description: string;
  questions: number;
  uploadDate: string;
  documentUrl?: string;
  documentName?: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  createdAt: Date;
}

interface MCQTest {
  id: string;
  title: string;
  questions: MCQQuestion[];
  totalMarks: number;
  duration: number;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  createdAt: Date;
}

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

const MCQQuestionBank = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'questionBank' | 'mcq'>('questionBank');
  const [showAddQuestionBank, setShowAddQuestionBank] = useState(false);
  const [showAddMCQ, setShowAddMCQ] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const [showMCQTest, setShowMCQTest] = useState<MCQTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  // State for Firebase data
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [mcqTests, setMcqTests] = useState<MCQTest[]>([]);
  const navigate = useNavigate();
  const [newQuestionBank, setNewQuestionBank] = useState({
    title: '',
    description: '',
    file: null as File | null,
    category: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard'
  });

  const [newMCQ, setNewMCQ] = useState({
    title: '',
    duration: 60,
    category: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    questions: [] as MCQQuestion[]
  });

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 1
  });
  const { user, logout } = useAuth();

  // Load data from Firebase on component mount
  useEffect(() => {
    loadQuestionBanks();
    loadMCQTests();
  }, []);

  const loadQuestionBanks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'questionBanks'));
      const banks: QuestionBank[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        banks.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date() // Fix: Convert Firestore timestamp
        } as QuestionBank);
      });
      banks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setQuestionBanks(banks);
    } catch (error) {
      console.error('Error loading question banks:', error);
    }
  };

  const loadMCQTests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'mcqTests'));
      const tests: MCQTest[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tests.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as MCQTest);
      });
      tests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setMcqTests(tests);
    } catch (error) {
      console.error('Error loading MCQ tests:', error);
    }
  };

  const uploadFile = async (file: File): Promise<{ url: string; name: string }> => {
    const fileRef = ref(storage, `questionBanks/${Date.now()}_${file.name}`);

    try {
      setUploadProgress(0);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setUploadProgress(100);

      return {
        url: downloadURL,
        name: file.name
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
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
  const handleAddQuestionBank = async () => {
    if (!newQuestionBank.title || !newQuestionBank.description) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let documentUrl = '';
      let documentName = '';

      // Upload file if provided
      if (newQuestionBank.file) {
        const uploadResult = await uploadFile(newQuestionBank.file);
        documentUrl = uploadResult.url;
        documentName = uploadResult.name;
      }

      const questionBank = {
        title: newQuestionBank.title,
        description: newQuestionBank.description,
        questions: Math.floor(Math.random() * 100) + 50, // You can make this dynamic
        uploadDate: new Date().toISOString().split('T')[0],
        documentUrl,
        documentName,
        category: newQuestionBank.category,
        difficulty: newQuestionBank.difficulty,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'questionBanks'), questionBank);

      // Reset form
      setNewQuestionBank({ title: '', description: '', file: null, category: '', difficulty: 'Medium' });
      setShowAddQuestionBank(false);
      setUploadProgress(0);

      // Reload data
      await loadQuestionBanks();

    } catch (error) {
      console.error('Error adding question bank:', error);
      alert('Error adding question bank. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestionBank = async (id: string, documentUrl?: string) => {
    if (!confirm('Are you sure you want to delete this question bank?')) return;

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'questionBanks', id));

      // Delete file from Storage if exists
      if (documentUrl) {
        try {
          // Fix: Create reference from URL properly
          const fileRef = ref(storage, documentUrl);
          await deleteObject(fileRef);
        } catch (error) {
          console.log('File deletion error:', error);
        }
      }

      // Reload data
      await loadQuestionBanks();

    } catch (error) {
      console.error('Error deleting question bank:', error);
      alert('Error deleting question bank. Please try again.');
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question || !newQuestion.options.every(opt => opt.trim())) {
      alert('Please fill in the question and all options');
      return;
    }

    const questionWithId: MCQQuestion = {
      ...newQuestion,
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    setNewMCQ({
      ...newMCQ,
      questions: [...newMCQ.questions, questionWithId]
    });

    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1
    });
  };

  const handleSaveMCQ = async () => {
    if (!newMCQ.title || newMCQ.questions.length === 0) {
      alert('Please provide a title and add at least one question');
      return;
    }

    setLoading(true);
    try {
      const totalMarks = newMCQ.questions.reduce((sum, q) => sum + q.marks, 0);

      const mcqTest = {
        title: newMCQ.title,
        duration: newMCQ.duration,
        totalMarks,
        category: newMCQ.category,
        difficulty: newMCQ.difficulty,
        questions: newMCQ.questions,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'mcqTests'), mcqTest);

      // Reset form
      setNewMCQ({ title: '', duration: 60, category: '', difficulty: 'Medium', questions: [] });
      setShowAddMCQ(false);

      // Reload data
      await loadMCQTests();

    } catch (error) {
      console.error('Error saving MCQ test:', error);
      alert('Error saving MCQ test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMCQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this MCQ test?')) return;

    try {
      await deleteDoc(doc(db, 'mcqTests', id));
      await loadMCQTests();
    } catch (error) {
      console.error('Error deleting MCQ test:', error);
      alert('Error deleting MCQ test. Please try again.');
    }
  };

  const handleStartTest = (test: MCQTest) => {
    setShowMCQTest(test);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (showMCQTest && currentQuestionIndex < showMCQTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviewDocument = (documentUrl: string) => {
    if (documentUrl) {
      // Open PDF in new tab for preview
      window.open(documentUrl, '_blank');
    }
  };
  const handleSubmitTest = () => {
    if (!showMCQTest) return;

    let score = 0;
    showMCQTest.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score += question.marks;
      }
    });

    alert(`Test completed! Your score: ${score}/${showMCQTest.totalMarks}`);
    setShowMCQTest(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const filteredQuestionBanks = questionBanks.filter(bank =>
      bank.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMCQTests = mcqTests.filter(test =>
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // MCQ Test Interface
  if (showMCQTest) {
    const currentQuestion = showMCQTest.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / showMCQTest.questions.length) * 100;

    return (
      <div className={`min-h-screen transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
      }`}>
        <div className="container mx-auto px-4 py-8">
          {/* Test Header */}
          <div className={`mb-8 p-6 rounded-2xl ${
            isDarkMode 
              ? 'bg-slate-800/60 border border-blue-800/30 backdrop-blur-sm' 
              : 'bg-white/90 border border-blue-200/30 backdrop-blur-sm shadow-lg'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {showMCQTest.title}
              </h1>
              <Button 
                onClick={() => setShowMCQTest(null)}
                variant="ghost"
                className={isDarkMode ? 'hover:bg-blue-800/30 text-blue-300' : 'hover:bg-blue-100/50 text-blue-700'}
              >
                Exit Test
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>
                  Question {currentQuestionIndex + 1} of {showMCQTest.questions.length}
                </span>
                <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-blue-100'}`}>
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <Card className={`mb-8 ${
            isDarkMode 
              ? 'bg-slate-800/60 border-blue-800/30 backdrop-blur-sm' 
              : 'bg-white/90 border-blue-200/30 backdrop-blur-sm shadow-lg'
          }`}>
            <CardHeader>
              <CardTitle className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentQuestion.question}
              </CardTitle>
              <CardDescription className={isDarkMode ? 'text-blue-300' : 'text-blue-600'}>
                Marks: {currentQuestion.marks}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    answers[currentQuestion.id] === index
                      ? isDarkMode
                        ? 'border-blue-500 bg-blue-900/30'
                        : 'border-blue-500 bg-blue-50'
                      : isDarkMode
                        ? 'border-blue-800/30 hover:border-blue-700 bg-slate-700/30'
                        : 'border-blue-200 hover:border-blue-300 bg-white/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion.id] === index
                        ? 'border-blue-500 bg-blue-500'
                        : isDarkMode
                          ? 'border-blue-400'
                          : 'border-blue-400'
                    }`}>
                      {answers[currentQuestion.id] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className={`${
                isDarkMode 
                  ? 'border-blue-700 text-blue-300 hover:bg-blue-800/30' 
                  : 'border-blue-200 text-blue-700 hover:bg-blue-50'
              }`}
            >
              Previous
            </Button>
            
            {currentQuestionIndex === showMCQTest.questions.length - 1 ? (
              <Button
                onClick={handleSubmitTest}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                Submit Test
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                Next Question
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

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
                  placeholder="Search questions, tests, or topics..."
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
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.college}</p>
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
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-5xl font-bold mb-4 bg-gradient-to-r ${
            isDarkMode 
              ? 'from-blue-400 to-indigo-300' 
              : 'from-blue-600 to-indigo-700'
          } bg-clip-text text-transparent`}>
            MCQ & Question Bank
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDarkMode ? 'text-blue-200' : 'text-blue-700'
          }`}>
            Master medical knowledge with comprehensive question banks and interactive MCQ tests designed for medical professionals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className={`${
            isDarkMode 
              ? 'bg-slate-800/50 border-blue-800/30 backdrop-blur-sm' 
              : 'bg-white/80 border-blue-200/30 backdrop-blur-sm shadow-lg'
          } hover:shadow-xl transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    Total Question Banks
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {questionBanks.length}
                  </p>
                </div>
                <BookOpen className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              </div>
            </CardContent>
          </Card>
          
          <Card className={`${
            isDarkMode 
              ? 'bg-slate-800/50 border-blue-800/30 backdrop-blur-sm' 
              : 'bg-white/80 border-blue-200/30 backdrop-blur-sm shadow-lg'
          } hover:shadow-xl transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    MCQ Tests
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {mcqTests.length}
                  </p>
                </div>
                <Users className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              </div>
            </CardContent>
          </Card>
          
          <Card className={`${
            isDarkMode 
              ? 'bg-slate-800/50 border-blue-800/30 backdrop-blur-sm' 
              : 'bg-white/80 border-blue-200/30 backdrop-blur-sm shadow-lg'
          } hover:shadow-xl transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    Total Questions
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {questionBanks.reduce((sum, bank) => sum + bank.questions, 0)}
                  </p>
                </div>
                <Clock className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className={`flex rounded-2xl p-2 ${
            isDarkMode 
              ? 'bg-slate-800/60 backdrop-blur-sm border border-blue-800/30' 
              : 'bg-white/80 backdrop-blur-sm border border-blue-200/30 shadow-lg'
          }`}>
            <Button
              variant={activeTab === 'questionBank' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('questionBank')}
              className={`px-8 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'questionBank' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                  : isDarkMode ? 'hover:bg-blue-800/30 text-blue-300' : 'hover:bg-blue-100/50 text-blue-700'
              }`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Question Bank
            </Button>
            <Button
              variant={activeTab === 'mcq' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('mcq')}
              className={`px-8 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'mcq' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                  : isDarkMode ? 'hover:bg-blue-800/30 text-blue-300' : 'hover:bg-blue-100/50 text-blue-700'
              }`}
            >
              <Brain className="h-4 w-4 mr-2" />
              MCQ Tests
            </Button>
          </div>
        </div>

        {/* Question Bank Section */}
        {activeTab === 'questionBank' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Question Banks
              </h2>
              <Button 
                onClick={() => setShowAddQuestionBank(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question Bank
              </Button>
            </div>

            {/* Enhanced Add Question Bank Form */}
            {showAddQuestionBank && (
              <Card className={`${
                isDarkMode 
                  ? 'bg-slate-800/60 border-blue-800/30 backdrop-blur-sm' 
                  : 'bg-white/90 border-blue-200/30 backdrop-blur-sm shadow-lg'
              }`}>
                <CardHeader>
                  <CardTitle className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Add New Question Bank
                  </CardTitle>
                  <CardDescription className={isDarkMode ? 'text-blue-300' : 'text-blue-600'}>
                    Create a comprehensive question bank for medical topics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title" className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={newQuestionBank.title}
                        onChange={(e) => setNewQuestionBank({...newQuestionBank, title: e.target.value})}
                        placeholder="Enter question bank title"
                        className={`mt-2 ${isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white placeholder-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder-gray-500'}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Category
                      </Label>
                      <Input
                        id="category"
                        value={newQuestionBank.category}
                        onChange={(e) => setNewQuestionBank({...newQuestionBank, category: e.target.value})}
                        placeholder="e.g., Cardiology, Neurology"
                        className={`mt-2 ${isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white placeholder-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder-gray-500'}`}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description" className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newQuestionBank.description}
                      onChange={(e) => setNewQuestionBank({...newQuestionBank, description: e.target.value})}
                      placeholder="Enter detailed description"
                      className={`mt-2 min-h-[100px] ${isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white placeholder-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder-gray-500'}`}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="difficulty" className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Difficulty Level
                      </Label>
                      <select
                        value={newQuestionBank.difficulty}
                        onChange={(e) => setNewQuestionBank({...newQuestionBank, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard'})}
                        className={`w-full p-3 border rounded-lg mt-2 ${
                          isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white' : 'bg-white border-blue-200 text-gray-900'
                        }`}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="file" className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Upload Document (Optional)
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => setNewQuestionBank({...newQuestionBank, file: e.target.files?.[0] || null})}
                        accept=".pdf,.doc,.docx"
                        className={`mt-2 ${isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white' : 'bg-white border-blue-200 text-gray-900'}`}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="space-x-3">
                  <Button 
                    onClick={handleAddQuestionBank}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  >
                    Save Question Bank
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddQuestionBank(false)}
                    className={isDarkMode ? 'border-blue-700 text-blue-300 hover:bg-blue-800/30' : 'border-blue-200 text-blue-700 hover:bg-blue-50'}
                  >
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Enhanced Question Banks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {questionBanks.map((bank) => (
                <Card key={bank.id} className={`group transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  isDarkMode 
                    ? 'bg-slate-800/60 border-blue-800/30 backdrop-blur-sm hover:bg-slate-800/80' 
                    : 'bg-white/90 border-blue-200/30 backdrop-blur-sm hover:bg-white shadow-lg'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className={`text-lg leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {bank.title}
                      </CardTitle>
                      {bank.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(bank.difficulty)}`}>
                          {bank.difficulty}
                        </span>
                      )}
                    </div>
                    {bank.category && (
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {bank.category}
                      </span>
                    )}
                    <CardDescription className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
                      {bank.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BookOpen className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                            {bank.questions} Questions
                          </span>
                        </div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {bank.uploadDate}
                        </span>
                      </div>
                      {bank.documentUrl && (
                        <div className={`p-2 rounded-lg ${
                          isDarkMode ? 'bg-slate-700/50' : 'bg-blue-50'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <Upload className={`h-3 w-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                            <span className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                              {bank.documentUrl}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="space-x-2 pt-3">
                    {bank.documentUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewDocument(bank.documentUrl!)}
                        className={`${
                          isDarkMode 
                            ? 'border-blue-700 text-blue-300 hover:bg-blue-800/30' 
                            : 'border-blue-200 text-blue-700 hover:bg-blue-50 bg-white'
                        } flex-1`}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className={`${
                        isDarkMode 
                          ? 'border-blue-700 text-blue-300 hover:bg-blue-800/30' 
                          : 'border-blue-200 text-blue-700 hover:bg-blue-50 bg-white'
                      } flex-1`}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced MCQ Section */}
        {activeTab === 'mcq' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                MCQ Tests
              </h2>
              <Button 
                onClick={() => setShowAddMCQ(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Test
              </Button>
            </div>

            {/* Enhanced Add MCQ Form */}
            {showAddMCQ && (
              <Card className={`${
                isDarkMode 
                  ? 'bg-slate-800/60 border-blue-800/30 backdrop-blur-sm' 
                  : 'bg-white/90 border-blue-200/30 backdrop-blur-sm shadow-lg'
              }`}>
                <CardHeader>
                  <CardTitle className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Create New MCQ Test
                  </CardTitle>
                  <CardDescription className={isDarkMode ? 'text-blue-300' : 'text-blue-600'}>
                    Build an interactive multiple choice test for medical assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="mcqTitle" className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Test Title
                      </Label>
                      <Input
                        id="mcqTitle"
                        value={newMCQ.title}
                        onChange={(e) => setNewMCQ({...newMCQ, title: e.target.value})}
                        placeholder="Enter test title"
                        className={`mt-2 ${isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white placeholder-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder-gray-500'}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration" className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Duration (minutes)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newMCQ.duration}
                        onChange={(e) => setNewMCQ({...newMCQ, duration: parseInt(e.target.value)})}
                        className={`mt-2 ${isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white' : 'bg-white border-blue-200 text-gray-900'}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mcqCategory" className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Category
                      </Label>
                      <Input
                        id="mcqCategory"
                        value={newMCQ.category}
                        onChange={(e) => setNewMCQ({...newMCQ, category: e.target.value})}
                        placeholder="e.g., Anatomy, Physiology"
                        className={`mt-2 ${isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white placeholder-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder-gray-500'}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mcqDifficulty" className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Difficulty Level
                      </Label>
                      <select
                        value={newMCQ.difficulty}
                        onChange={(e) => setNewMCQ({...newMCQ, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard'})}
                        className={`w-full p-3 border rounded-lg mt-2 ${
                          isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white' : 'bg-white border-blue-200 text-gray-900'
                        }`}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Enhanced Add Question Form */}
                  <div className={`border-t pt-6 ${isDarkMode ? 'border-blue-800/30' : 'border-blue-200/30'}`}>
                    <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Add Question
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <Label className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Question</Label>
                        <Textarea
                          value={newQuestion.question}
                          onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                          placeholder="Enter your question"
                          className={`mt-2 min-h-[80px] ${isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white placeholder-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder-gray-500'}`}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {newQuestion.options.map((option, index) => (
                          <div key={index}>
                            <Label className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                              Option {index + 1}
                            </Label>
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...newQuestion.options];
                                newOptions[index] = e.target.value;
                                setNewQuestion({...newQuestion, options: newOptions});
                              }}
                              placeholder={`Option ${index + 1}`}
                              className={`mt-2 ${isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white placeholder-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder-gray-500'}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Correct Answer</Label>
                          <select
                            value={newQuestion.correctAnswer}
                            onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: parseInt(e.target.value)})}
                            className={`w-full p-3 border rounded-lg mt-2 ${
                              isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white' : 'bg-white border-blue-200 text-gray-900'
                            }`}
                          >
                            {newQuestion.options.map((_, index) => (
                              <option key={index} value={index}>Option {index + 1}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Marks</Label>
                          <Input
                            type="number"
                            value={newQuestion.marks}
                            onChange={(e) => setNewQuestion({...newQuestion, marks: parseInt(e.target.value)})}
                            min="1"
                            className={`mt-2 ${isDarkMode ? 'bg-slate-700/50 border-blue-700/50 text-white' : 'bg-white border-blue-200 text-gray-900'}`}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={handleAddQuestion} 
                        variant="outline"
                        className={`${
                          isDarkMode 
                            ? 'border-blue-700 text-blue-300 hover:bg-blue-800/30' 
                            : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                        } w-full`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </div>

                  {/* Questions List */}
                  {newMCQ.questions.length > 0 && (
                    <div className={`border-t pt-6 ${isDarkMode ? 'border-blue-800/30' : 'border-blue-200/30'}`}>
                      <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Questions Added ({newMCQ.questions.length})
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {newMCQ.questions.map((q, index) => (
                          <div key={q.id} className={`p-4 border rounded-lg ${
                            isDarkMode ? 'bg-slate-700/30 border-blue-800/30' : 'bg-blue-50/50 border-blue-200/30'
                          }`}>
                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Q{index + 1}: {q.question}
                            </p>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                              Marks: {q.marks} | Correct Answer: Option {q.correctAnswer + 1}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="space-x-3">
                  <Button 
                    onClick={handleSaveMCQ}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  >
                    Save Test
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddMCQ(false)}
                    className={isDarkMode ? 'border-blue-700 text-blue-300 hover:bg-blue-800/30' : 'border-blue-200 text-blue-700 hover:bg-blue-50'}
                  >
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Enhanced MCQ Tests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mcqTests.map((test) => (
                <Card key={test.id} className={`group transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  isDarkMode 
                    ? 'bg-slate-800/60 border-blue-800/30 backdrop-blur-sm hover:bg-slate-800/80' 
                    : 'bg-white/90 border-blue-200/30 backdrop-blur-sm hover:bg-white shadow-lg'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className={`text-lg leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {test.title}
                      </CardTitle>
                      {test.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                          {test.difficulty}
                        </span>
                      )}
                    </div>
                    {test.category && (
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {test.category}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Brain className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                          <div>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Questions</p>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                              {test.questions.length}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                          <div>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duration</p>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                              {test.duration} min
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-blue-50'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                            Total Marks
                          </span>
                          <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {test.totalMarks}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="space-x-2 pt-3">
                    <Button 
                      size="sm"
                      onClick={() => handleStartTest(test)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex-1"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start Test
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className={`${
                        isDarkMode 
                          ? 'border-blue-700 text-blue-300 hover:bg-blue-800/30' 
                          : 'border-blue-200 text-blue-700 hover:bg-blue-50 bg-white'
                      } flex-1`}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Document Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-5xl w-full h-5/6 rounded-2xl overflow-hidden shadow-2xl ${
            isDarkMode ? 'bg-slate-800 border border-blue-800/30' : 'bg-white border border-blue-200/30'
          }`}>
            <div className={`flex justify-between items-center p-6 border-b ${
              isDarkMode ? 'border-blue-800/30 bg-slate-800/90' : 'border-blue-200/30 bg-white/90'
            }`}>
              <div className="flex items-center space-x-3">
                <FileText className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Document Preview: {previewDocument}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost"
                  size="sm"
                  className={`${isDarkMode ? 'hover:bg-blue-800/30 text-blue-300' : 'hover:bg-blue-100/50 text-blue-700'}`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setPreviewDocument(null)}
                  className={`${isDarkMode ? 'hover:bg-blue-800/30 text-blue-300' : 'hover:bg-blue-100/50 text-blue-700'} text-2xl`}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className={`p-8 h-full flex items-center justify-center ${
              isDarkMode ? 'bg-slate-900/50' : 'bg-blue-50/30'
            }`}>
              <div className="text-center">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full ${
                  isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                } flex items-center justify-center`}>
                  <FileText className={`h-12 w-12 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <p className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Document Preview
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  PDF viewer integration would show the actual document content here
                </p>
                <p className={`text-xs mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  File: {previewDocument}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MCQQuestionBank;