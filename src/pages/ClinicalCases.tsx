import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Plus,
  Upload,
  Image,
  FileText,
  Video,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Stethoscope,
  Sun,
  Moon,
  X,
  Calendar, GraduationCap
} from 'lucide-react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {useAuth} from "@/contexts/AuthContext.tsx";

const ClinicalCaseOfTheDay = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFullCase, setShowFullCase] = useState(false);
  interface ClinicalCase {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    presentation: string;
    diagnosis: string;
    treatment: string;
    image: string;
    author: string;
    publishedDate: string;
    caseDate: string;
    views: number;
    likes: number;
    comments: number;
    isNew: boolean;
  }

  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    presentation: '',
    diagnosis: '',
    treatment: '',
    caseDate: ''
  });

  const [allCases, setAllCases] = useState([]);
  const [todayCase, setTodayCase] = useState(null);
  const [previousCases, setPreviousCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { user, logout } = useAuth();


  const fetchCasesFromFirebase = async () => {
    try {
      setLoading(true);
      const casesRef = collection(db, 'clinicalCases');
      const q = query(casesRef, orderBy('publishedTimestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      const cases = [];
      querySnapshot.forEach((doc) => {
        cases.push({ id: doc.id, ...doc.data() });
      });

      setAllCases(cases);

      if (cases.length > 0) {
        setTodayCase(cases[0]);
        setPreviousCases(cases.slice(1));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching cases:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCasesFromFirebase();
  }, []);

  const formatDate = (dateString: string) => {
    if (dateString === "Today") return "Today";
    if (dateString === "Yesterday") return "Yesterday";

    // For other date strings, try to parse and format
    const today = new Date();
    const todayTime = today.getTime();

    // Handle "X days ago" format
    if (dateString.includes("days ago")) {
      const days = parseInt(dateString.split(" ")[0]);
      const caseDate = new Date(todayTime - days * 24 * 60 * 60 * 1000);
      return caseDate.toLocaleDateString();
    }

    // Handle "X week ago" format
    if (dateString.includes("week ago")) {
      const weeks = dateString.includes("1 week") ? 1 : parseInt(dateString.split(" ")[0]);
      const caseDate = new Date(todayTime - weeks * 7 * 24 * 60 * 60 * 1000);
      return caseDate.toLocaleDateString();
    }

    return dateString;
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitCase = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop";

      if (selectedImage) {
        const imageFile = document.getElementById('image-upload').files[0];
        const imageRef = ref(storage, `case-images/${Date.now()}-${imageFile.name}`);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      const caseDate = formData.caseDate ? new Date(formData.caseDate) : new Date();
      const publishedTimestamp = new Date();

      const newCase = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty || 'Intermediate',
        presentation: formData.presentation,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        image: imageUrl,
        author: user.name,
        publishedDate: publishedTimestamp.toLocaleDateString(),
        publishedTimestamp: publishedTimestamp,
        caseDate: caseDate.toLocaleDateString(),
        caseDateTimestamp: caseDate,
        views: 0,
        likes: 0,
        comments: 0,
        isNew: true
      };

      const docRef = await addDoc(collection(db, 'clinicalCases'), newCase);

      const caseWithId = { id: docRef.id, ...newCase };

      setAllCases(prev => [caseWithId, ...prev]);
      setTodayCase(caseWithId);
      setPreviousCases(prev => todayCase ? [todayCase, ...prev] : prev);

      setFormData({
        title: '',
        description: '',
        category: '',
        difficulty: '',
        presentation: '',
        diagnosis: '',
        treatment: '',
        caseDate: ''
      });
      setSelectedImage(null);
      setShowAddForm(false);
      setLoading(false);

      alert('Case added successfully and featured as today\'s case!');
    } catch (error) {
      console.error('Error adding case:', error);
      alert('Error adding case. Please try again.');
      setLoading(false);
    }
  };

  const handleViewFullCase = (caseItem: ClinicalCase) => {
    setSelectedCase(caseItem);
    setShowFullCase(true);
  };

  if (loading && !todayCase) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading today's featured case...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Full Case Study Modal */}
        {showFullCase && selectedCase && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Full Case Study</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowFullCase(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <img
                          src={selectedCase.image}
                          alt={selectedCase.title}
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          {selectedCase.category}
                        </Badge>
                        <Badge className="bg-orange-500 text-white">
                          {selectedCase.difficulty}
                        </Badge>
                        {selectedCase.isNew && (
                            <Badge className="bg-green-500 text-white animate-pulse">
                              Today's Featured Case
                            </Badge>
                        )}
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCase.title}</h1>
                      <p className="text-gray-700 dark:text-gray-300">{selectedCase.description}</p>
                      <div className="text-sm text-gray-500">
                        <span>By {selectedCase.author} • Case Date: {selectedCase.caseDate}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {selectedCase.views}
                    </span>
                        <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                          {selectedCase.likes}
                    </span>
                        <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                          {selectedCase.comments}
                    </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-green-50 dark:bg-green-900/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Clinical Presentation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCase.presentation || "Detailed clinical presentation not provided."}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-blue-50 dark:bg-blue-900/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Diagnosis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCase.diagnosis || "Diagnostic information not provided."}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-50 dark:bg-purple-900/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">Treatment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCase.treatment || "Treatment information not provided."}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Clinical Case of the Day</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search cases..."
                    className="w-64 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
              </Button>

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
        </header>

        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Today's Featured Case</h2>
                <p className="text-gray-600 dark:text-gray-400">Learn from real clinical scenarios updated daily</p>
              </div>
              <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit Your Case
              </Button>
            </div>

            {/* Featured Case of the Day */}
            {todayCase && (
                <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-600 text-white mb-2">Case of the Day</Badge>
                        {todayCase.isNew && (
                            <Badge className="bg-green-500 text-white animate-pulse mb-2">
                              New Today!
                            </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {todayCase.caseDate}
                    </span>
                        <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                          {todayCase.views}
                    </span>
                        <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                          {todayCase.likes}
                    </span>
                        <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                          {todayCase.comments}
                    </span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-blue-800 dark:text-blue-300">{todayCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <img
                            src={todayCase.image}
                            alt={todayCase.title}
                            className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {todayCase.category}
                          </Badge>
                          <Badge className="bg-orange-500 text-white">
                            {todayCase.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{todayCase.description}</p>
                        <div className="text-sm text-gray-500">
                          <span>By {todayCase.author} • Published: {todayCase.publishedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button
                          onClick={() => handleViewFullCase(todayCase)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                      >
                        View Full Case Study
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            )}

            {/* Add New Case Form */}
            {showAddForm && (
                <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                  <CardHeader>
                    <CardTitle className="text-blue-800 dark:text-blue-300">Submit Your Clinical Case of the Day</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Share an interesting case with the medical community</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Case Title *</label>
                        <Input
                            placeholder="Enter case title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                        <Input
                            placeholder="e.g., Cardiology, Neurology"
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty Level</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.difficulty}
                            onChange={(e) => handleInputChange('difficulty', e.target.value)}
                        >
                          <option value="">Select difficulty</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Case Date</label>
                        <Input
                            type="date"
                            value={formData.caseDate}
                            onChange={(e) => handleInputChange('caseDate', e.target.value)}
                            className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Case Image</label>
                        <div className="flex items-center space-x-2">
                          <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                          />
                          <label
                              htmlFor="image-upload"
                              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                          >
                            <Image className="h-4 w-4 mr-2" />
                            Upload Image
                          </label>
                          {selectedImage && <span className="text-sm text-green-600">Image selected</span>}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Case Description *</label>
                      <Textarea
                          placeholder="Brief description of the case..."
                          rows={3}
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Clinical Presentation</label>
                      <Textarea
                          placeholder="Patient presentation, symptoms, vital signs..."
                          rows={3}
                          value={formData.presentation}
                          onChange={(e) => handleInputChange('presentation', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diagnosis</label>
                        <Textarea
                            placeholder="Diagnosis and diagnostic findings..."
                            rows={3}
                            value={formData.diagnosis}
                            onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment</label>
                        <Textarea
                            placeholder="Treatment plan and interventions..."
                            rows={3}
                            value={formData.treatment}
                            onChange={(e) => handleInputChange('treatment', e.target.value)}
                        />
                      </div>
                    </div>

                    {selectedImage && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Preview</label>
                          <img src={selectedImage} alt="Preview" className="w-32 h-32 object-cover rounded-md border" />
                        </div>
                    )}

                    <div className="flex space-x-4">
                      <Button onClick={handleSubmitCase} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit as Today\'s Case'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            )}

            {/* Previous Cases Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Previous Cases of the Day</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {previousCases.map((caseItem) => (
                    <Card key={caseItem.id} className="group hover:shadow-lg transition-all border-gray-200 hover:border-blue-300 relative">
                      {caseItem.isNew && (
                          <div className="absolute top-2 left-2 z-10">
                            <Badge className="bg-green-500 text-white animate-pulse">
                              New Case Added
                            </Badge>
                          </div>
                      )}
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                            src={caseItem.image}
                            alt={caseItem.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-3 right-3 bg-orange-500 text-white">
                          {caseItem.difficulty}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {caseItem.category}
                          </Badge>
                          <span className="text-sm text-gray-500 font-medium flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                            {caseItem.caseDate}
                      </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {caseItem.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {caseItem.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {caseItem.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {caseItem.likes}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleViewFullCase(caseItem)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Case
                      </Button>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      By {caseItem.author} • Published: {caseItem.publishedDate}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalCaseOfTheDay;
