import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ArrowLeft,
  Plus,
  Upload,
  FileText,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Eye,
  Download,
  ExternalLink,
  Sun,
  Moon,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Firebase imports
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  deleteDoc
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../firebase'; // adjust path as needed

interface JournalsProps {
  onBack: () => void;
}

interface Journal {
  id: string;
  title: string;
  authors: string;
  journal: string;
  abstract: string;
  publishedDate: string;
  citationCount: number;
  downloadCount: number;
  category: string;
  impact: string;
  imageUrl: string; // Changed from 'image' to 'imageUrl'
  pdfUrl: string;
  externalUrl: string;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: any;
  status: string;
}

const Journals: React.FC<JournalsProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // States
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfError, setPdfError] = useState(false);

  // PDF Viewer states
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15; // Mock total pages - you can implement actual PDF page counting

  // Form states
  const [newJournal, setNewJournal] = useState({
    title: '',
    authors: '',
    journal: '',
    abstract: '',
    category: '',
    externalUrl: '',
    pdfFile: null as File | null,
    coverImage: null as File | null
  });

  // Load journals on component mount
  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    try {
      setLoading(true);
      const journalsRef = collection(db, 'journals');
      const q = query(journalsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const journalsData: Journal[] = [];
      querySnapshot.forEach((doc) => {
        journalsData.push({
          id: doc.id,
          ...doc.data()
        } as Journal);
      });

      setJournals(journalsData);
    } catch (error) {
      console.error('Error loading journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFileToStorage = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'pdf') {
        // Validate PDF file
        if (file.type !== 'application/pdf') {
          alert('Please upload a PDF file');
          return;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          alert('PDF file size should be less than 10MB');
          return;
        }
        setNewJournal(prev => ({ ...prev, pdfFile: file }));
      } else {
        // Validate image file
        if (!file.type.startsWith('image/')) {
          alert('Please upload an image file');
          return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          alert('Image file size should be less than 5MB');
          return;
        }
        setNewJournal(prev => ({ ...prev, coverImage: file }));
      }
    }
  };

  const handleAddJournal = async () => {
    if (!newJournal.title || !newJournal.authors || !newJournal.journal || !newJournal.abstract) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);

      // Upload PDF file if provided
      let pdfUrl = '';
      if (newJournal.pdfFile) {
        const pdfPath = `journals/${user?.id}/${Date.now()}_${newJournal.pdfFile.name}`;
        pdfUrl = await uploadFileToStorage(newJournal.pdfFile, pdfPath);
      }

      // Upload cover image (or use default)
      let imageUrl = "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop";

      if (newJournal.coverImage) {
        const imagePath = `journal-covers/${user?.id}/${Date.now()}_${newJournal.coverImage.name}`;
        imageUrl = await uploadFileToStorage(newJournal.coverImage, imagePath);
      }

      // Create journal document in Firestore
      const journalData: Partial<Journal> = {
        title: newJournal.title,
        authors: newJournal.authors,
        journal: newJournal.journal,
        abstract: newJournal.abstract,
        category: newJournal.category || 'General',
        externalUrl: newJournal.externalUrl || '',
        imageUrl: imageUrl,
        citationCount: 0,
        downloadCount: 0,
        impact: 'New Publication',
        uploadedBy: user?.id,
        uploadedByName: user?.name,
        publishedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        createdAt: serverTimestamp(),
        status: 'pending'
      };
      if (pdfUrl) {
        journalData.pdfUrl = pdfUrl;
      }

      await addDoc(collection(db, 'journals'), journalData);

      // Reset form
      setNewJournal({
        title: '',
        authors: '',
        journal: '',
        abstract: '',
        category: '',
        externalUrl: '',
        pdfFile: null,
        coverImage: null
      });

      setShowAddForm(false);

      // Reload journals
      await loadJournals();

      alert('Journal uploaded successfully!Wait for the journal to get approved by admin.');
    } catch (error) {
      console.error('Error uploading journal:', error);
      alert('Error uploading journal. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleViewJournal = (journal: Journal) => {
    setSelectedJournal(journal);
  };

  const handleViewPDF = async (journal: Journal) => {
    console.log('PDF URL:', journal.pdfUrl); // Debug log
    setSelectedJournal(journal);
    setShowPDFViewer(true);
    setZoom(100);
    setRotation(0);
    setCurrentPage(1);
    setPdfError(false);

    // Increment view count
    try {
      const journalRef = doc(db, 'journals', journal.id);
      await updateDoc(journalRef, {
        downloadCount: increment(1)
      });

      // Update the local state to reflect the change
      setJournals(prev => prev.map(j =>
        j.id === journal.id
          ? { ...j, downloadCount: j.downloadCount + 1 }
          : j
      ));
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const handleDownload = async () => {
    if (selectedJournal?.pdfUrl) {
      try {
        // Increment download count
        const journalRef = doc(db, 'journals', selectedJournal.id);
        await updateDoc(journalRef, {
          downloadCount: increment(1)
        });

        // Update local state
        setJournals(prev => prev.map(j =>
          j.id === selectedJournal.id
            ? { ...j, downloadCount: j.downloadCount + 1 }
            : j
        ));

        // Download file
        const link = document.createElement('a');
        link.href = selectedJournal.pdfUrl;
        link.download = `${selectedJournal.title}.pdf`;
        link.target = '_blank';
        link.click();
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    }
  };

  const handleExternalLink = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setProfileDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // PDF Viewer functions
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const closePDFViewer = () => {
    setShowPDFViewer(false);
    setSelectedJournal(null);
    setPdfError(false);
  };

  // Only show approved journals and filter based on search term
  const filteredJournals = journals
    .filter(journal => journal.status === 'approved')
    .filter(journal =>
      journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Admin email list
  const ADMIN_EMAILS = ['admin@example.com', 'anotheradmin@example.com', 'smak.founder@gmail.com', 'smak.researchclub@gmail.com', 'smak.quizclub@gmail.com', 'Sjmsr.journal@gmail.com', 'Team.smak2025@gmail.com', 'Khushal.smak@gmail.com', 'Samudra.smak@gmail.com'];

  // Delete journal function
  const handleDeleteJournal = async (journalId: string) => {
    if (!window.confirm('Are you sure you want to delete this journal?')) return;
    try {
      await deleteDoc(doc(db, 'journals', journalId));
      setJournals(prev => prev.filter(j => j.id !== journalId));
      alert('Journal deleted successfully.');
    } catch (error) {
      console.error('Error deleting journal:', error);
      alert('Error deleting journal.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading journals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 gap-2 md:gap-4">
          <div className="flex items-center space-x-2 md:space-x-4 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs md:text-sm px-2 md:px-4"
            >
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
            <h1 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Journals</h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 flex-1 md:flex-none">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-8 md:pl-10 text-sm bg-white/50 dark:bg-gray-800/50 border-gray-300/50 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-100/50 p-2"
            >
              {darkMode ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>

            <Button variant="ghost" size="sm" className="relative p-2 hidden sm:inline-flex">
              <Bell className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-1 md:space-x-2 p-2"
              >
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-blue-100 dark:bg-slate-600 flex items-center justify-center ring-2 ring-blue-100 dark:ring-slate-600">
                  <span className="text-xs md:text-sm font-semibold text-blue-800 dark:text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 md:h-4 md:w-4 hidden sm:inline" />
              </Button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.college}</p>
                  </div>
                  {/* Only show admin panel link for admin users */}
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
                  })() ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => { setProfileDropdownOpen(false); navigate('/adminpanel'); }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  )}
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
      <div className="p-3 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6 md:mb-8 flex-col sm:flex-row gap-4 sm:gap-0">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Medical Journals</h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Latest research papers and publications</p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg text-sm md:text-base px-3 md:px-4 whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Add Journal</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          {/* Add New Journal Form */}
          {showAddForm && (
            <Card className="mb-6 md:mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-blue-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-base md:text-lg text-blue-800 dark:text-blue-300">Add New Journal Article</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Article Title</label>
                  <Input
                    placeholder="Enter article title"
                    value={newJournal.title}
                    onChange={(e) => setNewJournal(prev => ({ ...prev, title: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Authors</label>
                    <Input
                      placeholder="Authors names"
                      value={newJournal.authors}
                      onChange={(e) => setNewJournal(prev => ({ ...prev, authors: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Journal Name</label>
                    <Input
                      placeholder="Journal publication name"
                      value={newJournal.journal}
                      onChange={(e) => setNewJournal(prev => ({ ...prev, journal: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <Input
                      placeholder="e.g., Cardiology, Neurology"
                      value={newJournal.category}
                      onChange={(e) => setNewJournal(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">External URL (Optional)</label>
                  <Input
                    placeholder="https://..."
                    value={newJournal.externalUrl}
                    onChange={(e) => setNewJournal(prev => ({ ...prev, externalUrl: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Abstract</label>
                  <Textarea
                    placeholder="Article abstract..."
                    rows={4}
                    value={newJournal.abstract}
                    onChange={(e) => setNewJournal(prev => ({ ...prev, abstract: e.target.value }))}
                  />
                </div>
                <div className="flex space-x-4">
                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'pdf')}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <Button
                      variant="outline"
                      className={`flex items-center ${newJournal.pdfFile ? 'bg-green-50 border-green-300 text-green-700' : ''}`}
                      asChild
                    >
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <FileText className="h-4 w-4 mr-2" />
                        {newJournal.pdfFile ? `PDF: ${newJournal.pdfFile.name}` : 'Upload PDF'}
                      </label>
                    </Button>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      variant="outline"
                      className={`flex items-center ${newJournal.coverImage ? 'bg-green-50 border-green-300 text-green-700' : ''}`}
                      asChild
                    >
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        {newJournal.coverImage ? `Image: ${newJournal.coverImage.name}` : 'Upload Cover Image'}
                      </label>
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button
                    onClick={handleAddJournal}
                    disabled={uploading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Save Article'
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Journals List */}
          <div className="space-y-4 md:space-y-6">
            {filteredJournals.map((journal) => (
              <Card key={journal.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-xl transition-all border-gray-200/50 hover:border-blue-300/50 group">
                <CardContent className="p-3 md:p-6">
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-6">
                    <div className="sm:w-32 md:w-40 lg:w-48 flex-shrink-0 w-full">
                      <img
                        src={journal.imageUrl}
                        alt={journal.title}
                        className="w-full h-24 sm:h-28 md:h-32 lg:h-40 object-cover rounded-lg md:rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2 md:mb-3 gap-2 flex-col sm:flex-row">
                        <div className="flex items-center space-x-1 md:space-x-2 flex-wrap gap-1">
                          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs md:text-sm">
                            {journal.category}
                          </Badge>
                          <Badge className={`${journal.impact === 'Very High Impact' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            journal.impact === 'High Impact' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                              journal.impact === 'Moderate Impact' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                'bg-gradient-to-r from-gray-500 to-slate-500'
                            } text-white border-0 text-xs md:text-sm`}>
                            {journal.impact}
                          </Badge>
                        </div>
                        <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">{journal.publishedDate}</span>
                      </div>

                      <h3 className="text-base md:text-xl font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {journal.title}
                      </h3>

                      <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 mb-1 md:mb-2 font-medium">
                        {journal.journal}
                      </p>

                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-3 line-clamp-1 md:line-clamp-none">
                        By {journal.authors}
                      </p>

                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
                        {journal.abstract}
                      </p>

                      <div className="flex items-center justify-between flex-col sm:flex-row gap-3">
                        <div className="flex items-center space-x-3 md:space-x-6 text-xs md:text-sm text-gray-500">
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="hidden sm:inline">{journal.citationCount} citations</span>
                            <span className="sm:hidden">{journal.citationCount}</span>
                          </span>
                          <span className="flex items-center">
                            <Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="hidden sm:inline">{journal.downloadCount} downloads</span>
                            <span className="sm:hidden">{journal.downloadCount}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2 w-full sm:w-auto flex-wrap justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewJournal(journal)}
                            className="text-xs md:text-sm px-2 md:px-3"
                          >
                            <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          {journal.pdfUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPDF(journal)}
                              className="text-green-600 border-green-300 hover:bg-green-50 text-xs md:text-sm px-2 md:px-3"
                            >
                              <FileText className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              <span className="hidden md:inline">PDF</span>
                            </Button>
                          )}
                          {journal.externalUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExternalLink(journal.externalUrl)}
                              className="text-xs md:text-sm px-2 md:px-3 hidden md:inline-flex"
                            >
                              <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              Link
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs md:text-sm px-2 md:px-3"
                            onClick={() => handleDownload()}
                          >
                            <Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                          {/* Admin-only delete button */}
                          {ADMIN_EMAILS.includes(user?.email) && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50 px-2"
                              onClick={() => handleDeleteJournal(journal.id)}
                              title="Delete Journal"
                            >
                              <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJournals.length === 0 && !loading && (
            <div className="text-center py-8 md:py-12">
              <FileText className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-1 md:mb-2">No journals found</h3>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first journal article.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Journal Detail Modal */}
      <Dialog open={!!selectedJournal && !showPDFViewer} onOpenChange={() => setSelectedJournal(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedJournal && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{selectedJournal.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <img
                  src={selectedJournal.imageUrl} // Fixed: was selectedJournal.image
                  alt={selectedJournal.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{selectedJournal.category}</Badge>
                  <Badge className="bg-blue-600">{selectedJournal.impact}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-600">{selectedJournal.journal}</h4>
                  <p className="text-sm text-gray-500">By {selectedJournal.authors}</p>
                  <p className="text-sm text-gray-500">{selectedJournal.publishedDate}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Abstract</h4>
                  <p className="text-gray-600">{selectedJournal.abstract}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {selectedJournal.citationCount} citations
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    {selectedJournal.downloadCount} downloads
                  </span>
                </div>
                <div className="flex space-x-2 pt-4">
                  {selectedJournal.pdfUrl && (
                    <Button
                      onClick={() => setShowPDFViewer(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View PDF
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleExternalLink(selectedJournal.externalUrl)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    External Link
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Modal */}
      <Dialog open={showPDFViewer} onOpenChange={() => setShowPDFViewer(false)}>
        <DialogContent className="max-w-2xl md:max-w-6xl max-h-[90vh] p-0 w-[95vw]">
          {selectedJournal && (
            <div className="h-[90vh] flex flex-col bg-gray-50 dark:bg-gray-900">
              {/* PDF Viewer Header */}
              <div className="flex items-center justify-between p-2 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 gap-2 flex-wrap">
                <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
                  <Button variant="ghost" size="sm" onClick={closePDFViewer} className="p-1">
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 text-xs md:text-sm">
                      {selectedJournal.title}
                    </h3>
                    <div className="flex items-center space-x-1 md:space-x-2 mt-1 flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                        {selectedJournal.category}
                      </Badge>
                      <span className="text-xs text-gray-500 line-clamp-1">
                        By {selectedJournal.authors}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 md:space-x-2">
                  <Button variant="outline" size="sm" onClick={handleDownload} className="text-xs md:text-sm px-2 md:px-3">
                    <Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExternalLink(selectedJournal.externalUrl)} className="text-xs md:text-sm px-2 md:px-3 hidden sm:inline-flex">
                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Link
                  </Button>
                </div>
              </div>

              {/* PDF Viewer Toolbar */}
              <div className="flex items-center justify-between p-2 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 gap-2 flex-wrap">
                <div className="flex items-center space-x-1 md:space-x-2">
                  <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1} className="p-1 md:p-2">
                    <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 min-w-[80px] md:min-w-[100px] text-center">
                    Page {currentPage}/{totalPages}
                  </span>
                  <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages} className="p-1 md:p-2">
                    <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-1 md:space-x-2">
                  <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50} className="p-1 md:p-2">
                    <ZoomOut className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 min-w-[45px] md:min-w-[60px] text-center">
                    {zoom}%
                  </span>
                  <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200} className="p-1 md:p-2">
                    <ZoomIn className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRotate} className="p-1 md:p-2 hidden sm:inline-flex">
                    <RotateCw className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-sm text-gray-500 hidden sm:flex">
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    {selectedJournal.citationCount}
                  </span>
                  <span className="flex items-center">
                    <Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    {selectedJournal.downloadCount}
                  </span>
                </div>
              </div>

              {/* PDF Content Area */}
              <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 p-2 md:p-4">
                <div className="max-w-2xl md:max-w-4xl mx-auto">
                  {selectedJournal.pdfUrl ? (
                    /* Actual PDF Viewer for uploaded PDFs */
                    <div
                      className="bg-white shadow-lg mx-auto transition-all duration-300 border"
                      style={{
                        transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                        width: '210mm',
                        minHeight: '297mm'
                      }}
                    >
                      {pdfError ? (
                        /* Error fallback */
                        <div className="h-full flex items-center justify-center flex-col gap-4 p-8">
                          <FileText className="h-16 w-16 text-gray-400" />
                          <div className="text-center">
                            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                              Unable to display PDF
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              The PDF might not be compatible with the browser viewer
                            </p>
                            <Button
                              onClick={handleDownload}
                              className="mt-4 gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download PDF Instead
                            </Button>
                          </div>
                        </div>
                      ) : (
                        /* PDF iframe with proper Firebase URL handling */
                        <iframe
                          src={`${selectedJournal.pdfUrl}#page=${currentPage}&zoom=${zoom}`}
                          width="100%"
                          height="800px"
                          className="border-0"
                          title="PDF Preview"
                          onError={() => setPdfError(true)}
                          onLoad={() => setPdfError(false)}
                        />
                      )}
                    </div>
                  ) : (
                    /* Fallback when no PDF URL is available */
                    <div
                      className="bg-white shadow-lg mx-auto transition-all duration-300"
                      style={{
                        transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                        width: '210mm',
                        minHeight: '297mm'
                      }}
                    >
                      <div className="h-full flex items-center justify-center flex-col gap-4 p-8">
                        <FileText className="h-16 w-16 text-gray-400" />
                        <div className="text-center">
                          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                            No PDF Available
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            This journal doesn't have an uploaded PDF file
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Journals;