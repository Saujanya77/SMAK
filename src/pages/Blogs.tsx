import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
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
  MessageCircle,
  Share2,
  Calendar,
  Clock,
  Sun,
  Moon,
  X,
  Bookmark,
  TrendingUp,
  Send,
  GraduationCap,
  Trash2
} from 'lucide-react';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  increment,
  serverTimestamp,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { db, storage } from '../firebase.ts';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useNavigate } from 'react-router-dom';

interface BlogProps {
  onBack: () => void;
}

interface Blog {
  id: string;
  title: string;
  author: string;
  category: string;
  content: string;
  excerpt: string;
  publishedDate?: string;
  readTime: string;
  likes: number;
  views: number;
  comments: number;
  status: string;
  image: string;
  tags: string[];
  featured?: boolean;
  createdAt?: Timestamp;
}
interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  blogId: string;
}
const ADMIN_EMAILS = ['admin@example.com', 'anotheradmin@example.com'];

const Blog: React.FC<BlogProps> = ({ onBack }) => {
  // State and hooks
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likedBlogs, setLikedBlogs] = useState<Set<string>>(new Set());
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [commentBlogId, setCommentBlogId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: user?.name || '',
    category: '',
    content: '',
    excerpt: '',
    tags: '',
    coverImage: null as File | null
  });

  // Utility functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { document.body.removeChild(toast); }, 3000);
  };

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const handleLogout = () => { logout(); navigate('/'); };

  // Fetch blogs
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogList: Blog[] = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Blog));
      setBlogs(blogList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Upload image
  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `blogImages/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // Add blog
  const handleAddBlog = async () => {
    setIsSubmitting(true);
    try {
      let imageUrl = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop";
      if (newBlog.coverImage) {
        imageUrl = await uploadImage(newBlog.coverImage);
      }
      const blogData = {
        title: newBlog.title,
        author: newBlog.author,
        category: newBlog.category || 'General',
        content: `<div class=\"blog-content\">${newBlog.content.replace(/\n/g, '<br>')}</div>`,
        excerpt: newBlog.excerpt,
        readTime: Math.max(1, Math.ceil(newBlog.content.split(' ').length / 200)) + ' min read',
        likes: 0,
        views: 0,
        comments: 0,
        status: 'pending',
        image: imageUrl,
        tags: newBlog.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        featured: false,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'blogs'), blogData);
      setNewBlog({
        title: '',
        author: user?.name || '',
        category: '',
        content: '',
        excerpt: '',
        tags: '',
        coverImage: null
      });
      setUploadedImage(null);
      setShowAddForm(false);
      showToast('Blog published successfully!Wait for the blog to get approved by admin.', 'success');
    } catch (error) {
      console.error('Error adding blog:', error);
      showToast('Error publishing blog. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // View blog
  const handleViewBlog = async (blog: Blog) => {
    setSelectedBlog(blog);
    setShowPreview(true);
    try {
      const blogRef = doc(db, 'blogs', blog.id);
      await updateDoc(blogRef, { views: increment(1) });
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  // Like blog
  const handleLikeBlog = async (blogId: string) => {
    const isLiked = likedBlogs.has(blogId);
    try {
      const blogRef = doc(db, 'blogs', blogId);
      if (isLiked) {
        setLikedBlogs(prev => { const newSet = new Set(prev); newSet.delete(blogId); return newSet; });
        await updateDoc(blogRef, { likes: increment(-1) });
      } else {
        setLikedBlogs(prev => new Set(prev).add(blogId));
        await updateDoc(blogRef, { likes: increment(1) });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  // Bookmark blog
  const handleBookmarkBlog = (blogId: string) => {
    setBookmarkedBlogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blogId)) newSet.delete(blogId); else newSet.add(blogId);
      return newSet;
    });
  };

  // Share blog
  const handleShareBlog = (blog: Blog) => {
    navigator.clipboard.writeText(window.location.href + '/' + blog.id);
    showToast('Blog link copied!', 'info');
  };

  // Show comments
  const handleShowComments = (blogId: string) => {
    setCommentBlogId(blogId);
    setShowComments(true);
  };

  // Add comment
  const handleAddComment = async (blogId: string) => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: user?.name || 'Anonymous',
      text: newComment,
      date: new Date().toLocaleString(),
      blogId
    };
    setComments(prev => ({ ...prev, [blogId]: [...(prev[blogId] || []), comment] }));
    setNewComment('');
    showToast('Comment added!', 'success');
    // Optionally, save to Firestore
  };

  // Delete blog
  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await deleteDoc(doc(db, 'blogs', blogId));
      setBlogs(prev => prev.filter(b => b.id !== blogId));
      showToast('Blog deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting blog:', error);
      showToast('Error deleting blog.', 'error');
    }
  };

  // Close preview/comments
  const closePreview = () => { setShowPreview(false); setSelectedBlog(null); };
  const closeComments = () => { setShowComments(false); setCommentBlogId(null); setNewComment(''); };

  // Filter blogs: only show approved
  const filteredBlogs = blogs
    .filter(blog => blog.status === 'approved')
    .filter(blog => {
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  // Featured blogs
  const featuredBlogs = blogs.filter(blog => blog.featured);

  // Render
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
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Medical Blogs</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-slate-600 flex items-center justify-center ring-2 ring-blue-100 dark:ring-slate-600">
                  <span className="text-sm font-semibold text-blue-800 dark:text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.college}</p>
                  </div>
                  {/* Only show admin panel link for admin users */}
                  {ADMIN_EMAILS.includes(user?.email) ? (
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
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Medical Blogs</h2>
              <p className="text-gray-600 dark:text-gray-400">Latest stories and articles from the medical community</p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Blog
            </Button>
          </div>
          {/* Add Blog Form Modal */}
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Add New Blog</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={e => { e.preventDefault(); handleAddBlog(); }}
                className="space-y-4"
              >
                <Input
                  type="text"
                  placeholder="Title"
                  value={newBlog.title}
                  onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
                  required
                />
                <Input
                  type="text"
                  placeholder="Author"
                  value={newBlog.author}
                  onChange={e => setNewBlog({ ...newBlog, author: e.target.value })}
                  required
                />
                <Input
                  type="text"
                  placeholder="Category"
                  value={newBlog.category}
                  onChange={e => setNewBlog({ ...newBlog, category: e.target.value })}
                />
                <Textarea
                  placeholder="Content"
                  value={newBlog.content}
                  onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}
                  rows={6}
                  required
                />
                <Input
                  type="text"
                  placeholder="Excerpt"
                  value={newBlog.excerpt}
                  onChange={e => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={newBlog.tags}
                  onChange={e => setNewBlog({ ...newBlog, tags: e.target.value })}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setNewBlog({ ...newBlog, coverImage: e.target.files[0] });
                      setUploadedImage(e.target.files[0]);
                    }
                  }}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    {isSubmitting ? 'Publishing...' : 'Publish Blog'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          {/* Featured Blogs */}
          {featuredBlogs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Featured Blogs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBlogs.map(blog => (
                  <div key={blog.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{blog.readTime} read</span>
                        <span>•</span>
                        <span>{blog.comments} comments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'All' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('All')}
                className="text-gray-900 dark:text-white"
              >
                All
              </Button>
              {Array.from(new Set(blogs.map(blog => blog.category))).map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="text-gray-900 dark:text-white"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          {/* Blog List */}
          <div className="space-y-8">
            {filteredBlogs.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No blogs found in this category. Try adding some!
              </p>
            ) : (
              filteredBlogs.map(blog => (
                <div key={blog.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {blog.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>{blog.readTime} read</span>
                      <span>•</span>
                      <span>{blog.comments} comments</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewBlog(blog)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        Read More
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLikeBlog(blog.id)}
                          className={`${likedBlogs.has(blog.id) ? 'text-red-600 border-red-300 bg-red-50' : 'text-red-600 border-red-300 hover:bg-red-50'}`}
                        >
                          <Heart className={`h-4 w-4 mr-2 ${likedBlogs.has(blog.id) ? 'fill-current' : ''}`} />
                          Like ({blog.likes})
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareBlog(blog)}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookmarkBlog(blog.id)}
                          className={bookmarkedBlogs.has(blog.id) ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}
                        >
                          <Bookmark className={`h-4 w-4 mr-2 ${bookmarkedBlogs.has(blog.id) ? 'fill-current' : ''}`} />
                          {bookmarkedBlogs.has(blog.id) ? 'Saved' : 'Save'}
                        </Button>
                        {/* Admin-only Delete button */}
                        {ADMIN_EMAILS.includes(user?.email) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Blog Preview Modal */}
      <Dialog open={showPreview} onOpenChange={() => setShowPreview(false)}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          {selectedBlog && (
            <div className="h-[90vh] flex flex-col bg-gray-50 dark:bg-gray-900">
              {/* Blog Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" onClick={closePreview}>
                    <X className="h-4 w-4" />
                  </Button>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {selectedBlog.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {selectedBlog.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        By {selectedBlog.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {selectedBlog.readTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLikeBlog(selectedBlog.id)}
                    className={`${likedBlogs.has(selectedBlog.id) ? 'text-red-600 border-red-300 bg-red-50' : 'text-red-600 border-red-300 hover:bg-red-50'}`}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${likedBlogs.has(selectedBlog.id) ? 'fill-current' : ''}`} />
                    Like ({selectedBlog.likes})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShareBlog(selectedBlog)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBookmarkBlog(selectedBlog.id)}
                    className={bookmarkedBlogs.has(selectedBlog.id) ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${bookmarkedBlogs.has(selectedBlog.id) ? 'fill-current' : ''}`} />
                    {bookmarkedBlogs.has(selectedBlog.id) ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
              {/* Blog Content */}
              <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 p-6">
                <div className="max-w-4xl mx-auto">
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-64 object-cover rounded-xl shadow-lg mb-8"
                  />
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {selectedBlog.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedBlog.author}</p>
                          <p className="text-sm">{selectedBlog.publishedDate}</p>
                        </div>
                      </div>
                      <span>•</span>
                      <span>{selectedBlog.readTime}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {selectedBlog.views} views
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedBlog.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div
                      className="text-gray-700 dark:text-gray-300 leading-relaxed blog-content"
                      dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                      style={{ fontSize: '16px', lineHeight: '1.8' }}
                    />
                    <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <Button
                            variant="outline"
                            onClick={() => handleLikeBlog(selectedBlog.id)}
                            className={`flex items-center space-x-2 ${likedBlogs.has(selectedBlog.id) ? 'text-red-600 border-red-300 bg-red-50' : 'text-red-600 border-red-300 hover:bg-red-50'}`}
                          >
                            <Heart className={`h-4 w-4 ${likedBlogs.has(selectedBlog.id) ? 'fill-current' : ''}`} />
                            <span>{selectedBlog.likes} Likes</span>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleShowComments(selectedBlog.id)}
                            className="flex items-center space-x-2"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>{selectedBlog.comments} Comments</span>
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShareBlog(selectedBlog)}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Story
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBookmarkBlog(selectedBlog.id)}
                            className={bookmarkedBlogs.has(selectedBlog.id) ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}
                          >
                            <Bookmark className={`h-4 w-4 mr-2 ${bookmarkedBlogs.has(selectedBlog.id) ? 'fill-current' : ''}`} />
                            {bookmarkedBlogs.has(selectedBlog.id) ? 'Saved' : 'Save for Later'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Comments Modal */}
      <Dialog open={showComments} onOpenChange={closeComments}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Comments</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[60vh]">
            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {commentBlogId && comments[commentBlogId] && comments[commentBlogId].length > 0 ? (
                comments[commentBlogId].map((comment) => (
                  <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                        {comment.author ? comment.author.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{comment.author}</p>
                        <p className="text-xs text-gray-500">{comment.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
            {/* Add Comment Form */}
            <div className="border-t pt-4">
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold flex-shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex-1">
                  <Textarea
                    placeholder="Write your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={() => commentBlogId && handleAddComment(commentBlogId)}
                      disabled={!newComment.trim()}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Blog;
