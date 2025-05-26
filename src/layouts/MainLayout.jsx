
import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookCopy, User, LogIn, LayoutDashboard, DollarSign, Video, FileText, Rss, Edit3, MessageSquare, Menu, X, GraduationCap, Zap, BookOpenCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
  { name: 'Exams', path: '/categories', icon: <BookCopy className="h-5 w-5" /> },
  { name: 'Live Tests', path: '/live-tests', icon: <Zap className="h-5 w-5" /> },
  { name: 'Study Material', path: '/study-material', icon: <BookOpenCheck className="h-5 w-5" /> },
  { name: 'Classes', path: '/classes', icon: <Video className="h-5 w-5" /> },
  { name: 'Current Affairs', path: '/current-affairs', icon: <Rss className="h-5 w-5" /> },
  { name: 'Subscriptions', path: '/subscriptions', icon: <DollarSign className="h-5 w-5" /> },
  { name: 'Doubt Forum', path: '/doubt-forum', icon: <MessageSquare className="h-5 w-5" /> },
  { name: 'Profile', path: '/profile', icon: <User className="h-5 w-5" /> },
];

const MainLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-slate-100">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-800">MCQgram</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <nav className="flex flex-col space-y-1 px-2 py-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={toggleMobileMenu}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3
                    ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
              <div className="border-t my-2"></div>
              <Button variant="ghost" asChild className="w-full justify-start px-3 py-2">
                <Link to="/login" onClick={toggleMobileMenu}>
                  <LogIn className="mr-3 h-5 w-5" /> Login
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                 <GraduationCap className="h-8 w-8 text-primary" />
                 <span className="text-xl font-bold text-white">MCQgram</span>
              </div>
              <p className="text-sm">
                Your partner in acing competitive exams. Practice, analyze, and achieve your goals with MCQgram.
              </p>
            </div>
            <div>
              <p className="text-white font-semibold mb-4">Quick Links</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/categories" className="hover:text-white">All Exams</Link></li>
                <li><Link to="/subscriptions" className="hover:text-white">Subscription Plans</Link></li>
                <li><Link to="/study-material" className="hover:text-white">Study Material</Link></li>
                <li><Link to="/profile" className="hover:text-white">Your Profile</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-4">Contact Us</p>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white">support@mcqgram.com</span></li>
                <li><span className="hover:text-white">+1 234 567 8900</span></li>
                <li><span className="hover:text-white">123 Exam Street, Test City, India</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} MCQgram. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
