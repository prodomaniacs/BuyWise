import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { resolveConflict } from '../../logic/conflictDetector';

export default function ConflictResolution() {
  const { conflicts, answers, setAnswers, navigate } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const currentConflict = conflicts[currentIndex];

  const handleChoice = (choice) => {
    const updatedResolutions = {
      ...answers.conflictResolutions,
      [currentConflict.id]: choice
    };
    setAnswers({ ...answers, conflictResolutions: updatedResolutions });

    if (currentIndex < conflicts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate('results');
      }, 600);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-text-primary">Adjusting your recommendations...</p>
        </div>
      </div>
    );
  }

  if (!currentConflict) return null;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="p-4 flex items-center gap-4 bg-card border-b border-border sticky top-0 z-10">
        <div className="flex-1 text-center font-semibold text-text-primary">
          Let's make sure we find the right fit
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-card border-l-4 border-warning rounded-r-xl shadow-md p-6 md:p-8"
            >
              <h2 className="text-xl font-bold text-text-primary mb-3">
                Your priorities are pulling in a few directions.
              </h2>
              <p className="text-text-muted mb-8 text-lg">
                {currentConflict.explanation}
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleChoice('choice1')}
                  className="w-full p-4 text-left border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                >
                  <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                    {currentConflict.choice1Label}
                  </span>
                </button>
                
                <button
                  onClick={() => handleChoice('choice2')}
                  className="w-full p-4 text-left border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                >
                  <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                    {currentConflict.choice2Label}
                  </span>
                </button>

                <button
                  onClick={() => handleChoice('balanced')}
                  className="w-full p-4 text-center text-sm font-medium text-text-muted hover:text-primary transition-colors mt-4"
                >
                  Show me the best compromise
                </button>
              </div>

              {conflicts.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {conflicts.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-primary' : 'bg-border'}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
