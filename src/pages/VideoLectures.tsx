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

interface Course {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  sections: any[];
  createdAt?: any;
}

const VideoLectures = () => {
  // State for video progress bar (modal)
  const [videoProgress, setVideoProgress] = useState(0);
  // Track progress for all videos (card display)
  const [videoProgressMap, setVideoProgressMap] = useState<{ [id: string]: number }>({});
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [videoLectures, setVideoLectures] = useState<VideoLecture[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
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
  const [activeVideoLink, setActiveVideoLink] = useState<string | null>(null);

  const user = mockUser;

  const toggleTheme = () => setDarkMode((d) => !d);
  const handleLogout = () => alert('Logout!');

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const uploadFileToFirebase = async (file: File, path: string, onProgress?: (progress: number) => void) => {
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

      if (formData.thumbnailFile) {
        const thumbnailPath = `thumbnails/${Date.now()}_${formData.thumbnailFile.name}`;
        thumbnailUrl = await uploadFileToFirebase(
          formData.thumbnailFile,
          thumbnailPath,
          (progress) => setUploadProgress(progress * 0.3)
        );
      }

      if (formData.videoFile) {
        const videoPath = `videos/${Date.now()}_${formData.videoFile.name}`;
        videoUrl = await uploadFileToFirebase(
          formData.videoFile,
          videoPath,
          (progress) => setUploadProgress(30 + (progress * 0.5))
        );
      }

      if (formData.notesFile) {
        const notesPath = `notes/${Date.now()}_${formData.notesFile.name}`;
        notesUrl = await uploadFileToFirebase(
          formData.notesFile,
          notesPath,
          (progress) => setUploadProgress(80 + (progress * 0.2))
        );
      }

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

      if (formData.isLink && formData.externalLink) {
        videoData.externalLink = formData.externalLink;
      }

      if (formData.notes) {
        videoData.notes = formData.notes;
      }

      if (notesUrl) {
        videoData.notesUrl = notesUrl;
      }

      await addDoc(collection(db, 'videoLectures'), videoData);

      console.log('Video uploaded successfully');

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
    try {
      const videoRef = doc(db, 'videoLectures', video.id);
      await updateDoc(videoRef, {
        views: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating view count:', error);
    }
    const stored = localStorage.getItem(`video-progress-${video.id}`);
    setVideoProgress(stored ? Number(stored) : 0);
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

    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1].split('/')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    } else if (url.includes('dailymotion.com/video/')) {
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
          className="w-full h-full rounded-lg"
          poster={video.thumbnail}
          onTimeUpdate={e => {
            const target = e.target as HTMLVideoElement;
            if (target.duration > 0) {
              const percent = (target.currentTime / target.duration) * 100;
              setVideoProgress(percent);
              localStorage.setItem(`video-progress-${video.id}`, String(percent));
              setVideoProgressMap(prev => ({ ...prev, [video.id]: percent }));
            }
          }}
          onLoadedMetadata={e => {
            const target = e.target as HTMLVideoElement;
            const stored = localStorage.getItem(`video-progress-${video.id}`);
            if (stored && target.duration > 0) {
              const percent = Number(stored);
              target.currentTime = (percent / 100) * target.duration;
              setVideoProgress(percent);
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

    if (video.videoUrl) {
      const embedUrl = getEmbedUrl(video.videoUrl);
      return (
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-lg"
          allowFullScreen
          title={video.title}
        />
      );
    }

    return null;
  };

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
        }).filter(video => video.status === 'approved');
        const progressMap: { [id: string]: number } = {};
        videos.forEach(video => {
          const stored = localStorage.getItem(`video-progress-${video.id}`);
          progressMap[video.id] = stored ? Number(stored) : 0;
        });
        setVideoProgressMap(progressMap);
        setVideoLectures(videos);
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setLoading(false);
      }
    };
    const loadCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'courses'));
        const coursesList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          } as Course;
        });
        setCourses(coursesList);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };
    loadVideos();
    loadCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800">
      {/* Video Modal Popup */}
      {showVideoModal && activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full mx-4 relative">
            <button
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              onClick={() => { setShowVideoModal(false); setActiveVideo(null); setVideoProgress(0); }}
            >
              <X className="h-8 w-8" />
            </button>
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{activeVideo.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{activeVideo.description}</p>
              </div>
              <div className="bg-black rounded-xl overflow-hidden mb-4" style={{ height: '400px' }}>
                {renderVideoPlayer(activeVideo)}
              </div>
              {activeVideo.isLocalVideo && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
                  <div
                    className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${videoProgress}%` }}
                  ></div>
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">By {activeVideo.instructor}</span>
                <span>{activeVideo.publishedDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Video Lectures
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search videos..."
                className="w-64 pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="sm" className="relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-gray-300 dark:ring-gray-600" />
                <ChevronDown className="h-4 w-4" />
              </Button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.college}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut className="h-4 w-4 mr-3" />
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
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Video Library</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">Comprehensive video tutorials for medical education</p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2.5 rounded-xl"
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Upload Video
            </Button>
          </div>

          {/* Add New Video Form */}
          {showAddForm && (
            <Card className="mb-8 border-2 border-blue-200/50 dark:border-blue-500/20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Upload New Video Lecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {uploading && (
                  <div className="mb-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Uploading...</span>
                      <span className="text-sm font-bold text-blue-600">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300 shadow-inner"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Video Title *</label>
                      <Input
                        placeholder="Enter video title"
                        value={formData.title}
                        onChange={e => handleInputChange('title', e.target.value)}
                        disabled={uploading}
                        required
                        className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Subject *</label>
                      <Input
                        placeholder="e.g., Anatomy, Physiology"
                        value={formData.subject}
                        onChange={e => handleInputChange('subject', e.target.value)}
                        disabled={uploading}
                        required
                        className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Instructor</label>
                      <Input
                        placeholder="Instructor name"
                        value={formData.instructor}
                        onChange={e => handleInputChange('instructor', e.target.value)}
                        disabled={uploading}
                        className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Duration</label>
                      <Input
                        placeholder="e.g., 1h 30m"
                        value={formData.duration}
                        onChange={e => handleInputChange('duration', e.target.value)}
                        disabled={uploading}
                        className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Level</label>
                      <Input
                        placeholder="Beginner/Intermediate/Advanced"
                        value={formData.level}
                        onChange={e => handleInputChange('level', e.target.value)}
                        disabled={uploading}
                        className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
                    <Textarea
                      placeholder="Video description and learning objectives..."
                      rows={4}
                      value={formData.description}
                      onChange={e => handleInputChange('description', e.target.value)}
                      disabled={uploading}
                      className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                    <input
                      type="checkbox"
                      id="isVideoLink"
                      checked={formData.isLink}
                      onChange={e => handleInputChange('isLink', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isVideoLink" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      External Video Link (YouTube, Vimeo, etc.)
                    </label>
                  </div>

                  {formData.isLink ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Video URL *</label>
                        <Input
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={formData.videoUrl}
                          onChange={e => handleInputChange('videoUrl', e.target.value)}
                          className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">External Link</label>
                        <Input
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={formData.externalLink}
                          onChange={e => handleInputChange('externalLink', e.target.value)}
                          className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Video URL</label>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.videoUrl}
                        onChange={e => handleInputChange('videoUrl', e.target.value)}
                        className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  )}

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Video File</label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              handleInputChange('videoFile', e.target.files[0]);
                            }
                          }}
                          disabled={uploading}
                          className="hidden"
                          id="video-upload"
                        />
                        <label htmlFor="video-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload video</p>
                        </label>
                      </div>
                      {formData.videoFile && (
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium text-center">
                          ✓ {formData.videoFile.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Thumbnail</label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              handleInputChange('thumbnailFile', e.target.files[0]);
                              const reader = new FileReader();
                              reader.onload = ev => handleInputChange('thumbnail', ev.target?.result);
                              reader.readAsDataURL(e.target.files[0]);
                            }
                          }}
                          disabled={uploading}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label htmlFor="thumbnail-upload" className="cursor-pointer">
                          <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Upload thumbnail</p>
                        </label>
                      </div>
                      {formData.thumbnail && (
                        <img src={formData.thumbnail} alt="Preview" className="w-20 h-12 object-cover mx-auto rounded-lg shadow-sm" />
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Notes (PDF)</label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              handleInputChange('notesFile', e.target.files[0]);
                              handleInputChange('notes', e.target.files[0].name);
                            }
                          }}
                          disabled={uploading}
                          className="hidden"
                          id="notes-upload"
                        />
                        <label htmlFor="notes-upload" className="cursor-pointer">
                          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Upload notes</p>
                        </label>
                      </div>
                      {formData.notes && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium text-center">
                          ✓ {formData.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-2.5 rounded-xl flex-1"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Upload Video'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Video Lectures Grid */}
          <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4 mt-8">Lectures</h3>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {videoLectures.map((video) => (
                <Card
                  key={video.id}
                  className="group hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm overflow-hidden"
                  onClick={() => handleVideoClick(video)}
                >
                  {/* ...existing code for video card... */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-blue-600/90 backdrop-blur-sm text-white border-0 shadow-lg">
                        {video.level}
                      </Badge>
                    </div>

                    {video.isLink && (
                      <Badge className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm text-white border-0 shadow-lg">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        External
                      </Badge>
                    )}

                    {video.isLocalVideo && (
                      <Badge className="absolute top-12 left-3 bg-purple-600/90 backdrop-blur-sm text-white border-0 shadow-lg">
                        <Upload className="h-3 w-3 mr-1" />
                        Local
                      </Badge>
                    )}

                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {video.duration}
                    </div>

                    {/* Progress Bar */}
                    {video.isLocalVideo && (
                      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-300/50 backdrop-blur-sm">
                        <div
                          className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                          style={{ width: `${videoProgressMap[video.id] || 0}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm">
                        {video.subject}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>

                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 text-lg leading-tight">
                      {video.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="font-medium">By {video.instructor}</span>
                      <span>{video.publishedDate}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center font-medium">
                          <Eye className="h-4 w-4 mr-1.5" />
                          {video.views}
                        </span>
                        <span className="flex items-center font-medium">
                          <Heart className="h-4 w-4 mr-1.5" />
                          {video.likes}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2 rounded-lg"
                        onClick={e => { e.stopPropagation(); handleVideoClick(video); }}
                      >
                        Watch Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {/* Courses Section */}
          <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4">Courses</h3>
          {loadingCourses ? (
            <div className="text-center text-gray-500">Loading courses...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.length === 0 ? (
                <div className="text-gray-500 col-span-3">No courses available.</div>
              ) : (
                courses.map(course => (
                  <Card key={course.id} className="border-green-200 hover:border-green-400 transition-all cursor-pointer">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop'}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>Sections: {course.sections?.length || 0}</span>
                        <span>{course.createdAt ? (course.createdAt.toDate ? course.createdAt.toDate().toLocaleDateString() : new Date(course.createdAt).toLocaleDateString()) : ''}</span>
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { setActiveCourse(course); setShowCourseModal(true); }}>View Course</Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
          {/* Video Lectures Empty State */}
          {!loading && videoLectures.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-12 max-w-2xl mx-auto border border-gray-200 dark:border-gray-700">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PlayCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No videos available</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                  Start by uploading your first video lecture to share with students.
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 rounded-xl text-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Upload First Video
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Course Modal Popup */}
      {showCourseModal && activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full relative" style={{ minWidth: '400px', minHeight: '300px' }}>
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-600"
              onClick={() => { setShowCourseModal(false); setActiveCourse(null); }}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-8">
              <div className="flex gap-6 items-center mb-6">
                <img src={activeCourse.thumbnail || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop'} alt={activeCourse.name} className="w-32 h-32 object-cover rounded-xl shadow-lg" />
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{activeCourse.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{activeCourse.description}</p>
                  <span className="text-sm text-gray-500">Created: {activeCourse.createdAt ? (activeCourse.createdAt.toDate ? activeCourse.createdAt.toDate().toLocaleDateString() : new Date(activeCourse.createdAt).toLocaleDateString()) : ''}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-4">Sections</h3>
              {activeCourse.sections && activeCourse.sections.length > 0 ? (
                <div className="space-y-6">
                  {activeCourse.sections.map((section, idx) => (
                    <div key={idx} className="border border-green-200 rounded-xl p-4 bg-green-50 dark:bg-green-900/10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-green-700 dark:text-green-300">Section {idx + 1}:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{section.sectionType === 'video' ? 'Video' : 'Quiz'}</span>
                      </div>
                      {section.sectionType === 'video' && (
                        <div>
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all"
                            onClick={() => {
                              setShowVideoModal(true);
                              setActiveVideoLink(section.videoLink);
                            }}
                            disabled={!section.videoLink}
                          >
                            Play Video
                          </button>
                        </div>
                      )}
                      {section.sectionType === 'quiz' && (
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Quiz Type:</span>
                          <span className="ml-2 text-blue-700 dark:text-blue-300">{section.quizType === 'manual' ? 'Manual' : 'Google Form'}</span>
                          {section.quizType === 'manual' && (
                            <div className="mt-2">
                              <div className="font-semibold text-gray-700 dark:text-gray-300">Quiz Title: <span className="font-normal text-gray-800 dark:text-gray-200">{section.quizTitle || 'Untitled'}</span></div>
                              <div className="font-semibold text-gray-700 dark:text-gray-300">Questions:</div>
                              <ul className="list-disc ml-6 mt-1">
                                {section.questions && section.questions.length > 0 ? section.questions.map((q, qIdx) => (
                                  <li key={qIdx} className="mb-2">
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{q.question}</span>
                                    <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">Options: {q.options.join(', ')}</div>
                                    <div className="ml-4 text-sm text-green-700 dark:text-green-300">Correct Answer: Option {q.correctAnswer + 1}</div>
                                  </li>
                                )) : <li className="text-gray-500">No questions.</li>}
                              </ul>
                            </div>
                          )}
                          {section.quizType === 'gform' && (
                            <div className="mt-2">
                              <span className="font-semibold text-gray-700 dark:text-gray-300">Google Form Link:</span>
                              <a href={section.gformLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline">{section.gformLink || 'N/A'}</a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No sections found for this course.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Popup Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full relative p-8 flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-600"
              onClick={() => { setShowVideoModal(false); setActiveVideoLink(null); }}
            >
              <X className="h-6 w-6" />
            </button>
            {activeVideoLink ? (
              <video controls autoPlay className="w-full h-96 rounded-lg shadow-lg">
                <source src={activeVideoLink} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-gray-500">No video link available.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoLectures;