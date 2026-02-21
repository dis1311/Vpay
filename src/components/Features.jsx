import React from 'react';
import { Mic, Languages, Shield, Smartphone } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Mic className="w-8 h-8 text-indigo-600" />,
      title: "Voice Control",
      description: "Simply speak to pay your electricity, water bills, and mobile recharges. No typing required."
    },
    {
      icon: <Languages className="w-8 h-8 text-emerald-500" />,
      title: "Multiple Languages",
      description: "Supports Hindi, Tamil, Telugu, Bengali, Marathi, and Gujarati for your convenience."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Secure & Easy",
      description: "Bank-level security with a simple interface designed for everyone, even smartphone beginners."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Vpay?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of payments with our voice-first technology designed for simplicity and security.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow bg-white group hover:-translate-y-1 duration-300">
              <div className="mb-6 p-4 bg-gray-50 rounded-xl inline-block group-hover:bg-indigo-50 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
