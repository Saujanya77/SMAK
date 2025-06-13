import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "The NEET preparation resources here are exceptional. The practice tests and detailed explanations helped me understand complex concepts easily.",
    author: "Priya Sharma",
    position: "NEET Qualifier 2024",
    avatar: "/placeholder.svg",
    rating: 5,
    score: "680/720"
  },
  {
    quote: "Thanks to the structured study plan and expert guidance, I was able to crack NEET with flying colors. Highly recommend to all aspiring doctors!",
    author: "Rahul Kumar",
    position: "AIIMS Delhi",
    avatar: "/placeholder.svg",
    rating: 5,
    score: "695/720"
  },
  {
    quote: "The mock tests were incredibly similar to the actual NEET exam. The detailed analytics helped me identify my weak areas and improve consistently.",
    author: "Ananya Patel",
    position: "JIPMER Puducherry",
    avatar: "/placeholder.svg",
    rating: 5,
    score: "672/720"
  },
  {
    quote: "Amazing platform with excellent study material. The doubt clearing sessions were particularly helpful during my preparation journey.",
    author: "Vikash Singh",
    position: "KGMU Lucknow",
    avatar: "/placeholder.svg",
    rating: 5,
    score: "665/720"
  },
  {
    quote: "The comprehensive course content and regular assessments kept me motivated throughout my NEET preparation. Couldn't have done it without this platform!",
    author: "Sneha Reddy",
    position: "AFMC Pune",
    avatar: "/placeholder.svg",
    rating: 5,
    score: "687/720"
  }
];

const TestimonialsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const getVisibleTestimonials = () => {
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
        </div>

        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main Slider */}
          <div className="relative h-96 mb-8">
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
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                        ))}
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
                          src={testimonial.avatar}
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
          </div>

          {/* Navigation Buttons */}
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

          {/* Progress Bar */}
          <div className="max-w-md mx-auto bg-blue-100 dark:bg-blue-900 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / testimonials.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;