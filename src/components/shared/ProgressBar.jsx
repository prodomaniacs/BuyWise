import React from 'react';

export default function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full h-1 bg-border rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin="1"
        aria-valuemax={total}
      />
    </div>
  );
}
