import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'motion/react';

export default function Landing() {
  const { setCategory, navigate } = useAppContext();

  const categories = [
    { id: 'laptop', icon: '💻', name: 'Laptop', desc: 'Work, gaming, or college' },
    { id: 'phone', icon: '📱', name: 'Phone', desc: 'Camera, battery, or budget' },
    { id: 'ac', icon: '❄️', name: 'AC', desc: 'Right tonnage, lowest bills' },
    { id: 'mattress', icon: '🛏️', name: 'Mattress', desc: 'Back pain, heat, or value' }
  ];

  const handleSelect = (id) => {
    setCategory(id);
    navigate('intake');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface"
    >
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
          BuyRight<span className="text-primary">.</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">
          India's smartest buying advisor
        </h2>
        <p className="text-lg text-text-muted mb-12 max-w-xl mx-auto">
          Answer 6 questions. Get a recommendation you can trust — and defend to your family.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className="group flex items-center p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary transition-all duration-200 text-left"
            >
              <div className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-text-muted">{cat.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-medium text-text-muted mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-positive"></span>
            No affiliate links
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-positive"></span>
            No sponsored rankings
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-positive"></span>
            Scoring explained at every step
          </div>
        </div>

        <p className="text-xs text-text-muted/60">
          Helps avoid ₹8,000–₹40,000 in wrong purchase cost
        </p>
      </div>
    </motion.div>
  );
}
