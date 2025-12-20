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
  Loader2,
  CheckCircle,
  Lock
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
import { db, storage } from '../firebase.ts';

// Razorpay type declaration
declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  status?: string;
  uploadedBy?: string;
  uploadedAt?: any;
  locked?: boolean;
  price?: number;
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
  locked?: boolean;
  price?: number;
}

interface Section {
  id: string;
  sectionType: 'video' | 'quiz';
  videoLink?: string;
  quizType?: 'manual' | 'gform';
  quizTitle?: string;
  questions?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  gformLink?: string;
  locked?: boolean;
  price?: number;
}

// Helper to check if a link is an embed (YouTube, Vimeo, etc.)
function isEmbedLink(url?: string): boolean {
  if (!url) {
    return false;
  }
  return url.includes('youtube.com/embed') || url.includes('vimeo.com/video');
}

function VideoLectures() {
  const navigate = useNavigate();

  // State declarations
  const [sectionProgress, setSectionProgress] = useState<{ [idx: number]: boolean }>({});
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [activeQuizSection, setActiveQuizSection] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<{ correct: boolean[]; submitted: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
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
    price: 99, // Default price
    locked: false
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentItem, setPaymentItem] = useState<{
    type: 'video' | 'course' | 'section';
    id: string;
    title: string;
    price: number;
  } | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoProgressMap, setVideoProgressMap] = useState<{ [id: string]: number }>({});
  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoLectures, setVideoLectures] = useState<VideoLecture[]>([]);
  const [unlockedItems, setUnlockedItems] = useState<{
    videos: string[];
    courses: string[];
    sections: string[];
  }>({
    videos: [],
    courses: [],
    sections: []
  });

  // Load unlocked items from localStorage
  useEffect(() => {
    const storedUnlocked = localStorage.getItem('unlockedItems');
    if (storedUnlocked) {
      setUnlockedItems(JSON.parse(storedUnlocked));
    }
  }, []);

  // Check if item is unlocked
  const isUnlocked = (type: 'video' | 'course' | 'section', id: string) => {
    return unlockedItems[`${type}s` as keyof typeof unlockedItems].includes(id);
  };

  // Unlock item after payment
  const unlockItem = (type: 'video' | 'course' | 'section', id: string) => {
    const key = `${type}s` as keyof typeof unlockedItems;
    const updatedUnlockedItems = {
      ...unlockedItems,
      [key]: [...unlockedItems[key], id]
    };
    setUnlockedItems(updatedUnlockedItems);
    localStorage.setItem('unlockedItems', JSON.stringify(updatedUnlockedItems));
  };

  // Handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);

    try {
      let thumbnailUrl = formData.thumbnail;
      let notesUrl = formData.notes;
      let videoUrl = formData.videoUrl;

      // Upload thumbnail if file is provided
      if (formData.thumbnailFile) {
        const thumbnailRef = ref(storage, `thumbnails/${Date.now()}_${formData.thumbnailFile.name}`);
        await uploadBytes(thumbnailRef, formData.thumbnailFile);
        thumbnailUrl = await getDownloadURL(thumbnailRef);
      }

      // Upload notes if file is provided
      if (formData.notesFile) {
        const notesRef = ref(storage, `notes/${Date.now()}_${formData.notesFile.name}`);
        await uploadBytes(notesRef, formData.notesFile);
        notesUrl = await getDownloadURL(notesRef);
      }

      // Upload video file if provided (not a link)
      if (!formData.isLink && formData.videoFile) {
        const videoRef = ref(storage, `videos/${Date.now()}_${formData.videoFile.name}`);
        const uploadTask = uploadBytesResumable(videoRef, formData.videoFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            throw error;
          },
          async () => {
            videoUrl = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Save to Firestore after video upload completes
            await saveVideoToFirestore(videoUrl, thumbnailUrl, notesUrl);
          }
        );
      } else {
        // If it's a link or external video, save immediately
        await saveVideoToFirestore(videoUrl, thumbnailUrl, notesUrl);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
      setUploading(false);
    }
  };

  const saveVideoToFirestore = async (videoUrl: string | null, thumbnailUrl: string | null, notesUrl: string | null) => {
    try {
      const videoData = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        instructor: formData.instructor,
        level: formData.level,
        duration: formData.duration,
        isLink: formData.isLink,
        videoUrl: videoUrl || formData.videoUrl || formData.externalLink,
        externalLink: formData.externalLink,
        thumbnail: thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        notes: formData.notes,
        notesUrl: notesUrl,
        isLocalVideo: !formData.isLink && !!formData.videoFile,
        views: 0,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'pending',
        uploadedBy: mockUser.name,
        uploadedAt: serverTimestamp(),
        locked: formData.locked,
        price: formData.price || 99
      };

      await addDoc(collection(db, 'videoLectures'), videoData);
      
      alert('Video uploaded successfully! It will be visible after admin approval.');
      
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
        notesFile: null,
        price: 99,
        locked: false
      });
      setShowAddForm(false);
      setUploadProgress(0);
      
      // Reload videos
      await loadVideos();
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      alert('Failed to save video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleVideoClick = async (video: VideoLecture) => {
    // Check if video is locked
    if (video.locked && !isUnlocked('video', video.id)) {
      setPaymentItem({
        type: 'video',
        id: video.id,
        title: video.title,
        price: video.price || 99
      });
      setShowPaymentModal(true);
      return;
    }

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

  const handleCourseClick = (course: Course) => {
    // Check if course is locked
    if (course.locked && !isUnlocked('course', course.id)) {
      setPaymentItem({
        type: 'course',
        id: course.id,
        title: course.name,
        price: course.price || 199
      });
      setShowPaymentModal(true);
      return;
    }

    setActiveCourse(course);
    setShowCourseModal(true);
  };

  const handleSectionClick = (section: Section, course: Course, sectionIndex: number) => {
    // Check if section is locked
    if (section.locked && !isUnlocked('section', section.id)) {
      setPaymentItem({
        type: 'section',
        id: section.id,
        title: `${course.name} - Section ${sectionIndex + 1}`,
        price: section.price || 49
      });
      setShowPaymentModal(true);
      return;
    }

    if (section.sectionType === 'video' && section.videoLink) {
      setShowVideoModal(true);
      setActiveVideo({
        id: section.id,
        title: `${course.name} - Section ${sectionIndex + 1}`,
        description: `Section ${sectionIndex + 1} of ${course.name}`,
        subject: course.name,
        duration: 'N/A',
        views: 0,
        likes: 0,
        instructor: 'Course Instructor',
        thumbnail: course.thumbnail,
        publishedDate: new Date().toLocaleDateString(),
        level: 'Intermediate',
        isLink: true,
        videoUrl: section.videoLink
      });
      setSectionProgress(prev => ({ ...prev, [sectionIndex]: true }));
    } else if (section.sectionType === 'quiz') {
      setShowQuizModal(true);
      setActiveQuizSection(section);
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
  if (!video) return null;

  // Local uploaded video player with progress tracking
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
      >
        <source src={video.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  // Embedded external players (YouTube, Vimeo, etc.)
  if (video.isLink && video.videoUrl && isEmbedLink(video.videoUrl)) {
    return (
      <iframe
        src={getEmbedUrl(video.videoUrl)}
        className="w-full h-full rounded-lg"
        allowFullScreen
        title={video.title}
      />
    );
  }

  // Fallback for direct remote video URL
  if (video.videoUrl) {
    return (
      <video controls className="w-full h-full rounded-lg" poster={video.thumbnail}>
        <source src={video.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return <div className="text-gray-500">No video available.</div>;
};


// Backend base URL (can be set with VITE_BACKEND_URL in env)
const backendBase = import.meta.env.VITE_BACKEND_URL || 'https://smak-server.vercel.app';

async function createRazorpayOrder(amount: number) {
  const response = await fetch(`${backendBase}/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount, // e.g. 99 for ₹99
      currency: 'INR'
    })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Order creation failed: ${text}`);
  }
  const data = await response.json();
  return data; // Contains order.id, amount, etc.
}

// Load Razorpay checkout script dynamically
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Handle payment flow: create order, open checkout, verify payment via backend
async function handlePayment() {
  if (!paymentItem) return;
  setUnlocking(true);
  try {
    const order = await createRazorpayOrder(paymentItem.price);

    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error('Failed to load Razorpay script');

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || (window as any).RAZORPAY_KEY_ID || '';

    const options = {
      key: keyId, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // in paise
      currency: order.currency || 'INR',
      name: 'SMAK',
      description: paymentItem.title,
      order_id: order.id,
      handler: async function (response: any) {
        try {
          // verify payment at backend
          const verifyResp = await fetch(`${backendBase}/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              itemType: paymentItem.type,
              itemId: paymentItem.id,
              amount: paymentItem.price
            })
          });
          const json = await verifyResp.json();
          if (json && json.success) {
            // Unlock the item locally
            unlockItem(paymentItem.type, paymentItem.id);
            setShowPaymentModal(false);
            setPaymentItem(null);
            // Optionally notify backend / save record
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        } catch (err) {
          console.error('Verification error:', err);
          alert('Verification failed.');
        } finally {
          setUnlocking(false);
        }
      },
      prefill: {
        name: mockUser.name,
        email: ''
      },
      theme: {
        color: '#2563eb'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (resp: any) {
      console.error('Payment failed:', resp);
      alert('Payment failed or was cancelled.');
      setUnlocking(false);
    });
    rzp.open();
  } catch (err) {
    console.error('Payment error:', err);
    alert('Unable to initiate payment. Please try again later.');
    setUnlocking(false);
  }
}

// Load videos and courses
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
        publishedDate: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString(),
        locked: data.locked ?? Math.random() > 0.5, // Randomly lock some videos for demo
        price: data.price || 99
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
        ...data,
        createdAt: data.createdAt || null,
        locked: data.locked ?? Math.random() > 0.3, // Randomly lock some courses
        price: data.price || 199,
        sections: (data.sections || []).map((section: any, index: number) => ({
          ...section,
          id: `${doc.id}-section-${index}`,
          locked: section.locked ?? Math.random() > 0.7, // Randomly lock some sections
          price: section.price || 49
        }))
      } as Course;
    });
    setCourses(coursesList);
  } catch (error) {
    console.error('Error loading courses:', error);
  } finally {
    setLoadingCourses(false);
  }
};

// Effects
useEffect(() => {
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
            <div className="aspect-video bg-black rounded-lg">
              {renderVideoPlayer(activeVideo)}
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {activeVideo.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {activeVideo.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => handleLike(activeVideo.id)}
                    className="flex items-center space-x-2"
                  >
                    <Heart className="h-5 w-5" />
                    <span>{activeVideo.likes}</span>
                  </Button>
                  <span className="text-gray-500">
                    {activeVideo.views} views
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>{activeVideo.level}</Badge>
                  <Badge variant="outline">{activeVideo.subject}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

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
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Upload New Video Lecture
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Video Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Introduction to Anatomy"
                      required
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="e.g., Anatomy"
                      required
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what students will learn..."
                    rows={4}
                    required
                    className="bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Instructor *
                    </label>
                    <Input
                      value={formData.instructor}
                      onChange={(e) => handleInputChange('instructor', e.target.value)}
                      placeholder="Instructor name"
                      required
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Level *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Duration *
                    </label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="e.g., 45 min"
                      required
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                {/* Video Source Toggle */}
                <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!formData.isLink}
                      onChange={() => handleInputChange('isLink', false)}
                      className="text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Video File</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.isLink}
                      onChange={() => handleInputChange('isLink', true)}
                      className="text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">External Link (YouTube/Vimeo)</span>
                  </label>
                </div>

                {/* Video Upload or Link */}
                {formData.isLink ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Video URL *
                    </label>
                    <Input
                      value={formData.externalLink}
                      onChange={(e) => handleInputChange('externalLink', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                      required
                      className="bg-white dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supports YouTube, Vimeo, and other embeddable video links
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Upload Video File *
                    </label>
                    <div className="flex items-center space-x-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-white dark:bg-gray-800">
                        <Upload className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formData.videoFile ? formData.videoFile.name : 'Choose video file (MP4, WebM)'}
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleInputChange('videoFile', e.target.files?.[0])}
                          className="hidden"
                          required={!formData.isLink}
                        />
                      </label>
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{Math.round(uploadProgress)}% uploaded</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Thumbnail Image
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-white dark:bg-gray-800">
                      <Image className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.thumbnailFile ? formData.thumbnailFile.name : 'Choose thumbnail (optional)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleInputChange('thumbnailFile', e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Lecture Notes (PDF)
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-white dark:bg-gray-800">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.notesFile ? formData.notesFile.name : 'Upload notes (optional)'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleInputChange('notesFile', e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Premium Content Settings */}
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.locked}
                      onChange={(e) => handleInputChange('locked', e.target.checked)}
                      className="w-4 h-4 text-orange-600"
                    />
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Make this a premium (paid) video
                    </label>
                  </div>
                  {formData.locked && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Price (₹)
                      </label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', Number(e.target.value))}
                        placeholder="99"
                        min="1"
                        className="bg-white dark:bg-gray-800 max-w-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading... {Math.round(uploadProgress)}%
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Video
                      </>
                    )}
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
            {videoLectures.map((video) => {
              const isVideoLocked = video.locked && !isUnlocked('video', video.id);

              return (
                <Card
                  key={video.id}
                  className={`group hover:shadow-2xl transition-all duration-300 border cursor-pointer bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm overflow-hidden ${isVideoLocked
                    ? 'border-orange-300 dark:border-orange-500 hover:border-orange-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Lock Overlay */}
                    {isVideoLocked && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
                        <Lock className="h-12 w-12 text-white mb-3" />
                        <span className="text-white text-lg font-bold mb-2">Premium Content</span>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-orange-600 to-red-600 text-white"
                          onClick={e => {
                            e.stopPropagation();
                            setPaymentItem({
                              type: 'video',
                              id: video.id,
                              title: video.title,
                              price: video.price || 99
                            });
                            setShowPaymentModal(true);
                          }}
                        >
                          Unlock for ₹{video.price || 99}
                        </Button>
                      </div>
                    )}

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

                    {/* Lock Badge */}
                    {isVideoLocked && (
                      <Badge className="absolute top-3 left-3 bg-orange-600/90 backdrop-blur-sm text-white border-0 shadow-lg">
                        <Lock className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}

                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {video.duration}
                    </div>

                    {/* Progress Bar */}
                    {video.isLocalVideo && !isVideoLocked && (
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
                      {isVideoLocked && <Lock className="h-4 w-4 inline ml-2 text-orange-500" />}
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
                        className={`${isVideoLocked
                          ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                          } text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2 rounded-lg`}
                        onClick={e => { e.stopPropagation(); handleVideoClick(video); }}
                      >
                        {isVideoLocked ? 'Unlock to Watch' : 'Watch Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
              courses.map(course => {
                const isCourseLocked = course.locked && !isUnlocked('course', course.id);

                return (
                  <Card
                    key={course.id}
                    className={`border transition-all cursor-pointer ${isCourseLocked
                      ? 'border-orange-200 hover:border-orange-400'
                      : 'border-green-200 hover:border-green-400'
                      }`}
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop'}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                      {isCourseLocked && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Lock className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {course.name}
                        {isCourseLocked && <Lock className="h-4 w-4 inline ml-2 text-orange-500" />}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>Sections: {course.sections?.length || 0}</span>
                        <span>{course.createdAt ? (course.createdAt.toDate ? course.createdAt.toDate().toLocaleDateString() : new Date(course.createdAt).toLocaleDateString()) : ''}</span>
                      </div>
                      <Button
                        size="sm"
                        className={`w-full ${isCourseLocked
                          ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                          } text-white`}
                        onClick={() => handleCourseClick(course)}
                      >
                        {isCourseLocked ? `Unlock Course - ₹${course.price || 199}` : 'View Course'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
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

    {/* Razorpay Payment Modal */}
    {showPaymentModal && paymentItem && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-md w-full relative p-8 flex flex-col items-center">
          <button
            className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-600"
            onClick={() => { setShowPaymentModal(false); setPaymentItem(null); }}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Unlock Premium Content</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-1 text-center">
            {paymentItem.type.charAt(0).toUpperCase() + paymentItem.type.slice(1)}:
            <span className="font-semibold ml-1">{paymentItem.title}</span>
          </p>
          <div className="text-2xl font-bold text-orange-600 mb-6">₹{paymentItem.price}</div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
            Complete the payment to unlock this content permanently
          </p>

          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white w-full mb-3"
            disabled={unlocking}
            onClick={handlePayment}
          >
            {unlocking ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${paymentItem.price} to Unlock`
            )}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    )}

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
                {activeCourse.sections.map((section: Section, idx: number) => {
                  // All sections are locked unless unlocked
                  const isSectionLocked = !isUnlocked('section', section.id);
                  return (
                    <div key={section.id} className={`border rounded-xl p-4 ${isSectionLocked
                      ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/10'
                      : 'border-green-200 bg-green-50 dark:bg-green-900/10'
                      }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-green-700 dark:text-green-300">Section {idx + 1}:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {section.sectionType === 'video' ? 'Video' : 'Quiz'}
                          {isSectionLocked && <Lock className="h-4 w-4 inline ml-2 text-orange-500" />}
                        </span>
                        {sectionProgress[idx] && (
                          <span className="ml-2 text-green-600"><CheckCircle className="inline h-5 w-5" /></span>
                        )}
                      </div>
                      {/* Lock overlay and unlock button for all locked sections */}
                      {isSectionLocked ? (
                        <div>
                          <button
                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all"
                            onClick={() => handleSectionClick(section, activeCourse, idx)}
                            disabled={unlocking}
                          >
                            Unlock
                          </button>
                        </div>
                      ) : (
                        section.sectionType === 'video' ? (
                          <div>
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all"
                              onClick={() => handleSectionClick(section, activeCourse, idx)}
                              disabled={!section.videoLink}
                            >
                              Play Video
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all"
                              onClick={() => handleSectionClick(section, activeCourse, idx)}
                              disabled={!section.questions || section.questions.length === 0}
                            >
                              Play Quiz
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
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
            onClick={() => { setShowVideoModal(false); setActiveVideo(null); }}
          >
            <X className="h-6 w-6" />
          </button>
          {activeVideo ? (
            isEmbedLink(activeVideo?.videoUrl)
              ? (
                <iframe
                  src={getEmbedUrl(activeVideo?.videoUrl)}
                  className="w-full h-96 rounded-lg shadow-lg"
                  allowFullScreen
                  title="Course Video"
                />
              )
              : (
                <video controls autoPlay className="w-full h-96 rounded-lg shadow-lg">
                  <source src={activeVideo?.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )
          ) : (
            <div className="text-gray-500">No video link available.</div>
          )}
        </div>
      </div>
    )}

    {/* Quiz Popup Modal */}
    {showQuizModal && activeQuizSection && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full relative p-8 flex flex-col items-center">
          <button
            className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-600"
            onClick={() => {
              setShowQuizModal(false);
              setActiveQuizSection(null);
              setQuizResults(null);
            }}
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">{activeQuizSection.quizTitle || 'Quiz'}</h2>
          <form className="w-full max-w-lg space-y-6" onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const results = activeQuizSection.questions.map((q: any, idx: number) => {
              const selected = Number(formData.get(`q${idx}`));
              return selected === q.correctAnswer;
            });
            setQuizResults({ correct: results, submitted: true });
            // Mark section as completed
            const idx = activeCourse?.sections.findIndex((s: any) => s === activeQuizSection);
            if (idx !== undefined && idx !== -1) {
              setSectionProgress(prev => ({ ...prev, [idx]: true }));
            }
          }}>
            {activeQuizSection.questions && activeQuizSection.questions.length > 0 ? (
              activeQuizSection.questions.map((q: any, idx: number) => (
                <div key={idx} className="mb-6">
                  <div className="font-semibold mb-2 text-gray-900 dark:text-white">Q{idx + 1}: {q.question}</div>
                  <div className="space-y-2">
                    {q.options.map((opt: string, oIdx: number) => (
                      <label key={oIdx} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`q${idx}`} value={oIdx} className="text-blue-600" required disabled={quizResults?.submitted} />
                        <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                  {quizResults?.submitted && (
                    <div className={quizResults.correct[idx] ? "text-green-600 font-semibold mt-2" : "text-red-600 font-semibold mt-2"}>
                      {quizResults.correct[idx] ? "Correct!" : "Incorrect!"}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No questions found.</div>
            )}
            {!quizResults?.submitted && (
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md mt-4">Submit Quiz</button>
            )}
            {quizResults?.submitted && (
              <div className="mt-6 text-lg font-bold text-blue-700 dark:text-blue-300">Quiz submitted! See feedback above.</div>
            )}
          </form>
        </div>
      </div>
    )}
  </div>
);
}

export default VideoLectures;