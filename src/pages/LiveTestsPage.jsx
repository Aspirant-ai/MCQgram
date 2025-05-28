
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockLiveTests = [
  {
    id: "live-ssc-cgl-weekly-1",
    name: "SSC CGL Weekly Challenge #1",
    examCategory: "SSC CGL",
    startTime: "2025-05-25 10:00 AM",
    duration: "60 Mins",
    participants: 1200,
    status: "Upcoming"
  },
  {
    id: "live-ibps-po-daily-5",
    name: "IBPS PO Daily Sprint #5",
    examCategory: "IBPS PO",
    startTime: "2025-05-23 06:00 PM",
    duration: "30 Mins",
    participants: 850,
    status: "Ongoing"
  },
  {
    id: "live-rrb-ntpc-mock-3",
    name: "RRB NTPC Full Mock #3",
    examCategory: "RRB NTPC",
    startTime: "2025-05-20 02:00 PM",
    duration: "90 Mins",
    participants: 1500,
    status: "Completed"
  }
];

const LiveTestsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-4xl"
      >
        <div className="text-center mb-12">
          <Zap className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Live Mock Tests</h1>
          <p className="text-lg text-gray-600">Compete with aspirants across the country in real-time mock tests.</p>
        </div>

        <div className="space-y-6">
          {mockLiveTests.map((test) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-primary mb-1">{test.name}</h2>
                  <p className="text-sm text-gray-500">{test.examCategory}</p>
                </div>
                <span 
                  className={`mt-2 sm:mt-0 text-xs font-semibold py-1 px-3 rounded-full
                    ${test.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 
                      test.status === 'Ongoing' ? 'bg-green-100 text-green-700 animate-pulse' : 
                      'bg-gray-100 text-gray-700'}`}
                >
                  {test.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{test.startTime}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{test.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{test.participants.toLocaleString()} Participants</span>
                </div>
              </div>
              
              {test.status === 'Upcoming' && (
                <Button className="w-full sm:w-auto" onClick={() => alert(`Registering for ${test.name}`)}>
                  Register Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {test.status === 'Ongoing' && (
                <Button asChild className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  <Link to={`/test/live/${test.id}`}>
                    Join Test Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              {test.status === 'Completed' && (
                 <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link to={`/result/live/${test.id}`}>
                    View Result <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </motion.div>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-10 text-sm">
          More live tests are scheduled regularly. Keep checking this page!
        </p>
      </motion.div>
    </div>
  );
};

export default LiveTestsPage;
