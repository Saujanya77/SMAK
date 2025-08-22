import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Network, Calendar, Microscope, FileText, User } from 'lucide-react';

const Index = () => {
  // State for blog popup
  const [showBlogPopup, setShowBlogPopup] = React.useState(false);
  const handleBlogPopupOpen = () => setShowBlogPopup(true);
  const handleBlogPopupClose = () => setShowBlogPopup(false);
  const handleStartBlog = () => {
  window.location.href = "/login";
  };
  // Demo data for events/research activities
  const activities = [
    {
      title: "National Research Symposium 2025",
      description: "A pan-India symposium for medical students to present research papers and network with experts.",
      details: "Join us for the largest student-led medical research symposium in India. Present your work, attend keynote lectures by renowned clinicians, and participate in interactive workshops. Network with peers and experts from top medical institutions.",
      date: "Sep 15, 2025",
      type: "Event",
      image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=800&q=80",
      link: "#symposium"
    },
    {
      title: "Student-Led COVID-19 Outcomes Study",
      description: "Collaborative research project analyzing post-COVID outcomes in young adults across India.",
      details: "This ongoing multicenter study investigates the long-term effects of COVID-19 in young adults. Collaborate with students and faculty, contribute to data collection, and co-author publications in leading journals.",
      date: "Ongoing",
      type: "Research Project",
      image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "#covidstudy"
    },
    {
      title: "Medical Innovation Hackathon",
      description: "48-hour hackathon for medical and engineering students to develop digital health solutions.",
      details: "Form teams, brainstorm, and build innovative digital health solutions in a high-energy hackathon. Compete for prizes, mentorship, and the chance to pilot your project in real clinical settings.",
      date: "Aug 30, 2025",
      type: "Event",
      image: "https://images.unsplash.com/photo-1733222765056-b0790217baa9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "#hackathon"
    }
  ];

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
              Ongoing Events & Research Activities
            </h2>
            <span className="text-blue-100 text-sm">Click 'See Details' to view more and join</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities.map((activity, idx) => (
              <div key={idx} className="bg-white dark:bg-blue-950/80 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 group relative">
                <img src={activity.image} alt={activity.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-semibold">{activity.type}</span>
                    <span className="text-xs text-blue-400">{activity.date}</span>
                  </div>
                  <h3 className="font-bold text-lg text-blue-700 group-hover:text-blue-900 mb-1">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{activity.description}</p>
                  <Button size="sm" className="w-full bg-blue-600 text-white font-semibold hover:bg-blue-700" onClick={e => {e.stopPropagation(); handleCardClick(activity);}}>
                    See Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-semibold">{selectedActivity.type}</span>
                      <span className="text-xs text-blue-400">{selectedActivity.date}</span>
                    </div>
                    <p className="text-base text-muted-foreground mb-2 font-semibold">{selectedActivity.description}</p>
                    <div className="mb-4">
                      <h4 className="text-blue-600 dark:text-blue-300 font-bold mb-1 text-lg">Details</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{selectedActivity.details}</p>
                    </div>
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
            <TeamMemberCard
              name="Brishabh Raj Prajesh"
              position="Head"
              institution="SMAK RESEARCH CLUB"
              batch=""
              imageUrl="https://i.postimg.cc/L5ByYYTG/Whats-App-Image-2025-08-13-at-13-01-49-9d0aaa5d.jpg"
            />
            <TeamMemberCard
              name="Musa M. Bharmal"
              position="Co Head"
              institution="SMAK RESEARCH CLUB"
              batch=" "
              imageUrl="https://i.postimg.cc/6pT0w1Dk/Whats-App-Image-2025-08-13-at-13-01-49-3b92b5a0.jpg"
            />
            <TeamMemberCard
              name="Taniya Masud Temkar"
              position="Head Of Event & Content Committee"
              institution="DY Patil Medical College, Kolhapur"
              batch=" "
              imageUrl="https://i.postimg.cc/HsMYKpLR/Whats-App-Image-2025-08-13-at-13-01-49-6427a359.jpg"
            />
            <TeamMemberCard
              name="Uzair Pathan"
              position="Coordinator"
              institution="Event and Content Committee"
              batch="GMC Alibag"
              imageUrl="https://i.postimg.cc/brcyYMC3/Whats-App-Image-2025-08-13-at-13-01-49-73477329.jpg"
            />
            <TeamMemberCard
              name="Aakanksha Nanda"
              position="Head of the Mentorship Program Committee"
              institution="Veer Surendra Sai Institute of Medical Science And Research, Burla, Odisha"
              batch=" "
              imageUrl="https://i.postimg.cc/0QG3mB5t/Whats-App-Image-2025-08-13-at-13-01-49-8c3c0677.jpg"
            />
            <TeamMemberCard
              name="Sanya Walia"
              position="Coordinator - Mentorship Program Committee"
              institution="Government Institute of Medical Sciences, Greater Noida "
              batch=" "
              imageUrl="https://i.postimg.cc/Gm0Fwhxy/Whats-App-Image-2025-08-13-at-13-01-49-c374962b.jpg"
            />
            <TeamMemberCard
              name="Ananya"
              position="Head Of Journal Development committee"
              institution="Maulana Azad Medical College Delhi,"
              batch=" "
              imageUrl="https://i.postimg.cc/vTkKfgxz/Whats-App-Image-2025-08-13-at-13-01-49-c8ba169c.jpg"
            />
            <TeamMemberCard
              name="Ansharah Khan"
              position="Coordinator - Journal  Developme Committee"
              institution="Grant medical college Mumbai"
              batch=" "
              imageUrl="https://i.postimg.cc/ydPgDc5M/Whats-App-Image-2025-08-13-at-13-01-49-62c3e89c.jpg"
            />
            <TeamMemberCard
              name="Pratik Gupta"
              position="Head - Campus outreach and coordination Committee"
              institution="IMS and SUM campus 2"
              batch=" "
              imageUrl="https://i.postimg.cc/B6rSQ6Zr/Whats-App-Image-2025-08-13-at-13-01-49-eeb0d546.jpg"
            />
            <TeamMemberCard
              name="Madhav Tripathi"
              position="Coordinator - Outreach & Collaboration Committee"
              institution="Virendra Kumar Sakhlecha Government Medical College, Neemuch ( MP)"
              batch=" "
              imageUrl="https://i.postimg.cc/50cTXFvS/Whats-App-Image-2025-08-13-at-13-01-49-7c1ed6e6.jpg"
            />
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
            {/* Example mentor cards, replace with real data as needed */}
            <TeamMemberCard
              name="Dr. Meera Gupta"
              position="Mentor - Research Methodology"
              institution="Lady Hardinge Medical College"
              batch="MD, PhD"
              imageUrl="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face"
            />
            <TeamMemberCard
              name="Prof. Rajesh Kumar"
              position="Mentor - Clinical Research"
              institution="JIPMER Puducherry"
              batch="MD, Professor"
              imageUrl="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face"
            />
            <TeamMemberCard
              name="Dr. Kavita Patel"
              position="Mentor - Medical Education"
              institution="Grant Medical College"
              batch="MBBS, Principal"
              imageUrl="https://images.unsplash.com/photo-1594824475871-2b2d28e2fb0e?w=200&h=200&fit=crop&crop=face"
            />
            <TeamMemberCard
              name="Dr. Arjun Patel"
              position="Mentor - Innovation & Technology"
              institution="AIIMS Delhi"
              batch="MD, Founder"
              imageUrl="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="py-16 bg-gradient-to-br from-blue-600 to-blue-400">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join the SMAK Research Club
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Be part of a nationwide community dedicated to advancing medical research and fostering academic excellence
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8"
              >
                <Microscope className="mr-2 h-5 w-5" />
                Membership Form
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-8"
              >
                <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                Become a Mentor
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      {/* Floating Write Blog Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={handleBlogPopupOpen}
          size="lg"
          className="bg-blue-600 text-white shadow-lg hover:bg-blue-700 rounded-full px-6 py-3 font-semibold flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182l-9.193 9.193a2.25 2.25 0 0 1-.878.547l-3.25 1.083a.375.375 0 0 1-.474-.474l1.083-3.25a2.25 2.25 0 0 1 .547-.878l9.193-9.193z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 6.75l-1.5-1.5" />
          </svg>
          Write Blog
        </Button>
      </div>

      {/* Blog Popup Modal */}
      {showBlogPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-blue-950 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button className="absolute top-3 right-3 text-blue-600 dark:text-blue-200 text-2xl font-bold" onClick={handleBlogPopupClose}>&times;</button>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182l-9.193 9.193a2.25 2.25 0 0 1-.878.547l-3.25 1.083a.375.375 0 0 1-.474-.474l1.083-3.25a2.25 2.25 0 0 1 .547-.878l9.193-9.193z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 6.75l-1.5-1.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mb-2">Share Your Blog</h2>
              <p className="text-base text-muted-foreground mb-4">How will your blog add value to SMAK and other sections? How will your blog help medical studies and inspire others?</p>
              <ul className="text-left text-sm text-gray-700 dark:text-gray-200 mb-6 list-disc list-inside">
                <li>Contribute unique insights, case studies, or experiences.</li>
                <li>Help peers learn new concepts, exam strategies, or clinical skills.</li>
                <li>Promote research, innovation, and collaboration in the medical field.</li>
                <li>Inspire students and professionals to share knowledge and grow together.</li>
              </ul>
              <Button size="lg" className="w-full bg-blue-600 text-white font-semibold hover:bg-blue-700 mt-2" onClick={handleStartBlog}>
                Start Blog Writing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
