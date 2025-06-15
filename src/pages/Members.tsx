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
      name: "KHUSHAL PAL",
      college: "",
      year: "",
      specialization: "",
      position: "Founder",
      image: "public/Images/20250613_172636.jpg",
    },
    {
      name: "SAMUDRA CHAUDHURI",
      college: "",
      year: "",
      specialization: "",
      position: "Founder",
      image: "public/Images/WhatsApp Image 2025-06-13 at 16.19.43_467db08b.jpg",
    },
    {
      name: "Dr. Rohit Patel",
      college: "PGIMER Chandigarh",
      year: "3rd Year",
      specialization: "Pediatrics",
      position: "President",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Dr. Kavita Singh",
      college: "KGMU Lucknow",
      year: "2nd Year",
      specialization: "Dermatology",
      position: "President",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
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
