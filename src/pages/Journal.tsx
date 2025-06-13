
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Eye, Download } from 'lucide-react';

const Journal = () => {
  const featuredArticles = [
    {
      title: "Novel Approaches in Telemedicine: Transforming Rural Healthcare Access",
      authors: ["Dr. Sarah Johnson", "Dr. Raj Patel", "SMAK Research Team"],
      date: "November 2024",
      category: "Digital Health",
      abstract: "This comprehensive study explores innovative telemedicine solutions that are revolutionizing healthcare delivery in rural areas, with a focus on cost-effective implementation and patient outcomes.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop&crop=center",
      views: "2,847",
      downloads: "1,203"
    },
    {
      title: "Impact of Artificial Intelligence in Early Cancer Detection",
      authors: ["Dr. Amit Kumar", "Dr. Lisa Chen", "Dr. Rohit Sharma"],
      date: "October 2024",
      category: "Oncology",
      abstract: "An analysis of machine learning algorithms in pathological diagnosis, examining their accuracy rates and potential for reducing diagnostic errors in cancer screening programs.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop&crop=center",
      views: "3,156",
      downloads: "1,847"
    },
    {
      title: "Mental Health Interventions in Medical Education",
      authors: ["Dr. Priya Menon", "Dr. Arjun Gupta"],
      date: "September 2024",
      category: "Medical Education",
      abstract: "A systematic review of mental health support systems in medical colleges and their effectiveness in reducing burnout and improving academic performance among medical students.",
      image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&h=250&fit=crop&crop=center",
      views: "4,203",
      downloads: "2,156"
    }
  ];

  const recentPublications = [
    {
      title: "Antibiotic Resistance Patterns in Indian ICUs",
      authors: ["Dr. Kavita Patel", "Dr. Suresh Kumar"],
      date: "November 2024",
      category: "Infectious Diseases"
    },
    {
      title: "Pediatric Nutrition in Urban vs Rural Settings",
      authors: ["Dr. Neha Sharma", "Dr. Vikram Singh"],
      date: "November 2024",
      category: "Pediatrics"
    },
    {
      title: "Surgical Outcomes in Minimally Invasive Procedures",
      authors: ["Dr. Raj Malhotra", "Dr. Sita Devi"],
      date: "October 2024",
      category: "Surgery"
    },
    {
      title: "Cardiovascular Risk Assessment in Young Adults",
      authors: ["Dr. Ajay Verma", "Dr. Sunita Rao"],
      date: "October 2024",
      category: "Cardiology"
    }
  ];

  const categories = [
    "All Categories",
    "Cardiology",
    "Oncology",
    "Pediatrics",
    "Surgery",
    "Digital Health",
    "Medical Education",
    "Infectious Diseases",
    "Mental Health"
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
                📘 SMAK Journal
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Peer-reviewed research and academic publications by medical students and professionals. Advancing medical knowledge through quality research.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
              Submit Your Research
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Featured Articles
            </h2>
            <p className="text-lg text-muted-foreground">
              Highlighting groundbreaking research from our community
            </p>
          </div>
          
          <div className="space-y-8">
            {featuredArticles.map((article, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {article.views}
                          </div>
                          <div className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            {article.downloads}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                      <CardDescription className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-1" />
                        {article.authors.join(", ")}
                        <Calendar className="h-4 w-4 ml-4 mr-1" />
                        {article.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-muted-foreground mb-4">{article.abstract}</p>
                      <div className="flex space-x-2">
                        <Button variant="default" size="sm">
                          Read Full Article
                        </Button>
                        <Button variant="outline" size="sm">
                          Download PDF
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-16 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Browse by Category
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category, index) => (
              <Button 
                key={index} 
                variant={index === 0 ? "default" : "outline"} 
                size="sm"
                className={index === 0 ? "bg-gradient-to-r from-blue-600 to-blue-500" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Publications */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Recent Publications
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPublications.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-sm text-muted-foreground">{article.date}</span>
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription>
                    By {article.authors.join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Read Abstract
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Submit Your Research
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Share your research with the medical community. Our peer review process ensures quality and impact.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl mb-4">📝</div>
                <h3 className="font-semibold mb-2">Submit Manuscript</h3>
                <p className="text-sm opacity-90">Upload your research paper following our guidelines</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">👥</div>
                <h3 className="font-semibold mb-2">Peer Review</h3>
                <p className="text-sm opacity-90">Expert reviewers evaluate your work</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="font-semibold mb-2">Publication</h3>
                <p className="text-sm opacity-90">Get published in our peer-reviewed journal</p>
              </div>
            </div>
            <Button size="lg" variant="secondary">
              View Submission Guidelines
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Journal;
