
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Microscope, Brain, Globe, Users, Award, Target } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: BookOpen,
      title: "Academic Excellence",
      description: "Promoting the highest standards in medical education and research"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Building a community where knowledge is shared and everyone grows together"
    },
    {
      icon: Brain,
      title: "Innovation",
      description: "Encouraging creative solutions to healthcare challenges"
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Preparing medical professionals to serve communities worldwide"
    }
  ];

  const achievements = [
    { number: "10,000+", label: "Active Members" },
    { number: "500+", label: "Research Papers Published" },
    { number: "200+", label: "Partner Institutions" },
    { number: "50+", label: "Cities Reached" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                About SMAK
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              The Society of Medical Academia and Knowledge - Empowering the next generation of medical professionals through collaboration, research, and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-blue-100 dark:border-blue-900/20">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To create a unified platform that bridges the gap between theoretical medical education and practical clinical experience, fostering a community of aspiring healthcare professionals who are committed to excellence, innovation, and compassionate care.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 dark:border-blue-900/20">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To be the leading national platform that transforms medical education by connecting students, researchers, and clinicians across India, ultimately contributing to a new era of evidence-based, compassionate healthcare delivery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Our Story
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-muted-foreground mb-4">
                  SMAK was founded in 2020 by a group of passionate medical students who recognized the need for a unified platform that could bridge the gap between theoretical knowledge and practical application in medical education.
                </p>
                <p className="text-muted-foreground mb-4">
                  What started as a small initiative to share study notes and clinical cases has evolved into a nationwide network of medical students, researchers, and healthcare professionals committed to advancing medical education and research.
                </p>
                <p className="text-muted-foreground">
                  Today, SMAK continues to grow, fostering collaboration between institutions, promoting research excellence, and preparing the next generation of healthcare leaders to meet the challenges of modern medicine.
                </p>
              </div>
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=400&fit=crop&crop=center" 
                  alt="Medical students collaborating" 
                  className="rounded-2xl shadow-lg mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at SMAK
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl opacity-90">
              See how SMAK is making a difference in medical education
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{achievement.number}</div>
                <div className="text-lg opacity-90">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Leadership Team
            </h2>
            <p className="text-lg text-muted-foreground">
              Meet the dedicated individuals leading SMAK's mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Arjun Patel",
                role: "Founder & President",
                college: "AIIMS Delhi",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
              },
              {
                name: "Dr. Priya Sharma",
                role: "Vice President - Research",
                college: "JIPMER Puducherry",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
              },
              {
                name: "Dr. Rohit Kumar",
                role: "Head of Operations",
                college: "PGIMER Chandigarh",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
              }
            ].map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-1">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.college}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
