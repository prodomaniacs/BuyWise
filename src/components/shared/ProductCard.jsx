import React from 'react';
import { ChevronDown, ChevronUp, Check, MessageSquare, IndianRupee, Clock, MapPin, Store } from 'lucide-react';
import ScoreBar from './ScoreBar';
import ConfidenceIndicator from './ConfidenceIndicator';
import KnownIssues from './KnownIssues';
import { useAppContext } from '../../context/AppContext';

export default function ProductCard({ 
  product, 
  rank, 
  isSelected, 
  onSelect, 
  onDeselect, 
  isSelectionDisabled, 
  showExpanded,
  onToggleExpand
}) {
  const { navigate, setActiveCompareProduct, selectedForCompare, setSelectedForCompare } = useAppContext();

  const handleDeepDive = (screen) => {
    if (!selectedForCompare.includes(product.id)) {
      if (selectedForCompare.length < 4) {
        setSelectedForCompare([...selectedForCompare, product.id]);
      } else {
        // If max selected, just replace the first one or just navigate with this one active
        // For simplicity, let's just set it as active. The screens might need it to be in selectedForCompare though.
        // Let's just alert if they can't select more.
        alert("Please deselect a product first to compare this one.");
        return;
      }
    }
    setActiveCompareProduct(product.id);
    navigate(screen);
  };

  const isTop3 = rank <= 3;
  const rankColor = isTop3 ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border';
  
  let launchBadgeColor = 'bg-border text-text-muted';
  let launchBadgeText = `${product.launchYear} model`;
  if (product.launchYear >= 2023) {
    launchBadgeColor = 'bg-positive/10 text-positive';
  } else if (product.launchYear < 2022) {
    launchBadgeColor = 'bg-warning/10 text-warning';
    launchBadgeText = `Older model (${product.launchYear})`;
  }

  let scoreColor = 'text-primary';
  let scoreBarColor = 'bg-primary';
  let scoreLabel = '';
  if (product.totalScore >= 85) {
    scoreColor = 'text-positive';
    scoreBarColor = 'bg-positive';
  } else if (product.totalScore >= 70) {
    scoreColor = 'text-primary';
    scoreBarColor = 'bg-primary';
  } else if (product.totalScore >= 55) {
    scoreColor = 'text-warning';
    scoreBarColor = 'bg-warning';
  } else {
    scoreColor = 'text-warning';
    scoreBarColor = 'bg-warning';
    scoreLabel = 'Partial match';
  }

  const handleCheckboxChange = () => {
    if (isSelected) {
      onDeselect(product.id);
    } else if (!isSelectionDisabled) {
      onSelect(product.id);
    }
  };

  return (
    <div className={`bg-card rounded-xl border ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-border'} shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md relative`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3 items-start">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${rankColor} shrink-0`}>
              {rank}
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary leading-tight mb-1">{product.name}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-muted">{product.brand}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${launchBadgeColor}`}>
                  {launchBadgeText}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0 ml-4">
            <div className="text-lg font-bold text-text-primary">₹{product.price.toLocaleString()}</div>
            {product.isStretch && (
              <div className="text-xs font-medium text-warning mt-1">
                ₹{product.stretchAmount.toLocaleString()} over budget
              </div>
            )}
            <div className="text-xs text-text-muted mt-1">
              Price and availability may change — verify on platform before buying
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`text-4xl font-bold ${scoreColor}`}>{product.totalScore}</div>
              <div className="flex-1">
                <div className="h-2 w-full bg-border rounded-full overflow-hidden mb-1">
                  <div className={`h-full ${scoreBarColor} transition-all duration-600`} style={{ width: `${product.totalScore}%` }} />
                </div>
                {scoreLabel && <div className="text-xs font-medium text-warning">{scoreLabel}</div>}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <ConfidenceIndicator level={product.confidenceLevel} dataPoints={product.confidenceDataPoints} />
              {product.recencyPenaltyApplied && (
                <span className="px-2 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium">
                  Score adjusted — {product.recencyPenaltyReason}
                </span>
              )}
              <KnownIssues knownIssues={product.knownIssues} productName={product.name} variant="chip" />
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            <ScoreBar label="Pricing" score={product.scores.pricing} />
            <ScoreBar label="After-sales" score={product.scores.afterSalesSupport} />
            <ScoreBar label="Durability" score={product.scores.durability} />
            <ScoreBar label="Usage" score={product.scores.usageExperience} />
            <ScoreBar label="Running Cost" score={product.scores.runningCost} />
            <ScoreBar label="Reliability" score={product.scores.reliability} />
            <ScoreBar label="Ratings" score={product.scores.ratings} />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border">
          <button 
            onClick={onToggleExpand}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            aria-expanded={showExpanded}
          >
            Why this score?
            {showExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <label 
            className={`flex items-center gap-2 text-sm font-medium cursor-pointer group ${isSelectionDisabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isSelectionDisabled && !isSelected ? "Deselect a product to add this one" : ""}
          >
            <span className="text-text-muted group-hover:text-text-primary transition-colors">Compare</span>
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'border-text-muted bg-surface group-hover:border-primary'}`}>
              {isSelected && <Check size={14} strokeWidth={3} />}
            </div>
            <input 
              type="checkbox" 
              className="sr-only"
              checked={isSelected}
              onChange={handleCheckboxChange}
              disabled={isSelectionDisabled && !isSelected}
              aria-label={`Compare ${product.name}`}
            />
          </label>
        </div>
      </div>

      {showExpanded && (
        <div className="bg-surface p-5 border-t border-border animate-in slide-in-from-top-2 duration-200">
          <h4 className="font-semibold text-text-primary mb-4">Scoring Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(product.scoreBreakdown).map(([dim, data]) => {
              if (data.weight === 0) return null;
              const labels = {
                pricing: 'Pricing', afterSalesSupport: 'After-sales Support', durability: 'Durability',
                usageExperience: 'Usage Experience', runningCost: 'Running Cost', reliability: 'Reliability', ratings: 'Ratings'
              };
              return (
                <div key={dim} className="bg-card p-3 rounded-lg border border-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-text-primary text-sm">{labels[dim]}</span>
                    <span className="text-xs font-bold text-primary">{Math.round(data.contribution)} pts</span>
                  </div>
                  <p className="text-xs text-text-muted">{data.explanation}</p>
                </div>
              );
            })}
          </div>
          
          {product.recencyPenaltyApplied && (
            <div className="mb-4 bg-warning/5 border border-warning/20 p-3 rounded-lg text-sm">
              <span className="font-semibold text-warning-dark">Recency adjustment:</span> This is an older model. We've slightly reduced its reliability score as older inventory can sometimes have degraded components or shorter remaining software support.
            </div>
          )}

          {product.knownIssues.hasIssue && (
            <div className="mt-4">
              <KnownIssues knownIssues={product.knownIssues} productName={product.name} variant="card" />
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wider">Deep Dives</h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleDeepDive('voc')}
                className="px-3 py-1.5 bg-surface border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-border transition-colors flex items-center gap-1.5"
              >
                <MessageSquare size={14} /> Voice of Customer
              </button>
              <button 
                onClick={() => handleDeepDive('cost')}
                className="px-3 py-1.5 bg-surface border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-border transition-colors flex items-center gap-1.5"
              >
                <IndianRupee size={14} /> Ownership Cost
              </button>
              <button 
                onClick={() => handleDeepDive('timing')}
                className="px-3 py-1.5 bg-surface border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-border transition-colors flex items-center gap-1.5"
              >
                <Clock size={14} /> Buy Now or Wait
              </button>
              <button 
                onClick={() => handleDeepDive('location')}
                className="px-3 py-1.5 bg-surface border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-border transition-colors flex items-center gap-1.5"
              >
                <MapPin size={14} /> Location Intelligence
              </button>
              <button 
                onClick={() => handleDeepDive('store')}
                className="px-3 py-1.5 bg-surface border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-border transition-colors flex items-center gap-1.5"
              >
                <Store size={14} /> Store Locator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
