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
  Loader2
} from 'lucide-react';

// Firebase imports
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  increment
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable
} from 'firebase/storage';
import { db, storage } from '../firebase';

const ClinicalCases = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [clinicalCases, setClinicalCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    difficulty: 'Beginner',
    duration: ''
  });
  const [selectedFiles, setSelectedFiles] = useState({
    images: [],
    videos: [],
    documents: []
  });

  const navigate = useNavigate();

  const user = {
    name: "Dr. John Doe",
    year: "3rd Year MBBS",
    college: "SMAK Medical College",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
  };

  // Fetch clinical cases from Firebase
  const fetchClinicalCases = async () => {
    try {
      setLoading(true);
      const casesRef = collection(db, 'clinicalCases');
      const q = query(casesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const cases = [];
      querySnapshot.forEach((doc) => {
        cases.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setClinicalCases(cases);
    } catch (error) {
      console.error('Error fetching clinical cases:', error);
    } finally {
      setLoading(false);
    }
  };

  // Upload file to Firebase Storage
  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, `clinical-cases/${path}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
      );
    });
  };

  // Handle file selection
  const handleFileSelect = (type, files) => {
    setSelectedFiles(prev => ({
      ...prev,
      [type]: Array.from(files)
    }));
  };

  // Handle form submission
  const handleSubmitCase = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);

      // Upload files
      const uploadedFiles = {
        images: [],
        videos: [],
        documents: []
      };

      // Upload images
      for (const file of selectedFiles.images) {
        const url = await uploadFile(file, 'images');
        uploadedFiles.images.push({
          name: file.name,
          url: url,
          type: file.type
        });
      }

      // Upload videos
      for (const file of selectedFiles.videos) {
        const url = await uploadFile(file, 'videos');
        uploadedFiles.videos.push({
          name: file.name,
          url: url,
          type: file.type
        });
      }

      // Upload documents
      for (const file of selectedFiles.documents) {
        const url = await uploadFile(file, 'documents');
        uploadedFiles.documents.push({
          name: file.name,
          url: url,
          type: file.type
        });
      }

      // Create case document
      const caseData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        duration: formData.duration,
        author: user.name,
        authorCollege: user.college,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        likes: 0,
        files: uploadedFiles,
        // Use first uploaded image as main image, or default
        image: uploadedFiles.images.length > 0
            ? uploadedFiles.images[0].url
            : "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop"
      };

      // Add to Firestore
      await addDoc(collection(db, 'clinicalCases'), caseData);

      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        difficulty: 'Beginner',
        duration: ''
      });
      setSelectedFiles({
        images: [],
        videos: [],
        documents: []
      });
      setShowAddForm(false);

      // Refresh cases list
      fetchClinicalCases();

      alert('Clinical case added successfully!');
    } catch (error) {
      console.error('Error adding clinical case:', error);
      alert('Error adding clinical case. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle case view (increment views)
  const handleViewCase = async (caseId) => {
    try {
      const caseRef = doc(db, 'clinicalCases', caseId);
      await updateDoc(caseRef, {
        views: increment(1)
      });

      // Update local state
      setClinicalCases(prev =>
          prev.map(case_ =>
              case_.id === caseId
                  ? { ...case_, views: (case_.views || 0) + 1 }
                  : case_
          )
      );

      // Navigate to case detail (you can implement this)
      console.log('Navigate to case:', caseId);
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  // Handle like toggle
  const handleLikeCase = async (caseId) => {
    try {
      const caseRef = doc(db, 'clinicalCases', caseId);
      await updateDoc(caseRef, {
        likes: increment(1)
      });

      // Update local state
      setClinicalCases(prev =>
          prev.map(case_ =>
              case_.id === caseId
                  ? { ...case_, likes: (case_.likes || 0) + 1 }
                  : case_
          )
      );
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  // Format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

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

  // Fetch cases on component mount
  useEffect(() => {
    fetchClinicalCases();
  }, []);

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Clinical Cases</h1>
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Clinical Cases</h2>
                <p className="text-gray-600 dark:text-gray-400">Real patient scenarios and comprehensive case studies</p>
              </div>
              <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={uploading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Case
              </Button>
            </div>

            {/* Add New Case Form */}
            {showAddForm && (
                <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                  <CardHeader>
                    <CardTitle className="text-blue-800 dark:text-blue-300">Add New Clinical Case</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitCase} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Case Title *
                          </label>
                          <Input
                              placeholder="Enter case title"
                              value={formData.title}
                              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                              required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category *
                          </label>
                          <Input
                              placeholder="e.g., Cardiology, Neurology"
                              value={formData.category}
                              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                              required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Difficulty Level
                          </label>
                          <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={formData.difficulty}
                              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Duration
                          </label>
                          <Input
                              placeholder="e.g., 30 min, 1 hour"
                              value={formData.duration}
                              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Case Description *
                        </label>
                        <Textarea
                            placeholder="Detailed case description..."
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            required
                        />
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Images
                          </label>
                          <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleFileSelect('images', e.target.files)}
                              className="hidden"
                              id="images-upload"
                          />
                          <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('images-upload').click()}
                              className="flex items-center"
                          >
                            <Image className="h-4 w-4 mr-2" />
                            Upload Images ({selectedFiles.images.length})
                          </Button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Videos
                          </label>
                          <input
                              type="file"
                              multiple
                              accept="video/*"
                              onChange={(e) => handleFileSelect('videos', e.target.files)}
                              className="hidden"
                              id="videos-upload"
                          />
                          <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('videos-upload').click()}
                              className="flex items-center"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Upload Videos ({selectedFiles.videos.length})
                          </Button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Documents
                          </label>
                          <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={(e) => handleFileSelect('documents', e.target.files)}
                              className="hidden"
                              id="documents-upload"
                          />
                          <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('documents-upload').click()}
                              className="flex items-center"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Upload Documents ({selectedFiles.documents.length})
                          </Button>
                        </div>
                      </div>

                      {uploading && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                      )}

                      <div className="flex space-x-4">
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={uploading}
                        >
                          {uploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                          ) : (
                              'Save Case'
                          )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAddForm(false)}
                            disabled={uploading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading clinical cases...</span>
                </div>
            ) : (
                /* Cases Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clinicalCases.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <Stethoscope className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No Clinical Cases Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Start by adding your first clinical case to share with the community.
                        </p>
                        <Button
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Case
                        </Button>
                      </div>
                  ) : (
                      clinicalCases.map((caseItem) => (
                          <Card key={caseItem.id} className="group hover:shadow-lg transition-all border-gray-200 hover:border-blue-300">
                            <div className="relative h-48 overflow-hidden rounded-t-lg">
                              <img
                                  src={caseItem.image}
                                  alt={caseItem.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <Badge className="absolute top-3 right-3 bg-blue-600 text-white">
                                {caseItem.difficulty}
                              </Badge>
                            </div>
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-blue-600 border-blue-200">
                                  {caseItem.category}
                                </Badge>
                                {caseItem.duration && (
                                    <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                                      {caseItem.duration}
                          </span>
                                )}
                              </div>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {caseItem.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                {caseItem.description}
                              </p>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>By {caseItem.author}</span>
                                <span>{formatDate(caseItem.createdAt)}</span>
                              </div>
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {caseItem.views || 0}
                          </span>
                                  <button
                                      onClick={() => handleLikeCase(caseItem.id)}
                                      className="flex items-center hover:text-red-500 transition-colors"
                                  >
                                    <Heart className="h-4 w-4 mr-1" />
                                    {caseItem.likes || 0}
                                  </button>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleViewCase(caseItem.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  View Case
                                </Button>
                              </div>
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

export default ClinicalCases;