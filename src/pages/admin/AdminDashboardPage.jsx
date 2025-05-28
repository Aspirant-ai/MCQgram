
import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, BarChart, Clock, AlertTriangle, Zap, BookOpenCheck } from 'lucide-react';

const StatCard = ({ title, value, icon, bgColor, iconColor, description }) => (
  <motion.div 
    className={`p-6 rounded-xl shadow-lg border ${bgColor} border-opacity-30 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`p-3 rounded-full ${bgColor} bg-opacity-20`}>
        {React.cloneElement(icon, { className: `h-7 w-7 ${iconColor}` })}
      </div>
      <span className={`text-3xl font-bold ${iconColor}`}>{value}</span>
    </div>
    <h3 className={`text-lg font-semibold mb-1 ${iconColor}`}>{title}</h3>
    <p className="text-xs text-gray-300">{description}</p>
  </motion.div>
);

const AdminDashboardPage = () => {
  // Placeholder data
  const stats = {
    totalUsers: 1250,
    activeTests: 15,
    totalQuestions: 5000,
    recentSignups: 42,
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-gray-100"
    >
      <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          icon={<Users />}
          bgColor="bg-blue-500"
          iconColor="text-blue-300"
          description="Registered users on the platform."
        />
        <StatCard 
          title="Active Tests" 
          value={stats.activeTests} 
          icon={<Zap />}
          bgColor="bg-green-500"
          iconColor="text-green-300"
          description="Live and available mock tests."
        />
        <StatCard 
          title="Question Bank" 
          value={stats.totalQuestions.toLocaleString()} 
          icon={<BookOpenCheck />}
          bgColor="bg-purple-500"
          iconColor="text-purple-300"
          description="Total questions across all exams."
        />
        <StatCard 
          title="Recent Signups (7d)" 
          value={stats.recentSignups} 
          icon={<Users />}
          bgColor="bg-yellow-500"
          iconColor="text-yellow-300"
          description="New users in the last week."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for Recent Activity Log */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between p-2 bg-gray-700 rounded-md">
              <span>New SSC CGL Test Added</span>
              <span className="text-xs text-gray-400">2 hours ago</span>
            </li>
            <li className="flex items-center justify-between p-2 bg-gray-700 rounded-md">
              <span>User 'Riya_02' completed IBPS PO Mock</span>
              <span className="text-xs text-gray-400">5 hours ago</span>
            </li>
             <li className="flex items-center justify-between p-2 bg-gray-700 rounded-md">
              <span>Admin 'Moderator1' updated Current Affairs</span>
              <span className="text-xs text-gray-400">1 day ago</span>
            </li>
          </ul>
        </div>

        {/* Placeholder for System Status */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">System Status</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Database Connection:</span>
              <span className="text-green-400 font-semibold">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">API Latency:</span>
              <span className="text-green-400">45ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Errors Last 24h:</span>
              <span className="text-yellow-400">3 Minor</span>
            </div>
             <div className="flex items-center justify-between">
              <span className="text-gray-300">Server Load:</span>
              <span className="text-green-400">25%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;
