
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    year: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        college: formData.college,
        year: formData.year
      });

      if (success) {
        toast({
          title: "Welcome to SMAK!",
          description: "Your account has been created successfully.",
        });
        navigate('/login');
      } else {
        toast({
          title: "Registration failed",
          description: "Please check your information and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950/20 dark:via-background dark:to-blue-900/10">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start min-h-[calc(100vh-100px)]">
          {/* Left Side - Registration Form */}
          <div className="max-w-md mx-auto lg:mx-0 w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-3xl">S</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-3">
                Join SMAK
              </h1>
              <p className="text-muted-foreground text-lg">
                Start your journey with India's premier medical student community
              </p>
            </div>

            <Card className="border-2 border-blue-100 dark:border-blue-900/20 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription className="text-base">
                  Join thousands of medical students across India
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Dr. Your Full Name"
                      className="h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@medicalcollege.edu"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="college" className="text-sm font-medium">Medical College</Label>
                    <Input
                      id="college"
                      type="text"
                      value={formData.college}
                      onChange={(e) => handleInputChange('college', e.target.value)}
                      placeholder="e.g., AIIMS Delhi, CMC Vellore"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-medium">Year of Study</Label>
                    <Select onValueChange={(value) => handleInputChange('year', value)} required>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your current year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st-year">1st Year MBBS</SelectItem>
                        <SelectItem value="2nd-year">2nd Year MBBS</SelectItem>
                        <SelectItem value="3rd-year">3rd Year MBBS</SelectItem>
                        <SelectItem value="4th-year">4th Year MBBS</SelectItem>
                        <SelectItem value="final-year">Final Year MBBS</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                        <SelectItem value="resident">Resident</SelectItem>
                        <SelectItem value="pg">Post Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Strong password"
                        className="h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm password"
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating your account..." : "Create SMAK Account"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Already a member?</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-muted-foreground">
                    Have an account?{" "}
                    <Link 
                      to="/login" 
                      className="text-blue-600 hover:text-blue-500 hover:underline font-semibold"
                    >
                      Sign in to SMAK
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Professional Benefits */}
          <div className="hidden lg:block">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=800&fit=crop&crop=center" 
                alt="Medical students studying together"
                className="rounded-2xl shadow-2xl w-full h-[700px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h2 className="text-3xl font-bold mb-6">Why Join SMAK?</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <GraduationCap className="h-8 w-8 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Expert Knowledge</h3>
                      <p className="text-white/90">Access curated medical content from top professionals</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <BookOpen className="h-8 w-8 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Research & Journals</h3>
                      <p className="text-white/90">Publish and read peer-reviewed medical research</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Users className="h-8 w-8 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">National Network</h3>
                      <p className="text-white/90">Connect with medical students across India</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Award className="h-8 w-8 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Skill Development</h3>
                      <p className="text-white/90">Enhance clinical and research skills</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
