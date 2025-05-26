
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Lock, Camera, Save } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const EditProfilePage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    avatarUrl: "https://github.com/shadcn.png",
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    // Placeholder for avatar upload logic
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, avatarUrl: event.target.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for profile update logic
    if (newPassword && newPassword !== confirmPassword) {
      toast({ title: "Password Mismatch", description: "New password and confirm password do not match.", variant: "destructive"});
      return;
    }
    console.log("Profile Data:", formData);
    if (newPassword) console.log("New Password:", newPassword);
    toast({ title: "Profile Updated", description: "Your profile details have been saved successfully."});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-2xl"
      >
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Edit Your Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-3 mb-8">
              <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2">
                <AvatarImage src={formData.avatarUrl} alt={formData.name} />
                <AvatarFallback>{formData.name.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" size="sm" className="relative">
                <Camera className="mr-2 h-4 w-4" /> Change Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
              </Button>
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="pl-10" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Change Password (Optional)</h2>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="newPassword" name="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-10" placeholder="Leave blank to keep current password"/>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" />
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-5 w-5" /> Save Changes
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfilePage;
