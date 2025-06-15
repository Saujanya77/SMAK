
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const Events = () => {
  const upcomingEvents = [
    {
      title: "Clinical Case Presentation Series",
      date: "December 15, 2024",
      time: "6:00 PM - 8:00 PM IST",
      location: "Virtual Event",
      type: "Webinar",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=center",
      description: "Join us for an interactive session featuring complex clinical cases presented by senior residents and reviewed by expert clinicians."
    },
    {
      title: "Research Methodology Workshop",
      date: "December 20, 2024",
      time: "10:00 AM - 4:00 PM IST",
      location: "AIIMS Delhi",
      type: "Workshop",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop&crop=center",
      description: "Learn advanced research techniques, statistical analysis, and how to write compelling research papers."
    },
    {
      title: "Annual Medical Quiz Championship",
      date: "January 5, 2025",
      time: "2:00 PM - 5:00 PM IST",
      location: "Multiple Cities",
      type: "Competition",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop&crop=center",
      description: "Test your medical knowledge against peers from across the country in this comprehensive quiz competition."
    },
    {
      title: "Surgical Skills Simulation Training",
      date: "January 12, 2025",
      time: "9:00 AM - 5:00 PM IST",
      location: "PGIMER Chandigarh",
      type: "Training",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&crop=center",
      description: "Hands-on surgical skills training using state-of-the-art simulation equipment and expert guidance."
    }
  ];

  const pastEvents = [
    {
      title: "World Asthma Day",
      date: "November 15, 2024",
      attendees: "2,500+",
      image: "public/Images/IMG-20250613-WA0032.jpg"
    },
    {
      title: "World Asthma Day",
      date: "October 28, 2024",
      attendees: "1,800+",
      image: "public/Images/IMG-20250613-WA0033.jpg"
    },
    {
      title: "World Asthma Day",
      date: "October 10-16, 2024",
      attendees: "3,200+",
      image: "public/Images/IMG-20250613-WA0034.jpg"
    }
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
                📅 SMAK Events
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community of medical students and professionals in learning, networking, and growing together through our diverse range of events.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground">
              Don't miss out on these exciting learning opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium dark:bg-blue-900/20 dark:text-blue-400">
                      {event.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      {event.location}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Past Events
            </h2>
            <p className="text-lg text-muted-foreground">
              Celebrating our successful events and their impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-blue-600 font-medium">
                    <Users className="h-4 w-4 mr-2" />
                    {event.attendees} Attendees
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Event Categories
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Webinars", description: "Expert-led online sessions", icon: "🎥" },
              { title: "Workshops", description: "Hands-on learning experiences", icon: "🔬" },
              { title: "Competitions", description: "Test your knowledge and skills", icon: "🏆" },
              { title: "Conferences", description: "Large-scale academic gatherings", icon: "🏛️" }
            ].map((category, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
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

export default Events;
