import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, User, Eye, Download, PenTool, Sparkles, BookOpen, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Journal = () => {
  const [showPublishPopup, setShowPublishPopup] = useState(false);
  const navigate = useNavigate();

  const mainButtons = [
    {
      title: "Editorial & Advisory Board",
      description: "Meet our distinguished panel of editors, mentors, and national experts",
      icon: Users,
      path: "/editorial-board",
      color: "bg-medical-blue"
    },
    {
      title: "Submit Manuscript",
      description: "Unified portal for students and professionals to submit quality content",
      icon: FileText,
      
      color: "bg-medical-green"
    },
    {
      title: "About SJMSR",
      description: "Our mission, vision, and commitment to medical research excellence",
      icon: BookOpen,
      path: "/about",
      color: "bg-medical-blue-light"
    }
  ];

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
    navigate('/submit');
  };

  const handleViewGuidelines = () => {
    setShowPublishPopup(false);
    navigate('/Guidelines');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 relative text-blue-600">
        <div className="absolute inset-0">
          <img 
            src="https://plus.unsplash.com/premium_photo-1661580252810-800f4bd0ee63?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Vivid research background"
            className="w-full h-full object-cover object-center opacity-60 dark:opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/90 via-purple-700/80 to-pink-600/80 opacity-80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-blue-200 mx-auto">
                <img src="https://i.postimg.cc/s2szLDtn/Whats-App-Image-2025-08-22-at-03-58-52-f0a3f2ba.jpg" alt="SJMSR Logo" className="w-20 h-20 object-contain rounded-full" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              SJMSR
            </h1>
            <p className="text-xl mb-4 text-white drop-shadow-md">
              SMAK JOURNAL OF MEDICAL SCIENCE & RESEARCH
            </p>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90 drop-shadow-md">
              "To build a national platform integrating student innovation with expert mentorship, enabling publication of high-impact clinical, academic, and research-based medical content."
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handlePublishClick}
                variant="secondary"
                className="bg-blue-950 text-white hover:bg-white/90 hover:text-blue-900 transition-smooth font-bold shadow-lg"
              >
                <PenTool className="mr-2 h-5 w-5" />
                Submit Manuscript
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Action Buttons */}
      <section className="py-16 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-[image:var(--medical-gradient)] bg-clip-text text-blue-600">
              Explore SJMSR
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover our editorial excellence, submission process, and mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {mainButtons.map((button, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300 cursor-pointer group border-2 hover:border-medical-blue/50"
                onClick={() => navigate(button.path)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 mx-auto mb-4 ${
                    button.color.includes('green') ? 'bg-medical-green/10' : 
                    button.color.includes('light') ? 'bg-medical-blue-light/10' : 
                    'bg-medical-blue/10'
                  } rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <button.icon className={`h-10 w-10 ${
                      button.color.includes('green') ? 'text-medical-green' : 
                      button.color.includes('light') ? 'text-medical-blue-light' : 
                      'text-medical-blue'
                    }`} />
                  </div>
                  <CardTitle className="text-xl">{button.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{button.description}</p>
                  <Button className="w-full bg-[image:var(--medical-gradient)] hover:opacity-90 transition-smooth">
                    Explore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Highlighted Journals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-[image:var(--success-gradient)] bg-clip-text text-blue-500">
              ✨ Highlighted Journals
            </h2>
            <p className="text-lg text-muted-foreground">
              Exceptional research making a difference in healthcare
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlightedJournals.map((journal, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300 border-2 hover:border-medical-green/30">
                <div className="relative">
                  <img 
                    src={journal.image} 
                    alt={journal.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge 
                    className="absolute top-3 right-3 bg-[image:var(--success-gradient)] text-white"
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
                    <Button variant="default" size="sm" className="flex-1 bg-[image:var(--medical-gradient)]">
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
      <section className="py-16 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-[image:var(--medical-gradient)] bg-clip-text text-blue-500">
              Featured Articles
            </h2>
            <p className="text-lg text-muted-foreground">
              Highlighting groundbreaking research from our community
            </p>
          </div>
          
          <div className="space-y-8">
            {featuredArticles.map((article, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-shadow duration-300">
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
                        <Button variant="default" size="sm" className="bg-[image:var(--medical-gradient)]">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-[image:var(--medical-gradient)] bg-clip-text text-blue-500">
              Browse by Category
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category, index) => (
              <Button 
                key={index} 
                variant={index === 0 ? "default" : "outline"} 
                size="sm"
                className={index === 0 ? "bg-[image:var(--medical-gradient)]" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Publications */}
      <section className="py-16 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-[image:var(--medical-gradient)] bg-clip-text text-blue-500">
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

      {/* Editorial & Advisory Board Section */}
      <section className="py-16 bg-gradient-to-br from-medical-blue/5 via-background to-medical-green/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600 drop-shadow-md">
              👥 Editorial & Advisory Board
            </h2>
            <p className="text-xl mb-8 text-profile-text-secondary">
              Presenting the journal's academic backbone — a blend of editors, mentors, and national experts.
            </p>
          </div>

          {/* Editor in Chief */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-6 text-blue-600 drop-shadow-sm">Editor in Chief</h3>
            <div className="max-w-md mx-auto">
              <Card className="bg-profile-card border-profile-card-border hover:bg-white dark:hover:bg-gray-900 hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden group">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <img 
                        src="https://i.postimg.cc/4yq7vh22/Whats-App-Image-2025-08-22-at-04-06-37-afe21f71.jpg" 
                        alt="Dr. Rajesh Kumar Sharma"
                        className="w-28 h-28 rounded-full object-cover border-4 border-blue-200"
                        style={{ objectPosition: 'center 20%' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          ((e.target as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'flex';
                        }}
                      />
                      <User className="h-16 w-16 text-blue-500 hidden" />
                    </div>
                    <h4 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors">Prof. (Dr.) Ashok Kumar Mahapatra</h4>
                    <p className="text-profile-text-secondary dark:text-gray-300 font-medium mb-1">Padma Shri MBBS, MS (General Surgery), M.Ch. (Neurosurgery), DNB (Neurosurgery)</p>
                    <p className="text-sm text-profile-text-secondary dark:text-gray-300 mb-2">Former Head, Department of Neurosurgery</p>
                    <p className="text-sm text-profile-text-secondary dark:text-gray-300 mb-4">AIIMS, New Delhi</p>
                    <div className="space-y-2">
                      <div className="text-xs text-profile-text-secondary dark:text-gray-300 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <strong>Founding Director : </strong> AIIMS, Bhubaneswar

                      </div>
                      <div className="text-xs text-profile-text-secondary dark:text-gray-300 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <strong>Former Vice-Chancellor : </strong> SOA University
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Associate Editor */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-6 text-blue-600 drop-shadow-sm">Associate Editor</h3>
            <div className="max-w-md mx-auto">
              <Card className="bg-profile-card border-profile-card-border hover:bg-white dark:hover:bg-gray-900 hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden group">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <img 
                        src="https://i.postimg.cc/kGbXmYww/Whats-App-Image-2025-08-22-at-04-33-08-3e56a060.jpg" 
                        alt="Ananya Krishnan"
                        className="w-28 h-28 rounded-full object-cover border-4 border-green-200"
                        style={{ objectPosition: 'center 20%' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          ((e.target as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'flex';
                        }}
                      />
                      <User className="h-16 w-16 text-green-500 hidden" />
                    </div>
                    <h4 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2 group-hover:text-green-800 dark:group-hover:text-green-200 transition-colors">Prof. Dr. Asaranti Kar</h4>
                    <p className="text-profile-text-secondary dark:text-gray-300 font-medium mb-1">MBBS, MD, FICP</p>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-profile-text-secondary dark:text-gray-300 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <strong>Head Of Department Pathology : </strong> SCB CUTTACK
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

           {/* Editorial Advisory Board */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-blue-600 drop-shadow-sm">Editorial Advisory Board</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Dr. Sunita Rao",
                  title: "Professor of Medicine",
                  institution: "SGPGIMS, Lucknow",
                  specialization: "Cardiology, Clinical Research",
                  experience: "20+ years",
                  imagePath: "/images/advisory/dr-sunita-rao.jpg"
                },
                {
                  name: "Dr. Vikram Singh",
                  title: "Head of Pediatrics",
                  institution: "KIMS, Hyderabad",
                  specialization: "Pediatric Surgery",
                  experience: "18+ years",
                  imagePath: "/images/advisory/dr-vikram-singh.jpg"
                },
                {
                  name: "Dr. Kavita Patel",
                  title: "Professor of Pathology",
                  institution: "GMC, Mumbai",
                  specialization: "Molecular Pathology",
                  experience: "15+ years",
                  imagePath: "/images/advisory/dr-kavita-patel.jpg"
                }
              ].map((member, index) => (
                <Card key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gradient-to-br hover:from-white dark:hover:from-gray-900 hover:to-indigo-50 dark:hover:to-indigo-950 hover:shadow-xl hover:scale-105 hover:border-indigo-300 dark:hover:border-indigo-400 transition-all duration-300 ease-in-out overflow-hidden group">
                  <CardContent className="p-5">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-3 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        {/* Image placeholder - replace src with actual image path */}
                        <img 
                          src={member.imagePath} 
                          alt={member.name}
                          className="w-20 h-20 rounded-full object-cover border-3 border-indigo-200 dark:border-indigo-400"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            ((e.target as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'flex';
                          }}
                        />
                        <BookOpen className="h-12 w-12 text-indigo-500 hidden" />
                      </div>
                      <h4 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors">{member.name}</h4>
                      <p className="text-profile-text-secondary dark:text-gray-300 font-medium mb-1 text-sm">{member.title}</p>
                      <p className="text-xs text-profile-text-secondary dark:text-gray-300 mb-3">{member.institution}</p>
                      <div className="space-y-2">
                        <div className="text-xs text-profile-text-secondary dark:text-gray-300 bg-gradient-to-r from-indigo-50 to-blue-100 dark:from-indigo-900 dark:to-blue-800 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                          <strong>Expertise:</strong> {member.specialization}
                        </div>
                        <div className="text-xs text-profile-text-secondary dark:text-gray-300 bg-gradient-to-r from-indigo-50 to-blue-100 dark:from-indigo-900 dark:to-blue-800 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                          <strong>Experience:</strong> {member.experience}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Student Editors */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-blue-600 drop-shadow-sm">Student Editors (UG/PG)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Ananya Krishnan",
                  degree: "MBBS Final Year",
                  institution: "KIMS, Bangalore",
                  specialization: "Internal Medicine",
                  achievements: "Published 3 research papers, Dean's List",
                  imagePath: "/images/editors/ananya-krishnan.jpg"
                },
                {
                  name: "Arjun Patel",
                  degree: "MD Pediatrics (2nd Year)",
                  institution: "PGIMER, Chandigarh",
                  specialization: "Pediatric Oncology",
                  achievements: "Best Research Award 2023, 5 publications",
                  imagePath: "/images/editors/arjun-patel.jpg"
                },
                {
                  name: "Priya Menon",
                  degree: "MBBS 4th Year",
                  institution: "CMC, Vellore",
                  specialization: "Psychiatry",
                  achievements: "Mental Health Research, 2 publications",
                  imagePath: "/images/editors/priya-menon.jpg"
                }
              ].map((editor, index) => (
                <Card key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gradient-to-br hover:from-white dark:hover:from-gray-900 hover:to-blue-50 dark:hover:to-blue-950 hover:shadow-xl hover:scale-105 hover:border-blue-300 dark:hover:border-blue-400 transition-all duration-300 ease-in-out overflow-hidden group">
                  <CardContent className="p-5">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        {/* Image placeholder - replace src with actual image path */}
                        <img 
                          src={editor.imagePath} 
                          alt={editor.name}
                          className="w-20 h-20 rounded-full object-cover border-3 border-green-200 dark:border-green-400"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            ((e.target as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'flex';
                          }}
                        />
                        <User className="h-12 w-12 text-green-500 hidden" />
                      </div>
                      <h4 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors">{editor.name}</h4>
                      <p className="text-profile-text-secondary dark:text-gray-300 font-medium mb-1 text-sm">{editor.degree}</p>
                      <p className="text-xs text-profile-text-secondary dark:text-gray-300 mb-3">{editor.institution}</p>
                      <div className="space-y-2">
                        <div className="text-xs text-profile-text-secondary dark:text-gray-300 bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900 dark:to-green-800 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                          <strong>Focus:</strong> {editor.specialization}
                        </div>
                        <div className="text-xs text-profile-text-secondary dark:text-gray-300 bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900 dark:to-green-800 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                          <strong>Achievements:</strong> {editor.achievements}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

         

          {/* Patron / Honorary Mentors */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-blue-600 drop-shadow-sm">Mentors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Dr. Ashok Kumar Gupta",
                  title: "Dean & Director",
                  institution: "AIIMS, New Delhi",
                  specialization: "Neurosurgery, Medical Administration",
                  role: "Chief Patron",
                  imagePath: "/images/mentors/dr-ashok-kumar-gupta.jpg"
                },
                {
                  name: "Prof. Meera Sharma",
                  title: "Vice Chancellor",
                  institution: "KIMS University, Bangalore",
                  specialization: "Medical Education, Public Health",
                  role: "Honorary Mentor",
                  imagePath: "/images/mentors/prof-meera-sharma.jpg"
                }
              ].map((mentor, index) => (
                <Card key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gradient-to-br hover:from-white dark:hover:from-gray-900 hover:to-purple-50 dark:hover:to-purple-950 hover:shadow-2xl hover:scale-105 hover:border-purple-300 dark:hover:border-purple-400 transition-all duration-300 ease-in-out overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-blue-100 dark:from-purple-900 dark:to-blue-800 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 flex-shrink-0">
                        {/* Image placeholder - replace src with actual image path */}
                        <img 
                          src={mentor.imagePath} 
                          alt={mentor.name}
                          className="w-16 h-16 rounded-full object-cover border-3 border-purple-200 dark:border-purple-400"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            ((e.target as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'flex';
                          }}
                        />
                        <Sparkles className="h-10 w-10 text-purple-500 hidden" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-1 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors">{mentor.name}</h4>
                        <p className="text-profile-text-secondary dark:text-gray-300 font-medium mb-1">{mentor.title}</p>
                        <p className="text-sm text-profile-text-secondary dark:text-gray-300 mb-2">{mentor.institution}</p>
                        <div className="space-y-1">
                          <div className="text-xs text-profile-text-secondary dark:text-gray-300 bg-gradient-to-r from-purple-50 to-blue-100 dark:from-purple-900 dark:to-blue-800 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                            <strong>Role:</strong> {mentor.role}
                          </div>
                          <div className="text-xs text-profile-text-secondary dark:text-gray-300 bg-gradient-to-r from-purple-50 to-blue-100 dark:from-purple-900 dark:to-blue-800 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                            <strong>Expertise:</strong> {mentor.specialization}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/editorial-board')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 px-8 py-3 rounded-lg font-semibold"
            >
              <Users className="mr-2 h-5 w-5" />
              View Complete Board
            </Button>
          </div>
        </div>
      </section>

      {/* Submit Manuscript Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-[image:var(--medical-gradient)] bg-clip-text text-blue-500">
              📝 Submit Your Manuscript
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              A unified portal for both students and professionals to submit quality content
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Submission Guidelines */}
            <Card className="overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-medical-blue/10 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-medical-blue" />
                </div>
                <CardTitle className="text-center text-xl">Submission Guidelines</CardTitle>
                <CardDescription className="text-center">
                  Complete guidelines for manuscript preparation and submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="w-2 h-2 bg-medical-blue rounded-full mr-2"></span>Manuscript formatting requirements</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-medical-blue rounded-full mr-2"></span>Reference style guidelines</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-medical-blue rounded-full mr-2"></span>Word count and structure</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-medical-blue rounded-full mr-2"></span>Upload portal instructions</li>
                </ul>
                <Button 
  onClick={() => window.open("/Guidelines", "_blank")} 
  className="w-full mt-4 bg-[image:var(--medical-gradient)]"
>
  View Guidelines
</Button>

              </CardContent>
            </Card>

            {/* Upload Portal */}
            <Card className="overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-medical-green/10 rounded-full flex items-center justify-center">
                  <PenTool className="h-8 w-8 text-medical-green" />
                </div>
                <CardTitle className="text-center text-xl">Upload Portal</CardTitle>
                <CardDescription className="text-center">
                  Submit via Google Form or integrated submission tool
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-2 border-medical-green">
                    <div className="font-medium text-sm">Direct Upload</div>
                    <div className="text-xs text-muted-foreground">Use our integrated submission portal</div>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-2 border-medical-blue">
                    <div className="font-medium text-sm">Google Form</div>
                    <div className="text-xs text-muted-foreground">Alternative submission method</div>
                  </div>
                </div>
                <Button 
  variant="outline" 
  className="w-full mt-4"
  onClick={() => window.open("/login", "_blank")}
>
  <PenTool className="mr-2 h-4 w-4" />
  Start Submission
</Button>
              </CardContent>
            </Card>
          </div>

          {/* Article Types */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 bg-[image:var(--medical-gradient)] bg-clip-text text-blue-500">
              Article Types We Accept
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { type: "Original Research", desc: "Novel findings & studies", icon: "🔬", color: "blue" },
                { type: "Case Reports", desc: "Unique clinical cases", icon: "📋", color: "green" },
                { type: "Clinical Reviews", desc: "Literature analysis", icon: "📚", color: "purple" },
                { type: "Editorials", desc: "Expert opinions", icon: "✍️", color: "orange" },
                { type: "Letters to Editor", desc: "Brief communications", icon: "✉️", color: "teal" },
                { type: "Medical Education Articles", desc: "Educational content", icon: "🎓", color: "indigo" },
                { type: "Clinical Images", desc: "Visual case studies", icon: "🖼️", color: "pink" }
              ].map((article, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{article.icon}</div>
                    <div className="font-semibold text-sm mb-1">{article.type}</div>
                    <div className="text-xs text-muted-foreground">{article.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Compliance Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-medical-blue">
              <CardHeader>
                <CardTitle className="text-lg">Licensing and Declarations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Copyright and licensing agreements</li>
                  <li>• Conflict of interest declarations</li>
                  <li>• Author contribution statements</li>
                  <li>• Funding acknowledgments</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-medical-green">
              <CardHeader>
                <CardTitle className="text-lg">Ethical Compliance Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• IRB/Ethics committee approval</li>
                  <li>• Informed consent documentation</li>
                  <li>• Data privacy compliance</li>
                  <li>• Research integrity standards</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={handlePublishClick}
              className="bg-[image:var(--medical-gradient)] hover:opacity-90"
            >
              <FileText className="mr-2 h-5 w-5" />
              Submit Manuscript
            </Button>
          </div>
        </div>
      </section>

      {/* About SJMSR Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-[image:var(--success-gradient)] bg-clip-text text-blue-500">
              📖 About SJMSR
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Clear mission, broad vision, and nationwide inclusivity
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="border-l-4 border-medical-blue overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-medical-blue/10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-medical-blue" />
                </div>
                <CardTitle className="text-center text-xl">Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  "To build a national platform integrating student innovation with expert mentorship, enabling publication of high-impact clinical, academic, and research-based medical content."
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-medical-green overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-medical-green/10 rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-medical-green" />
                </div>
                <CardTitle className="text-center text-xl">Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  To become a leading international journal that bridges the gap between medical research and clinical practice.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Ethics & Who We Are */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="border-l-4 border-purple-500 overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-950/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle className="text-center text-xl">Ethics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  We uphold the highest ethical standards in research publication, ensuring transparency, integrity, and scientific rigor.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-orange-500 overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-950/20 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle className="text-center text-xl">Who We Are</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed mb-4">
                  A collaborative journal with contributors across MBBS, MD, PhD, faculty, and heads of institutions.
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  Joint initiative under SMAK, recognized by senior advisors and academic bodies.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 bg-[image:var(--medical-gradient)] bg-clip-text text-blue-500">
              Core Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: "Academic Excellence", icon: "🏆", desc: "Striving for the highest standards in research and publication" },
                { value: "Ethical Publishing", icon: "⚖️", desc: "Maintaining integrity and transparency in all processes" },
                { value: "Faculty-Student Synergy", icon: "🤝", desc: "Bridging experience with innovation" },
                { value: "Multi-Institutional Collaboration", icon: "🌐", desc: "Connecting institutions nationwide" }
              ].map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-3">{value.icon}</div>
                    <div className="font-semibold mb-2">{value.value}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{value.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/about')}
              className="bg-[image:var(--success-gradient)] hover:opacity-90"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Learn More About SJMSR
            </Button>
          </div>
        </div>
      </section>

      {/* Floating Publish Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={handlePublishClick}
          size="lg"
          className="bg-[image:var(--medical-gradient)] hover:opacity-90 shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 rounded-full px-6 py-3 text-white font-semibold"
        >
          <PenTool className="mr-2 h-5 w-5" />
          Publish Journal
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Updated Publish Popup */}
      <Dialog open={showPublishPopup} onOpenChange={setShowPublishPopup}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="text-center">
              <div className="text-4xl mb-3">📝✨</div>
              <DialogTitle className="text-2xl font-bold bg-[image:var(--medical-gradient)] bg-clip-text text-blue-500 mb-2">
                Share Your Research
              </DialogTitle>
              <p className="text-muted-foreground text-sm">
                Join our community of medical researchers and share your valuable insights with the world.
              </p>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-medical-blue/10 rounded-lg">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm font-medium">Peer Reviewed</div>
                <div className="text-xs text-muted-foreground">Quality assured</div>
              </div>
              <div className="p-3 bg-medical-green/10 rounded-lg">
                <div className="text-2xl mb-1">🌍</div>
                <div className="text-sm font-medium">Global Reach</div>
                <div className="text-xs text-muted-foreground">Worldwide access</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Article Types We Accept:</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded border-l-2 border-medical-blue">
                  <div className="font-medium">Original Research</div>
                  <div className="text-muted-foreground">Novel findings & studies</div>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border-l-2 border-medical-green">
                  <div className="font-medium">Case Reports</div>
                  <div className="text-muted-foreground">Unique clinical cases</div>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded border-l-2 border-purple-500">
                  <div className="font-medium">Clinical Reviews</div>
                  <div className="text-muted-foreground">Literature analysis</div>
                </div>
                <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded border-l-2 border-orange-500">
                  <div className="font-medium">Editorials</div>
                  <div className="text-muted-foreground">Expert opinions</div>
                </div>
                <div className="p-2 bg-teal-50 dark:bg-teal-950/20 rounded border-l-2 border-teal-500">
                  <div className="font-medium">Letters to Editor</div>
                  <div className="text-muted-foreground">Brief communications</div>
                </div>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 rounded border-l-2 border-indigo-500">
                  <div className="font-medium">Clinical Images</div>
                  <div className="text-muted-foreground">Visual case studies</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => navigate('/Guidelines')}
                className="flex-1 bg-[image:var(--medical-gradient)] hover:opacity-90"
                size="lg"
              >
                Submission Guidelines
              </Button>
              
            </div>

            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Get Started
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Explore our journal platform and publication opportunities
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Journal;
