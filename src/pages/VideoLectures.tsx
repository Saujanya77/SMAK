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
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Clock,
  Eye,
  Heart,
  PlayCircle,
  Bookmark,
  Sun,
  Moon,
  ExternalLink,
  X,
  Loader2
} from 'lucide-react';

// Firebase imports
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable
} from 'firebase/storage';
import { db, storage } from '../firebase.ts'; // Adjust path as needed

type VideoLecture = {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: string;
  views: number;
  likes: number;
  instructor: string;
  thumbnail: string;
  publishedDate: string;
  level: string;
  isLink: boolean;
  videoUrl?: string;
  externalLink?: string;
  notes?: string;
  notesUrl?: string;
  isLocalVideo?: boolean;
  videoFile?: File;
  createdAt?: any;
  updatedAt?: any;
};

const VideoLectures = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoLecture | null>(null);
  const [videoLectures, setVideoLectures] = useState<VideoLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    instructor: '',
    level: '',
    duration: '',
    isLink: false,
    videoUrl: '',
    externalLink: '',
    thumbnail: null as string | null,
    notes: null as string | null,
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
    notesFile: null as File | null
  });

  const user = {
    name: "Dr. John Doe",
    year: "3rd Year MBBS",
    college: "SMAK Medical College",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
  };

  // Load videos from Firebase
  useEffect(() => {
    const loadVideos = () => {
      const videosRef = collection(db, 'videoLectures');
      const q = query(videosRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const videos: VideoLecture[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          videos.push({
            id: doc.id,
            ...data,
            publishedDate: data.createdAt ? formatDate(data.createdAt.toDate()) : 'Just now'
          } as VideoLecture);
        });
        setVideoLectures(videos);
        setLoading(false);
      }, (error) => {
        console.error('Error loading videos:', error);
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribe = loadVideos();
    return () => unsubscribe();
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
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

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const uploadFileToFirebase = async (file: File, path: string, onProgress?: (progress: number) => void) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
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

  const handleFileUpload = (type: string) => {
    const input = document.createElement('input');
    input.type = 'file';

    if (type === 'video') {
      input.accept = 'video/*';
    } else if (type === 'thumbnail') {
      input.accept = 'image/*';
    } else if (type === 'notes') {
      input.accept = '.pdf,.doc,.docx';
    }

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files && target.files[0];
      if (file) {
        console.log(`${type} selected:`, file.name);
        if (type === 'thumbnail') {
          setFormData(prev => ({
            ...prev,
            thumbnail: URL.createObjectURL(file),
            thumbnailFile: file
          }));
        } else if (type === 'notes') {
          setFormData(prev => ({
            ...prev,
            notes: file.name,
            notesFile: file
          }));
        } else if (type === 'video') {
          setFormData(prev => ({
            ...prev,
            videoFile: file,
            videoUrl: URL.createObjectURL(file)
          }));
        }
      }
    };
    input.click();
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.subject) {
      alert('Please fill in required fields');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let thumbnailUrl = '';
      let videoUrl = '';
      let notesUrl = '';

      // Upload thumbnail if provided
      if (formData.thumbnailFile) {
        const thumbnailPath = `thumbnails/${Date.now()}_${formData.thumbnailFile.name}`;
        thumbnailUrl = await uploadFileToFirebase(
            formData.thumbnailFile,
            thumbnailPath,
            (progress) => setUploadProgress(progress * 0.3)
        );
      }

      // Upload video if provided
      if (formData.videoFile) {
        const videoPath = `videos/${Date.now()}_${formData.videoFile.name}`;
        videoUrl = await uploadFileToFirebase(
            formData.videoFile,
            videoPath,
            (progress) => setUploadProgress(30 + (progress * 0.5))
        );
      }

      // Upload notes if provided
      if (formData.notesFile) {
        const notesPath = `notes/${Date.now()}_${formData.notesFile.name}`;
        notesUrl = await uploadFileToFirebase(
            formData.notesFile,
            notesPath,
            (progress) => setUploadProgress(80 + (progress * 0.2))
        );
      }

      // Prepare video data - only include fields that have values
      const videoData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        duration: formData.duration || "30m",
        views: 0,
        likes: 0,
        instructor: formData.instructor || user.name,
        thumbnail: thumbnailUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
        level: formData.level || 'Intermediate',
        isLink: formData.isLink,
        videoUrl: videoUrl || formData.videoUrl,
        isLocalVideo: !!formData.videoFile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Only add optional fields if they have values
      if (formData.isLink && formData.externalLink) {
        videoData.externalLink = formData.externalLink;
      }

      if (formData.notes) {
        videoData.notes = formData.notes;
      }

      if (notesUrl) {
        videoData.notesUrl = notesUrl;
      }

      // Add to Firestore
      await addDoc(collection(db, 'videoLectures'), videoData);

      console.log('Video uploaded successfully');

      // Reset form
      setFormData({
        title: '',
        subject: '',
        description: '',
        instructor: '',
        level: '',
        duration: '',
        isLink: false,
        videoUrl: '',
        externalLink: '',
        thumbnail: null,
        notes: null,
        videoFile: null,
        thumbnailFile: null,
        notesFile: null
      });
      setShowAddForm(false);
      setUploadProgress(100);

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleVideoClick = async (video: VideoLecture) => {
    // Update view count
    try {
      const videoRef = doc(db, 'videoLectures', video.id);
      await updateDoc(videoRef, {
        views: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating view count:', error);
    }

    if (video.isLink && video.externalLink) {
      window.open(video.externalLink, '_blank');
    } else {
      setSelectedVideo(video);
    }
  };

  const handleLike = async (videoId: string) => {
    try {
      const videoRef = doc(db, 'videoLectures', videoId);
      await updateDoc(videoRef, {
        likes: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const renderVideoPlayer = (video: VideoLecture) => {
    if (video.isLocalVideo && video.videoUrl) {
      return (
          <video
              controls
              className="w-full h-full rounded-t-lg"
              poster={video.thumbnail}
          >
            <source src={video.videoUrl} type="video/mp4" />
            <source src={video.videoUrl} type="video/webm" />
            <source src={video.videoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
      );
    } else {
      return (
          <iframe
              src={getEmbedUrl(video.videoUrl)}
              title={video.title}
              className="w-full h-full rounded-t-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
          ></iframe>
      );
    }
  };

  const downloadNotes = (video: VideoLecture) => {
    if (video.notesUrl) {
      window.open(video.notesUrl, '_blank');
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading video lectures...</p>
          </div>
        </div>
    );
  }

  if (selectedVideo) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedVideo(null)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Videos
                </Button>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedVideo.title}</h1>
              </div>
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedVideo(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Player */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-0">
                      <div className="aspect-video">
                        {renderVideoPlayer(selectedVideo)}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Video Details */}
                  <Card className="mt-4">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{selectedVideo.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{selectedVideo.views} views</span>
                            <span>•</span>
                            <span>{selectedVideo.publishedDate}</span>
                            <span>•</span>
                            <span>{selectedVideo.duration}</span>
                            {selectedVideo.isLocalVideo && (
                                <>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-green-600 border-green-200">
                                    Local Video
                                  </Badge>
                                </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLike(selectedVideo.id)}
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            {selectedVideo.likes}
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
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{selectedVideo.instructor}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Medical Instructor</p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{selectedVideo.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Course Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subject:</span>
                        <Badge variant="outline">{selectedVideo.subject}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Level:</span>
                        <Badge>{selectedVideo.level}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span>{selectedVideo.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <Badge variant={selectedVideo.isLocalVideo ? "default" : "outline"}>
                          {selectedVideo.isLocalVideo ? "Local Upload" : "External"}
                        </Badge>
                      </div>
                      {(selectedVideo.notes || selectedVideo.notesUrl) && (
                          <div className="pt-3 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => downloadNotes(selectedVideo)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Download Notes
                            </Button>
                          </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Related Videos */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Related Videos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {videoLectures
                          .filter(v => v.id !== selectedVideo.id && v.subject === selectedVideo.subject)
                          .slice(0, 3)
                          .map(video => (
                              <div
                                  key={video.id}
                                  className="flex space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                                  onClick={() => setSelectedVideo(video)}
                              >
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-20 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium line-clamp-2">{video.title}</h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">{video.instructor}</p>
                                  <div className="flex items-center space-x-2">
                                    <p className="text-xs text-gray-500">{video.duration}</p>
                                    {video.isLocalVideo && (
                                        <Badge variant="outline" className="text-xs">Local</Badge>
                                    )}
                                  </div>
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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Video Lectures</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search videos..."
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Video Lectures</h2>
                <p className="text-gray-600 dark:text-gray-400">Comprehensive video tutorials for medical education</p>
              </div>
              <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={uploading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Video
              </Button>
            </div>

            {/* Add New Video Form */}
            {showAddForm && (
                <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                  <CardHeader>
                    <CardTitle className="text-blue-800 dark:text-blue-300">Upload New Video Lecture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">

                    {uploading && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Uploading...</span>
                            <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video Title *</label>
                        <Input
                            placeholder="Enter video title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            disabled={uploading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
                        <Input
                            placeholder="e.g., Anatomy, Physiology"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            disabled={uploading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instructor</label>
                        <Input
                            placeholder="Instructor name"
                            value={formData.instructor}
                            onChange={(e) => handleInputChange('instructor', e.target.value)}
                            disabled={uploading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                        <Input
                            placeholder="e.g., 1h 30m"
                            value={formData.duration}
                            onChange={(e) => handleInputChange('duration', e.target.value)}
                            disabled={uploading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level</label>
                        <Input
                            placeholder="Beginner/Intermediate/Advanced"
                            value={formData.level}
                            onChange={(e) => handleInputChange('level', e.target.value)}
                            disabled={uploading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                      <Textarea
                          placeholder="Video description and learning objectives..."
                          rows={4}
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          disabled={uploading}
                      />
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <input
                          type="checkbox"
                          id="isVideoLink"
                          checked={formData.isLink}


                    onChange={(e) => handleInputChange('isLink', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isVideoLink" className="text-sm text-gray-700 dark:text-gray-300">
                    External Video Link (YouTube, Vimeo, etc.)
                  </label>
                </div>

                {formData.isLink ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video URL (for embedding)</label>
                      <Input 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        value={formData.videoUrl}
                        onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">External Link (for redirection)</label>
                      <Input 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        value={formData.externalLink}
                        onChange={(e) => handleInputChange('externalLink', e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video URL</label>
                    <Input 
                      placeholder="https://www.youtube.com/watch?v=..." 
                      value={formData.videoUrl}
                      onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    />
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => handleFileUpload('video')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video File
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => handleFileUpload('thumbnail')}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Upload Thumbnail
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => handleFileUpload('notes')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Notes
                  </Button>
                </div>

                {(formData.thumbnail || formData.notes || formData.videoFile) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {formData.thumbnail && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Thumbnail:</p>
                        <img src={formData.thumbnail} alt="Preview" className="w-full h-20 object-cover rounded" />
                      </div>
                    )}
                    {formData.notes && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Notes:</p>
                        <p className="text-sm bg-gray-100 p-2 rounded">{formData.notes}</p>
                      </div>
                    )}
                    {formData.videoFile && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Video File:</p>
                        <p className="text-sm bg-green-100 p-2 rounded text-green-800">{formData.videoFile.name}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSubmit}
                  >
                    Upload Video
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoLectures.map((video) => (
              <Card key={video.id} className="group hover:shadow-lg transition-all border-gray-200 hover:border-blue-300 cursor-pointer">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-16 w-16 text-white" />
                  </div>
                  <Badge className="absolute top-3 right-3 bg-blue-600 text-white">
                    {video.level}
                  </Badge>
                  {video.isLink && (
                    <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Link
                    </Badge>
                  )}
                  {video.isLocalVideo && (
                    <Badge className="absolute top-12 left-3 bg-purple-600 text-white">
                      <Upload className="h-3 w-3 mr-1" />
                      Local
                    </Badge>
                  )}
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {video.subject}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>By {video.instructor}</span>
                    <span>{video.publishedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {video.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {video.likes}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleVideoClick(video)}
                    >
                      {video.isLink && video.externalLink ? (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Link
                        </>
                      ) : (
                        'Watch Now'
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

export default VideoLectures;