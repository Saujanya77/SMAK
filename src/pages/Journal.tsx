import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, User, Eye, Download, PenTool, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Journal = () => {
  const [showPublishPopup, setShowPublishPopup] = useState(false);
  const navigate = useNavigate();

  const highlightedJournals = [
    {
      title: "Breakthrough in Diabetes Management Using IoT Devices",
      author: "Dr. Ananya Krishnan",
      date: "December 2024",
      category: "Endocrinology",
      status: "Featured",
      abstract: "This study demonstrates how Internet of Things (IoT) devices can revolutionize diabetes monitoring and management, providing real-time glucose tracking and automated insulin delivery systems.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=center",
      views: "5,234",
      downloads: "2,891"
    },
    {
      title: "Community-Based Mental Health Programs: A Success Story",
      author: "Dr. Rahul Mehta",
      date: "November 2024",
      category: "Psychiatry",
      status: "Popular",
      abstract: "Analysis of community-driven mental health initiatives in rural India and their impact on reducing stigma while improving access to psychological care.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop&crop=center",
      views: "4,567",
      downloads: "2,234"
    },
    {
      title: "Minimally Invasive Cardiac Surgery: Patient Outcomes Study",
      author: "Dr. Sanjay Gupta",
      date: "October 2024",
      category: "Cardiothoracic Surgery",
      status: "Trending",
      abstract: "Comprehensive analysis of patient recovery times, complications, and long-term outcomes in minimally invasive cardiac procedures compared to traditional approaches.",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop&crop=center",
      views: "6,123",
      downloads: "3,456"
    }
  ];

  const featuredArticles = [
    {
      title: "Novel Approaches in Telemedicine: Transforming Rural Healthcare Access",
      authors: ["Dr. Sarah Johnson", "Dr. Raj Patel", "SMAK Research Team"],
      date: "November 2024",
      category: "Digital Health",
      abstract: "This comprehensive study explores innovative telemedicine solutions that are revolutionizing healthcare delivery in rural areas, with a focus on cost-effective implementation and patient outcomes.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop&crop=center",
      views: "2,847",
      downloads: "1,203"
    },
    {
      title: "Impact of Artificial Intelligence in Early Cancer Detection",
      authors: ["Dr. Amit Kumar", "Dr. Lisa Chen", "Dr. Rohit Sharma"],
      date: "October 2024",
      category: "Oncology",
      abstract: "An analysis of machine learning algorithms in pathological diagnosis, examining their accuracy rates and potential for reducing diagnostic errors in cancer screening programs.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop&crop=center",
      views: "3,156",
      downloads: "1,847"
    },
    {
      title: "Mental Health Interventions in Medical Education",
      authors: ["Dr. Priya Menon", "Dr. Arjun Gupta"],
      date: "September 2024",
      category: "Medical Education",
      abstract: "A systematic review of mental health support systems in medical colleges and their effectiveness in reducing burnout and improving academic performance among medical students.",
      image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&h=250&fit=crop&crop=center",
      views: "4,203",
      downloads: "2,156"
    }
  ];

  const recentPublications = [
    {
      title: "Antibiotic Resistance Patterns in Indian ICUs",
      authors: ["Dr. Kavita Patel", "Dr. Suresh Kumar"],
      date: "November 2024",
      category: "Infectious Diseases"
    },
    {
      title: "Pediatric Nutrition in Urban vs Rural Settings",
      authors: ["Dr. Neha Sharma", "Dr. Vikram Singh"],
      date: "November 2024",
      category: "Pediatrics"
    },
    {
      title: "Surgical Outcomes in Minimally Invasive Procedures",
      authors: ["Dr. Raj Malhotra", "Dr. Sita Devi"],
      date: "October 2024",
      category: "Surgery"
    },
    {
      title: "Cardiovascular Risk Assessment in Young Adults",
      authors: ["Dr. Ajay Verma", "Dr. Sunita Rao"],
      date: "October 2024",
      category: "Cardiology"
    }
  ];

  const categories = [
    "All Categories",
    "Cardiology",
    "Oncology",
    "Pediatrics",
    "Surgery",
    "Digital Health",
    "Medical Education",
    "Infectious Diseases",
    "Mental Health"
  ];

  const handlePublishClick = () => {
    setShowPublishPopup(true);
  };

  const handleGetStarted = () => {
    setShowPublishPopup(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                📘 SMAK Journal
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Peer-reviewed research and academic publications by medical students and professionals. Advancing medical knowledge through quality research.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                Browse Articles
              </Button>
              <Button size="lg" variant="outline">
                View Guidelines
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Highlighted Journals Section */}
      <section className="py-16 bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-950/10 dark:to-blue-950/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              ✨ Highlighted Journals
            </h2>
            <p className="text-lg text-muted-foreground">
              Exceptional research making a difference in healthcare
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlightedJournals.map((journal, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
                <div className="relative">
                  <img 
                    src={journal.image} 
                    alt={journal.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge 
                    className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-blue-500 text-white"
                  >
                    {journal.status}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{journal.category}</Badge>
                    <span className="text-sm text-muted-foreground">{journal.date}</span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{journal.title}</CardTitle>
                  <CardDescription className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-1" />
                    {journal.author}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{journal.abstract}</p>
                  <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {journal.views}
                    </div>
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      {journal.downloads}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="default" size="sm" className="flex-1">
                      Read Full
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Featured Articles
            </h2>
            <p className="text-lg text-muted-foreground">
              Highlighting groundbreaking research from our community
            </p>
          </div>
          
          <div className="space-y-8">
            {featuredArticles.map((article, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {article.views}
                          </div>
                          <div className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            {article.downloads}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                      <CardDescription className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-1" />
                        {article.authors.join(", ")}
                        <Calendar className="h-4 w-4 ml-4 mr-1" />
                        {article.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-muted-foreground mb-4">{article.abstract}</p>
                      <div className="flex space-x-2">
                        <Button variant="default" size="sm">
                          Read Full Article
                        </Button>
                        <Button variant="outline" size="sm">
                          Download PDF
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-16 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Browse by Category
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category, index) => (
              <Button 
                key={index} 
                variant={index === 0 ? "default" : "outline"} 
                size="sm"
                className={index === 0 ? "bg-gradient-to-r from-blue-600 to-blue-500" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Publications */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Recent Publications
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPublications.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-sm text-muted-foreground">{article.date}</span>
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription>
                    By {article.authors.join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Read Abstract
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Submit Your Research
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Share your research with the medical community. Our peer review process ensures quality and impact.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl mb-4">📝</div>
                <h3 className="font-semibold mb-2">Submit Manuscript</h3>
                <p className="text-sm opacity-90">Upload your research paper following our guidelines</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">👥</div>
                <h3 className="font-semibold mb-2">Peer Review</h3>
                <p className="text-sm opacity-90">Expert reviewers evaluate your work</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="font-semibold mb-2">Publication</h3>
                <p className="text-sm opacity-90">Get published in our peer-reviewed journal</p>
              </div>
            </div>
            <Button size="lg" variant="secondary">
              View Submission Guidelines
            </Button>
          </div>
        </div>
      </section>

      {/* Floating Publish Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={handlePublishClick}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-3 text-white font-semibold"
        >
          <PenTool className="mr-2 h-5 w-5" />
          Publish Journal
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Publish Popup */}
      <Dialog open={showPublishPopup} onOpenChange={setShowPublishPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div className="text-center flex-1">
                <div className="text-4xl mb-3">📝✨</div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
                  Share Your Research
                </DialogTitle>
                <p className="text-muted-foreground text-sm">
                  Join our community of medical researchers and share your valuable insights with the world.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPublishPopup(false)}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm font-medium">Peer Reviewed</div>
                <div className="text-xs text-muted-foreground">Quality assured</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl mb-1">🌍</div>
                <div className="text-sm font-medium">Global Reach</div>
                <div className="text-xs text-muted-foreground">Worldwide access</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">What you can publish:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Original research articles</li>
                <li>• Case studies and reports</li>
                <li>• Review articles</li>
                <li>• Medical innovations</li>
              </ul>
            </div>

            <Button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              size="lg"
            >
              Get Started
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Sign up or log in to begin publishing
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Journal;
