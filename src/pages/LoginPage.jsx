
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Key, LogIn, UserPlus, GraduationCap } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studentEmail, setStudentEmail] = useState('student@mcqgram.com');
  const [studentPassword, setStudentPassword] = useState('student123');
  const [adminEmail, setAdminEmail] = useState('admin@mcqgram.com');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const handleStudentLogin = (e) => {
    e.preventDefault();
    // Dummy login logic
    if (studentEmail === 'student@mcqgram.com' && studentPassword === 'student123') {
      localStorage.setItem('userRole', 'student'); // Set role
      toast({ title: "Login Successful", description: "Welcome back, student!" });
      navigate('/dashboard');
    } else {
      toast({ title: "Login Failed", description: "Invalid student credentials.", variant: "destructive" });
    }
  };
  
  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Dummy admin login
    if (adminEmail === "admin@mcqgram.com" && adminPassword === "admin123") {
      localStorage.setItem('userRole', 'admin'); // Set role
      toast({ title: "Admin Login Successful", description: "Welcome, Admin!" });
      navigate('/admin/dashboard');
    } else {
      toast({ title: "Admin Login Failed", description: "Invalid admin credentials.", variant: "destructive" });
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-primary">MCQgram</span>
          </Link>
          <p className="text-gray-600">Please login or register to continue</p>
        </div>

        <Tabs defaultValue="student-login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="student-login">Student</TabsTrigger>
            <TabsTrigger value="admin-login">Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="student-login">
            <form onSubmit={handleStudentLogin} className="space-y-6">
              <div>
                <Label htmlFor="student-email">Email</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    id="student-email" 
                    type="email" 
                    placeholder="you@example.com" 
                    className="pl-10" 
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="student-password">Password</Label>
                <div className="relative mt-1">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    id="student-password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10" 
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <Link to="#" className="font-medium text-primary hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-5 w-5" /> Login as Student
              </Button>
              <p className="text-center text-sm text-gray-600">
                Don't have an account? <Link to="#" className="font-medium text-primary hover:underline">Register here <UserPlus className="inline ml-1 h-4 w-4"/></Link>
              </p>
            </form>
          </TabsContent>
          <TabsContent value="admin-login">
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <Label htmlFor="admin-email">Admin Email</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    id="admin-email" 
                    type="email" 
                    placeholder="admin@mcqgram.com" 
                    className="pl-10" 
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="admin-password">Admin Password</Label>
                 <div className="relative mt-1">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    id="admin-password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">
                <LogIn className="mr-2 h-5 w-5" /> Login as Admin
              </Button>
            </form>
          </TabsContent>
        </Tabs>
         <p className="text-center text-xs text-gray-500 mt-6">
          <Link to="/" className="hover:underline">Back to Homepage</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
