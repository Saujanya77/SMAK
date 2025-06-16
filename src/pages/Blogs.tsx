import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
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
  Send
} from 'lucide-react';

interface BlogProps {
  onBack: () => void;
}

interface Blog {
  id: number;
  title: string;
  author: string;
  category: string;
  content: string;
  excerpt: string;
  publishedDate: string;
  readTime: string;
  likes: number;
  views: number;
  comments: number;
  status: string;
  image: string;
  tags: string[];
  featured?: boolean;
}

const Blog: React.FC<BlogProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likedBlogs, setLikedBlogs] = useState<Set<number>>(new Set());
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<Set<number>>(new Set());
  const [comments, setComments] = useState<{[key: number]: Array<{id: number, author: string, text: string, date: string}>}>({});
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [commentBlogId, setCommentBlogId] = useState<number | null>(null);

  const [blogs, setBlogs] = useState<Blog[]>([
    {
      id: 1,
      title: "The Future of Telemedicine: Revolutionizing Healthcare Access",
      author: "Dr. Sarah Johnson",
      category: "Healthcare Technology",
      content: `
        <div class="blog-content">
          <h2>Introduction</h2>
          <p>Telemedicine has emerged as one of the most significant innovations in healthcare delivery, especially in the wake of the global pandemic. This revolutionary approach to medical care is transforming how patients access healthcare services and how providers deliver care.</p>
          
          <h2>Key Benefits of Telemedicine</h2>
          <p>The adoption of telemedicine brings numerous advantages:</p>
          <ul>
            <li><strong>Increased Access:</strong> Patients in remote areas can now access specialized care without traveling long distances.</li>
            <li><strong>Cost-Effective:</strong> Reduced overhead costs for both patients and healthcare providers.</li>
            <li><strong>Convenience:</strong> Appointments can be scheduled more flexibly, reducing waiting times.</li>
            <li><strong>Continuity of Care:</strong> Chronic disease management becomes more efficient with regular virtual check-ups.</li>
          </ul>
          
          <h2>Challenges and Solutions</h2>
          <p>Despite its benefits, telemedicine faces several challenges including technology barriers, regulatory issues, and the need for digital literacy among patients. Healthcare institutions are addressing these challenges through comprehensive training programs and user-friendly platforms.</p>
          
          <h2>The Road Ahead</h2>
          <p>As technology continues to advance, we can expect to see even more sophisticated telemedicine solutions, including AI-powered diagnostics, virtual reality consultations, and integrated health monitoring systems.</p>
        </div>
      `,
      excerpt: "Exploring how telemedicine is transforming healthcare delivery and making medical care more accessible to patients worldwide through innovative technology solutions.",
      publishedDate: "March 15, 2024",
      readTime: "8 min read",
      likes: 142,
      views: 3246,
      comments: 28,
      status: "Published",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
      tags: ["Telemedicine", "Healthcare", "Technology", "Digital Health"],
      featured: true
    },
    {
      id: 2,
      title: "Mental Health in Medical School: Breaking the Silence",
      author: "Alex Chen",
      category: "Medical Education",
      content: `
        <div class="blog-content">
          <h2>The Hidden Struggle</h2>
          <p>Medical school is often portrayed as a challenging but rewarding journey. However, the mental health challenges faced by medical students are often overlooked or stigmatized within the medical community.</p>
          
          <h2>Common Mental Health Issues</h2>
          <p>Medical students face unique stressors that can impact their mental well-being:</p>
          <ul>
            <li><strong>Academic Pressure:</strong> The demanding curriculum and high expectations can lead to chronic stress and anxiety.</li>
            <li><strong>Financial Stress:</strong> The cost of medical education creates additional pressure and worry.</li>
            <li><strong>Work-Life Balance:</strong> Long study hours and clinical rotations leave little time for personal relationships and self-care.</li>
            <li><strong>Imposter Syndrome:</strong> Many students struggle with feelings of inadequacy despite their achievements.</li>
          </ul>
          
          <h2>Breaking the Stigma</h2>
          <p>It's crucial to normalize conversations about mental health in medical education. Seeking help should be viewed as a sign of strength, not weakness.</p>
          
          <h2>Resources and Support</h2>
          <p>Medical schools are increasingly recognizing the importance of student mental health and implementing support systems including counseling services, peer support groups, and wellness programs.</p>
        </div>
      `,
      excerpt: "An honest discussion about mental health challenges in medical school and the importance of seeking support in a demanding academic environment.",
      publishedDate: "March 12, 2024",
      readTime: "6 min read",
      likes: 89,
      views: 1854,
      comments: 15,
      status: "Published",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
      tags: ["Mental Health", "Medical School", "Student Life", "Wellness"]
    },
    {
      id: 3,
      title: "Breaking Into Medical Research: A Complete Guide",
      author: "Dr. Michael Rodriguez",
      category: "Research",
      content: `
        <div class="blog-content">
          <h2>Why Medical Research Matters</h2>
          <p>Medical research is the cornerstone of advancing healthcare and improving patient outcomes. For medical students and early-career professionals, getting involved in research can be both rewarding and career-defining.</p>
          
          <h2>Getting Started</h2>
          <p>Here are essential steps for beginners interested in medical research:</p>
          <ol>
            <li><strong>Identify Your Interests:</strong> Choose a field that genuinely excites you, whether it's clinical research, basic science, or public health.</li>
            <li><strong>Find a Mentor:</strong> Connect with experienced researchers who can guide your journey and provide valuable insights.</li>
            <li><strong>Start Small:</strong> Begin with literature reviews or assist in ongoing projects before leading your own research.</li>
            <li><strong>Learn the Basics:</strong> Understand research methodology, statistics, and ethical considerations.</li>
          </ol>
          
          <h2>Types of Medical Research</h2>
          <p>Medical research encompasses various approaches including clinical trials, observational studies, systematic reviews, and laboratory research. Each type has its own methodology and applications.</p>
          
          <h2>Building Your Research Portfolio</h2>
          <p>Consistency is key in research. Regular participation in research activities, publishing papers, and presenting at conferences will help build a strong research portfolio.</p>
        </div>
      `,
      excerpt: "Essential tips and guidance for medical students and professionals looking to start their research journey and build a successful academic career.",
      publishedDate: "March 10, 2024",
      readTime: "10 min read",
      likes: 176,
      views: 2567,
      comments: 34,
      status: "Published",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
      tags: ["Research", "Medical Research", "Career Development", "Academic Medicine"]
    },
    {
      id: 4,
      title: "Nutrition and Prevention: The Power of Food as Medicine",
      author: "Dr. Emma Thompson",
      category: "Preventive Medicine",
      content: `
        <div class="blog-content">
          <h2>Food as Medicine</h2>
          <p>The concept of food as medicine is not new, but it's gaining renewed attention in modern healthcare. Proper nutrition plays a crucial role in preventing chronic diseases and promoting overall health.</p>
          
          <h2>The Science Behind Nutritional Medicine</h2>
          <p>Recent research has shown that specific nutrients can have powerful effects on our health, from reducing inflammation to supporting immune function and preventing disease.</p>
          
          <h2>Practical Applications</h2>
          <p>Healthcare providers are increasingly incorporating nutritional counseling into their practice, recognizing that dietary interventions can be as effective as medications for certain conditions.</p>
        </div>
      `,
      excerpt: "Discover how proper nutrition can serve as powerful medicine in preventing chronic diseases and promoting optimal health outcomes.",
      publishedDate: "March 8, 2024",
      readTime: "7 min read",
      likes: 98,
      views: 1432,
      comments: 19,
      status: "Published",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop",
      tags: ["Nutrition", "Preventive Medicine", "Wellness", "Lifestyle Medicine"]
    },
    {
      id: 5,
      title: "The Rise of Artificial Intelligence in Medical Diagnosis",
      author: "Dr. James Kim",
      category: "Medical Technology",
      content: `
        <div class="blog-content">
          <h2>AI Revolution in Healthcare</h2>
          <p>Artificial Intelligence is transforming medical diagnosis, offering unprecedented accuracy and speed in detecting diseases that were previously difficult to diagnose early.</p>
          
          <h2>Current Applications</h2>
          <p>From radiology to pathology, AI systems are now assisting doctors in making more accurate diagnoses and treatment decisions.</p>
          
          <h2>Future Implications</h2>
          <p>As AI technology continues to evolve, we can expect even more sophisticated diagnostic tools that will revolutionize patient care.</p>
        </div>
      `,
      excerpt: "Exploring how artificial intelligence is revolutionizing medical diagnosis and what the future holds for AI-powered healthcare solutions.",
      publishedDate: "March 5, 2024",
      readTime: "9 min read",
      likes: 203,
      views: 4321,
      comments: 45,
      status: "Published",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
      tags: ["Artificial Intelligence", "Medical Technology", "Diagnosis", "Innovation"],
      featured: true
    },
    {
      id: 6,
      title: "Pediatric Care During Pandemic: Lessons Learned",
      author: "Dr. Maria Garcia",
      category: "Pediatrics",
      content: `
        <div class="blog-content">
          <h2>Adapting Pediatric Care</h2>
          <p>The pandemic has significantly changed how we approach pediatric care, from telemedicine adoption to new safety protocols in clinical settings.</p>
          
          <h2>Key Challenges</h2>
          <p>Healthcare providers had to quickly adapt to new challenges while maintaining quality care for children and their families.</p>
          
          <h2>Moving Forward</h2>
          <p>The lessons learned during this period will continue to shape pediatric care practices for years to come.</p>
        </div>
      `,
      excerpt: "Insights into how pediatric care has evolved during the pandemic and the lasting changes that will benefit children's healthcare.",
      publishedDate: "March 3, 2024",
      readTime: "6 min read",
      likes: 67,
      views: 1234,
      comments: 12,
      status: "Published",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=400&fit=crop",
      tags: ["Pediatrics", "Pandemic", "Healthcare", "Telemedicine"]
    }
  ]);

  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    category: '',
    content: '',
    excerpt: '',
    tags: '',
    coverImage: null as File | null
  });

  const user = {
    name: "Dr. John Doe",
    year: "3rd Year MBBS",
    college: "SMAK Medical College",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
  };

  const categories = ['All', 'Healthcare Technology', 'Medical Education', 'Research', 'Preventive Medicine', 'Medical Technology', 'Pediatrics'];

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewBlog(prev => ({ ...prev, coverImage: file }));
      setUploadedImage(file);
      console.log('Cover image uploaded:', file.name);
    }
  };

  const handleAddBlog = () => {
    if (newBlog.title && newBlog.author && newBlog.content && newBlog.excerpt) {
      const blog: Blog = {
        id: Date.now(),
        title: newBlog.title,
        author: newBlog.author,
        category: newBlog.category || 'General',
        content: `<div class="blog-content">${newBlog.content.replace(/\n/g, '<br>')}</div>`,
        excerpt: newBlog.excerpt,
        publishedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime: Math.max(1, Math.ceil(newBlog.content.split(' ').length / 200)) + ' min read',
        likes: 0,
        views: 0,
        comments: 0,
        status: 'Published',
        image: newBlog.coverImage ? URL.createObjectURL(newBlog.coverImage) : "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
        tags: newBlog.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      setBlogs(prev => [blog, ...prev]);
      setNewBlog({
        title: '',
        author: '',
        category: '',
        content: '',
        excerpt: '',
        tags: '',
        coverImage: null
      });
      setUploadedImage(null);
      setShowAddForm(false);
      
      console.log('Blog added:', blog);
    }
  };

  const handleViewBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowPreview(true);
    // Increment views
    setBlogs(prev => prev.map(b => 
      b.id === blog.id ? { ...b, views: b.views + 1 } : b
    ));
  };

  const handleLikeBlog = (blogId: number) => {
    const isLiked = likedBlogs.has(blogId);
    
    if (isLiked) {
      setLikedBlogs(prev => {
        const newSet = new Set(prev);
        newSet.delete(blogId);
        return newSet;
      });
      setBlogs(prev => prev.map(blog => 
        blog.id === blogId 
          ? { ...blog, likes: blog.likes - 1 }
          : blog
      ));
      toast({
        title: "Like removed",
        description: "You unliked this blog post.",
      });
    } else {
      setLikedBlogs(prev => new Set(prev).add(blogId));
      setBlogs(prev => prev.map(blog => 
        blog.id === blogId 
          ? { ...blog, likes: blog.likes + 1 }
          : blog
      ));
      toast({
        title: "Blog liked!",
        description: "You liked this blog post.",
      });
    }
  };

  const handleBookmarkBlog = (blogId: number) => {
    const isBookmarked = bookmarkedBlogs.has(blogId);
    
    if (isBookmarked) {
      setBookmarkedBlogs(prev => {
        const newSet = new Set(prev);
        newSet.delete(blogId);
        return newSet;
      });
      toast({
        title: "Bookmark removed",
        description: "Blog removed from your bookmarks.",
      });
    } else {
      setBookmarkedBlogs(prev => new Set(prev).add(blogId));
      toast({
        title: "Blog bookmarked!",
        description: "Blog saved to your bookmarks.",
      });
    }
  };

  const handleShareBlog = (blog: Blog) => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link copied!",
          description: "Blog link copied to clipboard.",
        });
      });
    }
  };

  const handleAddComment = (blogId: number) => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      author: user.name,
      text: newComment,
      date: new Date().toLocaleDateString()
    };
    
    setComments(prev => ({
      ...prev,
      [blogId]: [...(prev[blogId] || []), comment]
    }));
    
    setBlogs(prev => prev.map(blog => 
      blog.id === blogId 
        ? { ...blog, comments: blog.comments + 1 }
        : blog
    ));
    
    setNewComment('');
    toast({
      title: "Comment added!",
      description: "Your comment has been posted.",
    });
  };

  const handleShowComments = (blogId: number) => {
    setCommentBlogId(blogId);
    setShowComments(true);
    // Initialize comments for blog if not exists
    if (!comments[blogId]) {
      setComments(prev => ({
        ...prev,
        [blogId]: []
      }));
    }
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedBlog(null);
  };

  const closeComments = () => {
    setShowComments(false);
    setCommentBlogId(null);
    setNewComment('');
  };

  const filteredBlogs = selectedCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  const featuredBlogs = blogs.filter(blog => blog.featured);

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
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Medical Blog Community
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Discover insights, share experiences, and connect with the medical community through our comprehensive blog platform
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-8 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Write Your Story
              </Button>
              <Button variant="outline" className="px-8 py-3">
                <TrendingUp className="h-5 w-5 mr-2" />
                Trending Topics
              </Button>
            </div>
          </div>

          {/* Featured Blogs Section */}
          {featuredBlogs.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Stories</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredBlogs.slice(0, 2).map((blog) => (
                  <Card key={blog.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-2xl transition-all border-gradient-to-r from-blue-200 to-indigo-200 hover:border-blue-400/50 group cursor-pointer overflow-hidden">
                    <div className="relative">
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                          Featured
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                          {blog.category}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {blog.publishedDate}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {blog.likes}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {blog.views}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {blog.readTime}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                          onClick={() => handleViewBlog(blog)}
                        >
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'hover:bg-blue-50'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Add New Blog Form */}
          {showAddForm && (
            <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-blue-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-300 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Share Your Medical Story
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Blog Title</label>
                  <Input 
                    placeholder="What's your story about?" 
                    value={newBlog.title}
                    onChange={(e) => setNewBlog(prev => ({ ...prev, title: e.target.value }))}
                    className="text-lg"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author</label>
                    <Input 
                      placeholder="Your name" 
                      value={newBlog.author}
                      onChange={(e) => setNewBlog(prev => ({ ...prev, author: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <Input 
                      placeholder="e.g., Healthcare Technology, Medical Education" 
                      value={newBlog.category}
                      onChange={(e) => setNewBlog(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                    <Input 
                      placeholder="Add tags separated by commas" 
                      value={newBlog.tags}
                      onChange={(e) => setNewBlog(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brief Summary</label>
                  <Textarea 
                    placeholder="Give readers a preview of what they'll learn..." 
                    rows={3} 
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Story</label>
                  <Textarea 
                    placeholder="Share your insights, experiences, and knowledge with the community..." 
                    rows={12} 
                    value={newBlog.content}
                    onChange={(e) => setNewBlog(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[200px]"
                  />
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button 
                    variant="outline" 
                    className={`flex items-center ${newBlog.coverImage ? 'bg-green-50 border-green-300 text-green-700' : ''}`} 
                    asChild
                  >
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      {newBlog.coverImage ? `Image: ${newBlog.coverImage.name}` : 'Add Cover Image'}
                    </label>
                  </Button>
                  {newBlog.coverImage && (
                    <div className="mt-4">
                      <img 
                        src={URL.createObjectURL(newBlog.coverImage)} 
                        alt="Cover preview" 
                        className="w-full max-w-md h-32 object-cover rounded-lg border shadow-md"
                      />
                    </div>
                  )}
                </div>
                <div className="flex space-x-4">
                  <Button 
                    onClick={handleAddBlog}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8"
                    disabled={!newBlog.title || !newBlog.author || !newBlog.content || !newBlog.excerpt}
                  >
                    Publish Story
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Blogs Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {selectedCategory === 'All' ? 'Latest Stories' : `${selectedCategory} Stories`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <Card key={blog.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-xl transition-all border-gray-200/50 hover:border-blue-300/50 group cursor-pointer overflow-hidden">
                  <div className="relative">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {blog.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs">
                        {blog.category}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {blog.publishedDate}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 font-medium">
                      By {blog.author}
                    </p>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">
                      {blog.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeBlog(blog.id);
                          }}
                          className={`flex items-center hover:text-red-500 transition-colors ${
                            likedBlogs.has(blog.id) ? 'text-red-500' : ''
                          }`}
                        >
                          <Heart className={`h-3 w-3 mr-1 ${likedBlogs.has(blog.id) ? 'fill-current' : ''}`} />
                          {blog.likes}
                        </button>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {blog.views}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowComments(blog.id);
                          }}
                          className="flex items-center hover:text-blue-500 transition-colors"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {blog.comments}
                        </button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 hover:bg-blue-50 ${
                            bookmarkedBlogs.has(blog.id) ? 'text-blue-500' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmarkBlog(blog.id);
                          }}
                        >
                          <Bookmark className={`h-3 w-3 ${bookmarkedBlogs.has(blog.id) ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareBlog(blog);
                          }}
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      onClick={() => handleViewBlog(blog)}
                    >
                      Read Full Story
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                    className={`${
                      likedBlogs.has(selectedBlog.id) 
                        ? 'text-red-600 border-red-300 bg-red-50' 
                        : 'text-red-600 border-red-300 hover:bg-red-50'
                    }`}
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
                        <img src={user.avatar} alt="Author" className="w-10 h-10 rounded-full" />
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
                      style={{
                        fontSize: '16px',
                        lineHeight: '1.8'
                      }}
                    />
                    
                    <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <Button 
                            variant="outline"
                            onClick={() => handleLikeBlog(selectedBlog.id)}
                            className={`flex items-center space-x-2 ${
                              likedBlogs.has(selectedBlog.id) 
                                ? 'text-red-600 border-red-300 bg-red-50' 
                                : 'text-red-600 border-red-300 hover:bg-red-50'
                            }`}
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
                      <img src={user.avatar} alt={comment.author} className="w-8 h-8 rounded-full" />
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
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
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
