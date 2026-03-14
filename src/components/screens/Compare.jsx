import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export default function Compare() {
  const { scoredProducts, selectedForCompare, navigate, goBack, setActiveCompareProduct } = useAppContext();

  const products = selectedForCompare.map(id => scoredProducts.find(p => p.id === id)).filter(Boolean);

  if (products.length < 2) {
    return (
      <div className="min-h-screen bg-surface p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Not enough products selected</h2>
        <button onClick={goBack} className="text-primary font-medium hover:underline">
          Go back and select more
        </button>
      </div>
    );
  }

  const topScorer = products.reduce((prev, current) => (prev.totalScore > current.totalScore) ? prev : current);

  const renderCell = (product, value, isBest = false, isWorst = false) => {
    let bgColor = 'bg-card';
    if (isBest) bgColor = 'bg-positive/10 font-semibold text-positive';
    if (isWorst) bgColor = 'bg-negative/10 text-negative';

    return (
      <td key={product.id} className={`p-4 border-b border-r border-border text-center ${bgColor}`}>
        {value || '—'}
      </td>
    );
  };

  const handleGoDeeper = (id) => {
    setActiveCompareProduct(id);
    navigate('voiceOfCustomer');
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 -ml-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-text-primary" aria-label="Go back">
              ← Back
            </button>
            <h1 className="text-xl font-bold text-text-primary">Compare Top {products.length}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 overflow-x-auto">
        <table className="w-full border-collapse bg-card rounded-xl shadow-sm border border-border overflow-hidden min-w-[800px]">
          <thead className="bg-surface sticky top-0 z-20">
            <tr>
              <th className="p-4 border-b border-r border-border text-left w-48 font-semibold text-text-muted">
                Overview
              </th>
              {products.map(p => (
                <th key={p.id} className="p-4 border-b border-r border-border text-center w-64 relative">
                  {p.id === topScorer.id && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-warning text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      👑 Recommended
                    </div>
                  )}
                  <div className="font-bold text-lg text-text-primary mt-2">{p.brand}</div>
                  <div className="text-sm text-text-muted truncate">{p.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Overview */}
            <tr>
              <td className="p-4 border-b border-r border-border font-medium text-text-primary bg-surface/50">Price</td>
              {products.map(p => renderCell(p, `₹${p.price.toLocaleString()}`, p.price === Math.min(...products.map(x => x.price)), p.price === Math.max(...products.map(x => x.price))))}
            </tr>
            <tr>
              <td className="p-4 border-b border-r border-border font-medium text-text-primary bg-surface/50">Match Score</td>
              {products.map(p => renderCell(p, p.totalScore, p.totalScore === Math.max(...products.map(x => x.totalScore))))}
            </tr>
            <tr>
              <td className="p-4 border-b border-r border-border font-medium text-text-primary bg-surface/50">Launch Year</td>
              {products.map(p => renderCell(p, p.launchYear))}
            </tr>

            {/* Specs (AC specific for demo) */}
            <tr>
              <td colSpan={products.length + 1} className="p-4 border-b border-border bg-surface font-bold text-text-primary text-left">
                Key Specs
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-r border-border font-medium text-text-primary bg-surface/50">ISEER / Efficiency</td>
              {products.map(p => renderCell(p, p.specs.ac?.iseer, p.specs.ac?.iseer === Math.max(...products.map(x => x.specs.ac?.iseer || 0))))}
            </tr>
            <tr>
              <td className="p-4 border-b border-r border-border font-medium text-text-primary bg-surface/50">Noise Level</td>
              {products.map(p => renderCell(p, `${p.specs.ac?.noiseDb} dB`, p.specs.ac?.noiseDb === Math.min(...products.map(x => x.specs.ac?.noiseDb || 100))))}
            </tr>
            <tr>
              <td className="p-4 border-b border-r border-border font-medium text-text-primary bg-surface/50">Smart Features</td>
              {products.map(p => renderCell(p, p.specs.ac?.smartFeatures ? p.specs.ac?.smartPlatform || 'Yes' : 'No'))}
            </tr>

            {/* Ownership Cost */}
            <tr>
              <td colSpan={products.length + 1} className="p-4 border-b border-border bg-surface font-bold text-text-primary text-left">
                5-Year Ownership Cost
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-r border-border font-medium text-text-primary bg-surface/50">Running Cost / Year</td>
              {products.map(p => renderCell(p, `₹${p.ownership.runningCostPerYear.toLocaleString()}`, p.ownership.runningCostPerYear === Math.min(...products.map(x => x.ownership.runningCostPerYear))))}
            </tr>
            <tr>
              <td className="p-4 border-b border-r border-border font-medium text-text-primary bg-surface/50">Est. 5-Year Total</td>
              {products.map(p => {
                const total = p.price + (p.ownership.runningCostPerYear * 5) + p.ownership.repairCostYear5;
                const minTotal = Math.min(...products.map(x => x.price + (x.ownership.runningCostPerYear * 5) + x.ownership.repairCostYear5));
                return renderCell(p, `₹${total.toLocaleString()}`, total === minTotal);
              })}
            </tr>

            {/* Support */}
            <tr>
              <td colSpan={products.length + 1} className="p-4 border-b border-border bg-surface font-bold text-text-primary text-left">
                Support & Reliability
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-r border-border font-medium text-text-primary bg-surface/50">After-sales Score</td>
              {products.map(p => renderCell(p, p.scores.afterSalesSupport, p.scores.afterSalesSupport === Math.max(...products.map(x => x.scores.afterSalesSupport))))}
            </tr>
            <tr>
              <td className="p-4 border-b border-r border-border font-medium text-text-primary bg-surface/50">Common Repair</td>
              {products.map(p => renderCell(p, p.ownership.commonRepair.issue))}
            </tr>

            {/* Actions */}
            <tr>
              <td className="p-4 border-r border-border bg-surface/50"></td>
              {products.map(p => (
                <td key={p.id} className="p-4 border-r border-border text-center">
                  <button 
                    onClick={() => handleGoDeeper(p.id)}
                    className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
                  >
                    Go deeper <ChevronRight size={16} />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        {products.length >= 2 && (
          <div className="mt-8 bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-text-primary mb-2">
              Still deciding between {products[0].brand} and {products[1].brand}?
            </h3>
            <p className="text-text-muted mb-6">
              Choose <span className="font-semibold text-text-primary">{products[0].brand}</span> if {products[0].tags[0].toLowerCase()} is your priority. 
              Go with <span className="font-semibold text-text-primary">{products[1].brand}</span> if you care more about {products[1].tags[0].toLowerCase()}.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 border-t border-border pt-6">
              <button 
                onClick={() => navigate('location')}
                className="flex-1 py-3 px-4 bg-surface border border-border rounded-lg font-medium text-text-primary hover:bg-border transition-colors flex items-center justify-center gap-2"
              >
                📍 Compare Service Centers
              </button>
              <button 
                onClick={() => navigate('store')}
                className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                🏪 Find Nearby Stores
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
