
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, Youtube, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About SMAK */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white overflow-hidden" style={{ boxShadow: '0 0 0 4px #3b82f6, 0 0 12px 2px #2563eb' }}>
                <img src="https://i.postimg.cc/LXmZbsWJ/Logo.jpg" alt="SMAK Logo" className="w-10 h-10 object-cover rounded-full" />
              </div>
              <span className="text-xl font-bold">SMAK</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Empowering tomorrow's healers through knowledge today. A national platform for medical students to learn, lead & innovate.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors">About SMAK</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-blue-400 transition-colors">Events</Link></li>
              <li><Link to="/journal" className="text-gray-300 hover:text-blue-400 transition-colors">Journal</Link></li>
              <li><Link to="/research-hub" className="text-gray-300 hover:text-blue-400 transition-colors">Research Hub</Link></li>
              <li><Link to="/collaborate" className="text-gray-300 hover:text-blue-400 transition-colors">Collaborate</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">contact@smak.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 SMAK - Society of Medical Academia and Knowledge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
