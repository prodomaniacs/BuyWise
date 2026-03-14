import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

export default function EdgeCaseHandler({ scenario, context, onAction }) {
  const scenarios = {
    'no_results': {
      headline: "Nothing matches all your criteria — but we're close",
      body: `The closest products need either ₹${context?.stretchAmount || 'X'} more or a slight compromise on ${context?.lowestPriority || 'your lowest priority'}. Here are your nearest matches:`,
      action: { label: "See closest matches", type: "show_stretch" },
      secondaryAction: { label: "Adjust my budget", type: "update_budget" },
      style: 'blocking'
    },
    'one_result': {
      headline: "One product fits your exact criteria",
      body: `The ${context?.productName || 'product'} is your only match at this budget. Here's an honest view — and two alternatives if you can stretch slightly.`,
      action: { label: "See honest assessment", type: "show_single" },
      style: 'blocking'
    },
    'budget_too_low': {
      headline: `Reliable ${context?.category || 'product'}s start a bit higher`,
      body: `Below ₹${context?.floor || 'X'}, you risk higher repair costs and shorter lifespan that outweigh the savings. The best option at the floor price is the ${context?.productName || 'product'} — here's why it's worth the stretch.`,
      action: { label: "Show me the floor option", type: "show_floor" },
      style: 'blocking'
    },
    'no_location_data': {
      headline: "We don't have data for that location",
      body: `Showing service network data for ${context?.nearestCity || 'the nearest major city'} instead. Update your city if this doesn't look right.`,
      action: { label: "Update my city", type: "update_city" },
      style: 'informational'
    },
    'no_voc_data': {
      headline: `No direct reviews found for ${context?.productName || 'this product'}`,
      body: `Showing sentiment for ${context?.fallbackProduct || 'the closest comparable model'}. Key differences between them are noted below.`,
      action: { label: "See fallback data", type: "show_fallback" },
      style: 'informational'
    },
    'conflicting_all_priorities': {
      headline: "Your priorities each point to a different product",
      body: "This is common when everything matters. Let's find your anchor priority and build from there.",
      action: { label: "Help me prioritise", type: "restart_intake" },
      style: 'blocking'
    },
    'budget_too_low_category': {
      headline: "Heads up on budget",
      body: `Just so you know: we'll show you the best options available, but you may see limited choices. Even ₹${context?.smallIncrement || 'X'} more unlocks significantly better products.`,
      action: { label: "Continue anyway", type: "continue" },
      secondaryAction: { label: "Adjust budget", type: "update_budget" },
      style: 'inline'
    }
  };

  const config = scenarios[scenario];
  if (!config) return null;

  if (config.style === 'informational') {
    return (
      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex gap-3 items-start">
        <Info className="text-warning shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-semibold text-warning-dark mb-1">{config.headline}</h4>
          <p className="text-sm text-text-muted mb-3">{config.body}</p>
          {config.action && (
            <button 
              onClick={() => onAction(config.action.type)}
              className="text-sm font-medium text-primary hover:underline"
            >
              {config.action.label}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (config.style === 'inline') {
    return (
      <div className="bg-surface border border-border rounded-lg p-4 flex gap-3 items-start relative">
        <AlertCircle className="text-primary shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-semibold text-text-primary mb-1">{config.headline}</h4>
          <p className="text-sm text-text-muted mb-3">{config.body}</p>
          <div className="flex gap-3">
            {config.action && (
              <button 
                onClick={() => onAction(config.action.type)}
                className="text-sm font-medium text-primary hover:underline"
              >
                {config.action.label}
              </button>
            )}
            {config.secondaryAction && (
              <button 
                onClick={() => onAction(config.secondaryAction.type)}
                className="text-sm font-medium text-text-muted hover:underline"
              >
                {config.secondaryAction.label}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // blocking
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center max-w-md mx-auto shadow-sm">
      <AlertCircle className="text-warning mx-auto mb-4" size={32} />
      <h3 className="text-xl font-bold text-text-primary mb-2">{config.headline}</h3>
      <p className="text-text-muted mb-6">{config.body}</p>
      <div className="flex flex-col gap-3">
        {config.action && (
          <button 
            onClick={() => onAction(config.action.type)}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {config.action.label}
          </button>
        )}
        {config.secondaryAction && (
          <button 
            onClick={() => onAction(config.secondaryAction.type)}
            className="w-full py-3 bg-surface text-text-primary border border-border rounded-lg font-medium hover:bg-border/50 transition-colors"
          >
            {config.secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
