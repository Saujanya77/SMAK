import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Navigation from '@/components/Navigation';
import { Bookmark, Plus, Search, Filter, Download, Star, FileText, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Notes = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Anatomy Notes - Complete 1st Year",
      subject: "Anatomy",
      year: "1st Year",
      author: "Rahul Sharma",
      downloads: 1250,
      rating: 4.8,
      file: "PDF • 25 MB",
      description: "Comprehensive anatomy notes covering all systems with detailed diagrams and explanations",
      uploadDate: "2024-01-15",
      tags: ["Anatomy", "1st Year", "Comprehensive"],
      college: "AIIMS Delhi"
    },
    {
      id: 2,
      title: "Pathology Quick Reference - 2nd Year", 
      subject: "Pathology",
      year: "2nd Year", 
      author: "Priya Agarwal",
      downloads: 980,
      rating: 4.9,
      file: "PDF • 18 MB",
      description: "Quick reference guide for pathology with disease mechanisms and diagnostic criteria",
      uploadDate: "2024-01-12",
      tags: ["Pathology", "Quick Reference", "2nd Year"],
      college: "CMC Vellore"
    },
    {
      id: 3,
      title: "Pharmacology Drug Classifications",
      subject: "Pharmacology",
      year: "3rd Year",
      author: "Dr. Vikram Singh",
      downloads: 756,
      rating: 4.7,
      file: "PDF • 22 MB",
      description: "Detailed drug classifications with mechanisms of action and clinical uses",
      uploadDate: "2024-01-10",
      tags: ["Pharmacology", "Drugs", "Classifications"],
      college: "JIPMER"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    description: '',
    subject: '',
    year: '',
    fileSize: '',
    fileType: 'PDF'
  });

  const subjects = ['Anatomy', 'Pathology', 'Pharmacology', 'Physiology', 'Biochemistry', 'Microbiology'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Internship'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    const matchesYear = selectedYear === 'all' || note.year === selectedYear;
    return matchesSearch && matchesSubject && matchesYear;
  });

  const handleAddNote = () => {
    if (newNote.title && newNote.description && newNote.subject && newNote.year) {
      const note = {
        id: Date.now(),
        ...newNote,
        author: "You", // In real app, this would be current user
        downloads: 0,
        rating: 0,
        file: `${newNote.fileType} • ${newNote.fileSize}`,
        uploadDate: new Date().toISOString().split('T')[0],
        tags: [newNote.subject, newNote.year],
        college: "Your College"
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', description: '', subject: '', year: '', fileSize: '', fileType: 'PDF' });
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold flex items-center mb-2">
                <Bookmark className="h-10 w-10 mr-3 text-blue-600" />
                Notes Repository
              </h1>
              <p className="text-lg text-muted-foreground">
                High-quality study notes shared by medical students and faculty
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-5 w-5 mr-2" />
                  Upload Notes
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Study Notes</DialogTitle>
                  <DialogDescription>
                    Share your study notes to help fellow medical students
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Notes Title</Label>
                    <Input
                      id="title"
                      value={newNote.title}
                      onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                      placeholder="Enter notes title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Select value={newNote.subject} onValueChange={(value) => setNewNote({...newNote, subject: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="year">Academic Year</Label>
                      <Select value={newNote.year} onValueChange={(value) => setNewNote({...newNote, year: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fileType">File Type</Label>
                      <Select value={newNote.fileType} onValueChange={(value) => setNewNote({...newNote, fileType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PDF">PDF</SelectItem>
                          <SelectItem value="DOC">DOC</SelectItem>
                          <SelectItem value="PPT">PPT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fileSize">File Size</Label>
                      <Input
                        id="fileSize"
                        value={newNote.fileSize}
                        onChange={(e) => setNewNote({...newNote, fileSize: e.target.value})}
                        placeholder="e.g., 25 MB"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newNote.description}
                      onChange={(e) => setNewNote({...newNote, description: e.target.value})}
                      placeholder="Describe the content of your notes..."
                      rows={4}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddNote} className="flex-1">Upload Notes</Button>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="space-y-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-all duration-300 border-2 border-blue-100 dark:border-blue-900/20">
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold hover:text-blue-600 cursor-pointer">
                          {note.title}
                        </h3>
                        <p className="text-muted-foreground">
                          By {note.author} • {note.college}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{note.subject}</Badge>
                          <Badge variant="outline">{note.year}</Badge>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {note.uploadDate}
                          </span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{note.rating}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{note.file}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {note.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          {note.downloads} downloads
                        </span>
                        <div className="flex space-x-1">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button size="sm" variant="outline">Preview</Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notes found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;