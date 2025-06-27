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
  Activity,
  Sun,
  Moon,
  X,
  Calendar,
  Download,
  Filter,
  RotateCcw,
  Zap,
  Scan,
  TestTube,
  Stethoscope,
  Loader2
} from 'lucide-react';

// Firebase imports - adjust path as needed
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../firebase';

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  findings: string;
  impression: string;
  recommendations: string;
  image: string;
  author: string;
  reportDate: string;
  publishedDate: string;
  views: number;
  likes: number;
  comments: number;
  isNew: boolean;
  createdAt?: any;
}

interface Category {
  id?: string;
  name: string;
  icon: any;
  description: string;
  createdAt?: any;
}

const LabImaging = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    findings: '',
    impression: '',
    recommendations: '',
    reportDate: ''
  });
  const [newSectionData, setNewSectionData] = useState({
    name: '',
    description: '',
    icon: 'FileText'
  });

  const navigate = useNavigate();

  const user = {
    name: "Dr. John Doe",
    year: "3rd Year MBBS",
    college: "SMAK Medical College",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
  };

  const [categories, setCategories] = useState<Category[]>([
    { name: 'ECG', icon: Activity, description: 'Electrocardiogram reports and interpretations' },
    { name: 'X-RAY', icon: Scan, description: 'Radiographic imaging reports' },
    { name: 'CBC', icon: TestTube, description: 'Complete Blood Count analysis' },
    { name: 'LFT', icon: Stethoscope, description: 'Liver Function Test results' }
  ]);

  const [reports, setReports] = useState<Report[]>([]);

  // Icon mapping for Firebase stored categories
  const iconMapping = {
    'Activity': Activity,
    'Scan': Scan,
    'TestTube': TestTube,
    'Stethoscope': Stethoscope,
    'FileText': FileText,
    'Heart': Heart,
    'Zap': Zap
  };

  // Load categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesRef = collection(db, 'labCategories');
        const q = query(categoriesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const firebaseCategories: Category[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            firebaseCategories.push({
              id: doc.id,
              name: data.name,
              icon: iconMapping[data.iconName as keyof typeof iconMapping] || FileText,
              description: data.description,
              createdAt: data.createdAt
            });
          });

          // Merge with default categories
          const defaultCategories = [
            { name: 'ECG', icon: Activity, description: 'Electrocardiogram reports and interpretations' },
            { name: 'X-RAY', icon: Scan, description: 'Radiographic imaging reports' },
            { name: 'CBC', icon: TestTube, description: 'Complete Blood Count analysis' },
            { name: 'LFT', icon: Stethoscope, description: 'Liver Function Test results' }
          ];

          // Remove duplicates and combine
          const existingNames = firebaseCategories.map(cat => cat.name);
          const uniqueDefaults = defaultCategories.filter(cat => !existingNames.includes(cat.name));

          setCategories([...uniqueDefaults, ...firebaseCategories]);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Load reports from Firebase
  useEffect(() => {
    const loadReports = async () => {
      try {
        const reportsRef = collection(db, 'labReports');
        const q = query(reportsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const firebaseReports: Report[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            firebaseReports.push({
              id: doc.id,
              title: data.title,
              description: data.description,
              category: data.category,
              findings: data.findings || '',
              impression: data.impression || '',
              recommendations: data.recommendations || '',
              image: data.image,
              author: data.author,
              reportDate: data.reportDate,
              publishedDate: data.publishedDate,
              views: data.views || 0,
              likes: data.likes || 0,
              comments: data.comments || 0,
              isNew: data.isNew || false,
              createdAt: data.createdAt
            });
          });

          setReports(firebaseReports);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error loading reports:', error);
      }
    };

    loadReports();
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToFirebase = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `lab-reports/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewSectionChange = (field: string, value: string) => {
    setNewSectionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitReport = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop";

      // Upload image if selected
      if (selectedImageFile) {
        imageUrl = await uploadImageToFirebase(selectedImageFile);
      }

      const reportDate = formData.reportDate ? new Date(formData.reportDate).toLocaleDateString() : new Date().toLocaleDateString();

      const newReport = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        findings: formData.findings,
        impression: formData.impression,
        recommendations: formData.recommendations,
        image: imageUrl,
        author: user.name,
        reportDate: reportDate,
        publishedDate: new Date().toLocaleDateString(),
        views: 0,
        likes: 0,
        comments: 0,
        isNew: true,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'labReports'), newReport);

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        findings: '',
        impression: '',
        recommendations: '',
        reportDate: ''
      });
      setSelectedImage(null);
      setSelectedImageFile(null);
      setShowAddForm(false);

      alert('Report added successfully!');
    } catch (error) {
      console.error('Error adding report:', error);
      alert('Error adding report. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitNewSection = async () => {
    if (!newSectionData.name || !newSectionData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const newCategory = {
        name: newSectionData.name.toUpperCase(),
        iconName: 'FileText', // Default icon name for Firebase storage
        description: newSectionData.description,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'labCategories'), newCategory);

      // Reset form
      setNewSectionData({
        name: '',
        description: '',
        icon: 'FileText'
      });
      setShowAddSectionForm(false);

      alert('New section added successfully!');
    } catch (error) {
      console.error('Error adding section:', error);
      alert('Error adding section. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewFullReport = (report: Report) => {
    setSelectedReport(report);
    setShowFullReport(true);
  };

  const filteredReports = reports.filter(report => {
    const matchesCategory = selectedCategory === '' || report.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.findings.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
  };

  const downloadReport = (report: Report) => {
    const reportContent = `
Lab & Imaging Report
Title: ${report.title}
Category: ${report.category}
Report Date: ${report.reportDate}
Author: ${report.author}

Description:
${report.description}

Findings:
${report.findings}

Impression:
${report.impression}

Recommendations:
${report.recommendations}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Full Report Modal */}
        {showFullReport && selectedReport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Full Report</h2>
                  <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(selectedReport)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowFullReport(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <img
                          src={selectedReport.image}
                          alt={selectedReport.title}
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          {selectedReport.category}
                        </Badge>
                        {selectedReport.isNew && (
                            <Badge className="bg-green-500 text-white animate-pulse">
                              New Report
                            </Badge>
                        )}
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.title}</h1>
                      <p className="text-gray-700 dark:text-gray-300">{selectedReport.description}</p>
                      <div className="text-sm text-gray-500">
                        <span>By {selectedReport.author} • Report Date: {selectedReport.reportDate}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {selectedReport.views}
                    </span>
                        <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                          {selectedReport.likes}
                    </span>
                        <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                          {selectedReport.comments}
                    </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-green-50 dark:bg-green-900/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Findings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReport.findings || "No findings reported."}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-blue-50 dark:bg-blue-900/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Impression</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReport.impression || "No impression provided."}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-50 dark:bg-purple-900/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReport.recommendations || "No recommendations provided."}</p>
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
                  onClick={() => navigate('/dashboard')}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Lab & Imaging Interpretation</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                <Button
                    variant="ghost"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <ChevronDown className="h-4 w-4" />
                </Button>

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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Lab & Imaging Interpretation</h2>
                <p className="text-gray-600 dark:text-gray-400">Analyze and interpret medical reports and imaging studies</p>
              </div>
              <div className="flex space-x-3">
                <Button
                    onClick={() => setShowAddSectionForm(true)}
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Add Section
                </Button>
                <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={uploading}
                >
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Add Report
                </Button>
              </div>
            </div>

            {/* Filters Section */}
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800 dark:text-blue-300">Filters:</span>
                  </div>

                  <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-blue-200 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                    ))}
                  </select>

                  <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredReports.length} of {reports.length} reports
                  </span>
                    {(selectedCategory || searchTerm) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Clear Filters
                        </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Report Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  const categoryReports = reports.filter(report => report.category === category.name);
                  return (
                      <Card
                          key={category.id || category.name}
                          className="group hover:shadow-lg transition-all border-blue-200 hover:border-blue-300 cursor-pointer"
                          onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="flex justify-center mb-2">
                            <IconComponent className={`h-8 w-8 ${selectedCategory === category.name ? 'text-blue-600' : 'text-gray-600'}`} />
                          </div>
                          <h4 className={`font-semibold mb-1 ${selectedCategory === category.name ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                            {category.name}
                          </h4>
                          <p className="text-xs text-gray-500 mb-2">{category.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {categoryReports.length} reports
                          </Badge>
                        </CardContent>
                      </Card>
                  );
                })}
              </div>
            </div>

            {/* Add New Report Form */}
            {showAddForm && (
                <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                  <CardHeader>
                    <CardTitle className="text-blue-800 dark:text-blue-300">Add New Lab/Imaging Report</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Submit a new medical report or imaging study</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Title *</label>
                        <Input
                            placeholder="Enter report title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            disabled={uploading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            disabled={uploading}
                        >
                          <option value="">Select category</option>
                          {categories.map((category) => (
                              <option key={category.name} value={category.name}>
                                {category.name}
                              </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Date</label>
                        <Input
                            type="date"
                            value={formData.reportDate}
                            onChange={(e) => handleInputChange('reportDate', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Image</label>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                  <Textarea 
                    placeholder="Brief description of the report..." 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Clinical Findings</label>
                  <Textarea 
                    placeholder="Detailed clinical findings and observations..." 
                    rows={3}
                    value={formData.findings}
                    onChange={(e) => handleInputChange('findings', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Impression</label>
                    <Textarea 
                      placeholder="Clinical impression and diagnosis..." 
                      rows={3}
                      value={formData.impression}
                      onChange={(e) => handleInputChange('impression', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommendations</label>
                    <Textarea 
                      placeholder="Treatment recommendations and follow-up..." 
                      rows={3}
                      value={formData.recommendations}
                      onChange={(e) => handleInputChange('recommendations', e.target.value)}
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
                  <Button onClick={handleSubmitReport} className="bg-blue-600 hover:bg-blue-700">
                    Submit Report
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add New Section Form */}
          {showAddSectionForm && (
            <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-900/10">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-300">Add New Report Section</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create a new category for medical reports</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section Name *</label>
                    <Input 
                      placeholder="e.g., MRI, CT Scan, Blood Gas" 
                      value={newSectionData.name}
                      onChange={(e) => handleNewSectionChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                    <Input 
                      placeholder="Brief description of this section" 
                      value={newSectionData.description}
                      onChange={(e) => handleNewSectionChange('description', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={handleSubmitNewSection} className="bg-green-600 hover:bg-green-700">
                    Add Section
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddSectionForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports Grid */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {selectedCategory ? `${selectedCategory} Reports` : 'All Reports'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <Card key={report.id} className="group hover:shadow-lg transition-all border-gray-200 hover:border-blue-300 relative">
                  {report.isNew && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-green-500 text-white animate-pulse">
                        New Report
                      </Badge>
                    </div>
                  )}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img 
                      src={report.image} 
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-blue-600 text-white">
                      {report.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 font-medium flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {report.reportDate}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadReport(report)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {report.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {report.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {report.likes}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleViewFullReport(report)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Report
                      </Button>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      By {report.author} • Published: {report.publishedDate}
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

export default LabImaging;
