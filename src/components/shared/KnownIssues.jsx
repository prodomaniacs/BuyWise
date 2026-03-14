import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

export default function KnownIssues({ knownIssues, productName, variant = 'chip' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!knownIssues) return null;

  if (variant === 'chip') {
    if (!knownIssues.hasIssue) return null;
    return (
      <>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warning/10 text-warning border border-warning/20 rounded-full text-xs font-medium hover:bg-warning/20 transition-colors"
        >
          <AlertTriangle size={14} />
          Known issue — tap to see
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h3 className="font-semibold text-lg">Known Issue Report</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-surface rounded-full text-text-muted">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <KnownIssues knownIssues={knownIssues} productName={productName} variant="card" />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (variant === 'card') {
    if (knownIssues.hasIssue) {
      return (
        <div className="border-l-4 border-warning bg-warning/5 rounded-r-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-warning shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Known issue reported</h4>
              <p className="text-sm text-text-primary mb-3">{knownIssues.issue}</p>
              
              <div className="space-y-2 text-sm text-text-muted mb-4">
                <p><span className="font-medium text-text-primary">Affected batches:</span> {knownIssues.affectedBatches}</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    knownIssues.status === 'resolved' ? 'bg-positive/10 text-positive' :
                    knownIssues.status === 'monitoring' ? 'bg-warning/10 text-warning' :
                    'bg-negative/10 text-negative'
                  }`}>
                    {knownIssues.status === 'resolved' ? 'Resolved in current batch' :
                     knownIssues.status === 'monitoring' ? 'Under monitoring' :
                     'Ongoing — verify before buying'}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-text-muted mb-3">Source: {knownIssues.sourceNote}</p>
              <p className="text-sm italic text-text-primary bg-surface p-3 rounded-md border border-border">
                {knownIssues.actionAdvice}
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="border-l-4 border-positive bg-positive/5 rounded-r-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-positive shrink-0" size={20} />
            <p className="text-sm font-medium text-text-primary">
              No widespread issues reported for current production batch as of Nov 2024.
            </p>
          </div>
        </div>
      );
    }
  }

  return null;
}
