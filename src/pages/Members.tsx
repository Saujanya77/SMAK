import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, GraduationCap } from 'lucide-react';

const Members = () => {
  const members = [
    {
      name: "SAMUDRA CHAUDHARI ",
      college: "SMAK",
      year: "",
      specialization: "",
      position: "FOUNDER",
      image: "https://i.postimg.cc/65tpg88S/Whats-App-Image-2025-08-13-at-13-39-13-32477921.jpg",
    },
    {
      name: "KHUSHAL PAL",
      college: "SMAK",
      year: "",
      specialization: "",
      position: "CO-FOUNDER",
      image: "https://i.postimg.cc/DwYfS5xk/Whats-App-Image-2025-08-13-at-13-39-13-89a66ab2.jpg",
    },
    {
      name: "Brishabh Raj Prajesh",
      college: "SMAK RESEARCH CLUB",
      year: "",
      specialization: "",
      position: "Co Head",
      image: "https://i.postimg.cc/L5ByYYTG/Whats-App-Image-2025-08-13-at-13-01-49-9d0aaa5d.jpg",
    },
    {
      name: "Musa M. Bharmal",
      college: "SMAK RESEARCH CLUB",
      year: "",
      specialization: "",
      position: "Co Head",
      image: "https://i.postimg.cc/6pT0w1Dk/Whats-App-Image-2025-08-13-at-13-01-49-3b92b5a0.jpg",
    },
    {
      name: "Disha Agrawala ",
      college: "SMAK",
      year: "",
      specialization: "",
      position: "Executive Board Member",
      image: "https://i.postimg.cc/VN8d4JBK/Whats-App-Image-2025-08-13-at-13-01-49-0a36118b.jpg",
    },
    {
      name: "Taniya Masud Temkar",
      college: "DY Patil Medical College, Kolhapur",
      year: "",
      specialization: "",
      position: "Head Of Event & Content Committee",
      image: "https://i.postimg.cc/HsMYKpLR/Whats-App-Image-2025-08-13-at-13-01-49-6427a359.jpg",
    },
    {
      name: "Uzair Pathan",
      college: "Coordinator - Event and Content Committee",
      year: "GMC Alibag",
      specialization: "",
      position: "Head",
      image: "https://i.postimg.cc/brcyYMC3/Whats-App-Image-2025-08-13-at-13-01-49-73477329.jpg",
    },
    {
      name: "Aakanksha Nanda",
      college: "Veer Surendra Sai Institute of Medical Science And Research, Burla, Odisha",
      year: "",
      specialization: "",
      position: "Head of the Mentorship Program Committee",
      image: "https://i.postimg.cc/0QG3mB5t/Whats-App-Image-2025-08-13-at-13-01-49-8c3c0677.jpg",
    },
    {
      name: "Sanya Walia",
      college: "Government Institute of Medical Sciences, Greater Noida ",
      year: "",
      specialization: "",
      position: "Coordinator - Mentorship Program Committee",
      image: "https://i.postimg.cc/Gm0Fwhxy/Whats-App-Image-2025-08-13-at-13-01-49-c374962b.jpg",
    },
    {
      name: "Ananya",
      college: "Maulana Azad Medical College Delhi,",
      year: "",
      specialization: "",
      position: "Head Of Journal Development committee",
      image: "https://i.postimg.cc/vTkKfgxz/Whats-App-Image-2025-08-13-at-13-01-49-c8ba169c.jpg",
    },
    {
      name: "Ansharah Khan",
      college: "Grant medical college Mumbai",
      year: "",
      specialization: "",
      position: "Coordinator - Journal  Developme Committee",
      image: "https://i.postimg.cc/ydPgDc5M/Whats-App-Image-2025-08-13-at-13-01-49-62c3e89c.jpg",
    },
    {
      name: "Pratik Gupta",
      college: "IMS and SUM campus 2",
      year: "",
      specialization: "",
      position: "Head - Campus outreach and coordination Committee",
      image: "https://i.postimg.cc/B6rSQ6Zr/Whats-App-Image-2025-08-13-at-13-01-49-eeb0d546.jpg",
    },
    {
      name: "Madhav Tripathi",
      college: "Virendra Kumar Sakhlecha Government Medical College, Neemuch ( MP)",
      year: "",
      specialization: "",
      position: "Coordinator - Outreach & Collaboration Committee",
      image: "https://i.postimg.cc/50cTXFvS/Whats-App-Image-2025-08-13-at-13-01-49-7c1ed6e6.jpg",
    },
    {
      name: "Uzair Pathan",
      college: "Government Medical College, Alibag",
      year: "MBBS 2023 batch",
      specialization: "",
      position: "Coordinator",
      image: "/Images/placeholder.jpg",
    },
  ];

  const [search, setSearch] = useState('');

  // Filter members based on search term (case-insensitive, search in all fields)
  const filteredMembers = members.filter((member) =>
    [member.name, member.college, member.year, member.specialization]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-16 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                👥 SMAK Members
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with fellow medical students and professionals from across the country.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
              <Input
                className="pl-10"
                placeholder="Search members..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search members"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMembers.length > 0 ? filteredMembers.map((member, index) => (
              <Card
                key={index}
                className="p-0 bg-white/80 dark:bg-background/80 border-0 shadow-[0_6px_32px_-8px_rgba(0,80,195,0.08)] hover:shadow-xl transition-shadow duration-300 rounded-3xl flex flex-col items-center"
              >
                <CardContent className="flex flex-col items-center px-6 pt-8 pb-6 w-full">
                  {/* Large circular photo area */}
                  <div className="relative w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-blue-100 via-blue-300 to-blue-400 dark:from-blue-900 dark:via-blue-700 dark:to-blue-400 shadow-lg flex items-center justify-center mx-auto">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-28 h-28 object-cover rounded-full border-4 border-white dark:border-background ring-2 ring-blue-400 dark:ring-blue-500 shadow-lg mx-auto"
                      style={{ aspectRatio: "1/1", background: "#e8efff", objectPosition: "center" }}
                    />
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <h3 className="font-extrabold text-xl md:text-2xl mb-1 text-blue-700 dark:text-blue-300 text-center w-full break-words">
                      {member.name}
                    </h3>
                    <div className="text-sm bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 dark:from-blue-950/40 dark:to-blue-900/70 px-4 py-1.5 rounded-xl shadow-inner font-semibold mb-2 text-blue-700/90 dark:text-blue-200 tracking-wide">
                      {member.position}
                    </div>
                    {/* College & specialty block */}
                    <div className="flex flex-col items-center gap-1 mb-4 w-full text-center">
                      {member.college && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground text-base font-medium">
                          <MapPin className="h-5 w-5 text-blue-400" />
                          <span>{member.college}</span>
                        </div>
                      )}
                      {(member.year || member.specialization) && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground text-base font-medium">
                          <GraduationCap className="h-5 w-5 text-blue-400" />
                          <span>
                            {[member.year, member.specialization].filter(Boolean).join(" • ")}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full mt-2 font-semibold shadow focus:ring-2 focus:ring-blue-400"
                    >
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center text-muted-foreground py-16">
                No members found.
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Members;
