import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Star, Plus, Trash2 } from 'lucide-react';
import { db } from '@/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAILS = ['admin@example.com', 'anotheradmin@example.com', 'smak.founder@gmail.com', 'smak.researchclub@gmail.com', 'smak.quizclub@gmail.com', 'Sjmsr.journal@gmail.com', 'Team.smak2025@gmail.com', 'Khushal.smak@gmail.com', 'Samudra.smak@gmail.com'];

const TestimonialsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAllDialog, setShowAllDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');
  
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    position: '',
    rating: 5,
    score: ''
  });

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Default testimonials
  const defaultTestimonials = [
    {
      id: 'default-1',
      quote: "The NEET preparation resources here are exceptional. The practice tests and detailed explanations helped me understand complex concepts easily.",
      author: "Priya Sharma",
      position: "NEET Qualifier 2024",
      avatar: "/placeholder.svg",
      rating: 5,
      score: "680/720"
    },
    {
      id: 'default-2',
      quote: "Thanks to the structured study plan and expert guidance, I was able to crack NEET with flying colors. Highly recommend to all aspiring doctors!",
      author: "Rahul Kumar",
      position: "AIIMS Delhi",
      avatar: "/placeholder.svg",
      rating: 5,
      score: "695/720"
    },
    {
      id: 'default-3',
      quote: "The mock tests were incredibly similar to the actual NEET exam. The detailed analytics helped me identify my weak areas and improve consistently.",
      author: "Ananya Patel",
      position: "JIPMER Puducherry",
      avatar: "/placeholder.svg",
      rating: 5,
      score: "672/720"
    }
  ];

  // Fetch testimonials from Firestore
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoadingTestimonials(true);
        const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        // If no testimonials in Firestore, use defaults
        setTestimonials(data.length > 0 ? data : defaultTestimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Use default testimonials as fallback
        setTestimonials(defaultTestimonials);
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Submit new testimonial
  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please login to submit a testimonial',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.quote || !formData.author || !formData.position || !formData.score) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, 'testimonials'), {
        quote: formData.quote,
        author: formData.author,
        position: formData.position,
        rating: formData.rating,
        score: formData.score,
        userId: user.id,
        userEmail: user.email,
        createdAt: new Date(),
        avatar: '/placeholder.svg'
      });

      setFormData({
        quote: '',
        author: '',
        position: '',
        rating: 5,
        score: ''
      });
      setShowAddDialog(false);
      
      toast({
        title: 'Success',
        description: 'Testimonial submitted successfully!'
      });

      // Refresh testimonials
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTestimonials(data);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit testimonial',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete testimonial (admin only)
  const handleDeleteTestimonial = async (id: string) => {
    if (!isAdmin) {
      toast({
        title: 'Error',
        description: 'Only admins can delete testimonials',
        variant: 'destructive'
      });
      return;
    }

    try {
      await deleteDoc(doc(db, 'testimonials', id));
      setTestimonials(testimonials.filter((t) => t.id !== id));
      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % testimonials.length;
      visible.push({ ...testimonials[index], index });
    }
    return visible;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-blue-50/30 dark:to-blue-950/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
            <Star className="inline h-10 w-10 text-blue-500 mr-3 animate-pulse" />
            Success Stories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who achieved their NEET dreams with our guidance
          </p>
          <div className="mt-6 flex gap-4 justify-center flex-wrap">
            {user ? (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Share Your Success Story</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Your Name</label>
                      <Input
                        placeholder="Enter your full name"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Position/Institution</label>
                      <Input
                        placeholder="e.g., AIIMS Delhi, NEET Qualifier 2024"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Your Testimonial</label>
                      <Textarea
                        placeholder="Share your experience and success story..."
                        value={formData.quote}
                        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                        className="min-h-28"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Score</label>
                        <Input
                          placeholder="e.g., 680/720"
                          value={formData.score}
                          onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Rating</label>
                        <div className="flex gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFormData({ ...formData, rating: star })}
                              className="p-1"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  star <= formData.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <Button variant="outline" disabled>
                <Plus className="mr-2 h-4 w-4" />
                Login to Add Testimonial
              </Button>
            )}
            
            <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  Read More
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>All Testimonials</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="relative">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-1">
                            {[...Array(testimonial.rating || 5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete testimonial"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 italic">
                          "{testimonial.quote}"
                        </p>
                        <div className="border-t pt-3">
                          <p className="font-semibold text-sm">{testimonial.author}</p>
                          <p className="text-xs text-blue-600 mb-2">{testimonial.position}</p>
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Score: {testimonial.score}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main Slider */}
          <div className="relative h-96 mb-8">
            {loadingTestimonials ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading testimonials...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No testimonials yet. Be the first to share your story!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {getVisibleTestimonials().map((testimonial, idx) => (
                  <Card 
                    key={testimonial.index}
                    className={`group relative overflow-hidden transition-all duration-700 transform hover:scale-105 ${
                      idx === 1 
                        ? 'md:scale-110 md:z-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl' 
                        : 'bg-gradient-to-br from-white to-blue-50/50 dark:from-card dark:to-blue-950/20 hover:shadow-xl'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5"></div>
                    <CardContent className="relative h-full p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex justify-center gap-1">
                            {[...Array(testimonial.rating || 5)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                            ))}
                          </div>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
                              className={`p-1 rounded hover:bg-red-500/20 transition ${
                                idx === 1 ? 'text-red-200 hover:text-red-100' : 'text-red-500'
                              }`}
                              title="Delete testimonial"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <blockquote className={`text-center mb-6 italic text-lg leading-relaxed ${
                          idx === 1 ? 'text-blue-50' : 'text-muted-foreground'
                        }`}>
                          "{testimonial.quote}"
                        </blockquote>
                      </div>
                      
                      <div className="text-center">
                        <div className="mb-4">
                          <img 
                            src={testimonial.avatar || '/placeholder.svg'}
                            alt={testimonial.author}
                            className="w-16 h-16 rounded-full mx-auto border-4 border-blue-200 dark:border-blue-800 shadow-lg"
                          />
                        </div>
                        <div className={`border-t pt-4 ${idx === 1 ? 'border-blue-300' : 'border-border'}`}>
                          <p className={`font-bold text-lg mb-1 ${idx === 1 ? 'text-white' : 'text-foreground'}`}>
                            {testimonial.author}
                          </p>
                          <p className={`font-medium mb-2 ${idx === 1 ? 'text-blue-100' : 'text-blue-600'}`}>
                            {testimonial.position}
                          </p>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            idx === 1 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            Score: {testimonial.score}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {testimonials.length > 0 && (
          <div className="flex justify-center items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-blue-50 border-blue-200 hover:border-blue-300 shadow-lg"
            >
              <ChevronLeft className="h-5 w-5 text-blue-600" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-blue-600 w-8'
                      : 'bg-blue-200 hover:bg-blue-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-blue-50 border-blue-200 hover:border-blue-300 shadow-lg"
            >
              <ChevronRight className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
          )}

          {/* Progress Bar */}
          {testimonials.length > 0 && (
          <div className="max-w-md mx-auto bg-blue-100 dark:bg-blue-900 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / testimonials.length) * 100}%` }}
            />
          </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;