import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Microscope, Brain, Globe, Users, Award, Target, Heart, Stethoscope, Shield, Plus, Edit, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

const ADMIN_EMAILS = ['admin@example.com', 'anotheradmin@example.com', 'smak.founder@gmail.com', 'smak.researchclub@gmail.com', 'smak.quizclub@gmail.com', 'Sjmsr.journal@gmail.com', 'Team.smak2025@gmail.com', 'Khushal.smak@gmail.com', 'Samudra.smak@gmail.com'];

const About = () => {
  const { user } = useAuth();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');
  
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentPartner, setCurrentPartner] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Admin state for partners
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerForm, setPartnerForm] = useState({ name: '', image: '', gradient: 'from-blue-500 to-indigo-500' });
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  
  // Admin state for leadership
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [leaderForm, setLeaderForm] = useState({ name: '', role: '', college: '', image: '', objectPosition: '' });
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);

  const values = [
    {
      icon: Users,
      title: "Inclusivity",
      description: "Creating a welcoming space for all medical students regardless of background or institution"
    },
    {
      icon: BookOpen,
      title: "Collaboration",
      description: "Fostering partnerships and teamwork across medical colleges and universities"
    },
    {
      icon: Target,
      title: "Empowerment",
      description: "Giving students the tools and opportunities to lead and make meaningful contributions"
    },
    {
      icon: Award,
      title: "Credibility",
      description: "Maintaining the highest standards of academic integrity and professional ethics"
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Ensuring our resources and opportunities are available to all students, everywhere"
    }
  ];

  const whyJoinBenefits = [
    {
      icon: Globe,
      title: "National Visibility",
      description: "Get national recognition for your institution through our platform",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Leadership Exposure",
      description: "Develop leadership skills through various roles and responsibilities",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: BookOpen,
      title: "Free Research Publishing",
      description: "Publish your research papers at no cost through our academic journal",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      icon: Users,
      title: "Academic Collaboration",
      description: "Connect and collaborate with students from colleges across India",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: Shield,
      title: "No Fees, No Conditions",
      description: "Join our community completely free with no hidden conditions",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const achievements = [
    { number: "10,000+", label: "Active Members", icon: Users },
    { number: "500+", label: "Research Papers Published", icon: BookOpen },
    { number: "200+", label: "Partner Institutions", icon: Award },
    { number: "50+", label: "Cities Reached", icon: Globe }
  ];

  const testimonials = [
    {
      quote: "SMAK has transformed how we approach medical education. The collaborative environment has helped our students excel beyond classroom boundaries.",
      author: "Dr. Meera Gupta",
      position: "Dean, Medical College",
      institution: "Lady Hardinge Medical College",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
    },
    {
      quote: "Being part of SMAK gave me opportunities to publish research and connect with peers nationwide. It's been invaluable for my academic growth.",
      author: "Aditya Sharma",
      position: "Final Year MBBS",
      institution: "AIIMS Delhi",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
    },
    {
      quote: "The platform SMAK provides for research collaboration is unmatched. Our institution has benefited tremendously from this partnership.",
      author: "Prof. Rajesh Kumar",
      position: "Head of Research",
      institution: "JIPMER Puducherry",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face"
    },
    {
      quote: "SMAK's commitment to accessible medical education aligns perfectly with our institutional values. Together, we're shaping future doctors.",
      author: "Dr. Kavita Patel",
      position: "Principal",
      institution: "Grant Medical College",
      image: "https://images.unsplash.com/photo-1594824475871-2b2d28e2fb0e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const [partners, setPartners] = useState([
    { id: '1', name: "AIIMS Delhi", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop", gradient: "from-blue-500 to-indigo-500" },
    { id: '2', name: "JIPMER", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=200&h=200&fit=crop", gradient: "from-indigo-500 to-purple-500" },
    { id: '3', name: "PGIMER", image: "https://images.unsplash.com/photo-1519494140681-8b17d830a3e9?w=200&h=200&fit=crop", gradient: "from-purple-500 to-pink-500" },
    { id: '4', name: "Lady Hardinge", image: "https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?w=200&h=200&fit=crop", gradient: "from-pink-500 to-rose-500" },
    { id: '5', name: "Grant Medical", image: "https://images.unsplash.com/photo-1486825586573-7131f7991bdd?w=200&h=200&fit=crop", gradient: "from-rose-500 to-red-500" },
    { id: '6', name: "KGMU", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&h=200&fit=crop", gradient: "from-red-500 to-orange-500" },
    { id: '7', name: "MAMC", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop", gradient: "from-orange-500 to-yellow-500" },
    { id: '8', name: "UCMS", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop", gradient: "from-yellow-500 to-green-500" }
  ]);
  
  const [leadershipTeam, setLeadershipTeam] = useState([
    {
      id: '1',
      name: "Samudra Chaudhari",
      role: "Founder",
      college: "SMAK",
      image: "https://i.postimg.cc/65tpg88S/Whats-App-Image-2025-08-13-at-13-39-13-32477921.jpg",
      objectPosition: "center 20%"
    },
    {
      id: '2',
      name: "Khushal Pal",
      role: "Co-Founder",
      college: "SMAK",
      image: "https://i.postimg.cc/DwYfS5xk/Whats-App-Image-2025-08-13-at-13-39-13-89a66ab2.jpg",
      objectPosition: ""
    },
    {
      id: '3',
      name: "Disha Agrawala",
      role: "Executive Director",
      college: "SMAK",
      image: "https://i.postimg.cc/VN8d4JBK/Whats-App-Image-2025-08-13-at-13-01-49-0a36118b.jpg",
      objectPosition: ""
    },
    {
      id: '4',
      name: "Piyush Mishra",
      role: "Director of Operations",
      college: "SMAK",
      image: " ",
      objectPosition: ""
    }
  ]);

  // Fetch partners and leadership from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch partners
        const partnersSnapshot = await getDocs(collection(db, 'partners'));
        if (!partnersSnapshot.empty) {
          const partnersData = partnersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPartners(partnersData as any);
        }
        
        // Fetch leadership
        const leadershipSnapshot = await getDocs(collection(db, 'leadership'));
        if (!leadershipSnapshot.empty) {
          const leadershipData = leadershipSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setLeadershipTeam(leadershipData as any);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // Auto-advance testimonials (right to left)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Auto-advance partners (continuous right to left)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPartner((prev) => (prev + 1) % partners.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [partners.length]);
  
  // Partner CRUD functions
  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPartnerId) {
        await updateDoc(doc(db, 'partners', editingPartnerId), partnerForm);
        setPartners(prev => prev.map(p => p.id === editingPartnerId ? { ...p, ...partnerForm } : p));
      } else {
        const docRef = await addDoc(collection(db, 'partners'), partnerForm);
        setPartners(prev => [...prev, { id: docRef.id, ...partnerForm }]);
      }
      setShowPartnerModal(false);
      setPartnerForm({ name: '', logo: '🏥', gradient: 'from-blue-500 to-indigo-500' });
      setEditingPartnerId(null);
    } catch (error) {
      console.error('Error saving partner:', error);
      alert('Failed to save partner');
    }
  };
  
  const handleDeletePartner = async (id: string) => {
    if (!window.confirm('Delete this partner institution?')) return;
    try {
      await deleteDoc(doc(db, 'partners', id));
      setPartners(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting partner:', error);
      alert('Failed to delete partner');
    }
  };
  
  // Leadership CRUD functions
  const handleAddLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLeaderId) {
        await updateDoc(doc(db, 'leadership', editingLeaderId), leaderForm);
        setLeadershipTeam(prev => prev.map(l => l.id === editingLeaderId ? { ...l, ...leaderForm } : l));
      } else {
        const docRef = await addDoc(collection(db, 'leadership'), leaderForm);
        setLeadershipTeam(prev => [...prev, { id: docRef.id, ...leaderForm }]);
      }
      setShowLeaderModal(false);
      setLeaderForm({ name: '', role: '', college: '', image: '', objectPosition: '' });
      setEditingLeaderId(null);
    } catch (error) {
      console.error('Error saving leader:', error);
      alert('Failed to save leader');
    }
  };
  
  const handleDeleteLeader = async (id: string) => {
    if (!window.confirm('Delete this leadership member?')) return;
    try {
      await deleteDoc(doc(db, 'leadership', id));
      setLeadershipTeam(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting leader:', error);
      alert('Failed to delete leader');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900">
      <Navigation />
      
      {/* Hero Section with Medical Background */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-500/5 to-white dark:from-blue-400/5 dark:via-indigo-400/5 dark:to-gray-900"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-6xl md:text-8xl font-bold mb-8">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-400 bg-clip-text text-transparent">
                    About SMAK
                  </span>
                </h1>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1659353889416-fab1265eaa7f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Medical professionals collaborating" 
                    className={`rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    loading="eager"
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 rounded-3xl animate-pulse flex items-center justify-center">
                      <Stethoscope className="h-16 w-16 text-blue-400 animate-pulse" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-3xl"></div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100/50 dark:border-blue-400/20">
                  <Stethoscope className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">What is SMAK?</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    SMAK is India's first student-led, nonprofit medical academic organization built by and for medical students. Our mission: to create an inclusive academic ecosystem that enables collaboration, leadership, and publication beyond college walls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Quote with Medical Imagery */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-800 dark:via-indigo-800 dark:to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://plus.unsplash.com/premium_photo-1729286323727-03ae1fdb054c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Medical background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Heart className="h-16 w-16 mx-auto mb-8 text-white/80 animate-pulse" />
            <blockquote className="text-4xl md:text-6xl font-bold italic mb-8 leading-tight">
              "When one student grows, a doctor is born. When students grow together, medicine evolves."
            </blockquote>
            <p className="text-xl opacity-90">— SMAK Vision Statement</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
            <Card className="group border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 overflow-hidden bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20">
              <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1659353887907-000c9a92377d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Doctor with stethoscope, medical field"
                    className="w-full h-full object-cover object-position-center group-hover:scale-110 transition-transform duration-700"
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
                <Microscope className="absolute top-4 right-4 h-8 w-8 text-white" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  To create a unified platform that bridges the gap between theoretical medical education and practical clinical experience, fostering a community of aspiring healthcare professionals who are committed to excellence, innovation, and compassionate care.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 overflow-hidden bg-gradient-to-br from-white to-indigo-50/50 dark:from-gray-800 dark:to-indigo-900/20">
              <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1170&q=80" 
                    alt="Doctors and nurses in a clinical setting, teamwork"
                    className="w-full h-full object-cover object-position-center group-hover:scale-110 transition-transform duration-700"
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent"></div>
                <Brain className="absolute top-4 right-4 h-8 w-8 text-white" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  When one student grows, a doctor is born. When students grow together, medicine evolves.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values with Enhanced Effects */}
      <section className="py-24 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-gray-900/50 dark:via-gray-800 dark:to-indigo-900/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              The principles that guide everything we do at SMAK
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group text-center hover:shadow-2xl transition-all duration-700 hover:scale-110 hover:-translate-y-4 cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-500 group-hover:bg-gradient-to-br group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-700 dark:group-hover:to-indigo-700 relative z-10">
                    <value.icon className="h-12 w-12 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 relative z-10 dark:text-gray-200">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base leading-relaxed dark:text-gray-400">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join SMAK with Medical Background */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 via-blue-900/5 to-purple-900/5 dark:from-indigo-800/10 dark:via-blue-800/10 dark:to-purple-800/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Why Join SMAK?
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Discover the benefits that make SMAK the premier choice for medical students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {whyJoinBenefits.map((benefit, index) => (
              <Card key={index} className="group text-center hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-6 cursor-pointer border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardHeader className="pb-4 relative z-10">
                  <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${benefit.gradient} rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-500 shadow-lg group-hover:shadow-xl`}>
                    <benefit.icon className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 dark:text-gray-200">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base leading-relaxed dark:text-gray-400">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements with Medical Icons */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop" 
            alt="Medical achievements"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Our Impact in Numbers
            </h2>
            <p className="text-2xl opacity-90">
              See how SMAK is making a difference in medical education
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="mb-6">
                  <achievement.icon className="h-16 w-16 mx-auto mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                  <div className="text-5xl md:text-7xl font-bold mb-4 group-hover:scale-110 transition-transform duration-500">{achievement.number}</div>
                </div>
                <div className="text-xl md:text-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-300">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Automatic Testimonials Slider */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 dark:from-gray-900/30 dark:via-gray-800 dark:to-indigo-900/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              What Our Community Says
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-400">
              Hear from students and faculty who are part of the SMAK family
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-700">
                      <CardContent className="text-center p-12">
                        <div className="mb-8">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.author}
                            className="w-20 h-20 rounded-full mx-auto mb-6 object-cover shadow-lg border-4 border-blue-100 dark:border-blue-400"
                          />
                          <blockquote className="text-2xl md:text-3xl italic mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                            "{testimonial.quote}"
                          </blockquote>
                        </div>
                        <div className="border-t border-blue-100 dark:border-blue-400 pt-6">
                          <h4 className="font-semibold text-xl mb-2 text-blue-800 dark:text-blue-300">{testimonial.author}</h4>
                          <p className="text-blue-600 dark:text-blue-400 font-medium text-lg mb-1">{testimonial.position}</p>
                          <p className="text-gray-600 dark:text-gray-400">{testimonial.institution}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-12 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${
                    index === currentTestimonial 
                      ? 'bg-blue-600 shadow-lg scale-110' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-blue-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Automatic Partner Logos Slider */}
      <section className="py-24 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-gray-900/50 dark:via-gray-800 dark:to-indigo-900/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our Partner Institutions
              </h2>
              {isAdmin && (
                <Button
                  onClick={() => {
                    setShowPartnerModal(true);
                    setEditingPartnerId(null);
                    setPartnerForm({ name: '', image: '', gradient: 'from-blue-500 to-indigo-500' });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3"
                >
                  <Plus size={24} />
                </Button>
              )}
            </div>
            <p className="text-2xl text-gray-600 dark:text-gray-400">
              Proud to collaborate with India's premier medical colleges
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${(currentPartner * 100) / 4}%)` }}
              >
                {[...partners, ...partners].map((partner, index) => (
                  <div key={index} className="w-1/4 flex-shrink-0 px-4">
                    <Card className="text-center p-8 hover:shadow-2xl transition-all duration-700 hover:scale-110 hover:-translate-y-4 group cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm relative">
                      {isAdmin && index < partners.length && (
                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                          <Button
                            size="sm"
                            onClick={() => {
                              setEditingPartnerId(partner.id);
                              setPartnerForm({ name: partner.name, image: partner.image, gradient: partner.gradient });
                              setShowPartnerModal(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeletePartner(partner.id)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      )}
                      <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${partner.gradient} rounded-full flex items-center justify-center overflow-hidden group-hover:scale-125 transition-transform duration-500 shadow-lg group-hover:shadow-xl`}>
                        <img 
                          src={partner.image} 
                          alt={partner.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 dark:text-gray-200">{partner.name}</h3>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team with Medical Photos */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Leadership Team
              </h2>
              {isAdmin && (
                <Button
                  onClick={() => {
                    setShowLeaderModal(true);
                    setEditingLeaderId(null);
                    setLeaderForm({ name: '', role: '', college: '', image: '', objectPosition: '' });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3"
                >
                  <Plus size={24} />
                </Button>
              )}
            </div>
            <p className="text-2xl text-gray-600 dark:text-gray-400">
              Meet the dedicated individuals leading SMAK's mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {leadershipTeam.map((member, index) => (
              <Card key={index} className="group text-center hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-6 cursor-pointer border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden">
                <CardContent className="pt-10 pb-8 relative">
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingLeaderId(member.id);
                          setLeaderForm({ 
                            name: member.name, 
                            role: member.role, 
                            college: member.college, 
                            image: member.image,
                            objectPosition: member.objectPosition || ''
                          });
                          setShowLeaderModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDeleteLeader(member.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative mb-8">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-40 h-40 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-500 shadow-xl border-4 border-blue-100 dark:border-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-300"
                      style={member.objectPosition ? { objectPosition: member.objectPosition, objectFit: 'cover', background: '#e8efff', padding: '4px' } : { background: '#e8efff' }}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 relative z-10 dark:text-gray-200">{member.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3 text-lg group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300 relative z-10">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 relative z-10">{member.college}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section with Medical Background */}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=600&fit=crop" 
            alt="Medical collaboration"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-indigo-600/80 to-purple-600/80 dark:from-blue-800/80 dark:via-indigo-800/80 dark:to-purple-800/80"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Heart className="h-20 w-20 mx-auto mb-8 animate-pulse" />
          <h2 className="text-5xl md:text-7xl font-bold mb-12 leading-tight">
            Let's break walls and build bridges
          </h2>
          <p className="text-2xl md:text-4xl mb-16 opacity-90 leading-relaxed max-w-4xl mx-auto">
            Join SMAK and make history with us.
          </p>
          <Link to="/login">
  <Button 
    size="lg" 
    variant="secondary" 
    className="text-blue-600 hover:text-blue-700 dark:text-blue-800 dark:hover:text-blue-900 text-2xl px-16 py-8 hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-3xl font-bold rounded-full bg-white/95 backdrop-blur-sm border-2 border-white/20 hover:bg-white"
  >
    Join SMAK Today
    <Users className="ml-3 h-6 w-6" />
  </Button>
</Link>

        </div>
      </section>

      {/* Partner Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowPartnerModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {editingPartnerId ? 'Edit Partner' : 'Add Partner Institution'}
            </h3>
            <form onSubmit={handleAddPartner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Institution Name</label>
                <input
                  type="text"
                  required
                  value={partnerForm.name}
                  onChange={e => setPartnerForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., AIIMS Delhi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Image URL</label>
                <input
                  type="text"
                  required
                  value={partnerForm.image}
                  onChange={e => setPartnerForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Gradient Colors</label>
                <select
                  required
                  value={partnerForm.gradient}
                  onChange={e => setPartnerForm(prev => ({ ...prev, gradient: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="from-blue-500 to-indigo-500">Blue to Indigo</option>
                  <option value="from-indigo-500 to-purple-500">Indigo to Purple</option>
                  <option value="from-purple-500 to-pink-500">Purple to Pink</option>
                  <option value="from-pink-500 to-rose-500">Pink to Rose</option>
                  <option value="from-rose-500 to-red-500">Rose to Red</option>
                  <option value="from-red-500 to-orange-500">Red to Orange</option>
                  <option value="from-orange-500 to-yellow-500">Orange to Yellow</option>
                  <option value="from-yellow-500 to-green-500">Yellow to Green</option>
                  <option value="from-green-500 to-emerald-500">Green to Emerald</option>
                  <option value="from-cyan-500 to-blue-500">Cyan to Blue</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  {editingPartnerId ? 'Update' : 'Add'} Partner
                </Button>
                <Button type="button" onClick={() => setShowPartnerModal(false)} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leadership Modal */}
      {showLeaderModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowLeaderModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {editingLeaderId ? 'Edit Leader' : 'Add Leadership Member'}
            </h3>
            <form onSubmit={handleAddLeader} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  required
                  value={leaderForm.name}
                  onChange={e => setLeaderForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Role</label>
                <input
                  type="text"
                  required
                  value={leaderForm.role}
                  onChange={e => setLeaderForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Founder"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">College/Organization</label>
                <input
                  type="text"
                  required
                  value={leaderForm.college}
                  onChange={e => setLeaderForm(prev => ({ ...prev, college: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., SMAK"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Image URL</label>
                <input
                  type="text"
                  required
                  value={leaderForm.image}
                  onChange={e => setLeaderForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Object Position (optional)</label>
                <input
                  type="text"
                  value={leaderForm.objectPosition}
                  onChange={e => setLeaderForm(prev => ({ ...prev, objectPosition: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., center 20%"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  {editingLeaderId ? 'Update' : 'Add'} Leader
                </Button>
                <Button type="button" onClick={() => setShowLeaderModal(false)} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default About;
