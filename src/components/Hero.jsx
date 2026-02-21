import React, { useState } from 'react';
import { Mic, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  const { user } = useAuth();

  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-indigo-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-8 animate-fade-in-up">
            <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
              Voice-First Payment Solution
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Pay Bills Using <span className="text-indigo-600">Your Voice</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              Vpay makes bill payments simple and accessible for everyone. Just speak your payment commands in your language - no typing needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link to="/dashboard" className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                </Link>
              ) : (
                <Link to="/signup" className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200">
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <button
                onClick={() => setDemoOpen(true)}
                className="flex items-center justify-center space-x-2 bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all"
              >
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 max-w-sm mx-auto transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Mic className="text-indigo-600 w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Balance</div>
                  <div className="font-bold text-gray-800">₹2,500.00</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">Listening...</div>
                  <div className="text-lg font-medium text-gray-800">"Pay electricity bill 500 rupees"</div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {demoOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-3xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <div className="font-bold text-gray-900">Vpay Demo</div>
              <button
                onClick={() => setDemoOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/ysz5S6PUM-U"
                title="Vpay Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
