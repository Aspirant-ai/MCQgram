
// DashboardLayout.jsx
import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookCopy, User, LogOut, Menu, X, Zap, BookOpenCheck, Video, Rss, DollarSign, MessageSquare, 
  Search, Bell, Languages, Sun, Moon, Settings, ZoomIn, ZoomOut, BarChartHorizontalBig, GraduationCap, Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.jsx';
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

const sidebarNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: 'All Exams', path: '/dashboard/categories', icon: <BookCopy className="h-5 w-5" /> },
  { name: 'Live Tests', path: '/dashboard/live-tests', icon: <Zap className="h-5 w-5" /> },
  { name: 'Study Material', path: '/dashboard/study-material', icon: <BookOpenCheck className="h-5 w-5" /> },
  { name: 'Classes', path: '/dashboard/classes', icon: <Video className="h-5 w-5" /> },
  { name: 'Current Affairs', path: '/dashboard/current-affairs', icon: <Rss className="h-5 w-5" /> },
  { name: 'Subscriptions', path: '/dashboard/subscriptions', icon: <DollarSign className="h-5 w-5" /> },
  { name: 'Doubt Forum', path: '/dashboard/doubt-forum', icon: <MessageSquare className="h-5 w-5" /> },
  { name: 'My Profile', path: '/dashboard/profile', icon: <User className="h-5 w-5" /> },
];

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // UI only
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode); // Basic toggle

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    toast({title: "Logged Out", description: "You have been successfully logged out."});
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
    <div className={`flex h-screen bg-gray-100 ${isDarkMode ? 'dark' : ''}`}>
      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        className="hidden md:flex flex-col bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 h-16 border-b dark:border-gray-700">
          <Link to="/dashboard" className={`flex items-center space-x-2 overflow-hidden whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
            <GraduationCap className="h-8 w-8 text-primary flex-shrink-0" />
            {isSidebarOpen && <span className="text-2xl font-bold text-gray-800 dark:text-white">MCQgram</span>}
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:block">
            {isSidebarOpen ? <BarChartHorizontalBig className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        <nav className="flex-grow p-2 space-y-1 overflow-y-auto no-scrollbar">
          {sidebarNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}
                ${!isSidebarOpen ? 'justify-center' : ''}`
              }
              title={item.name}
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-3">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t dark:border-gray-700">
          <Button variant="ghost" className={`w-full flex items-center ${!isSidebarOpen ? 'justify-center' : 'justify-start'} p-3`} onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-red-500" />
            {isSidebarOpen && <span className="ml-3 text-red-500">Logout</span>}
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
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={toggleMobileSidebar}
            />
            <motion.aside
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-4 h-16 border-b dark:border-gray-700">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">MCQgram</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={toggleMobileSidebar}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="flex-grow p-2 space-y-1 overflow-y-auto no-scrollbar">
                {sidebarNavItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={toggleMobileSidebar}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg text-sm font-medium transition-colors
                      ${isActive ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`
                    }
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t dark:border-gray-700">
                <Button variant="ghost" className="w-full flex items-center justify-start p-3" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 text-red-500" />
                  <span className="ml-3 text-red-500">Logout</span>
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-6 border-b dark:border-gray-700">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="md:hidden mr-2">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input type="search" placeholder="Search tests, materials..." className="pl-10 pr-4 py-2 h-10 w-64 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-600" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" title="Zoom Out">
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Zoom In">
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Change Language">
              <Languages className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} title={isDarkMode ? "Light Mode" : "Dark Mode"}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
             <Link to="/dashboard/subscriptions">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex border-primary text-primary hover:bg-primary/10">
                <DollarSign className="mr-2 h-4 w-4" /> Buy Subscription
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john.doe@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/edit-profile"><Edit3 className="mr-2 h-4 w-4" />Edit Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/subscriptions"><DollarSign className="mr-2 h-4 w-4" />Subscription</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-700/20">
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

export default DashboardLayout;
