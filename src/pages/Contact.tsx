
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Contact = () => {
  // Default contact information
  const defaultContactInfo = {
    generalEmail: 'contact@smak.in.net',
    researchEmail: 'contact@smak.in.net',
    addressLine1: 'SMAK Headquarters',
    addressLine2: 'Medical Education Complex',
    addressLine3: 'New Delhi, India - 110029',
    responseTime: '24-48 hours'
  };

  const [contactInfo, setContactInfo] = useState(defaultContactInfo);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contactInfo'));
        if (!querySnapshot.empty) {
          // Get the first document (there should only be one)
          const data = querySnapshot.docs[0].data();
          setContactInfo({
            generalEmail: data.generalEmail || defaultContactInfo.generalEmail,
            researchEmail: data.researchEmail || defaultContactInfo.researchEmail,
            addressLine1: data.addressLine1 || defaultContactInfo.addressLine1,
            addressLine2: data.addressLine2 || defaultContactInfo.addressLine2,
            addressLine3: data.addressLine3 || defaultContactInfo.addressLine3,
            responseTime: data.responseTime || defaultContactInfo.responseTime
          });
        }
      } catch (e) {
        console.error("Error fetching contact info:", e);
        setContactInfo(defaultContactInfo);
      }
    };
    fetchContactInfo();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                📩 Contact Us
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get in touch with the SMAK team. We're here to help and support your medical journey.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">General Inquiries:</p>
                  <p className="font-medium mb-3">{contactInfo.generalEmail}</p>
                  <p className="text-muted-foreground mb-2">Research Collaborations:</p>
                  <p className="font-medium">{contactInfo.researchEmail}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Our Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {contactInfo.addressLine1}<br />
                    {contactInfo.addressLine2}<br />
                    {contactInfo.addressLine3}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We typically respond within<br />
                    <span className="font-medium text-foreground">{contactInfo.responseTime}</span><br />
                    during business days
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-blue-100 dark:border-blue-900/20">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Have a question or need assistance? We'd love to hear from you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Your first name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Your last name" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What is this regarding?" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us how we can help you..."
                        rows={6}
                      />
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
