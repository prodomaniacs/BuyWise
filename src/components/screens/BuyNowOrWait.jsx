import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, TrendingDown, AlertCircle } from 'lucide-react';

export default function BuyNowOrWait() {
  const { scoredProducts, selectedForCompare, activeCompareProduct, setActiveCompareProduct, goBack, answers } = useAppContext();
  
  const products = selectedForCompare.map(id => scoredProducts.find(p => p.id === id)).filter(Boolean);
  
  useEffect(() => {
    if (!activeCompareProduct && products.length > 0) {
      setActiveCompareProduct(products[0].id);
    }
  }, [activeCompareProduct, products, setActiveCompareProduct]);

  if (products.length === 0) return null;

  const activeProduct = products.find(p => p.id === activeCompareProduct) || products[0];
  const timing = activeProduct.buyNowSignal;

  const signalColors = {
    'buy-now': 'bg-positive text-white border-positive',
    'consider-waiting': 'bg-warning text-white border-warning',
    'wait-price-drop': 'bg-negative text-white border-negative'
  };

  const signalLabels = {
    'buy-now': 'Buy Now',
    'consider-waiting': 'Consider Waiting',
    'wait-price-drop': 'Wait — Price Drop Likely'
  };

  return (
    <div className="min-h-screen bg-surface pb-24">
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-text-primary" aria-label="Go back">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-text-primary">Buy Now or Wait?</h1>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveCompareProduct(p.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCompareProduct === p.id 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-surface text-text-muted hover:bg-border/50 border border-border'
              }`}
            >
              {p.brand} {p.name.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Recommendation Card */}
            <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className={`p-6 md:p-8 ${signalColors[timing.signal].replace('text-white', 'text-white/90')} bg-opacity-10 border-b-4`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-sm ${signalColors[timing.signal]}`}>
                    {signalLabels[timing.signal]}
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-semibold text-text-primary leading-snug mb-6">
                  {timing.reason}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-lg border border-border shadow-sm">
                    <TrendingDown size={18} className="text-primary" />
                    <span className="text-sm font-medium text-text-primary">{timing.priceContext}</span>
                  </div>
                  {timing.modelCycleNote && (
                    <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-lg border border-border shadow-sm">
                      <Clock size={18} className="text-warning" />
                      <span className="text-sm font-medium text-text-primary">{timing.modelCycleNote}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sale Calendar Strip */}
              {!timing.urgencyOverride && (
                <div className="p-6 md:p-8 bg-surface">
                  <h3 className="text-lg font-bold text-text-primary mb-6">Upcoming Sale Events</h3>
                  <div className="relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 hidden sm:block"></div>
                    <div className="flex flex-col sm:flex-row justify-between gap-6 relative z-10">
                      {timing.nextSales.map((sale, idx) => (
                        <div key={idx} className="flex-1 bg-card border border-border rounded-xl p-4 shadow-sm text-center relative">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface border border-border text-xs font-bold px-2 py-0.5 rounded-full text-text-muted">
                            {sale.weeksAway} weeks
                          </div>
                          <div className="font-bold text-text-primary text-lg mt-2 mb-1">{sale.event}</div>
                          <div className="text-sm text-text-muted mb-3">Month {sale.month}</div>
                          <div className="inline-flex items-center justify-center px-3 py-1 bg-positive/10 text-positive rounded-full text-sm font-bold">
                            ~{sale.avgDropPercent}% drop
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {answers.buyingTimeline === 'just-exploring' && (
                    <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
                      <AlertCircle className="text-primary shrink-0 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-semibold text-primary mb-1">Set a mental target price</h4>
                        <p className="text-sm text-text-primary">
                          If you see it at ₹{Math.round(activeProduct.price * (1 - timing.nextSales[0].avgDropPercent/100)).toLocaleString()} or below, that's a good deal. No rush — here's what the price landscape looks like so you know when to pull the trigger.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
