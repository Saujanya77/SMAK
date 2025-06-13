
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Microscope, BookOpen, Users, Award } from 'lucide-react';

const ResearchHub = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                🔬 Research Hub
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover ongoing research projects, collaborate with peers, and advance medical science through evidence-based research.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Microscope, title: "Active Projects", count: "150+", description: "Ongoing research initiatives" },
              { icon: Users, title: "Researchers", count: "500+", description: "Active research collaborators" },
              { icon: BookOpen, title: "Publications", count: "200+", description: "Published research papers" },
              { icon: Award, title: "Awards", count: "50+", description: "Research excellence awards" }
            ].map((stat, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center">
                    <stat.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">{stat.count}</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{stat.title}</h3>
                  <CardDescription>{stat.description}</CardDescription>
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

export default ResearchHub;
