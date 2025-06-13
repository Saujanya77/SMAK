
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileText, 
  Stethoscope, 
  PlayCircle, 
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Home
} from "lucide-react";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: Home,
      route: "/",
      color: "text-blue-600"
    },
    {
      title: "Medical Blogs",
      icon: BookOpen,
      route: "/medical-blogs",
      color: "text-blue-600"
    },
    {
      title: "Research Papers",
      icon: FileText,
      route: "/research-papers",
      color: "text-green-600"
    },
    {
      title: "Clinical Corner",
      icon: Stethoscope,
      route: "/clinical-corner",
      color: "text-red-600",
      subItems: [
        { title: "Clinical Cases", route: "/clinical-cases" },
        { title: "Examination Skills", route: "/examination-skills" },
        { title: "Emergency Protocols", route: "/emergency-protocols" },
        { title: "Clinical Procedures", route: "/clinical-procedures" },
        { title: "Communication", route: "/doctor-communication" },
        { title: "Lab & Imaging", route: "/lab-imaging" }
      ]
    },
    {
      title: "Content Hub",
      icon: PlayCircle,
      route: "/content-hub",
      color: "text-purple-600",
      subItems: [
        { title: "Video Lectures", route: "/video-lectures" },
        { title: "Study Notes", route: "/study-notes" },
        { title: "MCQ Tests", route: "/mcq-tests" },
        { title: "Question Bank", route: "/question-bank" }
      ]
    }
  ];

  const handleLogout = () => {
    console.log("User logged out");
    navigate('/');
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 min-h-screen">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">D</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Dr. John Doe</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">3rd Year MBBS</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <div key={item.title}>
            <div
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                location.pathname === item.route
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => {
                if (item.subItems) {
                  toggleSection(item.title);
                } else {
                  navigate(item.route);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <span className="font-medium">{item.title}</span>
              </div>
              {item.subItems && (
                expandedSections.includes(item.title) ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
            
            {/* Sub Items */}
            {item.subItems && expandedSections.includes(item.title) && (
              <div className="ml-8 mt-2 space-y-1">
                {item.subItems.map((subItem) => (
                  <div
                    key={subItem.title}
                    className={`p-2 rounded-md cursor-pointer text-sm transition-colors ${
                      location.pathname === subItem.route
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                    onClick={() => navigate(subItem.route)}
                  >
                    {subItem.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AppSidebar;
