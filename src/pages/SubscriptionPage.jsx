
import React, {useState} from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { CheckCircle, Sparkles, ShieldCheck, Star, Zap } from 'lucide-react';

const plans = [
  {
    name: "Weekly Pass",
    price: "₹99",
    duration: "/week",
    features: ["Access to All SSC Mock Tests", "Basic Analytics", "Email Support"],
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    textColor: "text-blue-700",
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    popular: false,
  },
  {
    name: "Monthly Pro",
    price: "₹299",
    duration: "/month",
    features: ["Access to All Exam Categories", "Advanced Analytics", "AI Performance Tips", "Priority Email Support"],
    bgColor: "bg-purple-50",
    borderColor: "border-purple-500",
    textColor: "text-purple-700",
    icon: <Star className="h-8 w-8 text-purple-600" />,
    popular: true,
  },
  {
    name: "Quarterly Saver",
    price: "₹799",
    duration: "/quarter",
    features: ["All Monthly Pro Features", "Doubt Forum Access", "Early Access to New Tests"],
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
    textColor: "text-green-700",
    icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
    popular: false,
  },
   {
    name: "Yearly Ultimate",
    price: "₹2499",
    duration: "/year",
    features: ["All Quarterly Saver Features", "Live Test Series Included", "Personalized Study Plan (AI)", "PDF Downloads"],
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-700",
    icon: <Sparkles className="h-8 w-8 text-yellow-600" />,
    popular: false,
  }
];

const SubscriptionPage = () => {
  const [couponCode, setCouponCode] = useState('');

  const handleSubscribe = (planName) => {
    // Placeholder for Stripe integration or other payment processing
    alert(`Subscribing to ${planName}. Coupon: ${couponCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-5xl"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">Unlock premium features and accelerate your exam preparation with MCQgram.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`rounded-xl shadow-xl border-2 p-6 flex flex-col relative overflow-hidden hover:shadow-2xl transition-shadow ${plan.bgColor} ${plan.borderColor}`}
            >
              {plan.popular && (
                <div className="absolute top-0 -right-10 transform rotate-45 bg-primary text-white text-xs font-semibold py-1 px-10">
                  Popular
                </div>
              )}
              <div className="mb-6 text-center">
                <div className="inline-block p-3 bg-white rounded-full shadow-md mb-3">{plan.icon}</div>
                <h2 className={`text-2xl font-semibold ${plan.textColor}`}>{plan.name}</h2>
                <p className="text-4xl font-bold text-gray-800 mt-2">{plan.price}<span className="text-base font-normal text-gray-500">{plan.duration}</span></p>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <CheckCircle className={`h-5 w-5 ${plan.textColor} mr-2 flex-shrink-0`} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleSubscribe(plan.name)} 
                className={`w-full mt-auto ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-gray-700 hover:bg-gray-800'} text-white`}
              >
                Choose Plan
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-lg mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Have a Coupon Code?</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input 
              type="text" 
              placeholder="Enter coupon code" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={() => alert(`Applying coupon: ${couponCode}`)}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            >
              Apply Coupon
            </Button>
          </div>
          {couponCode && <p className="text-xs text-gray-500 mt-2 text-center">Coupon "{couponCode}" will be applied at checkout.</p>}
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionPage;
