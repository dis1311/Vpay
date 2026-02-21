import React from 'react';
import { UserPlus, Globe, Mic, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus className="w-6 h-6 text-white" />,
      title: "Login",
      description: "Create your account or login securely",
      color: "bg-indigo-600"
    },
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "Select Language",
      description: "Choose your preferred language",
      color: "bg-emerald-500"
    },
    {
      icon: <Mic className="w-6 h-6 text-white" />,
      title: "Speak Command",
      description: "Say \"Pay electricity bill 500 rupees\"",
      color: "bg-blue-500"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      title: "Done!",
      description: "Payment processed instantly",
      color: "bg-green-500"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">
            Four simple steps to complete any payment
          </p>
        </div>
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300 z-10 border-4 border-white`}>
                  {step.icon}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm w-full h-full border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-sm font-bold text-indigo-600 mb-2">Step {index + 1}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-20 text-center bg-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
          
          <h3 className="text-3xl font-bold mb-6 relative z-10">Ready to Simplify Your Payments?</h3>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto relative z-10">
            Join thousands of users who are paying bills with just their voice. It's fast, secure, and easier than ever.
          </p>
          <Link to="/signup" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg relative z-10">
            Get Started Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
