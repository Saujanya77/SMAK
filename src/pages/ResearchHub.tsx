import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Network, Calendar, Microscope, FileText, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  // State for Research Club Members and Mentors
  const [researchClubMembers, setResearchClubMembers] = useState([]);
  const [mentors, setMentors] = useState([]);
  // State for events from Firebase
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch Research Club Members
    const fetchRCMembers = async () => {
      const querySnapshot = await getDocs(collection(db, "researchClubMembers"));
      setResearchClubMembers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchRCMembers();
    // Fetch Mentors
    const fetchMentors = async () => {
      const querySnapshot = await getDocs(collection(db, "researchClubMentors"));
      setMentors(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchMentors();
    // Fetch Events
    const fetchEvents = async () => {
      try {
        const eventsCol = collection(db, "events");
        const q = query(eventsCol, orderBy("date", "desc"), limit(3));
        const snapshot = await getDocs(q);
        const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsData);
      } catch (err) {
        console.error("Error loading events:", err);
      }
    };
    fetchEvents();
  }, []);

  // State for popup/modal
  const [selectedActivity, setSelectedActivity] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  const handleCardClick = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };
  const handleRegister = () => {
    window.open("/register", "_blank");
  };

  const handleViewAllEvents = () => {
    navigate('/events');
  };
  const TeamMemberCard = ({ name, position, institution, batch, imageUrl }: {
    name: string;
    position: string;
    institution: string;
    batch: string;
    imageUrl: string;
  }) => (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 flex flex-col items-center justify-center">
      <CardContent className="p-6 text-center flex flex-col items-center justify-center">
        <div className="mb-4 mx-auto w-28 h-28">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-24 h-24 object-cover rounded-full border-4 border-white dark:border-background ring-2 ring-blue-400 dark:ring-blue-500 shadow-lg mx-auto"
                style={{ aspectRatio: "1/1", objectPosition: (name === "Ansharah Khan" || name === "Pratik Gupta") ? "top center" : "center", background: "#e8efff" }}
              />
            ) : (
              <User className="h-12 w-12 text-blue-600" />
            )}
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-sm font-medium text-blue-600 mb-2">{position}</p>
        <p className="text-sm text-muted-foreground mb-1">{institution}</p>
        <p className="text-xs text-muted-foreground">{batch}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section id="about" className="py-16 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="rounded-full border-4 border-blue-500 shadow-lg p-2 bg-white relative" style={{ boxShadow: '0 0 32px 8px #3b82f6, 0 0 8px 2px #60a5fa' }}>
                <img
                  src="https://i.postimg.cc/SQMyj57f/Whats-App-Image-2025-08-22-at-03-58-53-bf435fbe.jpg"
                  alt="SMAK Research Club Logo"
                  className="w-24 h-24 rounded-full object-cover"
                  style={{ boxShadow: '0 0 32px 8px #3b82f6' }}
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                🔬 SMAK Research Club
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The SMAK Research Club is a nationwide, student-driven initiative aimed at fostering a vibrant research culture among undergraduate medical and dental students. With the support of mentors, peer networks, and a structured committee system.
            </p>
          </div>
        </div>
      </section>

      {/* Banner/Events & Research Activities */}
      <section className="relative z-10 py-8 bg-gradient-to-r from-blue-600/80 to-blue-400/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-4 md:mb-0">
              Ongoing Events
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-blue-100 text-sm">Click 'See Details' to view more and join</span>
              <Button 
                onClick={handleViewAllEvents}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold flex items-center gap-2"
              >
                View All Events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white text-lg">No events available at the moment. Check back soon!</p>
              <Button 
                onClick={handleViewAllEvents}
                className="mt-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold"
              >
                Go to Events Page
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((activity) => (
                <div key={activity.id} className="bg-white dark:bg-blue-950/80 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 group relative">
                  <img src={activity.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} alt={activity.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-semibold">{activity.type || 'Event'}</span>
                      <span className="text-xs text-blue-400">{activity.date || 'TBA'}</span>
                    </div>
                    <h3 className="font-bold text-lg text-blue-700 group-hover:text-blue-900 mb-1">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{activity.description}</p>
                    <Button size="sm" className="w-full bg-blue-600 text-white font-semibold hover:bg-blue-700" onClick={e => { e.stopPropagation(); handleCardClick(activity); }}>
                      See Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal/Popup for activity details */}
        {showModal && selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-blue-950 rounded-2xl shadow-2xl max-w-lg w-full p-0 relative overflow-hidden">
              <button className="absolute top-3 right-3 text-blue-600 dark:text-blue-200 text-2xl font-bold" onClick={handleCloseModal}>&times;</button>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-blue-100 dark:bg-blue-900 flex items-center justify-center p-6">
                  <img src={selectedActivity.image} alt={selectedActivity.title} className="rounded-xl shadow-lg w-full h-56 object-cover object-center" />
                </div>
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-2xl text-blue-700 dark:text-blue-200 mb-2">{selectedActivity.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-semibold">{selectedActivity.type || 'Event'}</span>
                    <span className="text-xs text-blue-400">{selectedActivity.date || 'TBA'}</span>
                  </div>
                  <p className="text-base text-muted-foreground mb-2 font-semibold">{selectedActivity.description}</p>
                  {selectedActivity.details && (
                    <div className="mb-4">
                      <h4 className="text-blue-600 dark:text-blue-300 font-bold mb-1 text-lg">Details</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{selectedActivity.details}</p>
                    </div>
                  )}
                  {selectedActivity.time && (
                    <p className="text-sm text-muted-foreground mb-1"><strong>Time:</strong> {selectedActivity.time}</p>
                  )}
                  {selectedActivity.location && (
                    <p className="text-sm text-muted-foreground mb-1"><strong>Location:</strong> {selectedActivity.location}</p>
                  )}
                  </div>
                  <Button size="lg" className="w-full bg-blue-600 text-white font-semibold hover:bg-blue-700 mt-2" onClick={handleRegister}>
                    Register / Join
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>


      {/* Committees Section */}
      <section id="committees" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Committees</h2>
            <p className="text-lg text-muted-foreground">
              The SMAK Research Club is organized into national leadership, supported by four key committees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: "Mentorship Program Committee",
                description: "Connecting students with experienced mentors to guide their research journey"
              },
              {
                icon: Network,
                title: "Outreach & Collaboration Committee",
                description: "Building partnerships and expanding our research network nationwide"
              },
              {
                icon: FileText,
                title: "Journal Development Committee",
                description: "Developing and managing our research publications and journals"
              },
              {
                icon: Calendar,
                title: "Events & Content Committee",
                description: "Organizing events, workshops, and creating educational content"
              }
            ].map((committee, index) => (
              <Card key={index} className="text-center h-full transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center">
                    <committee.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{committee.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{committee.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground">
              Meet the dedicated leaders driving research excellence across the nation
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {researchClubMembers.map((m) => (
              <TeamMemberCard
                key={m.id}
                name={m.name}
                position={m.designation}
                institution={m.institution}
                batch={m.batch || ''}
                imageUrl={m.pictureUrl || ''}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section id="mentors" className="py-16 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mentors</h2>
            <p className="text-lg text-muted-foreground">
              Meet the experienced mentors guiding and supporting our research journey
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {mentors.map((m) => (
              <TeamMemberCard
                key={m.id}
                name={m.name}
                position={m.position}
                institution={m.institution}
                batch={m.batch || ''}
                imageUrl={m.pictureUrl || ''}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
