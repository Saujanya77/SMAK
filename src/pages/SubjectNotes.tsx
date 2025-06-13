import React, { useState } from 'react';
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
  User, 
  Settings, 
  LogOut, 
  Search,
  Bell,
  ChevronDown,
  Clock,
  Eye,
  Heart,
  Download,
  Bookmark,
  Sun,
  Moon,
  ExternalLink,
  X,
  BookOpen,
  PenTool
} from 'lucide-react';

type SubjectNote = {
  id: number;
  title: string;
  description: string;
  subject: string;
  author: string;
  pages: number;
  downloads: number;
  likes: number;
  thumbnail: string;
  publishedDate: string;
  difficulty: string;
  isLink: boolean;
  fileUrl?: string;
  externalLink?: string;
  fileType: string;
  tags: string[];
};
const SubjectNotes = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<SubjectNote | null>(null);
  const [subjectNotes, setSubjectNotes] = useState<SubjectNote[]>([
    {
      id: 1,
      title: "Complete Anatomy Atlas - Human Body Systems",
      description: "Comprehensive anatomical reference covering all major body systems with detailed illustrations",
      subject: "Anatomy",
      author: "Dr. Sarah Wilson",
      pages: 245,
      downloads: 1524,
      likes: 342,
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      publishedDate: "2 days ago",
      difficulty: "Intermediate",
      isLink: false,
      fileUrl: "https://example.com/anatomy-atlas.pdf",
      fileType: "PDF",
      tags: ["anatomy", "reference", "illustrations"]
    },
    {
      id: 2,
      title: "Pharmacology Quick Reference Guide",
      description: "Essential drug classifications, mechanisms, and clinical applications",
      subject: "Pharmacology",
      author: "Dr. Michael Chen",
      pages: 156,
      downloads: 2156,
      likes: 478,
      thumbnail: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=250&fit=crop",
      publishedDate: "1 week ago",
      difficulty: "Advanced",
      isLink: true,
      externalLink: "https://www.example.com/pharma-guide",
      fileType: "External Link",
      tags: ["pharmacology", "drugs", "reference"]
    },
    {
      id: 3,
      title: "Pathophysiology Study Notes - Disease Mechanisms",
      description: "Detailed study notes covering pathological processes and disease mechanisms",
      subject: "Pathology",
      author: "Dr. Emily Rodriguez",
      pages: 189,
      downloads: 987,
      likes: 256,
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
      publishedDate: "3 days ago",
      difficulty: "Intermediate",
      isLink: false,
      fileUrl: "https://example.com/pathophysiology-notes.pdf",
      fileType: "PDF",
      tags: ["pathology", "disease", "mechanisms"]
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    author: '',
    difficulty: '',
    pages: '',
    isLink: false,
    fileUrl: '',
    externalLink: '',
    thumbnail: null as string | null,
    fileType: '',
    tags: ''
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (type: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    
    if (type === 'notes') {
      input.accept = '.pdf,.doc,.docx,.ppt,.pptx';
    } else if (type === 'thumbnail') {
      input.accept = 'image/*';
    }
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        console.log(`Uploading ${type}:`, file.name);
        
        if (type === 'thumbnail') {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFormData(prev => ({
              ...prev,
              thumbnail: e.target?.result as string
            }));
          };
          reader.readAsDataURL(file);
        } else if (type === 'notes') {
          setFormData(prev => ({
            ...prev,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type.includes('pdf') ? 'PDF' : 'DOC'
          }));
        }
      }
    };
    
    input.click();
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!formData.title || !formData.subject) {
      alert('Please fill in the required fields: Title and Subject.');
      return;
    }

    const newNote: SubjectNote = {
      id: subjectNotes.length + 1,
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      author: formData.author || user.name,
      pages: parseInt(formData.pages) || 50,
      downloads: 0,
      likes: 0,
      thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      publishedDate: 'Just now',
      difficulty: formData.difficulty || 'Intermediate',
      isLink: formData.isLink,
      fileUrl: formData.fileUrl,
      ...(formData.isLink ? { externalLink: formData.externalLink } : {}),
      fileType: formData.fileType || 'PDF',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setSubjectNotes(prev => [newNote, ...prev]);
    setFormData({
      title: '',
      subject: '',
      description: '',
      author: '',
      difficulty: '',
      pages: '',
      isLink: false,
      fileUrl: '',
      externalLink: '',
      thumbnail: null,
      fileType: '',
      tags: ''
    });
    setShowAddForm(false);
  };

  const handleNoteClick = (note: SubjectNote) => {
    if (note.isLink && note.externalLink) {
      window.open(note.externalLink, '_blank');
    } else {
      setSelectedNote(note);
    }
  };

  if (selectedNote) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedNote(null)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Notes
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedNote.title}</h1>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedNote(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Document Viewer */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {selectedNote.fileType === 'PDF' ? (
                        <iframe
                          src={selectedNote.fileUrl}
                          title={selectedNote.title}
                          className="w-full h-full rounded-t-lg"
                          frameBorder="0"
                        ></iframe>
                      ) : (
                        <div className="text-center">
                          <FileText className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 mb-4">Document Preview</p>
                          <Button 
                            onClick={() => window.open(selectedNote.fileUrl, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download {selectedNote.fileType}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Note Details */}
                <Card className="mt-4">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{selectedNote.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{selectedNote.downloads} downloads</span>
                          <span>•</span>
                          <span>{selectedNote.publishedDate}</span>
                          <span>•</span>
                          <span>{selectedNote.pages} pages</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-2" />
                          {selectedNote.likes}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <PenTool className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{selectedNote.author}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Medical Author</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedNote.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedNote.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Document Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subject:</span>
                      <Badge variant="outline">{selectedNote.subject}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <Badge>{selectedNote.difficulty}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">File Type:</span>
                      <span>{selectedNote.fileType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pages:</span>
                      <span>{selectedNote.pages}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(selectedNote.fileUrl, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {subjectNotes
                      .filter(n => n.id !== selectedNote.id && n.subject === selectedNote.subject)
                      .slice(0, 3)
                      .map(note => (
                        <div 
                          key={note.id}
                          className="flex space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                          onClick={() => setSelectedNote(note)}
                        >
                          <img 
                            src={note.thumbnail} 
                            alt={note.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium line-clamp-2">{note.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{note.author}</p>
                            <p className="text-xs text-gray-500">{note.pages} pages</p>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Notes</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search notes..."
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Subject Notes</h2>
              <p className="text-gray-600 dark:text-gray-400">Comprehensive study materials and reference notes for medical subjects</p>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Notes
            </Button>
          </div>

          {/* Add New Notes Form */}
          {showAddForm && (
            <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-300">Upload New Study Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes Title *</label>
                    <Input 
                      placeholder="Enter notes title" 
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
                    <Input 
                      placeholder="e.g., Anatomy, Physiology" 
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author</label>
                    <Input 
                      placeholder="Author name" 
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pages</label>
                    <Input 
                      placeholder="e.g., 150" 
                      value={formData.pages}
                      onChange={(e) => handleInputChange('pages', e.target.value)}
                      type="number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                    <Input 
                      placeholder="Beginner/Intermediate/Advanced" 
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <Textarea 
                    placeholder="Notes description and content overview..." 
                    rows={4} 
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma-separated)</label>
                  <Input 
                    placeholder="e.g., anatomy, reference, diagrams" 
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="isNotesLink"
                    checked={formData.isLink}
                    onChange={(e) => handleInputChange('isLink', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isNotesLink" className="text-sm text-gray-700 dark:text-gray-300">
                    External Link (Google Drive, Dropbox, etc.)
                  </label>
                </div>

                {formData.isLink ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">External Link</label>
                    <Input 
                      placeholder="https://drive.google.com/..." 
                      value={formData.externalLink}
                      onChange={(e) => handleInputChange('externalLink', e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File URL</label>
                    <Input 
                      placeholder="Document URL or upload below" 
                      value={formData.fileUrl}
                      onChange={(e) => handleInputChange('fileUrl', e.target.value)}
                    />
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => handleFileUpload('notes')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Notes File
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => handleFileUpload('thumbnail')}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Upload Thumbnail
                  </Button>
                </div>

                {formData.thumbnail && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Thumbnail Preview:</p>
                    <img src={formData.thumbnail} alt="Preview" className="w-32 h-20 object-cover rounded" />
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSubmit}
                  >
                    Add Notes
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectNotes.map((note) => (
              <Card key={note.id} className="group hover:shadow-lg transition-all border-gray-200 hover:border-blue-300 cursor-pointer">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={note.thumbnail} 
                    alt={note.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookOpen className="h-16 w-16 text-white" />
                  </div>
                  <Badge className="absolute top-3 right-3 bg-blue-600 text-white">
                    {note.difficulty}
                  </Badge>
                  {note.isLink && (
                    <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Link
                    </Badge>
                  )}
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {note.pages} pages
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {note.subject}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {note.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>By {note.author}</span>
                    <span>{note.publishedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {note.downloads}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {note.likes}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleNoteClick(note)}
                    >
                      {note.isLink && note.externalLink ? (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Link
                        </>
                      ) : (
                        'View Notes'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectNotes;