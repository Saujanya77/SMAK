import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  MessageCircle, Sparkles, X, Grid3X3, RotateCcw, Circle,
  ArrowRight, FileText, Calendar, Users, Star, Heart, Award, Shield, Activity, Brain, Microscope, GraduationCap, Library, Lightbulb, Target, Handshake, Rocket,
  Trophy,
  BookOpen,
  Globe,
  Crown,
  Zap,
  Stethoscope,
  Camera,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Mail,
  Play
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Badge } from "@/components/ui/badge";

import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

// Map icon string to Lucide icon component
const achievementIconMap = {
  Trophy,
  Users,
  BookOpen,
  Globe,
  Star,
  Award,
  Calendar,
  FileText,
  Heart,
  Activity,
  Shield,
  Microscope,
  Crown,
  Zap,
  Sparkles
};


// Static achievements (kept in sync with admin panel's staticAchievements)
const staticAchievements = [
  { icon: 'Trophy', value: '2024', label: 'Established' },
  { icon: 'Users', value: '1000+', label: 'Active Members' },
  { icon: 'BookOpen', value: '200+', label: 'Research Papers' },
  { icon: 'Globe', value: '50+', label: 'Partner Colleges' }
];

function GeminiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am SMAK Gemini Chatbot. How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input }] }]
        })
      });
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not get a response.';
      setMessages(msgs => [...msgs, { sender: 'bot', text: reply }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Error connecting to Gemini API.' }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none"
          title="Chat with Gemini"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
      {open && (
        <div className="w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-blue-200 dark:border-slate-700 flex flex-col overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-bold">Gemini Chatbot</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-blue-700 rounded-full p-1">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto max-h-80 bg-slate-50 dark:bg-slate-900">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-lg text-sm max-w-[70%] ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-blue-100 dark:border-slate-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start"><div className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-blue-100 dark:border-slate-700">Thinking...</div></div>
            )}
          </div>
          <div className="px-4 py-3 bg-white dark:bg-slate-800 border-t border-blue-100 dark:border-slate-700 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-lg border border-blue-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const Index = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'carousel' | 'stories'>('grid');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedStory, setSelectedStory] = useState(0);
  const [staticAch, setStaticAch] = useState(staticAchievements);
  const [firestoreAchievements, setFirestoreAchievements] = useState([]);
  const [achievements, setAchievements] = useState(staticAchievements);

  useEffect(() => {
    // Try to get static achievements from localStorage (if admin edited them)
    const localStatic = localStorage.getItem('staticAchievements');
    if (localStatic) {
      try {
        setStaticAch(JSON.parse(localStatic));
      } catch { }
    }
    const fetchAchievements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'achievements'));
        const data = querySnapshot.docs
          .map(doc => doc.data())
          .filter(doc => doc.icon && doc.value && doc.label);
        setFirestoreAchievements(data);
        // Always merge static and Firestore achievements
        setAchievements([...(localStatic ? JSON.parse(localStatic) : staticAchievements), ...data]);
      } catch (e) {
        setAchievements(localStatic ? JSON.parse(localStatic) : staticAchievements);
      }
    };
    fetchAchievements();
  }, []);

  // Updated pillars array with new items
  const pillars = [

    {
      icon: Microscope,
      title: 'Research & Mentorship',
      description: 'Get mentored by top doctors .Research projects, publications, guidence and expert sessions',
      color: 'from-blue-600 to-blue-700',
      stats: 'Peer-Reviewed'
    },

    {
      icon: Users,
      title: "Events & Leadership",
      description: "National Webinars, medical fests, Health camps , leadership roles and outreach programs",
      color: 'from-blue-600 to-blue-700',
      stats: "Student-Led"
    },
    {
      icon: BookOpen,
      title: "Academic Resources",
      description: "Access exclusive study materials, webinars, and journal archives",
      color: 'from-blue-500 to-blue-600',
      stats: "Open Access"
    },

    {
      icon: Handshake,
      title: "Connectivity",
      description: "Pan-India students & professionals connectivity, state heads, international liaisons",
      color: 'from-blue-600 to-blue-700',
      stats: "Together"
    }
  ];

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center",
      title: "Medical Conference 2024",
      description: "Annual gathering of medical professionals discussing latest innovations in healthcare technology and patient care methodologies."
    },
    {
      src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&crop=center",
      title: "Surgery Training Session",
      description: "Hands-on training session for residents learning advanced surgical techniques under expert supervision."
    },
    {
      src: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop&crop=center",
      title: "Research Laboratory",
      description: "State-of-the-art research facility where breakthrough medical discoveries are made daily."
    },
    {
      src: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop&crop=center",
      title: "Patient Care Excellence",
      description: "Dedicated healthcare professionals providing compassionate care and support to patients and families."
    },
    {
      src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop&crop=center",
      title: "Medical Education",
      description: "Interactive learning sessions where medical students engage with cutting-edge educational content."
    },
    {
      src: "https://images.unsplash.com/photo-1559757175-8a6c4f73d2d7?w=800&h=600&fit=crop&crop=center",
      title: "Healthcare Innovation",
      description: "Showcasing the latest medical technologies and innovations that are transforming patient care."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const nextStory = () => {
    setSelectedStory((prev) => (prev + 1) % galleryImages.length);
  };

  const prevStory = () => {
    setSelectedStory((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const features = [
    {
      icon: Stethoscope,
      title: 'Clinical Excellence',
      description: 'Advanced clinical training and skill development',
      stats: '500+ Students'
    },
    {
      icon: GraduationCap,
      title: 'Academic Leadership',
      description: 'Fostering next-generation medical leaders',
      stats: '50+ Colleges'
    },
    {
      icon: Award,
      title: 'Research Impact',
      description: 'Published research with real-world applications',
      stats: '100+ Papers'
    },
    {
      icon: Heart,
      title: 'Community Care',
      description: 'Serving communities through medical outreach',
      stats: '1000+ Lives Touched'
    }
  ];


  // Define the values array for "Our Values" section
  const values = [
    {
      icon: Heart,
      title: 'Compassion',
      description: 'We put empathy and patient care at the heart of everything we do.',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for the highest standards in academics, research, and service.',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace new ideas and creative solutions in medical education.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Handshake,
      title: 'Collaboration',
      description: 'We believe in teamwork and building bridges across disciplines.',
      color: 'from-green-400 to-teal-500'
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We uphold honesty, ethics, and transparency in all our actions.',
      color: 'from-gray-400 to-gray-600'
    }
  ];

  const partners = [
    { name: "Harvard Medical School", logo: "https://logo.clearbit.com/harvard.edu" },
    { name: "Johns Hopkins", logo: "https://logo.clearbit.com/jhu.edu" },
    { name: "Stanford Medicine", logo: "https://logo.clearbit.com/stanford.edu" },
    { name: "Mayo Clinic", logo: "https://logo.clearbit.com/mayoclinic.org" },
    { name: "UCLA", logo: "https://logo.clearbit.com/ucla.edu" },
    { name: "NYU Langone", logo: "https://logo.clearbit.com/nyu.edu" },
    { name: "UCSF", logo: "https://logo.clearbit.com/ucsf.edu" },
    { name: "Yale School of Medicine", logo: "https://logo.clearbit.com/yale.edu" },
    { name: "Columbia Medicine", logo: "https://logo.clearbit.com/columbia.edu" },
    { name: "University of Pennsylvania", logo: "https://logo.clearbit.com/upenn.edu" }
  ];

  const duplicatedPartners = [...partners, ...partners];

  // Sample testimonials data
  const testimonials = [
    {
      quote: "This platform transformed my MCAT preparation. The personalized study plans and AI-powered practice questions helped me achieve my target score.",
      author: "Sarah Johnson",
      position: "Pre-Med Student, Harvard University",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "The comprehensive resources and expert guidance made medical school applications so much easier. I got accepted to my dream school!",
      author: "Michael Chen",
      position: "Medical Student, Johns Hopkins",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "Outstanding support throughout my medical journey. The mentorship program connected me with amazing physicians who guided my career path.",
      author: "Emily Rodriguez",
      position: "Resident, Mayo Clinic",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "The clinical rotation resources were invaluable. I felt more prepared and confident during my hospital rotations thanks to this platform.",
      author: "David Kumar",
      position: "Medical Student, Stanford Medicine",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "From MCAT prep to residency matching, this platform supported me every step of the way. Couldn't have done it without them!",
      author: "Jessica Park",
      position: "Resident, Mass General Brigham",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "The community aspect is incredible. Connecting with fellow pre-med students and sharing experiences made the journey less isolating.",
      author: "Alex Thompson",
      position: "Pre-Med Student, UCLA",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5
    }
  ];

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  // Features for "Why Join SMAK?" section
  const whyJoinFeatures = [
    {
      icon: GraduationCap,
      title: "Leadership Opportunities",
      description: "Take on leadership roles in organizing events, research, and outreach programs.",
      stats: "50+ Student Leaders",
      badge: "Leadership"
    },
    {
      icon: Microscope,
      title: "Research Mentorship",
      description: "Get mentored by top doctors and researchers for your academic projects.",
      stats: "100+ Mentors",
      badge: "Mentorship"
    },
    {
      icon: BookOpen,
      title: "Academic Resources",
      description: "Access exclusive study materials, webinars, and journal archives.",
      stats: "200+ Resources",
      badge: "Academics"
    },
    {
      icon: Users,
      title: "National Visibility",
      description: "Get your institution recognized across the country through our extensive network and platform reach",
      stats: "1000+ Members",
      badge: "Community"
    },
    {
      icon: Award,
      title: "Recognition & Awards",
      description: "Earn certificates, awards, recognition and build your CV",
      stats: "30+ Awards",
      badge: "Recognition"
    },
    {
      icon: Globe,
      title: "Collaborative Projects",
      description: "Participate in multi-institutional research and outreach projects.",
      stats: "20+ Projects",
      badge: "Collaboration"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Enhanced Calming Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/80 via-sky-50/60 to-cyan-50/80 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Enhanced Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-sky-100/30 to-cyan-100/40 dark:from-blue-900/30 dark:via-slate-800/40 dark:to-cyan-900/20"></div>

          {/* Soft floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-cyan-200/40 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-sky-200/50 rounded-full blur-lg animate-pulse delay-500"></div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-blue-300/30 rounded-full blur-lg animate-pulse delay-700"></div>

          {/* Background Medical Icons */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.03] dark:opacity-[0.06]">
            {/* Large background icons */}
            <div className="absolute top-10 left-32 text-blue-400 rotate-12">
              <Stethoscope className="h-24 w-24" />
            </div>
            <div className="absolute top-40 right-20 text-cyan-400 -rotate-12">
              <Brain className="h-32 w-32" />
            </div>
            <div className="absolute bottom-40 left-16 text-sky-400 rotate-45">
              <Heart className="h-28 w-28" />
            </div>
            <div className="absolute bottom-20 right-32 text-blue-400 -rotate-45">
              <Activity className="h-20 w-20" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyan-400 rotate-90">
              <Shield className="h-36 w-36" />
            </div>
            <div className="absolute top-20 right-1/3 text-blue-400 rotate-30">
              <Microscope className="h-22 w-22" />
            </div>
          </div>

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>

          {/* Enhanced wave animation */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-200/20 via-sky-100/10 to-transparent dark:from-blue-900/20 dark:via-blue-800/10"></div>

          {/* Diagonal gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/20 to-cyan-100/30 dark:from-transparent dark:via-blue-950/20 dark:to-cyan-950/10"></div>
        </div>

        {/* Floating Medical Icons with Gentle Animation */}
        <div className="absolute top-20 left-10 text-blue-300/60 animate-float">
          <Stethoscope className="h-8 w-8 drop-shadow-sm" />
        </div>
        <div className="absolute top-32 right-16 text-cyan-400/50 animate-float-delayed">
          <Brain className="h-6 w-6 drop-shadow-sm" />
        </div>
        <div className="absolute bottom-32 left-20 text-sky-400/60 animate-float-slow">
          <Heart className="h-7 w-7 drop-shadow-sm" />
        </div>
        <div className="absolute top-1/2 right-10 text-blue-400/40 animate-float-reverse">
          <Activity className="h-5 w-5 drop-shadow-sm" />
        </div>
        <div className="absolute bottom-20 right-1/4 text-cyan-300/50 animate-float">
          <Shield className="h-6 w-6 drop-shadow-sm" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Unique SMAK Logo Area */}
            <div className="mb-12 relative">
              <div className="relative inline-block">
                <div className="w-44 h-44 mx-auto mb-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-blue-400 dark:border-blue-700 shadow-2xl">
                  <img
                    src="https://i.postimg.cc/LXmZbsWJ/Logo.jpg"
                    alt="SMAK Logo"
                    className="w-36 h-36 object-contain rounded-full shadow-xl border-4 border-white dark:border-blue-900 animate-gentle-pulse"
                    style={{ background: "#e8efff" }}
                  />
                </div>
                {/* Orbiting Elements for Uniqueness */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 w-56 h-56 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full flex items-center justify-center shadow-lg animate-orbit-slow">
                        <Crown className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg animate-orbit-reverse">
                        <Star className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-full flex items-center justify-center shadow-lg animate-orbit-side">
                        <Zap className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg animate-orbit-side-reverse">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent flex items-center justify-center gap-4 mb-4">
                <span className="animate-fade-in-up">Empowering Tomorrow's</span>
              </div>
              <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in-up-delayed">
                Empowering Tomorrow’s Healers Through Knowledge today
              </div>
            </h1>

            <div className="mb-12 animate-fade-in-up-slow">
              <p className="text-xl md:text-3xl text-slate-600 dark:text-slate-300 mb-6 max-w-4xl mx-auto leading-relaxed font-light">
                Welcome to <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">The Society for Medical Academia and Knowledge</span>
              </p>
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                A student-led nonprofit platform uniting future doctors through knowledge,  research, leadership andcollaboration
              </p>
            </div>

            {/* Enhanced CTA Buttons with Breathing Animation */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up-slower">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-gentle-breathe" asChild>
                <Link to="/register">
                  <Rocket className="mr-3 h-5 w-5" />
                  Join SMAK Today
                </Link>
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-gentle-breathe" asChild>
                <Link to="/research-hub">
                  <Rocket className="mr-3 h-5 w-5" />
                  Research Club
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-5 rounded-full border-2 border-blue-200/60 hover:border-blue-300 hover:bg-blue-50/50 dark:border-blue-700/60 dark:hover:bg-blue-950/30 backdrop-blur-sm transition-all duration-300" asChild>
                <Link to="/journal">
                  <FileText className="mr-3 h-5 w-5" />
                  View Journal
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-5 rounded-full border-2 border-cyan-200/60 hover:border-cyan-300 hover:bg-cyan-50/50 dark:border-cyan-700/60 dark:hover:bg-cyan-950/30 backdrop-blur-sm transition-all duration-300" asChild>
                <Link to="/events">
                  <Calendar className="mr-3 h-5 w-5" />
                  Upcoming Events
                </Link>
              </Button>
            </div>

            {/* Achievement Stats with Glass Morphism (Firestore-powered) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in-up-slowest">
              {achievements.map((achievement, index) => {
                const Icon = achievementIconMap[achievement.icon] || Star;
                return (
                  <div key={index} className="group text-center p-6 bg-white/40 dark:bg-slate-800/40 rounded-3xl backdrop-blur-md border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/60 dark:hover:bg-slate-800/60">
                    <div className="mb-4 flex justify-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                      {achievement.value}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {achievement.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inspirational Quote */}
            <div className="mt-16 max-w-2xl mx-auto animate-fade-in-up-ultra-slow">
              <blockquote className="text-lg md:text-xl text-slate-500 dark:text-slate-400 italic font-light leading-relaxed">
                "The art of medicine consists of amusing the patient while nature cures the disease."
              </blockquote>
              <cite className="block mt-3 text-sm text-slate-400 dark:text-slate-500">— Voltaire</cite>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style>
          {`
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    
    @keyframes float-delayed {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(-3deg); }
    }
    
    @keyframes float-slow {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }
    
    @keyframes float-reverse {
      0%, 100% { transform: translateY(-10px) rotate(0deg); }
      50% { transform: translateY(0px) rotate(-2deg); }
    }
    
    @keyframes gentle-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes gentle-breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    
    @keyframes orbit-slow {
      0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
      100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
    }
    
    @keyframes orbit-reverse {
      0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
      100% { transform: rotate(-360deg) translateX(80px) rotate(360deg); }
    }
    
    @keyframes orbit-side {
      0% { transform: rotate(90deg) translateX(70px) rotate(-90deg); }
      100% { transform: rotate(450deg) translateX(70px) rotate(-450deg); }
    }
    
    @keyframes orbit-side-reverse {
      0% { transform: rotate(270deg) translateX(70px) rotate(-270deg); }
      100% { transform: rotate(-90deg) translateX(70px) rotate(90deg); }
    }
    
    @keyframes fade-in-up {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
    .animate-float-slow { animation: float-slow 8s ease-in-out infinite 2s; }
    .animate-float-reverse { animation: float-reverse 5s ease-in-out infinite 0.5s; }
    .animate-gentle-pulse { animation: gentle-pulse 4s ease-in-out infinite; }
    .animate-gentle-breathe { animation: gentle-breathe 3s ease-in-out infinite; }
    .animate-orbit-slow { animation: orbit-slow 20s linear infinite; }
    .animate-orbit-reverse { animation: orbit-reverse 25s linear infinite; }
    .animate-orbit-side { animation: orbit-side 18s linear infinite; }
    .animate-orbit-side-reverse { animation: orbit-side-reverse 22s linear infinite; }
    .animate-fade-in-up { animation: fade-in-up 1s ease-out 0.2s both; }
    .animate-fade-in-up-delayed { animation: fade-in-up 1s ease-out 0.4s both; }
    .animate-fade-in-up-slow { animation: fade-in-up 1s ease-out 0.6s both; }
    .animate-fade-in-up-slower { animation: fade-in-up 1s ease-out 0.8s both; }
    .animate-fade-in-up-slowest { animation: fade-in-up 1s ease-out 1s both; }
    .animate-fade-in-up-ultra-slow { animation: fade-in-up 1s ease-out 1.2s both; }
  `}</style>
      </section>

      {/* Enhanced Features Section */}

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              <Heart className="inline h-10 w-10 text-red-500 mr-3" />
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The core principles that guide everything we do at SMAK
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((value, index) => (
              <div key={index} className="group">
                <Card className="h-full transition-all duration-500 border-0 bg-white dark:bg-card shadow-lg hover:shadow-2xl transform hover:-translate-y-1 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${value.color}`}></div>
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${value.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg mb-3 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center px-4 pb-6">
                    <CardDescription className="text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join SMAK Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              <Sparkles className="inline h-10 w-10 text-blue-500 mr-3" />
              Why Join SMAK?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the exclusive benefits and opportunities waiting for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {whyJoinFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-2 border-blue-100 hover:border-blue-300 dark:border-blue-900 dark:hover:border-blue-700 transform hover:-translate-y-3 bg-white dark:bg-card relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-transparent dark:from-blue-900/30 rounded-bl-2xl"></div>

                {/* Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                    {feature.badge}
                  </span>
                </div>

                <CardHeader className="pb-4 pt-6 pr-20 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg flex-shrink-0">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                      <div className="text-lg font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                        {feature.stats}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Let's break walls and build bridges
            </h3>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Join SMAK and make history with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                asChild
              >
                <Link to="/login">
                  Join SMAK Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About SMAK Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  <Library className="inline h-10 w-10 text-blue-500 mr-3" />
                  About SMAK
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  SMAK is a student-founded organization uniting medical students, researchers, and clinicians across India to build a new era of evidence-based academic medicine. We bridge the gap between theoretical knowledge and practical application.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-blue-500" />
                    <span className="text-lg">Evidence-based medical education</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="h-6 w-6 text-blue-500" />
                    <span className="text-lg">Collaborative learning environment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-6 w-6 text-blue-500" />
                    <span className="text-lg">Innovation in medical practice</span>
                  </div>
                </div>

              </div>
              <div className="relative">
                <img
                  src="https://plus.unsplash.com/premium_photo-1752073513197-0e69835878c5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Medical collaboration"
                  className="w-full rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg">
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-sm">Medical Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Our Pillars */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              <GraduationCap className="inline h-10 w-10 text-blue-500 mr-3" />
              Our Pillars
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              "We aim to develop competent, compassionate, and research-driven doctors ready to serve globally."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, index) => (
              <Card key={index} className="group text-center hover:shadow-2xl transition-all duration-500 border-2 hover:border-blue-200 dark:hover:border-blue-800 transform hover:-translate-y-3 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${pillar.color}`}></div>
                <CardHeader className="pb-4">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                    <pillar.icon className="h-10 w-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{pillar.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Gallery Section with Interactive Slider */}
      <section className="py-20 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 dark:from-blue-950/10 dark:via-background dark:to-purple-950/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              <Camera className="inline h-12 w-12 text-blue-500 mr-4" />
              SMAK Gallery
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Capturing moments of learning, collaboration, and medical excellence
            </p>
          </div>

          {/* Gallery Mode Switcher */}
          <div className="flex justify-center mb-12 space-x-2">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              className="rounded-full transition-all duration-300 hover:scale-105"
            >
              <Grid3X3 className="mr-2 h-4 w-4" />
              Grid
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'carousel' ? 'default' : 'outline'}
              onClick={() => setViewMode('carousel')}
              className="rounded-full transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Carousel
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'stories' ? 'default' : 'outline'}
              onClick={() => setViewMode('stories')}
              className="rounded-full transition-all duration-300 hover:scale-105"
            >
              <Circle className="mr-2 h-4 w-4" />
              Stories
            </Button>
          </div>

          {/* Grid View (Enhanced Original) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((image, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 relative animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-125 group-hover:brightness-110"
                    />

                    {/* Animated overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                    {/* Floating action buttons */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="h-10 w-10 p-0 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20">
                          <Heart className="h-4 w-4 text-white" />
                        </Button>
                        <Button size="sm" className="h-10 w-10 p-0 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20">
                          <Share2 className="h-4 w-4 text-white" />
                        </Button>
                        <Button size="sm" className="h-10 w-10 p-0 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20">
                          <Bookmark className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </div>

                    {/* Enhanced content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 text-white transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100 p-6">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-xs text-white/70">LIVE EVENT</span>
                      </div>
                      <h3 className="font-bold text-xl mb-2 leading-tight">{image.title}</h3>
                      <p className="text-sm text-white/90 mb-4 line-clamp-2">{image.description}</p>

                      {/* Social stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-white/80">
                          <span className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {Math.floor(Math.random() * 100) + 20}
                          </span>
                          <span className="flex items-center">
                            <Share2 className="h-3 w-3 mr-1" />
                            {Math.floor(Math.random() * 20) + 5}
                          </span>
                        </div>
                        <Button size="sm" className="text-xs px-3 py-1 rounded-full bg-blue-500 hover:bg-blue-600">
                          View
                        </Button>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      <div className="w-8 h-8 border-2 border-white/30 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Carousel View */}
          {viewMode === 'carousel' && (
            <div className="relative max-w-6xl mx-auto">
              <div className="overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm p-2">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {galleryImages.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative group">
                      <div className="aspect-video relative overflow-hidden rounded-2xl">
                        <img
                          src={image.src}
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                        {/* Carousel content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                          <div className="flex items-end justify-between">
                            <div className="flex-1 max-w-2xl">
                              <div className="flex items-center mb-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                                <span className="text-sm text-white/80 uppercase tracking-wider">Medical Excellence</span>
                              </div>
                              <h3 className="text-4xl font-bold mb-3 leading-tight">{image.title}</h3>
                              <p className="text-lg text-white/90 mb-6 leading-relaxed">{image.description}</p>
                              <div className="flex items-center space-x-4">
                                <Button className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20">
                                  <Play className="h-4 w-4 mr-2" />
                                  Watch Now
                                </Button>
                                <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share
                                </Button>
                              </div>
                            </div>

                            {/* Navigation */}
                            <div className="text-right">
                              <div className="text-sm text-white/70 mb-4">
                                {String(index + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
                              </div>
                              <div className="flex space-x-3">
                                <Button
                                  size="lg"
                                  variant="ghost"
                                  className="h-12 w-12 p-0 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
                                  onClick={prevSlide}
                                >
                                  <ChevronLeft className="h-6 w-6 text-white" />
                                </Button>
                                <Button
                                  size="lg"
                                  variant="ghost"
                                  className="h-12 w-12 p-0 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
                                  onClick={nextSlide}
                                >
                                  <ChevronRight className="h-6 w-6 text-white" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced indicators */}
              <div className="flex justify-center mt-8 space-x-3">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`relative transition-all duration-300 ${index === currentSlide
                      ? 'w-12 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full'
                      }`}
                  >
                    {index === currentSlide && (
                      <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stories View */}
          {viewMode === 'stories' && (
            <div className="max-w-5xl mx-auto">
              {/* Stories thumbnails */}
              <div className="flex justify-center space-x-6 mb-10 overflow-x-auto pb-4">
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${selectedStory === index ? 'transform scale-110' : 'hover:scale-105'
                      }`}
                    onClick={() => setSelectedStory(index)}
                  >
                    <div className={`w-24 h-24 rounded-full p-1 ${selectedStory === index
                      ? 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-lg'
                      : 'bg-gradient-to-r from-gray-300 to-gray-400 hover:from-blue-400 hover:to-purple-500'
                      }`}>
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full rounded-full object-cover border-3 border-white shadow-md"
                      />
                      {selectedStory === index && (
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                      )}
                    </div>
                    <p className="text-center text-xs mt-3 font-medium truncate w-24 text-gray-600">
                      {image.title.split(' ')[0]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Story viewer */}
              <Card className="relative overflow-hidden rounded-3xl shadow-2xl max-w-sm mx-auto bg-black">
                <div className="aspect-[9/16] relative">
                  <img
                    src={galleryImages[selectedStory].src}
                    alt={galleryImages[selectedStory].title}
                    className="w-full h-full object-cover"
                  />

                  {/* Story progress bars */}
                  <div className="absolute top-6 left-4 right-4 flex space-x-1 z-10">
                    {galleryImages.map((_, index) => (
                      <div key={index} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-white rounded-full transition-all duration-300 ${index < selectedStory ? 'w-full' :
                            index === selectedStory ? 'w-3/4 animate-pulse' : 'w-0'
                            }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Story header */}
                  <div className="absolute top-16 left-4 right-4 flex items-center text-white z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                      <Camera className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">SMAK Medical</p>
                      <p className="text-xs text-white/80">2 hours ago</p>
                    </div>
                  </div>

                  {/* Story content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
                    <h3 className="text-2xl font-bold mb-2 leading-tight">{galleryImages[selectedStory].title}</h3>
                    <p className="text-white/90 mb-6 text-sm leading-relaxed">{galleryImages[selectedStory].description}</p>

                    {/* Story actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4">
                        <Button size="sm" className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button size="sm" className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tap zones for navigation */}
                  <div className="absolute inset-y-0 left-0 w-1/2 cursor-pointer z-5" onClick={prevStory}></div>
                  <div className="absolute inset-y-0 right-0 w-1/2 cursor-pointer z-5" onClick={nextStory}></div>
                </div>
              </Card>
            </div>
          )}

          {/* Enhanced action button */}
          <div className="text-center mt-16">
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 px-12 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              asChild
            >
              <Link to="/exploregalllery">
                <Sparkles className="mr-3 h-6 w-6 animate-pulse" />
                Explore Full Gallery
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Keep existing sections with minor enhancements */}
      {/* Upcoming Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              <Calendar className="inline h-10 w-10 text-blue-500 mr-3" />
              Upcoming Events
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Clinical Case Presentations",
                date: "Dec 15, 2024",
                time: "2:00 PM IST",
                image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=center",
                description: "Interactive case discussions with expert clinicians",
                attendees: "150+ registered"
              },
              {
                title: "Research Methodology Webinar",
                date: "Dec 20, 2024",
                time: "3:00 PM IST",
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop&crop=center",
                description: "Learn advanced research techniques and methodologies",
                attendees: "200+ registered"
              },
              {
                title: "Annual Medical Quiz Series",
                date: "Jan 5, 2025",
                time: "11:00 AM IST",
                image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop&crop=center",
                description: "Compete with peers in this comprehensive medical quiz",
                attendees: "500+ registered"
              }
            ].map((event, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {event.attendees}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-blue-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="rounded-full border-2 border-blue-200" asChild>
              <Link to="/events">
                <Calendar className="mr-2 h-5 w-5" />
                See Full Calendar <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SMAK Journal Snapshot */}
      <section className="py-20 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              <FileText className="inline h-10 w-10 text-blue-500 mr-3" />
              SMAK Journal Snapshot
            </h2>
          </div>

          <Card className="max-w-5xl mx-auto hover:shadow-2xl transition-all duration-500 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-2/5">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=400&fit=crop&crop=center"
                  alt="Featured research article"
                  className="w-full h-80 md:h-full object-cover"
                />
              </div>
              <div className="md:w-3/5 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Featured Article</span>
                </div>
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl mb-4 leading-tight">
                    Novel Approaches in Telemedicine: Transforming Rural Healthcare Access
                  </CardTitle>
                  <CardDescription className="text-base">
                    By Dr. Sarah Johnson, Dr. Raj Patel, and SMAK Research Team
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    This comprehensive study explores innovative telemedicine solutions that are revolutionizing healthcare delivery in rural areas, with a focus on cost-effective implementation and patient outcomes...
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">2.5k Downloads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">45 Citations</span>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Browse Journal Archive <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50/50 dark:from-background dark:to-blue-950/20">
        <div className="container mx-auto px-4">
          {/* Testimonials Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              <Star className="inline h-10 w-10 text-blue-500 mr-3" />
              Student Testimonials
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Hear from our community of future medical leaders
            </p>
          </div>

          {/* Testimonials Slider */}
          <div className="relative overflow-hidden mb-20">
            <div className="flex animate-scroll-left">
              {duplicatedTestimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6 text-center">
                    <div className="mb-6">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-blue-100 object-cover"
                      />
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <blockquote className="text-gray-600 dark:text-gray-300 mb-6 italic text-sm leading-relaxed min-h-[80px]">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-lg text-gray-800 dark:text-white">{testimonial.author}</p>
                      <p className="text-blue-600 font-medium text-sm">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Institutions Section */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Trusted by Leading Institutions
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Partnering with top medical schools and healthcare institutions
            </p>
          </div>

          {/* Partners Logo Carousel */}
          <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-inner py-8">
            <div className="flex animate-scroll-right">
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-8 flex items-center justify-center"
                >
                  <div className="w-32 h-16 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/120x40/4F46E5/FFFFFF?text=${partner.name.split(' ')[0]}`;
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 25s linear infinite;
        }

        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>
      </section>

      {/* Collaborate With Us */}
      <section className="py-20 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              <Users className="inline h-10 w-10 text-blue-500 mr-3" />
              Collaborate With Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Want to bring SMAK to your college? Join our growing network of medical institutions and be part of the medical education revolution.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-lg py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300" asChild>
              <Link to="/collaborate">
                <Users className="mr-2 h-5 w-5" />
                Request Collaboration <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3">
              <Mail className="h-12 w-12" />

              Stay Updated
            </h2>
            <p className="text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">
              Get latest research calls, event invites, and journal updates directly to your inbox. Join 5000+ medical students already subscribed.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="flex gap-3 mb-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 rounded-full px-6 py-3 text-lg"
              />
              <Button variant="secondary" className="rounded-full px-8 py-3 text-lg font-medium">
                <Mail className="mr-2 h-5 w-5" />
                Subscribe
              </Button>
            </div>
            <p className="text-center text-white/80 text-sm">
              <Shield className="inline h-4 w-4 mr-1" />
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <GeminiChatbot />
    </div>
  );
}

export default Index;
