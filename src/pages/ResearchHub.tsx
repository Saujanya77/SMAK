import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Network, Calendar, Microscope, FileText, User } from 'lucide-react';

const Index = () => {
  const TeamMemberCard = ({ name, position, institution, batch, imageUrl }: { 
    name: string; 
    position: string; 
    institution: string; 
    batch: string;
    imageUrl: string; // Image path is now required
  }) => (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105">
      <CardContent className="p-6 text-center">
        <div className="mb-4 mx-auto w-24 h-24">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={name}
                className="w-full h-full object-cover rounded-full"
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

          {/* National Leadership */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <TeamMemberCard
                name="SAMUDRA CHAUDHARI "
                position="FOUNDER"
                institution="SMAK"
                batch=""
                imageUrl="https://i.postimg.cc/65tpg88S/Whats-App-Image-2025-08-13-at-13-39-13-32477921.jpg" // Add your image path here
              />
              <TeamMemberCard
                name="KHUSHAL PAL"
                position="CO-FOUNDER"
                institution="SMAK"
                batch=""
                imageUrl="https://i.postimg.cc/DwYfS5xk/Whats-App-Image-2025-08-13-at-13-39-13-89a66ab2.jpg" // Add your image path here
              />
            </div>
          </div>

          {/* Committee Teams */}
          <div>
            
            <div className="space-y-12">
              {/* Mentorship Program Committee */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <TeamMemberCard
                  
                    name="Brishabh Raj Prajesh"
                    position="Co Head"
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
                </div>
              </div>

              {/* Outreach & Collaboration Committee */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <TeamMemberCard
                    name="Disha Agrawala "
                    position="Executive Board Member"
                    institution="SMAK"
                    batch=" "
                    imageUrl="https://i.postimg.cc/VN8d4JBK/Whats-App-Image-2025-08-13-at-13-01-49-0a36118b.jpg"
                  />
                  <TeamMemberCard
                    name="Taniya Masud Temkar"
                    position="Head Of Event & Content Committee"
                    institution="DY Patil Medical College, Kolhapur"
                    batch=" "
                    imageUrl="https://i.postimg.cc/HsMYKpLR/Whats-App-Image-2025-08-13-at-13-01-49-6427a359.jpg"
                  />
                </div>
              </div>

              {/* Journal Development Committee */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <TeamMemberCard
                    name="Uzair Pathan"
                    position="Head"
                    institution="Coordinator - Event and Content Committee"
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
                </div>
              </div>

              {/* Events & Content Committee */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
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
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
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
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <TeamMemberCard
                    name="Madhav Tripathi"
                    position="Coordinator - Outreach & Collaboration Committee"
                    institution="Virendra Kumar Sakhlecha Government Medical College, Neemuch ( MP)"
                    batch=" "
                    imageUrl="https://i.postimg.cc/50cTXFvS/Whats-App-Image-2025-08-13-at-13-01-49-7c1ed6e6.jpg"
                  />
                  <TeamMemberCard
                    name="Uzair Pathan"
                    position="Coordinator"
                    institution="Government Medical College, Alibag"
                    batch="MBBS 2023 batch"
                    imageUrl="/Images/placeholder.jpg"
                  />
                </div>
              </div>
            </div>
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
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Become a Mentor
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
