import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Microscope, Brain, Globe, Users, Award, Target, Heart, Stethoscope, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentPartner, setCurrentPartner] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const partners = [
    { name: "AIIMS Delhi", logo: "🏥", gradient: "from-blue-500 to-indigo-500" },
    { name: "JIPMER", logo: "🏥", gradient: "from-indigo-500 to-purple-500" },
    { name: "PGIMER", logo: "🏥", gradient: "from-purple-500 to-pink-500" },
    { name: "Lady Hardinge", logo: "🏥", gradient: "from-pink-500 to-rose-500" },
    { name: "Grant Medical", logo: "🏥", gradient: "from-rose-500 to-red-500" },
    { name: "KGMU", logo: "🏥", gradient: "from-red-500 to-orange-500" },
    { name: "MAMC", logo: "🏥", gradient: "from-orange-500 to-yellow-500" },
    { name: "UCMS", logo: "🏥", gradient: "from-yellow-500 to-green-500" }
  ];

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
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Our Partner Institutions
            </h2>
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
                    <Card className="text-center p-8 hover:shadow-2xl transition-all duration-700 hover:scale-110 hover:-translate-y-4 group cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${partner.gradient} rounded-full flex items-center justify-center text-4xl group-hover:scale-125 transition-transform duration-500 shadow-lg group-hover:shadow-xl`}>
                        {partner.logo}
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
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Leadership Team
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-400">
              Meet the dedicated individuals leading SMAK's mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {[ 
              {
                name: "Samudra Chaudhari",
                role: "Founder",
                college: "SMAK",
                image: "https://i.postimg.cc/65tpg88S/Whats-App-Image-2025-08-13-at-13-39-13-32477921.jpg",
                objectPosition: "center 20%"
              },
              {
                name: "Khushal Pal",
                role: "Co-Founder",
                college: "SMAK",
                image: "https://i.postimg.cc/DwYfS5xk/Whats-App-Image-2025-08-13-at-13-39-13-89a66ab2.jpg"
              },
              {
                name: "Disha Agrawala",
                role: "Executive Director",
                college: "SMAK",
                image: "https://i.postimg.cc/VN8d4JBK/Whats-App-Image-2025-08-13-at-13-01-49-0a36118b.jpg"
              },
              {
                name: "Piyush Mishra",
                role: "Director of Operations",
                college: "SMAK",
                image: " "
              }
            ].map((member, index) => (
              <Card key={index} className="group text-center hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-6 cursor-pointer border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden">
                <CardContent className="pt-10 pb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative mb-8">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-40 h-40 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-500 shadow-xl border-4 border-blue-100 dark:border-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-300"
                      style={member.name === "Samudra Chaudhari" ? { objectPosition: member.objectPosition || "center 20%", objectFit: 'cover', background: '#e8efff', padding: '4px' } : { background: '#e8efff' }}
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

      <Footer />
    </div>
  );
};

export default About;
