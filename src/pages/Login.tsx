
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { Stethoscope, ShieldCheck, Users } from 'lucide-react';
import LoginPic from '../Images/login.jpg'
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login successful!",
          description: "Welcome back to SMAK.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-100px)]">
          {/* Left Side - Professional Image & Content */}
          <div className="hidden lg:block">
            <div className="relative">
              <img 
                src={LoginPic}
                alt="Medical professionals in discussion"
                className="rounded-2xl shadow-2xl w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h2 className="text-3xl font-bold mb-4">Join the Future of Medical Education</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Stethoscope className="h-6 w-6" />
                    <span className="text-lg">Access Expert Knowledge</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6" />
                    <span className="text-lg">Connect with Peers Nationwide</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="h-6 w-6" />
                    <span className="text-lg">Evidence-Based Learning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="max-w-md mx-auto lg:mx-0 w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-3xl">S</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-3">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-lg">
                Sign in to your SMAK account and continue your medical journey
              </p>
            </div>

            <Card className="border-2 border-blue-100 dark:border-blue-900/20 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription className="text-base">
                  Enter your credentials to access your medical knowledge hub
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@medicalcollege.edu"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your secure password"
                      className="h-12 text-base"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-blue-600 hover:text-blue-500 hover:underline font-medium"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In to SMAK"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">New to SMAK?</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-muted-foreground">
                    Don't have an account?{" "}
                    <Link 
                      to="/register" 
                      className="text-blue-600 hover:text-blue-500 hover:underline font-semibold"
                    >
                      Create your SMAK account
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
