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
  createdAt?: import('firebase/firestore').Timestamp | Date | import('firebase/firestore').FieldValue | null;
  updatedAt?: import('firebase/firestore').Timestamp | Date | import('firebase/firestore').FieldValue | null;
  status?: string;
  uploadedBy?: string;
  uploadedAt?: import('firebase/firestore').Timestamp | Date | import('firebase/firestore').FieldValue | null;
};


const mockUser = {
  name: 'Demo User',
  avatar: 'https://ui-avatars.com/api/?name=Demo+User',
  college: 'Demo College',
};

const VideoLectures = () => {
  // State for video progress bar
  const [videoProgress, setVideoProgress] = useState(0); // percent watched
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
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
    notesFile: null as File | null,
  });
  // Modal state for video popup
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);

  // Placeholder for user context
  const user = mockUser;

  // Placeholder: toggle theme
  const toggleTheme = () => setDarkMode((d) => !d);

  // Placeholder: handle logout
  const handleLogout = () => alert('Logout!');

  // Placeholder: handle input change
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Placeholder: handle file upload
  const handleFileUpload = (type: string) => {
    // This should open a file dialog and update formData
    alert(`File upload for: ${type}`);
  };

  // Placeholder: upload file to Firebase Storage
  const uploadFileToFirebase = async (file: File, path: string, onProgress?: (progress: number) => void) => {
    // Simulate upload
    return new Promise<string>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        if (onProgress) onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve('https://dummyimage.com/400x250/000/fff');
        }
      }, 50);
    });
  };

  // Placeholder: download notes
  const downloadNotes = (video: VideoLecture) => {
    alert('Download notes for: ' + video.title);
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
      const videoData: Partial<VideoLecture> = {
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
        updatedAt: serverTimestamp(),
        status: 'pending',
        uploadedBy: user.name,
        uploadedAt: serverTimestamp()
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
    // Show video in modal popup
    setActiveVideo(video);
    setShowVideoModal(true);
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

    // YouTube URL handling
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo URL handling
    else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1].split('/')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    // Dailymotion URL handling
    else if (url.includes('dailymotion.com/video/')) {
      const videoId = url.split('video/')[1].split('_')[0];
      return `https://www.dailymotion.com/embed/video/${videoId}`;
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
          onTimeUpdate={e => {
            const target = e.target as HTMLVideoElement;
            if (target.duration > 0) {
              setVideoProgress((target.currentTime / target.duration) * 100);
            }
          }}
        >
          <source src={video.videoUrl} type="video/mp4" />
          <source src={video.videoUrl} type="video/webm" />
          <source src={video.videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      );
    }

    // For external videos, we can't track progress directly, but we can show a static bar or try with YouTube API (not implemented here)
    if (video.videoUrl) {
      const embedUrl = getEmbedUrl(video.videoUrl);
      return (
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-t-lg"
          allowFullScreen
          title={video.title}
        />
      );
    }

    return null;
  };

  // Load videos from Firestore
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videosQuery = query(
          collection(db, 'videoLectures'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(videosQuery);
        const videos = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            publishedDate: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString()
          } as VideoLecture;
        }).filter(video => video.status === 'approved'); // Only show approved videos

        setVideoLectures(videos);
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Video Modal Popup */}
      {showVideoModal && activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-5xl w-full relative" style={{ minWidth: '700px', minHeight: '500px' }}>
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-600"
              onClick={() => { setShowVideoModal(false); setActiveVideo(null); setVideoProgress(0); }}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{activeVideo.title}</h2>
              <p className="text-base mb-6 text-gray-600 dark:text-gray-400">{activeVideo.description}</p>
              <div className="mb-6" style={{ height: '350px' }}>
                {renderVideoPlayer(activeVideo)}
                {/* Progress Bar for local video */}
                {activeVideo.isLocalVideo && (
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                    <div
                      className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${videoProgress}%` }}
                    ></div>
                  </div>
                )}
                {/* For external videos, progress bar not shown (YouTube API required for tracking) */}
              </div>
              <div className="flex items-center justify-between text-base text-gray-500">
                <span>By {activeVideo.instructor}</span>
                <span>{activeVideo.publishedDate}</span>
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
                ...existing code...
              </CardContent>
            </Card>
          )}
          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoLectures.map((video) => (
              <Card key={video.id} className="group hover:shadow-lg transition-all border-gray-200 hover:border-blue-300 cursor-pointer"
                onClick={() => handleVideoClick(video)}>
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
                      onClick={e => { e.stopPropagation(); handleVideoClick(video); }}
                    >
                      Watch Now
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
