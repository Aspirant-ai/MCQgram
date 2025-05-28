
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-slate-800">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">MCQgram</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login / Register
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300 dark:text-gray-400 py-12">
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
                <li><Link to="/dashboard/categories" className="hover:text-white">All Exams</Link></li>
                <li><Link to="/dashboard/subscriptions" className="hover:text-white">Subscription Plans</Link></li>
                <li><Link to="/dashboard/study-material" className="hover:text-white">Study Material</Link></li>
                <li><Link to="/dashboard/profile" className="hover:text-white">Your Profile</Link></li>
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
          <div className="mt-8 border-t border-gray-700 dark:border-gray-600 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} MCQgram. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
