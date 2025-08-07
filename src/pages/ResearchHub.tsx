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
    imageUrl?: string; // Add space for image link here
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
            <h3 className="text-2xl font-bold text-center mb-8 text-blue-600">National Leadership</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <TeamMemberCard
                name="Mohammed Musa M. Bharmal"
                position="National Co-Head"
                institution=""
                batch=""
              />
              <TeamMemberCard
                name="Brishabh Raj Prajesh"
                position="National Co-Head"
                institution=""
                batch=""
              />
            </div>
          </div>

          {/* Committee Teams */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-8 text-blue-600">Committee Teams</h3>
            
            <div className="space-y-12">
              {/* Mentorship Program Committee */}
              <div>
                <h4 className="text-xl font-semibold mb-6 text-center">Mentorship Program Committee</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <TeamMemberCard
                    name="Aakanksha Nanda"
                    position="Head"
                    institution="VSSIMSAR, Burla"
                    batch="MBBS 2021 batch"
                  />
                  <TeamMemberCard
                    name="Sanya Walia"
                    position="Coordinator"
                    institution="GIMS, Greater Noida"
                    batch="MBBS 2022 batch"
                  />
                </div>
              </div>

              {/* Outreach & Collaboration Committee */}
              <div>
                <h4 className="text-xl font-semibold mb-6 text-center">Outreach & Collaboration Committee</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <TeamMemberCard
                    name="Pratik Gupta"
                    position="Head"
                    institution="IMS & SUM Hospital, Campus 2"
                    batch="MBBS 2024 batch"
                  />
                  <TeamMemberCard
                    name="Madhav Tripathi"
                    position="Coordinator"
                    institution="VKS Government Medical College"
                    batch="MBBS 2024 batch"
                  />
                </div>
              </div>

              {/* Journal Development Committee */}
              <div>
                <h4 className="text-xl font-semibold mb-6 text-center">Journal Development Committee</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <TeamMemberCard
                    name="Ananya"
                    position="Head"
                    institution="Maulana Azad Medical College"
                    batch="MBBS 2022 batch"
                  />
                  <TeamMemberCard
                    name="Ansharah Khan"
                    position="Coordinator"
                    institution="Grant Medical College"
                    batch="MBBS 2023 batch"
                  />
                </div>
              </div>

              {/* Events & Content Committee */}
              <div>
                <h4 className="text-xl font-semibold mb-6 text-center">Events & Content Committee</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <TeamMemberCard
                    name="Taniya Masud Temkar"
                    position="Head"
                    institution="DY Patil Medical College, Kolhapur"
                    batch="MBBS 2023 batch"
                  />
                  <TeamMemberCard
                    name="Uzair Pathan"
                    position="Coordinator"
                    institution="Government Medical College, Alibag"
                    batch="MBBS 2023 batch"
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
