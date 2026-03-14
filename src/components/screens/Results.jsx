import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'motion/react';
import { scoreProducts } from '../../logic/scoringEngine';
import ProductCard from '../shared/ProductCard';
import EdgeCaseHandler from '../shared/EdgeCaseHandler';
import StickyCompareBar from '../shared/StickyCompareBar';
import productsData from '../../data/products.json';

export default function Results() {
  const { 
    category, answers, scoredProducts, setScoredProducts, 
    selectedForCompare, setSelectedForCompare,
    expandedCards, setExpandedCards, navigate, goBack
  } = useAppContext();

  useEffect(() => {
    if (category && answers && scoredProducts.length === 0) {
      const results = scoreProducts(category, answers, productsData.products, answers.conflictResolutions);
      setScoredProducts(results);
    }
  }, [category, answers, scoredProducts, setScoredProducts]);

  const handleSelect = (id) => {
    if (selectedForCompare.length < 4) {
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const handleDeselect = (id) => {
    setSelectedForCompare(selectedForCompare.filter(pid => pid !== id));
  };

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (scoredProducts.length === 0) {
    return (
      <div className="min-h-screen bg-surface p-6">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={goBack} className="p-2 hover:bg-card rounded-full transition-colors text-text-muted hover:text-text-primary">
            ← Back
          </button>
        </header>
        <EdgeCaseHandler 
          scenario="no_results" 
          context={{ stretchAmount: 5000, lowestPriority: 'brand preference' }}
          onAction={(type) => {
            if (type === 'update_budget') navigate('intake');
          }}
        />
      </div>
    );
  }

  const isSelectionDisabled = selectedForCompare.length >= 4;

  return (
    <div className="min-h-screen bg-surface pb-24">
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 -ml-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-text-primary" aria-label="Go back">
              ← Back
            </button>
            <h1 className="text-xl font-bold text-text-primary">Your top {scoredProducts.length} picks</h1>
          </div>
          <button onClick={() => navigate('landing')} className="text-sm font-medium text-primary hover:underline">
            Start over
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-text-primary text-lg font-medium mb-2">
            Scoring weighted toward after-sales support and running cost because you're buying for {answers.buyingFor} in {answers.city || 'your city'}.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span className="w-2 h-2 rounded-full bg-positive"></span>
            No affiliate links — scored on your priorities only
          </div>
        </div>

        {scoredProducts.length < 10 && scoredProducts.length >= 4 && (
          <div className="mb-6">
            <EdgeCaseHandler 
              scenario="budget_too_low_category"
              context={{ smallIncrement: 5000 }}
              onAction={(type) => {
                if (type === 'update_budget') navigate('intake');
              }}
            />
          </div>
        )}

        <div className="space-y-6">
          {scoredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                rank={index + 1}
                isSelected={selectedForCompare.includes(product.id)}
                onSelect={handleSelect}
                onDeselect={handleDeselect}
                isSelectionDisabled={isSelectionDisabled}
                showExpanded={expandedCards[product.id]}
                onToggleExpand={() => toggleExpand(product.id)}
              />
            </motion.div>
          ))}
        </div>
      </main>

      <StickyCompareBar />
    </div>
  );
}
