import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { detectConflicts } from '../../logic/conflictDetector';
import ProgressBar from '../shared/ProgressBar';

export default function Intake() {
  const { category, answers, setAnswers, setConflicts, navigate, goBack } = useAppContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        const { hasConflicts, conflicts } = detectConflicts(category, answers);
        setConflicts(conflicts);
        setLoading(false);
        if (hasConflicts) {
          navigate('conflictResolution');
        } else {
          navigate('results');
        }
      }, 600);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      goBack();
    }
  };

  const updateAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">What's your budget?</h2>
            <input 
              type="range" 
              min="20000" max="100000" step="1000"
              value={answers.budget || 45000}
              onChange={(e) => updateAnswer('budget', parseInt(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">₹{(answers.budget || 45000).toLocaleString()}</span>
              <p className="text-sm text-text-muted mt-2">or ₹{Math.round((answers.budget || 45000) / 12).toLocaleString()}/month on 12-month no-cost EMI</p>
            </div>
            {(answers.budget || 45000) <= 25000 && (
              <p className="text-sm text-warning bg-warning/10 p-3 rounded-lg border border-warning/20">
                Products at this budget may have limited options. We'll show you the best available and what a small stretch unlocks.
              </p>
            )}
            <button onClick={handleNext} className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">Next</button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">Primary use case</h2>
            {['Bedroom cooling', 'Hall or living room', 'Office or commercial', 'Multiple rooms on one unit'].map(opt => (
              <button
                key={opt}
                onClick={() => { updateAnswer('useCase', opt); handleNext(); }}
                className={`w-full p-4 text-left border rounded-xl transition-all duration-200 ${answers.useCase === opt ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}
              >
                <span className="font-medium text-text-primary">{opt}</span>
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">Who are you buying for?</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Self', 'Parents', 'Office', 'Gift'].map(opt => (
                <button
                  key={opt}
                  onClick={() => { updateAnswer('buyingFor', opt.toLowerCase()); handleNext(); }}
                  className={`p-6 text-center border rounded-xl transition-all duration-200 ${answers.buyingFor === opt.toLowerCase() ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}
                >
                  <span className="font-semibold text-lg text-text-primary">{opt}</span>
                </button>
              ))}
            </div>
            {answers.buyingFor === 'parents' && (
              <p className="text-sm text-text-muted mt-4 bg-surface p-3 rounded-lg border border-border">
                Buying for parents shifts our scoring toward durability and service quality — the things that matter most when you're not there to troubleshoot.
              </p>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">Which city are you in?</h2>
            <select
              value={answers.city || ''}
              onChange={(e) => updateAnswer('city', e.target.value)}
              className="w-full p-4 border border-border rounded-xl bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="" disabled>Select a city</option>
              {['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Lucknow'].map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
              <option value="other">My city isn't listed</option>
            </select>
            {answers.city === 'other' && (
              <input 
                type="text" 
                placeholder="Enter pincode" 
                className="w-full p-4 border border-border rounded-xl bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                onChange={(e) => updateAnswer('city', 'unknown')}
              />
            )}
            <button 
              onClick={handleNext} 
              disabled={!answers.city}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${answers.city ? 'bg-primary text-white hover:bg-primary/90' : 'bg-border text-text-muted cursor-not-allowed'}`}
            >
              Next
            </button>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">When are you buying?</h2>
            {['This week', 'Within this month', 'In 2-3 months', 'Just exploring'].map(opt => (
              <button
                key={opt}
                onClick={() => { updateAnswer('buyingTimeline', opt.toLowerCase().replace(/ /g, '-')); handleNext(); }}
                className={`w-full p-4 text-left border rounded-xl transition-all duration-200 ${answers.buyingTimeline === opt.toLowerCase().replace(/ /g, '-') ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}
              >
                <span className="font-medium text-text-primary">{opt}</span>
              </button>
            ))}
            {answers.buyingTimeline === 'just-exploring' && (
              <p className="text-sm text-text-muted mt-4 bg-surface p-3 rounded-lg border border-border">
                No problem. We'll still give you a full recommendation so you know exactly what to look for when the time comes.
              </p>
            )}
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">Brand preferences (Optional)</h2>
            <p className="text-sm text-text-muted">This won't override the score — it just breaks ties.</p>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Brands I trust</label>
              <div className="flex flex-wrap gap-2">
                {['Daikin', 'LG', 'Voltas', 'Samsung', 'Blue Star'].map(brand => (
                  <button
                    key={brand}
                    onClick={() => {
                      const current = answers.brandPreference || [];
                      const updated = current.includes(brand) ? current.filter(b => b !== brand) : [...current, brand];
                      updateAnswer('brandPreference', updated);
                    }}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${answers.brandPreference?.includes(brand) ? 'bg-primary text-white border-primary' : 'bg-surface text-text-primary border-border hover:border-primary/50'}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Brands I want to avoid</label>
              <div className="flex flex-wrap gap-2">
                {['Hitachi', 'Carrier', 'Panasonic', 'Godrej', 'Whirlpool'].map(brand => (
                  <button
                    key={brand}
                    onClick={() => {
                      const current = answers.brandAvoid || [];
                      const updated = current.includes(brand) ? current.filter(b => b !== brand) : [...current, brand];
                      updateAnswer('brandAvoid', updated);
                    }}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${answers.brandAvoid?.includes(brand) ? 'bg-negative text-white border-negative' : 'bg-surface text-text-primary border-border hover:border-negative/50'}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleNext} className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Show my recommendations
              </button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-text-primary">Analysing your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="p-4 flex items-center gap-4 bg-card border-b border-border sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-text-primary" aria-label="Go back">
          ← Back
        </button>
        <div className="flex-1">
          <ProgressBar current={step} total={6} />
        </div>
        <span className="text-sm font-medium text-text-muted w-12 text-right">{step} / 6</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
