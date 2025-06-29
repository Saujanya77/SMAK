import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";


import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import Journal from "./pages/Journal";
import ResearchHub from "./pages/ResearchHub";
import Members from "./pages/Members";
import Collaborate from "./pages/Collaborate";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Blogs from "./pages/Blogs";
import Videos from "./pages/Videos";
import Notes from "./pages/Notes";
import TestimonialsSlider from "./components/TestimonialsSlider";
import ClinicalCases from "./pages/ClinicalCases";
import ExaminationSkills from "./pages/ExaminationSkills";
import VideoLectures from "./pages/VideoLectures";
import MCQBank from "./pages/MCQBank";
import Journals from "./pages/Journals";
import SubjectNotes from "./pages/SubjectNotes";
import Exploregallery from "./pages/exploregallery";
import Clinicalcorner from "./pages/Clinicalcorner";
import Contenthub from "./pages/Contenthub";
import Homeclinicalcorner from "./pages/Homeclinicalcorner";


const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="smak-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/events" element={<Events />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/research-hub" element={<ResearchHub />} />
                <Route path="/members" element={<Members />} />
                <Route path="/collaborate" element={<Collaborate />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/examination-skills" element={<ExaminationSkills />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/SubjectNotes" element={<SubjectNotes />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/TestimonialsSlider" element={<TestimonialsSlider />} />
                <Route path="/exploregalllery" element={<Exploregallery />} />
                <Route path="/Clinicalcorner" element={<Clinicalcorner />} />
                <Route path="/Contenthub" element={<Contenthub />} />
                <Route path="/Homeclinicalcorner" element={<Homeclinicalcorner />} />

                {/* Protected Routes */}
                <Route
                    path="/video-lectures"
                    element={
                      <ProtectedRoute>
                        <VideoLectures />
                      </ProtectedRoute>
                    }
                />
                <Route
                    path="/mcq-bank"
                    element={
                      <ProtectedRoute>
                        <MCQBank />
                      </ProtectedRoute>
                    }
                />
                <Route
                    path="/journals"
                    element={
                      <ProtectedRoute>
                        <Journals onBack={() => window.history.back()} />
                      </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                />
                <Route
                    path="/blogs"
                    element={
                      <ProtectedRoute>
                        <Blogs onBack={() => window.history.back()} />
                      </ProtectedRoute>
                    }
                />
                <Route
                    path="/clinical-cases"
                    element={
                      <ProtectedRoute>
                        <ClinicalCases />
                      </ProtectedRoute>
                    }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
);

export default App;
