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
  const [videoProgress, setVideoProgress] = useState(0); // percent watched (modal)
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
    // Load progress from localStorage
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
              const percent = (target.currentTime / target.duration) * 100;
              setVideoProgress(percent);
              // Save progress to localStorage
              localStorage.setItem(`video-progress-${video.id}`, String(percent));
              // Only update card progress for local videos
              setVideoProgressMap(prev => ({ ...prev, [video.id]: percent }));
            }
          }}
          onLoadedMetadata={e => {
            // Restore progress on load
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

    // For external videos, do not show progress bar
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

  // Load videos and courses from Firestore
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
                <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video Title *</label>
                      <Input
                        placeholder="Enter video title"
                        value={formData.title}
                        onChange={e => handleInputChange('title', e.target.value)}
                        disabled={uploading}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
                      <Input
                        placeholder="e.g., Anatomy, Physiology"
                        value={formData.subject}
                        onChange={e => handleInputChange('subject', e.target.value)}
                        disabled={uploading}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instructor</label>
                      <Input
                        placeholder="Instructor name"
                        value={formData.instructor}
                        onChange={e => handleInputChange('instructor', e.target.value)}
                        disabled={uploading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                      <Input
                        placeholder="e.g., 1h 30m"
                        value={formData.duration}
                        onChange={e => handleInputChange('duration', e.target.value)}
                        disabled={uploading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level</label>
                      <Input
                        placeholder="Beginner/Intermediate/Advanced"
                        value={formData.level}
                        onChange={e => handleInputChange('level', e.target.value)}
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
                      onChange={e => handleInputChange('description', e.target.value)}
                      disabled={uploading}
                    />
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="isVideoLink"
                      checked={formData.isLink}
                      onChange={e => handleInputChange('isLink', e.target.checked)}
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
                          onChange={e => handleInputChange('videoUrl', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">External Link (optional - same as video URL if not provided)</label>
                        <Input
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={formData.externalLink}
                          onChange={e => handleInputChange('externalLink', e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video URL</label>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.videoUrl}
                        onChange={e => handleInputChange('videoUrl', e.target.value)}
                      />
                    </div>
                  )}
                  {/* File Inputs for video, thumbnail, notes */}
                  <div className="flex space-x-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Video File</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            handleInputChange('videoFile', e.target.files[0]);
                          }
                        }}
                        disabled={uploading}
                      />
                      {formData.videoFile && (
                        <p className="text-xs mt-1 text-green-700">Selected: {formData.videoFile.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Thumbnail</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            handleInputChange('thumbnailFile', e.target.files[0]);
                            // Show preview
                            const reader = new FileReader();
                            reader.onload = ev => handleInputChange('thumbnail', ev.target?.result);
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                        disabled={uploading}
                      />
                      {formData.thumbnail && (
                        <img src={formData.thumbnail} alt="Preview" className="w-20 h-12 object-cover mt-1 rounded" />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Notes (PDF)</label>
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
                      />
                      {formData.notes && (
                        <p className="text-xs mt-1 text-blue-700">Selected: {formData.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={uploading}
                    >
                      Upload Video
                    </Button>
                    <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          {/* Video Lectures Grid */}
          <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4 mt-8">Lectures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {videoLectures.map((video) => (
              <Card key={video.id} className="group hover:shadow-lg transition-all border-gray-200 hover:border-blue-300 cursor-pointer"
                onClick={() => handleVideoClick(video)}>
                {/* ...existing code for video card... */}
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
                  {/* Progress Bar for video (card) */}
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-200 rounded-b-lg">
                    {/* Only show progress bar for local videos */}
                    {video.isLocalVideo && (
                      <div
                        className="h-2 bg-blue-600 rounded-b-lg transition-all duration-300"
                        style={{ width: `${videoProgressMap[video.id] || 0}%` }}
                      ></div>
                    )}
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
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Video Link:</span>
                          <span className="ml-2 text-blue-700 dark:text-blue-300">{section.videoLink || 'N/A'}</span>
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
    </div>
  );
}

export default VideoLectures;
