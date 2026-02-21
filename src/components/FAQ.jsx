import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const faqs = [
    {
      question: "Is Vpay secure?",
      answer: "Absolutely. We use industry-standard JWT encryption and secure password hashing. Your voice data is processed locally whenever possible, and we never store sensitive payment information without your consent."
    },
    {
      question: "Which languages does Vpay support?",
      answer: "Currently, we support English and Hindi for voice commands. We are actively working on adding more regional languages to make Vpay accessible to everyone."
    },
    {
      question: "How do I add money to my wallet?",
      answer: "You can add money using any UPI app, Debit/Credit cards, or Net Banking. Just click on the 'Add Money' button in your dashboard."
    },
    {
      question: "What if the voice command is misinterpreted?",
      answer: "Vpay always shows a confirmation preview before initiating any payment. You can verify the amount and biller details before the transaction is processed."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-600">Everything you need to know about Vpay.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-800">{faq.question}</span>
                {activeIndex === i ? (
                  <Minus className="w-5 h-5 text-indigo-600" />
                ) : (
                  <Plus className="w-5 h-5 text-slate-400" />
                )}
              </button>
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
