
import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, FilePlus, BarChart, Settings, LogOut, Menu, X, GraduationCap, BarChartHorizontalBig, BookOpenCheck, Video, Rss, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';

const adminSidebarNavItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <BarChart className="h-5 w-5" /> },
  { name: 'User Management', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
  { name: 'Content Creation', path: '/admin/content', icon: <FilePlus className="h-5 w-5" /> },
  { name: 'Exam Management', path: '/admin/exams', icon: <BookOpenCheck className="h-5 w-5" /> },
  { name: 'Classes Management', path: '/admin/classes', icon: <Video className="h-5 w-5" /> },
  { name: 'Current Affairs', path: '/admin/current-affairs', icon: <Rss className="h-5 w-5" /> },
  { name: 'Doubt Forum Moderation', path: '/admin/doubt-forum', icon: <MessageSquare className="h-5 w-5" /> },
  { name: 'Site Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    toast({title: "Logged Out", description: "Admin has been successfully logged out."});
    navigate('/login');
  }

  const sidebarVariants = {
    open: { width: "280px", transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { width: "80px", transition: { type: "spring", stiffness: 300, damping: 30 } },
  };
  
  const mobileSidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        className="hidden md:flex flex-col bg-gray-800 shadow-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
          <Link to="/admin/dashboard" className={`flex items-center space-x-2 overflow-hidden whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
            <Shield className="h-8 w-8 text-primary flex-shrink-0" />
            {isSidebarOpen && <span className="text-2xl font-bold text-white">Admin Panel</span>}
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:block text-gray-300 hover:text-white">
            {isSidebarOpen ? <BarChartHorizontalBig className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        <nav className="flex-grow p-2 space-y-1 overflow-y-auto no-scrollbar">
          {adminSidebarNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                ${!isSidebarOpen ? 'justify-center' : ''}`
              }
              title={item.name}
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-3">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Button variant="ghost" className={`w-full flex items-center ${!isSidebarOpen ? 'justify-center' : 'justify-start'} p-3 text-red-400 hover:text-red-300 hover:bg-red-700/20`} onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
       <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={toggleMobileSidebar}
            />
            <motion.aside
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 h-full w-72 bg-gray-800 shadow-xl z-50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
                <Link to="/admin/dashboard" className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold text-white">Admin Panel</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="text-gray-300 hover:text-white">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="flex-grow p-2 space-y-1 overflow-y-auto no-scrollbar">
                {adminSidebarNavItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={toggleMobileSidebar}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg text-sm font-medium transition-colors
                      ${isActive ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                    }
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
               <div className="p-4 border-t border-gray-700">
                <Button variant="ghost" className="w-full flex items-center justify-start p-3 text-red-400 hover:text-red-300 hover:bg-red-700/20" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3">Logout</span>
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-gray-800 shadow-sm h-16 flex items-center justify-between px-6 border-b border-gray-700">
           <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="md:hidden mr-2 text-gray-300 hover:text-white">
              <Menu className="h-6 w-6" />
            </Button>
          <div className="flex-1">
            {/* Can add search or other header items here if needed for admin */}
          </div>
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Admin User" /> {/* Placeholder Admin Avatar */}
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-200" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-gray-400">
                      admin@mcqgram.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700"/>
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 focus:bg-red-700/20">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
