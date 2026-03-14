import React from 'react';

export default function ScoreBar({ label, score, colorClass = "bg-primary" }) {
  return (
    <div className="flex items-center justify-between text-sm mb-1">
      <span className="text-text-muted w-24 truncate">{label}</span>
      <div className="flex-1 mx-2 h-2 bg-border rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-600 ease-out`} 
          style={{ width: `${score}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
      <span className="font-medium w-6 text-right">{score}</span>
    </div>
  );
}
