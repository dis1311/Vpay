import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Business Owner",
      content: "Vpay has completely changed how I manage my bills. The voice commands are incredibly accurate and save me so much time every month.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
    },
    {
      name: "Priya Patel",
      role: "Freelancer",
      content: "I love the glassmorphism UI! It feels so premium. Plus, being able to pay just by speaking is like living in the future.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
    },
    {
      name: "Amit Kumar",
      role: "Senior Citizen",
      content: "As someone who finds typing difficult, Vpay is a blessing. I can pay my electricity and water bills without any help now.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Loved by users everywhere</h2>
          <p className="text-slate-600">Join thousands of people who have simplified their financial life with Vpay.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 hover:scale-105 transition-transform duration-300">
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-700 italic mb-8">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-slate-100" />
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
