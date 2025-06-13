import React, { useState } from 'react';
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
  Heart,
  Download,
  ExternalLink,
  Sun,
  Moon,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface JournalsProps {
  onBack: () => void;
}
const Journals: React.FC<JournalsProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  interface Journal {
    id: number;
    title: string;
    authors: string;
    journal: string;
    abstract: string;
    publishedDate: string;
    citationCount: number;
    downloadCount: number;
    category: string;
    impact: string;
    image: string;
    pdfUrl?: string | null;
    pdfFile?: File | null;
    externalUrl: string;
  }
  
    const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // PDF Viewer states
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15; // Mock total pages
  
  const [journals, setJournals] = useState([
    {
      id: 1,
      title: "Advances in Cardiovascular Medicine: New Treatment Approaches",
      authors: "Dr. Sarah Wilson, Dr. Michael Chen",
      journal: "American Journal of Cardiology",
      abstract: "This comprehensive study examines novel therapeutic approaches in cardiovascular medicine, focusing on minimally invasive procedures and their impact on patient outcomes. The research demonstrates significant improvements in patient recovery times and reduced complications through innovative surgical techniques.",
      publishedDate: "January 2024",
      citationCount: 45,
      downloadCount: 234,
      category: "Cardiology",
      impact: "High Impact",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      pdfUrl: "https://example.com/sample-cardiology.pdf",
      externalUrl: "https://doi.org/10.1016/j.amjcard.2024.01.001"
    },
    {
      id: 2,
      title: "Emerging Trends in Infectious Disease Management",
      authors: "Dr. Emily Rodriguez, Dr. James Patterson",
      journal: "The Lancet Infectious Diseases",
      abstract: "A systematic review of current infectious disease management protocols and emerging antimicrobial resistance patterns in clinical practice. This study provides evidence-based recommendations for healthcare providers dealing with complex infectious disease cases in modern medical settings.",
      publishedDate: "February 2024",
      citationCount: 67,
      downloadCount: 456,
      category: "Infectious Disease",
      impact: "Very High Impact",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
      pdfUrl: "https://example.com/sample-infectious.pdf",
      externalUrl: "https://doi.org/10.1016/S1473-3099(24)00123-4"
    },
    {
      id: 3,
      title: "Pediatric Emergency Medicine: Best Practices and Guidelines",
      authors: "Dr. Lisa Chen, Dr. Robert Kim",
      journal: "Pediatric Emergency Care",
      abstract: "Evidence-based guidelines for pediatric emergency management, including updated protocols for common pediatric emergencies and trauma care. The guidelines incorporate latest research findings and expert consensus to improve outcomes in pediatric emergency settings.",
      publishedDate: "March 2024",
      citationCount: 23,
      downloadCount: 189,
      category: "Pediatrics",
      impact: "Moderate Impact",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=250&fit=crop",
      pdfUrl: "https://example.com/sample-pediatrics.pdf",
      externalUrl: "https://doi.org/10.1097/PEC.0000000000003001"
    }
  ]);

  const [newJournal, setNewJournal] = useState({
    title: '',
    authors: '',
    journal: '',
    abstract: '',
    category: '',
    pdfFile: null as File | null,
    coverImage: null as File | null
  });

  const user = {
    name: "Dr. John Doe",
    year: "3rd Year MBBS",
    college: "SMAK Medical College",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
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
  navigate('/login'); // Add this line to redirect
};

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'pdf') {
        setNewJournal(prev => ({ ...prev, pdfFile: file }));
        setUploadedFile(file);
        console.log('PDF file uploaded:', file.name);
      } else {
        setNewJournal(prev => ({ ...prev, coverImage: file }));
        console.log('Cover image uploaded:', file.name);
      }
    }
  };

  const handleAddJournal = () => {
    if (newJournal.title && newJournal.authors && newJournal.journal && newJournal.abstract) {
      // Create object URL for the uploaded PDF file
      const pdfUrl = newJournal.pdfFile ? URL.createObjectURL(newJournal.pdfFile) : null;
      
      const journal = {
        id: Date.now(),
        title: newJournal.title,
        authors: newJournal.authors,
        journal: newJournal.journal,
        abstract: newJournal.abstract,
        publishedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        citationCount: 0,
        downloadCount: 0,
        category: newJournal.category || 'General',
        impact: 'New Publication',
        image: newJournal.coverImage ? URL.createObjectURL(newJournal.coverImage) : "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop",
        pdfUrl: pdfUrl,
        pdfFile: newJournal.pdfFile, // Store the actual file object for download
        externalUrl: `https://doi.org/10.placeholder/${Date.now()}`
      };

      setJournals(prev => [journal, ...prev]);
      setNewJournal({
        title: '',
        authors: '',
        journal: '',
        abstract: '',
        category: '',
        pdfFile: null,
        coverImage: null
      });
      setUploadedFile(null);
      setShowAddForm(false);
      
      console.log('Journal added with PDF:', journal);
    }
  };

  const handleViewJournal = (journal: Journal) => {
    setSelectedJournal(journal);
  };

  const handleViewPDF = (journal: Journal) => {
    console.log('Opening PDF viewer for:', journal.title, 'PDF URL:', journal.pdfUrl);
    setSelectedJournal(journal);
    setShowPDFViewer(true);
    // Reset PDF viewer states
    setZoom(100);
    setRotation(0);
    setCurrentPage(1);
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // PDF Viewer functions
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    console.log('Downloading PDF:', selectedJournal?.title);
    if (selectedJournal?.pdfUrl) {
      const link = document.createElement('a');
      link.href = selectedJournal.pdfUrl;
      link.download = `${selectedJournal.title}.pdf`;
      link.click();
    }
  };

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const closePDFViewer = () => {
    setShowPDFViewer(false);
    setSelectedJournal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Medical Journals</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search journals..."
                className="w-64 pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-300/50 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            
            <Button 
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-100/50"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2"
              >
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-blue-500/20" />
                <ChevronDown className="h-4 w-4" />
              </Button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
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
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Medical Journals</h2>
              <p className="text-gray-600 dark:text-gray-400">Latest research papers and medical publications</p>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Journal
            </Button>
          </div>

          {/* Add New Journal Form */}
          {showAddForm && (
            <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-blue-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-300">Add New Journal Article</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Article Title</label>
                  <Input 
                    placeholder="Enter article title" 
                    value={newJournal.title}
                    onChange={(e) => setNewJournal(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={!newJournal.title || !newJournal.authors || !newJournal.journal || !newJournal.abstract}
                  >
                    Save Article
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Journals List */}
          <div className="space-y-6">
            {journals.map((journal) => (
              <Card key={journal.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-xl transition-all border-gray-200/50 hover:border-blue-300/50 group">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-48 flex-shrink-0">
                      <img 
                        src={journal.image} 
                        alt={journal.title}
                        className="w-full h-32 lg:h-40 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                            {journal.category}
                          </Badge>
                          <Badge className={`${
                            journal.impact === 'Very High Impact' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            journal.impact === 'High Impact' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 
                            journal.impact === 'Moderate Impact' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-gray-500 to-slate-500'
                          } text-white border-0`}>
                            {journal.impact}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{journal.publishedDate}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {journal.title}
                      </h3>
                      
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 font-medium">
                        {journal.journal}
                      </p>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        By {journal.authors}
                      </p>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {journal.abstract}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {journal.citationCount} citations
                          </span>
                          <span className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            {journal.downloadCount} downloads
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewJournal(journal)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          {journal.pdfUrl && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewPDF(journal)}
                              className="text-green-600 border-green-300 hover:bg-green-50"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              PDF Preview
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleExternalLink(journal.externalUrl)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            External Link
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                            onClick={() => handleViewJournal(journal)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Read Article
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  src={selectedJournal.image} 
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
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          {selectedJournal && (
            <div className="h-[90vh] flex flex-col bg-gray-50 dark:bg-gray-900">
              {/* PDF Viewer Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" onClick={closePDFViewer}>
                    <X className="h-4 w-4" />
                  </Button>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {selectedJournal.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {selectedJournal.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        By {selectedJournal.authors}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExternalLink(selectedJournal.externalUrl)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    External Link
                  </Button>
                </div>
              </div>

              {/* PDF Viewer Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[100px] text-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
                    {zoom}%
                  </span>
                  <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRotate}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {selectedJournal.citationCount} citations
                  </span>
                  <span className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    {selectedJournal.downloadCount} downloads
                  </span>
                </div>
              </div>

              {/* PDF Content Area */}
              <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 p-4">
                <div className="max-w-4xl mx-auto">
                  {selectedJournal.pdfUrl && selectedJournal.pdfUrl.startsWith('blob:') ? (
                    /* Uploaded PDF Viewer */
                    <div 
                      className="bg-white shadow-lg mx-auto transition-all duration-300 border"
                      style={{ 
                        transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                        width: '210mm',
                        minHeight: '297mm'
                      }}
                    >
                      <iframe
                        src={selectedJournal.pdfUrl}
                        width="100%"
                        height="800px"
                        className="border-0"
                        title="PDF Preview"
                      />
                    </div>
                  ) : (
                    /* Mock PDF Pages for journals without uploaded PDFs */
                    <div 
                      className="bg-white shadow-lg mx-auto transition-all duration-300"
                      style={{ 
                        transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                        width: '210mm',
                        minHeight: '297mm'
                      }}
                    >
                      {/* Mock PDF Page Content */}
                      <div className="p-8 space-y-6">
                        <div className="text-center border-b border-gray-200 pb-6">
                          <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedJournal.title}
                          </h1>
                          <p className="text-lg text-gray-600 mb-2">
                            {selectedJournal.authors}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedJournal.journal} • {selectedJournal.publishedDate}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Abstract</h2>
                            <p className="text-gray-700 leading-relaxed">
                              {selectedJournal.abstract}
                            </p>
                          </div>

                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Introduction</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                              The field of medicine continues to evolve rapidly with new discoveries and innovations 
                              emerging at an unprecedented pace. This research paper examines the latest developments 
                              in {selectedJournal.category.toLowerCase()} and their potential impact on clinical practice.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                              Recent studies have highlighted the importance of evidence-based approaches to medical 
                              treatment, particularly in the context of patient safety and treatment efficacy. Our 
                              research builds upon these foundational principles to explore new therapeutic modalities.
                            </p>
                          </div>

                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Methodology</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                              This study employed a comprehensive systematic review approach, analyzing data from 
                              multiple clinical trials and observational studies conducted between 2020 and 2024. 
                              The research methodology was designed to ensure statistical rigor and clinical relevance.
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                              <li>Systematic literature review of peer-reviewed publications</li>
                              <li>Meta-analysis of clinical trial data</li>
                              <li>Statistical analysis using advanced computational methods</li>
                              <li>Peer review and validation by expert clinicians</li>
                            </ul>
                          </div>

                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Results</h2>
                            <p className="text-gray-700 leading-relaxed">
                              Our findings demonstrate significant improvements in patient outcomes when utilizing 
                              the proposed treatment protocols. The data suggests a marked reduction in adverse 
                              events and improved quality of life metrics across all patient cohorts studied.
                            </p>
                          </div>

                          {currentPage > 1 && (
                            <div className="mt-8">
                              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                {currentPage === 2 ? '4. Discussion' : 
                                 currentPage === 3 ? '5. Clinical Implications' :
                                 currentPage === 4 ? '6. Limitations' :
                                 '7. Conclusion'}
                              </h2>
                              <p className="text-gray-700 leading-relaxed">
                                {currentPage === 2 ? 
                                  'The results of this study have important implications for clinical practice. The evidence suggests that implementing these new protocols could significantly improve patient outcomes while reducing healthcare costs.' :
                                  currentPage === 3 ?
                                  'Healthcare providers should consider integrating these findings into their clinical decision-making processes. The protocols outlined in this study provide a framework for evidence-based treatment approaches.' :
                                  currentPage === 4 ?
                                  'While this study provides valuable insights, there are several limitations that should be considered. The sample size was limited to specific geographic regions, and long-term follow-up data is still being collected.' :
                                  'In conclusion, this research contributes significant new knowledge to the field of ' + selectedJournal.category.toLowerCase() + '. The findings support the adoption of new treatment protocols and provide a foundation for future research in this area.'
                                }
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                          Page {currentPage} of {totalPages}
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