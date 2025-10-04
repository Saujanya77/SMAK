import React, { useState, useEffect } from "react";
// ...existing code...
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { MapPin, GraduationCap, X, Users } from "lucide-react";
import membersData from '../data/members.json';


const Members = () => {
  // Hardcoded members array
  const hardcodedMembers = [
    { name: "SAMUDRA CHAUDHARI ", institution: "SMAK", designation: "FOUNDER", pictureUrl: "https://i.postimg.cc/65tpg88S/Whats-App-Image-2025-08-13-at-13-39-13-32477921.jpg", phone: "", objectPosition: "center 20%" },
    { name: "KHUSHAL PAL", institution: "SMAK", designation: "CO-FOUNDER", pictureUrl: "https://i.postimg.cc/DwYfS5xk/Whats-App-Image-2025-08-13-at-13-39-13-89a66ab2.jpg", phone: "" },
    { name: "Brishabh Raj Prajesh", institution: "SMAK RESEARCH CLUB", designation: "Head", pictureUrl: "https://i.postimg.cc/L5ByYYTG/Whats-App-Image-2025-08-13-at-13-01-49-9d0aaa5d.jpg", phone: "" },
    { name: "Musa M. Bharmal", institution: "SMAK RESEARCH CLUB", designation: "Co Head", pictureUrl: "https://i.postimg.cc/6pT0w1Dk/Whats-App-Image-2025-08-13-at-13-01-49-3b92b5a0.jpg", phone: "" },
    { name: "Disha Agrawala ", institution: "SMAK", designation: "Executive Board Member", pictureUrl: "https://i.postimg.cc/VN8d4JBK/Whats-App-Image-2025-08-13-at-13-01-49-0a36118b.jpg", phone: "" },
    { name: "Taniya Masud Temkar", institution: "DY Patil Medical College, Kolhapur", designation: "Head Of Event & Content Committee", pictureUrl: "https://i.postimg.cc/HsMYKpLR/Whats-App-Image-2025-08-13-at-13-01-49-6427a359.jpg", phone: "" },
    { name: "Uzair Pathan", institution: "Coordinator - Event and Content Committee", designation: "Head", pictureUrl: "https://i.postimg.cc/brcyYMC3/Whats-App-Image-2025-08-13-at-13-01-49-73477329.jpg", phone: "GMC Alibag" },
    { name: "Aakanksha Nanda", institution: "Veer Surendra Sai Institute of Medical Science And Research, Burla, Odisha", designation: "Head of the Mentorship Program Committee", pictureUrl: "https://i.postimg.cc/0QG3mB5t/Whats-App-Image-2025-08-13-at-13-01-49-8c3c0677.jpg", phone: "" },
    { name: "Sanya Walia", institution: "Government Institute of Medical Sciences, Greater Noida", designation: "Coordinator - Mentorship Program Committee", pictureUrl: "https://i.postimg.cc/Gm0Fwhxy/Whats-App-Image-2025-08-13-at-13-01-49-c374962b.jpg", phone: "" },
    { name: "Ananya", institution: "Maulana Azad Medical College Delhi", designation: "Head Of Journal Development committee", pictureUrl: "https://i.postimg.cc/vTkKfgxz/Whats-App-Image-2025-08-13-at-13-01-49-c8ba169c.jpg", phone: "" },
    { name: "Ansharah Khan", institution: "Grant medical college Mumbai", designation: "Coordinator - Journal Development Committee", pictureUrl: "https://i.postimg.cc/ydPgDc5M/Whats-App-Image-2025-08-13-at-13-01-49-62c3e89c.jpg", phone: "" },
    { name: "Pratik Gupta", institution: "IMS and SUM campus 2", designation: "Head - Campus outreach and coordination Committee", pictureUrl: "https://i.postimg.cc/B6rSQ6Zr/Whats-App-Image-2025-08-13-at-13-01-49-eeb0d546.jpg", phone: "" },
    { name: "Madhav Tripathi", institution: "Virendra Kumar Sakhlecha Government Medical College, Neemuch (MP)", designation: "Coordinator - Outreach & Collaboration Committee", pictureUrl: "https://i.postimg.cc/50cTXFvS/Whats-App-Image-2025-08-13-at-13-01-49-7c1ed6e6.jpg", phone: "" },
  ];

  // Helper to convert Google Drive links to direct image links
  function getDirectImageUrl(url) {
    if (!url) return "";
    let id = "";
    const idMatch = url.match(/id=([\w-]+)/);
    if (idMatch) {
      id = idMatch[1];
    } else {
      const dMatch = url.match(/\/d\/([\w-]+)/);
      if (dMatch) {
        id = dMatch[1];
      }
    }
    if (id) {
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return url;
  }

  // Map imported JSON members to match the display structure and fix image links
  const importedMembers = Array.isArray(membersData)
    ? membersData
        .filter(item => !!item.image)
        .map((item) => {
          let pictureUrl = "";
          if (item.image.includes("drive.google.com")) {
            pictureUrl = getDirectImageUrl(item.image);
          } else {
            pictureUrl = item.image;
          }
          return {
            name: item["Name "]?.trim() || "",
            institution: item.college?.trim() || "",
            designation: "Member",
            pictureUrl,
            phone: "",
          };
        })
    : [];

  const [search, setSearch] = useState("");
  const [modalSearch, setModalSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ...existing code...

  // Filter hardcoded members for main display
  const filteredHardcodedMembers = hardcodedMembers.filter((member) =>
    member.name && member.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  // Filter JSON members for modal
  const allOtherMembers = [...importedMembers];
  const filteredModalMembers = allOtherMembers.filter((member) =>
    member.name && member.name.toLowerCase().includes(modalSearch.toLowerCase().trim())
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
              <search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
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
          {/* Core Team Members */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-4">Core Team Members</h2>
            <p className="text-muted-foreground mb-8">Meet our dedicated leadership team</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
            {filteredHardcodedMembers.length > 0 ? filteredHardcodedMembers.map((member, index) => (
              <Card
                key={index}
                className="p-0 bg-white/80 dark:bg-background/80 border-0 shadow-[0_6px_32px_-8px_rgba(0,80,195,0.08)] hover:shadow-xl transition-shadow duration-300 rounded-3xl flex flex-col items-center"
              >
                <CardContent className="flex flex-col items-center px-6 pt-8 pb-6 w-full">
                  {/* Large circular photo area */}
                  <div className="relative w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-blue-100 via-blue-300 to-blue-400 dark:from-blue-900 dark:via-blue-700 dark:to-blue-400 shadow-lg flex items-center justify-center mx-auto">
                    <img
                      src={member.pictureUrl || ""}
                      alt={member.name}
                      className="w-28 h-28 object-cover rounded-full border-4 border-white dark:border-background ring-2 ring-blue-400 dark:ring-blue-500 shadow-lg mx-auto"
                      style={{ aspectRatio: "1/1", background: "#e8efff", objectPosition: member.objectPosition || "center top", objectFit: "cover" }}
                    />
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <h3 className="font-extrabold text-xl md:text-2xl mb-1 text-blue-700 dark:text-blue-300 text-center w-full break-words">
                      {member.name}
                    </h3>
                    <div className="text-sm bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 dark:from-blue-950/40 dark:to-blue-900/70 px-4 py-1.5 rounded-xl shadow-inner font-semibold mb-2 text-blue-700/90 dark:text-blue-200 tracking-wide">
                      {member.designation}
                    </div>
                    {/* College & specialty block */}
                    <div className="flex flex-col items-center gap-1 mb-4 w-full text-center">
                      {member.institution && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground text-base font-medium">
                          <MapPin className="h-5 w-5 text-blue-400" />
                          <span>{member.institution}</span>
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
                No core team members found.
              </div>
            )}
          </div>

          {/* See More Members Button */}
          <div className="text-center">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                >
                  <Users className="h-5 w-5 mr-2" />
                  See More Members ({allOtherMembers.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
                <DialogHeader className="sticky top-0 bg-white dark:bg-background z-10 pb-4">
                  <DialogTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    All SMAK Members
                  </DialogTitle>
                  <div className="max-w-md mx-auto relative mt-4">
                    <Input
                      className="pl-4"
                      placeholder="Search members..."
                      value={modalSearch}
                      onChange={e => setModalSearch(e.target.value)}
                      aria-label="Search members in modal"
                    />
                  </div>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[70vh] pr-2">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredModalMembers.length > 0 ? filteredModalMembers.map((member, index) => (
                      <Card
                        key={index}
                        className="p-0 bg-white/80 dark:bg-background/80 border-0 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl flex flex-col items-center"
                      >
                        <CardContent className="flex flex-col items-center px-4 pt-6 pb-4 w-full">
                          {/* Smaller circular photo for modal (commented out as requested) */}
                          {/**
                          <div className="relative w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-blue-100 via-blue-300 to-blue-400 dark:from-blue-900 dark:via-blue-700 dark:to-blue-400 shadow-lg flex items-center justify-center mx-auto">
                            <img
                              src={member.pictureUrl || ""}
                              alt={member.name}
                              className="w-18 h-18 object-cover rounded-full border-2 border-white dark:border-background ring-1 ring-blue-400 dark:ring-blue-500 shadow-lg mx-auto"
                              style={{ aspectRatio: "1/1", background: "#e8efff", objectPosition: "center top", objectFit: "cover" }}
                            />
                          </div>
                          */}
                          <div className="flex flex-col items-center w-full">
                            <h3 className="font-bold text-lg mb-1 text-blue-700 dark:text-blue-300 text-center w-full break-words">
                              {member.name}
                            </h3>
                            <div className="text-xs bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 dark:from-blue-950/40 dark:to-blue-900/70 px-3 py-1 rounded-lg shadow-inner font-medium mb-2 text-blue-700/90 dark:text-blue-200">
                              {member.designation}
                            </div>
                            {/* College block */}
                            <div className="flex flex-col items-center gap-1 mb-3 w-full text-center">
                              {member.institution && (
                                <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm">
                                  <MapPin className="h-4 w-4 text-blue-400" />
                                  <span className="text-xs">{member.institution}</span>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-1 text-sm font-medium shadow-sm"
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
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Members;
// {
//   name: "SAMUDRA CHAUDHARI ", institution: "SMAK", designation: "FOUNDER", pictureUrl: "https://i.postimg.cc/65tpg88S/Whats-App-Image-2025-08-13-at-13-39-13-32477921.jpg", phone: "", objectPosition: "center 20%"
// },
// { name: "KHUSHAL PAL", institution: "SMAK", designation: "CO-FOUNDER", pictureUrl: "https://i.postimg.cc/DwYfS5xk/Whats-App-Image-2025-08-13-at-13-39-13-89a66ab2.jpg", phone: "" },
// { name: "Brishabh Raj Prajesh", institution: "SMAK RESEARCH CLUB", designation: "Head", pictureUrl: "https://i.postimg.cc/L5ByYYTG/Whats-App-Image-2025-08-13-at-13-01-49-9d0aaa5d.jpg", phone: "" },
// { name: "Musa M. Bharmal", institution: "SMAK RESEARCH CLUB", designation: "Co Head", pictureUrl: "https://i.postimg.cc/6pT0w1Dk/Whats-App-Image-2025-08-13-at-13-01-49-3b92b5a0.jpg", phone: "" },
// { name: "Disha Agrawala ", institution: "SMAK", designation: "Executive Board Member", pictureUrl: "https://i.postimg.cc/VN8d4JBK/Whats-App-Image-2025-08-13-at-13-01-49-0a36118b.jpg", phone: "" },
// { name: "Taniya Masud Temkar", institution: "DY Patil Medical College, Kolhapur", designation: "Head Of Event & Content Committee", pictureUrl: "https://i.postimg.cc/HsMYKpLR/Whats-App-Image-2025-08-13-at-13-01-49-6427a359.jpg", phone: "" },
// { name: "Uzair Pathan", institution: "Coordinator - Event and Content Committee", designation: "Head", pictureUrl: "https://i.postimg.cc/brcyYMC3/Whats-App-Image-2025-08-13-at-13-01-49-73477329.jpg", phone: "GMC Alibag" },
// { name: "Aakanksha Nanda", institution: "Veer Surendra Sai Institute of Medical Science And Research, Burla, Odisha", designation: "Head of the Mentorship Program Committee", pictureUrl: "https://i.postimg.cc/0QG3mB5t/Whats-App-Image-2025-08-13-at-13-01-49-8c3c0677.jpg", phone: "" },
// { name: "Sanya Walia", institution: "Government Institute of Medical Sciences, Greater Noida", designation: "Coordinator - Mentorship Program Committee", pictureUrl: "https://i.postimg.cc/Gm0Fwhxy/Whats-App-Image-2025-08-13-at-13-01-49-c374962b.jpg", phone: "" },
// { name: "Ananya", institution: "Maulana Azad Medical College Delhi", designation: "Head Of Journal Development committee", pictureUrl: "https://i.postimg.cc/vTkKfgxz/Whats-App-Image-2025-08-13-at-13-01-49-c8ba169c.jpg", phone: "" },
// { name: "Ansharah Khan", institution: "Grant medical college Mumbai", designation: "Coordinator - Journal Development Committee", pictureUrl: "https://i.postimg.cc/ydPgDc5M/Whats-App-Image-2025-08-13-at-13-01-49-62c3e89c.jpg", phone: "" },
// { name: "Pratik Gupta", institution: "IMS and SUM campus 2", designation: "Head - Campus outreach and coordination Committee", pictureUrl: "https://i.postimg.cc/B6rSQ6Zr/Whats-App-Image-2025-08-13-at-13-01-49-eeb0d546.jpg", phone: "" },
// { name: "Madhav Tripathi", institution: "Virendra Kumar Sakhlecha Government Medical College, Neemuch (MP)", designation: "Coordinator - Outreach & Collaboration Committee", pictureUrl: "https://i.postimg.cc/50cTXFvS/Whats-App-Image-2025-08-13-at-13-01-49-7c1ed6e6.jpg", phone: "" },
// designation: "Head Of Journal Development committee",
//   pictureUrl: "https://i.postimg.cc/vTkKfgxz/Whats-App-Image-2025-08-13-at-13-01-49-c8ba169c.jpg",
//     phone: "",
//       name: "Pratik Gupta",
//         college: "IMS and SUM campus 2",
//           year: "",
//             institution: "Grant medical college Mumbai",
//               designation: "Coordinator - Journal Development Committee",
//                 pictureUrl: "https://i.postimg.cc/ydPgDc5M/Whats-App-Image-2025-08-13-at-13-01-49-62c3e89c.jpg",
//                   phone: "",
//                     name: "Madhav Tripathi",
//                       college: "Virendra Kumar Sakhlecha Government Medical College, Neemuch ( MP)",
//                         year: "",
//                           institution: "IMS and SUM campus 2",
//                             designation: "Head - Campus outreach and coordination Committee",
//                               pictureUrl: "https://i.postimg.cc/B6rSQ6Zr/Whats-App-Image-2025-08-13-at-13-01-49-eeb0d546.jpg",
//                                 phone: "",
//   ];


// const [search, setSearch] = useState('');
// institution: "Virendra Kumar Sakhlecha Government Medical College, Neemuch (MP)",
//   designation: "Coordinator - Outreach & Collaboration Committee",
//     pictureUrl: "https://i.postimg.cc/50cTXFvS/Whats-App-Image-2025-08-13-at-13-01-49-7c1ed6e6.jpg",
//       phone: "",
//       .toLowerCase()
//           .includes(search.toLowerCase().trim())
//   );
// const [firestoreMembers, setFirestoreMembers] = useState([]);
// useEffect(() => {
//   const fetchMembers = async () => {
//     const querySnapshot = await getDocs(collection(db, "members"));
//     const membersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     setFirestoreMembers(membersList);
//   };
//   fetchMembers();
// }, []);
// const members = [...staticMembers, ...firestoreMembers];

// return (
//   <div className="min-h-screen bg-background">
//     <Navigation />

//     <section className="py-16 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
//       <div className="container mx-auto px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-4xl md:text-6xl font-bold mb-6">
//             <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
//               👥 SMAK Members
//             </span>
//           </h1>
//           <p className="text-xl text-muted-foreground mb-8">
//             Connect with fellow medical students and professionals from across the country.
//           </p>
//           <div className="max-w-md mx-auto relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
//             <Input
//               className="pl-10"
//               placeholder="Search members..."
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               aria-label="Search members"
//             />
//           </div>
//         </div>
//       </div>
//     </section>

//     <section className="py-16">
//       <div className="container mx-auto px-4">
//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {filteredMembers.length > 0 ? filteredMembers.map((member, index) => (
//             <Card
//               key={index}
//               className="p-0 bg-white/80 dark:bg-background/80 border-0 shadow-[0_6px_32px_-8px_rgba(0,80,195,0.08)] hover:shadow-xl transition-shadow duration-300 rounded-3xl flex flex-col items-center"

//             >
//               <CardContent className="flex flex-col items-center px-6 pt-8 pb-6 w-full">
//                 {/* Large circular photo area */}
//                 <div className="relative w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-blue-100 via-blue-300 to-blue-400 dark:from-blue-900 dark:via-blue-700 dark:to-blue-400 shadow-lg flex items-center justify-center mx-auto">
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-28 h-28 object-cover rounded-full border-4 border-white dark:border-background ring-2 ring-blue-400 dark:ring-blue-500 shadow-lg mx-auto"
//                     style={{ aspectRatio: "1/1", background: "#e8efff", objectPosition: member.objectPosition || "center top", objectFit: "cover" }}
//                   />
//                 </div>
//                 <div className="flex flex-col items-center w-full">
//                   <h3 className="font-extrabold text-xl md:text-2xl mb-1 text-blue-700 dark:text-blue-300 text-center w-full break-words">
//                     {member.name}
//                   </h3>
//                   <div className="text-sm bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 dark:from-blue-950/40 dark:to-blue-900/70 px-4 py-1.5 rounded-xl shadow-inner font-semibold mb-2 text-blue-700/90 dark:text-blue-200 tracking-wide">
//                     {member.position}
//                   </div>
//                   {/* College & specialty block */}
//                   <div className="flex flex-col items-center gap-1 mb-4 w-full text-center">
//                     {member.college && (
//                       <div className="flex items-center justify-center gap-2 text-muted-foreground text-base font-medium">
//                         <MapPin className="h-5 w-5 text-blue-400" />
//                         <span>{member.college}</span>
//                       </div>
//                     )}
//                     {(member.year || member.specialization) && (
//                       <div className="flex items-center justify-center gap-2 text-muted-foreground text-base font-medium">
//                         <GraduationCap className="h-5 w-5 text-blue-400" />
//                         <span>
//                           {[member.year, member.specialization].filter(Boolean).join(" • ")}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     className="w-full mt-2 font-semibold shadow focus:ring-2 focus:ring-blue-400"
//                   >
//                     Connect
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )) : (
//             <div className="col-span-full text-center text-muted-foreground py-16">
//               No members found.
//             </div>
//           )}
//         </div>
//       </div>
//     </section>

//     <Footer />
//   </div>
// );
// };

// export default Members;

