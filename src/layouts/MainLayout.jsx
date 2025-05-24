
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, BookOpen, BarChart2, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // In a real app, this would clear authentication
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home className="h-5 w-5 mr-2" /> },
    { path: '/categories', label: 'Exams', icon: <BookOpen className="h-5 w-5 mr-2" /> },
    { path: '/profile', label: 'Profile', icon: <User className="h-5 w-5 mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <div className="bg-primary rounded-full p-2 mr-2">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                MCQgram
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary font-medium'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-50"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-2 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary font-medium bg-gray-50'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <Button 
                variant="outline" 
                className="flex items-center mt-2 mx-4" 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-primary rounded-full p-2 mr-2">
                  <BarChart2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">MCQgram</span>
              </div>
              <p className="text-gray-600 text-sm">
                Your ultimate platform for competitive exam preparation. Practice with mock tests for SSC, Bank, Railway and more.
              </p>
            </div>
            <div>
              <span className="font-medium block mb-4">Quick Links</span>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-primary">Home</Link>
                </li>
                <li>
                  <Link to="/categories" className="text-gray-600 hover:text-primary">Exam Categories</Link>
                </li>
                <li>
                  <Link to="/profile" className="text-gray-600 hover:text-primary">My Profile</Link>
                </li>
              </ul>
            </div>
            <div>
              <span className="font-medium block mb-4">Contact Us</span>
              <p className="text-gray-600 text-sm mb-2">
                Have questions or feedback? Reach out to our support team.
              </p>
              <p className="text-gray-600 text-sm">
                Email: support@mcqgram.com
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} MCQgram. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
