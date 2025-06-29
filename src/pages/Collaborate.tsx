import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Users, Award, BookOpen, Heart } from 'lucide-react';

const Collaborate = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    position: '',
    phone: '',
    collaborationType: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.college) {
      toast({
        title: "Please fill in required fields",
        description: "Name, email, and institution are required.",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Collaboration request submitted!",
      description: "We'll get back to you within 24 hours.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      college: '',
      position: '',
      phone: '',
      collaborationType: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Heart className="w-4 h-4" />
              Join Our Mission
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent">
                🤝 Collaborate With Us
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in">
              Want to bring SMAK to your college? Join our growing network of medical institutions committed to academic excellence and student empowerment.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800/50 px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">100% Free</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800/50 px-4 py-2 rounded-full shadow-sm">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Pan-India Network</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800/50 px-4 py-2 rounded-full shadow-sm">
                <Award className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Academic Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Collaborate Section */}
      <section className="py-20 bg-gradient-to-br from-white to-blue-50 dark:from-background dark:to-blue-950/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                Benefits of Partnership
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Why Should You Collaborate With Us?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Here's how your esteemed institution will gain — academically, reputationally, and nationally
              </p>
            </div>

            {/* Benefit Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="order-2 lg:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                  alt="Medical collaboration and teamwork" 
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                      🌟 <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Nationwide Recognition</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Break the boundaries of your campus! Through our platform, your students' research, innovations, and academic events will be highlighted and recognized across India — not just internally. This boosts your college's academic image and national presence.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                      🔗 <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Exclusive Network</span>
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      Gain access to a prestigious network of medical colleges already collaborating with us. This opens doors to:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Inter-college research partnerships",
                        "Cross-campus competitions",
                        "Pan-India webinars",
                        "Shared academic ecosystem"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                  alt="Medical students collaborating" 
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="order-2 lg:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                  alt="Medical student research and learning" 
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                      🧠 <span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">Student Empowerment</span>
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">We offer comprehensive development opportunities:</p>
                    <div className="space-y-3">
                      {[
                        "Free publication in student medical journal",
                        "National leadership opportunities",
                        "Skill-building in writing & peer review",
                        "Networking with academic panels"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                          <Award className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <Card className="border-l-4 border-l-orange-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background">
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                      🏅 <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">Enhanced Reputation</span>
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      Your participation ensures your college's name is:
                    </p>
                    <div className="space-y-3">
                      {[
                        "Featured in inter-college activities",
                        "Included in journal contributor listings",
                        "Acknowledged in academic forums"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-4 text-sm italic">
                      Creating a long-term reputation footprint in Indian medical education.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                  alt="Medical research and innovation" 
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Final CTA Card */}
            <div className="text-center">
              <Card className="border-2 border-blue-200 dark:border-blue-800 max-w-4xl mx-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-3xl font-bold mb-6 flex items-center justify-center gap-3">
                    💯 <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent">100% Non-Profit, 100% Free</span>
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                    There are no fees, no commercial motives, no barriers. It's an initiative built with passion — by medical students, for medical students, and supported by visionary institutions like yours. Your goodwill and collaboration will forever be remembered as a foundational pillar of this national student movement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Form Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Start Your Collaboration Journey
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Fill out this form and we'll get back to you within 24 hours
              </p>
            </div>

            <Card className="border-2 border-blue-100 dark:border-blue-900/20 hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Collaboration Request Form
                </CardTitle>
                <CardDescription className="text-base">
                  Let's build the future of medical education together
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">Your Name *</Label>
                      <Input 
                        id="name" 
                        placeholder="Dr. John Doe" 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john.doe@medicalcollege.edu" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="college" className="text-sm font-semibold">Institution Name *</Label>
                    <Input 
                      id="college" 
                      placeholder="ABC Medical College & Hospital" 
                      value={formData.college}
                      onChange={(e) => handleInputChange('college', e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm font-semibold">Your Position</Label>
                      <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-blue-300">
                          <SelectValue placeholder="Select your position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="faculty">Faculty Member</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="dean">Dean/Director</SelectItem>
                          <SelectItem value="hod">Head of Department</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                      <Input 
                        id="phone" 
                        placeholder="+91 98765 43210" 
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="collaboration-type" className="text-sm font-semibold">Type of Collaboration</Label>
                    <Select value={formData.collaborationType} onValueChange={(value) => handleInputChange('collaborationType', value)}>
                      <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-blue-300">
                        <SelectValue placeholder="What type of collaboration interests you?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chapter">Establish SMAK Chapter</SelectItem>
                        <SelectItem value="events">Joint Events & Workshops</SelectItem>
                        <SelectItem value="research">Research Partnership</SelectItem>
                        <SelectItem value="exchange">Student Exchange Program</SelectItem>
                        <SelectItem value="publication">Journal Publication</SelectItem>
                        <SelectItem value="mentorship">Mentorship Program</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us more about your collaboration goals, your institution's vision, and how SMAK can help achieve your academic objectives..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-blue-300 resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 text-white font-semibold py-4 text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    Submit Collaboration Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Collaborate;
