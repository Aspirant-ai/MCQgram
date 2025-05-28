
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Award, BarChart2, CheckCircle2, Users, TrendingUp, ShieldCheck, MessageSquare as MessageSquareQuote, Sparkles, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserAttempts } from '@/lib/data/userAttempts'; 

const MotionDiv = motion.div;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

const testimonials = [
  {
    quote: "MCQgram transformed my preparation. The mock tests are so realistic!",
    name: "Priya Sharma",
    role: "SSC CGL Aspirant",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=50&q=60"
  },
  {
    quote: "The detailed analytics helped me identify my weak areas. Highly recommend!",
    name: "Rohan Singh",
    role: "Banking Aspirant",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=50&q=60"
  },
  {
    quote: "I love the variety of exams available. It's a one-stop solution for competitive exams.",
    name: "Aisha Khan",
    role: "Railway Exam Aspirant",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=50&q=60"
  }
];

const updates = [
  { 
    title: "New RRB NTPC Mock Tests Added!", 
    date: "2025-05-20", 
    description: "Fresh set of RRB NTPC mock tests based on the latest pattern are now live. Sharpen your skills!" 
  },
  { 
    title: "Advanced Analytics Dashboard Launch", 
    date: "2025-05-15", 
    description: "Explore our new analytics dashboard with deeper insights into your performance. Track progress like never before." 
  },
  { 
    title: "Mobile App Coming Soon!", 
    date: "2025-05-10", 
    description: "Get ready to practice on the go! The MCQgram mobile app is under development and launching soon." 
  }
];

const HeroSection = () => (
  <section className="gradient-bg text-white py-16 md:py-24">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <MotionDiv
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ace Your Competitive Exams with <span className="text-yellow-300">MCQgram</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Practice with realistic mock tests for SSC, Banking, Railway, and other competitive exams. Track your progress and improve your scores with MCQgram.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
              asChild
            >
              <Link to="/login"> {/* Changed from /categories to /login */}
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" // Changed from default to outline
              className="border-white text-white hover:bg-white/10 focus:bg-white/10 focus:text-white"
              asChild
            >
              <Link to="/dashboard/categories"> {/* Assuming login first */}
                Explore Exams
              </Link>
            </Button>
          </div>
        </MotionDiv>
        <MotionDiv
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:block"
        >
          <div className="glass-card rounded-xl p-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500 rounded-full opacity-20"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500 rounded-full opacity-20"></div>
            <img  alt="Students preparing for competitive exams on MCQgram" className="rounded-lg w-full" src="https://images.unsplash.com/photo-1620837913485-75ec3d6fea99" />
          </div>
        </MotionDiv>
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, bgColor, iconColor, title, description }) => (
  <MotionDiv variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className={`${bgColor} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
      <Icon className={`h-6 w-6 ${iconColor}`} />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </MotionDiv>
);

const FeaturesSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Why Choose <span className="text-primary">MCQgram</span>?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our platform is designed to help you prepare effectively for competitive exams with realistic mock tests and comprehensive analytics.
        </p>
      </MotionDiv>

      <MotionDiv 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        <FeatureCard icon={BookOpen} bgColor="bg-blue-100" iconColor="text-blue-600" title="Diverse Exam Categories" description="Practice with mock tests for SSC, Banking, Railway, and other competitive exams all in one place." />
        <FeatureCard icon={Clock} bgColor="bg-purple-100" iconColor="text-purple-600" title="Timed Mock Tests" description="Experience real exam conditions with timed tests that simulate the actual exam environment." />
        <FeatureCard icon={BarChart2} bgColor="bg-green-100" iconColor="text-green-600" title="Detailed Analytics" description="Get comprehensive performance reports to identify your strengths and areas for improvement." />
        <FeatureCard icon={TrendingUp} bgColor="bg-yellow-100" iconColor="text-yellow-600" title="AI Performance Tips" description="Leverage AI-powered insights to understand your performance and get personalized study suggestions." />
      </MotionDiv>
    </div>
  </section>
);

const TestimonialCard = ({ quote, name, role, image }) => (
  <MotionDiv
    variants={itemVariants}
    className="bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-200"
  >
    <MessageSquareQuote className="h-8 w-8 text-primary mb-4" />
    <p className="text-gray-700 italic mb-6">"{quote}"</p>
    <div className="flex items-center">
      <img  alt={name} className="w-10 h-10 rounded-full mr-3 object-cover" src={image} />
      <div>
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </MotionDiv>
);

const TestimonialsSection = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hear from students who have successfully used MCQgram for their exam preparation.
        </p>
      </MotionDiv>
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </MotionDiv>
    </div>
  </section>
);

const UpdateCard = ({ title, date, description }) => (
  <MotionDiv
    variants={itemVariants}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
  >
    <div className="flex items-center mb-3">
      <Sparkles className="h-6 w-6 text-yellow-500 mr-3" />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-xs text-gray-500 mb-3">{date}</p>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    {/* Removed Link to /updates, as it might not exist in dashboard context */}
    {/* <Link to="/updates" className="text-primary font-medium text-sm hover:underline flex items-center">
      Read More <ArrowRight className="ml-1 h-3 w-3" />
    </Link> */}
  </MotionDiv>
);

const WhatsNewSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Latest Updates from <span className="text-primary">MCQgram</span></h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay informed about new features, tests, and improvements on our platform.
        </p>
      </MotionDiv>
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {updates.map((update, index) => (
          <UpdateCard key={index} {...update} />
        ))}
      </MotionDiv>
    </div>
  </section>
);


const CallToActionSection = () => (
  <section className="py-16 bg-gray-900 text-white">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Exam Preparation?</h2>
          <p className="text-gray-300 mb-8">
            Start practicing with MCQgram today and take a step closer to achieving your goals.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            asChild
          >
            <Link to="/login"> {/* Changed from /categories to /login */}
              Join MCQgram Now <CheckCircle2 className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </MotionDiv>
      </div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <WhatsNewSection />
      {/* RecentActivitySection removed from public homepage to avoid data fetching before login */}
      <CallToActionSection />
    </div>
  );
};

export default HomePage;
