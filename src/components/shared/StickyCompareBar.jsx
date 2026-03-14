import React from 'react';
import { useAppContext } from '../../context/AppContext';

export default function StickyCompareBar() {
  const { selectedForCompare, setSelectedForCompare, navigate } = useAppContext();

  if (selectedForCompare.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-40 animate-in slide-in-from-bottom-full duration-300">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-text-primary">
            Compare selected ({selectedForCompare.length}/4)
          </span>
          <button 
            onClick={() => setSelectedForCompare([])}
            className="text-sm font-medium text-text-muted hover:text-negative transition-colors"
          >
            Clear selection
          </button>
        </div>
        
        <button
          onClick={() => navigate('compare')}
          disabled={selectedForCompare.length < 2}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            selectedForCompare.length >= 2 
              ? 'bg-primary text-white hover:bg-primary/90' 
              : 'bg-border text-text-muted cursor-not-allowed'
          }`}
        >
          {selectedForCompare.length < 2 ? 'Select at least 2 to compare' : 'Compare Now'}
        </button>
      </div>
    </div>
  );
}
