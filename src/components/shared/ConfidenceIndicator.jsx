import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

export default function ConfidenceIndicator({ level, dataPoints }) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef(null);

  const colors = {
    high: 'bg-positive text-white',
    moderate: 'bg-warning text-white',
    limited: 'bg-negative text-white'
  };

  const labels = {
    high: 'High confidence',
    moderate: 'Moderate confidence',
    limited: 'Limited data'
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tooltipRef]);

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}
        aria-label={`Confidence level: ${labels[level]}. Tap for details.`}
      >
        {level === 'limited' && <Info size={12} />}
        {labels[level]}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 p-3 bg-card border border-border rounded-lg shadow-lg text-sm text-text-primary left-0 md:left-auto md:right-0">
          <p className="font-semibold mb-2">Score based on:</p>
          <ul className="list-disc pl-4 space-y-1 text-text-muted mb-2">
            <li>{dataPoints} aggregated reviews & threads</li>
            <li>Local service data: Available</li>
          </ul>
          {level === 'limited' && (
            <p className="text-negative text-xs mt-2 border-t border-border pt-2">
              This recommendation is directionally accurate but verify independently before buying.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
