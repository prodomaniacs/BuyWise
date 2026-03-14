import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import KnownIssues from '../shared/KnownIssues';

export default function OwnershipCost() {
  const { scoredProducts, selectedForCompare, activeCompareProduct, setActiveCompareProduct, goBack } = useAppContext();
  
  const products = selectedForCompare.map(id => scoredProducts.find(p => p.id === id)).filter(Boolean);
  
  useEffect(() => {
    if (!activeCompareProduct && products.length > 0) {
      setActiveCompareProduct(products[0].id);
    }
  }, [activeCompareProduct, products, setActiveCompareProduct]);

  if (products.length === 0) return null;

  const activeProduct = products.find(p => p.id === activeCompareProduct) || products[0];
  const ownership = activeProduct.ownership;

  const chartData = [
    {
      name: 'Year 0',
      Purchase: activeProduct.price,
      Running: 0,
      Maintenance: 0,
    },
    {
      name: 'Year 1',
      Purchase: activeProduct.price,
      Running: ownership.runningCostPerYear,
      Maintenance: ownership.repairCostYear1,
    },
    {
      name: 'Year 3',
      Purchase: activeProduct.price,
      Running: ownership.runningCostPerYear * 3,
      Maintenance: ownership.repairCostYear3,
    },
    {
      name: 'Year 5',
      Purchase: activeProduct.price,
      Running: ownership.runningCostPerYear * 5,
      Maintenance: ownership.repairCostYear5,
    },
  ];

  const total5YearCost = activeProduct.price + (ownership.runningCostPerYear * 5) + ownership.repairCostYear5;
  const effectiveCostPerYear = Math.round(total5YearCost / 5);

  let runnerUp = products.find(p => p.id !== activeProduct.id);
  let comparisonText = null;
  let comparisonColor = 'text-text-muted';

  if (runnerUp) {
    const runnerUpTotal = runnerUp.price + (runnerUp.ownership.runningCostPerYear * 5) + runnerUp.ownership.repairCostYear5;
    const diff = Math.abs(total5YearCost - runnerUpTotal);
    const upfrontDiff = Math.abs(activeProduct.price - runnerUp.price);
    
    if (total5YearCost < runnerUpTotal && activeProduct.price > runnerUp.price) {
      comparisonText = `Vs ${runnerUp.brand}: Over 5 years, ${activeProduct.brand} costs ₹${diff.toLocaleString()} less despite being ₹${upfrontDiff.toLocaleString()} more upfront.`;
      comparisonColor = 'text-positive font-medium';
    } else if (total5YearCost > runnerUpTotal && activeProduct.price < runnerUp.price) {
      comparisonText = `Vs ${runnerUp.brand}: Over 5 years, ${activeProduct.brand} costs ₹${diff.toLocaleString()} more despite being ₹${upfrontDiff.toLocaleString()} cheaper upfront.`;
      comparisonColor = 'text-warning font-medium';
    } else {
      comparisonText = `Vs ${runnerUp.brand}: Over 5 years, ${activeProduct.brand} is ₹${diff.toLocaleString()} ${total5YearCost > runnerUpTotal ? 'more' : 'less'} expensive overall.`;
    }
  }

  return (
    <div className="min-h-screen bg-surface pb-24">
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-text-primary" aria-label="Go back">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-text-primary">Long-term Ownership Cost</h1>
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
            {/* 5-Year Cost Timeline */}
            <section className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">5-Year Cost Timeline</h2>
              
              <div className="h-80 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 14 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 14 }} tickFormatter={(val) => `₹${(val/1000)}k`} />
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString()}`}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Purchase" stackId="a" fill="#2563EB" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Running" stackId="a" fill="#10B981" />
                    <Bar dataKey="Maintenance" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-border">
                <div>
                  <div className="text-3xl font-bold text-text-primary mb-1">
                    ₹{effectiveCostPerYear.toLocaleString()} <span className="text-lg text-text-muted font-medium">/ year</span>
                  </div>
                  <div className="text-sm text-text-muted">Effective cost over 5 years</div>
                </div>
                {comparisonText && (
                  <div className={`text-sm md:text-right max-w-sm ${comparisonColor} bg-surface p-3 rounded-lg border border-border`}>
                    {comparisonText}
                  </div>
                )}
              </div>
            </section>

            {/* Known Issues */}
            <section>
              <h3 className="text-xl font-bold text-text-primary mb-4">Known Issues & Reliability</h3>
              <KnownIssues knownIssues={activeProduct.knownIssues} productName={activeProduct.name} variant="card" />
            </section>

            {/* Repair Intel */}
            <section className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
              <h3 className="text-xl font-bold text-text-primary mb-6">Repair Intelligence</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 bg-surface rounded-xl border border-border">
                  <div className="text-sm text-text-muted mb-1">Most common repair</div>
                  <div className="font-semibold text-text-primary text-lg mb-2">{ownership.commonRepair.issue}</div>
                  <div className={`inline-flex px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    ownership.commonRepair.frequency === 'rare' ? 'bg-positive/10 text-positive' :
                    ownership.commonRepair.frequency === 'occasional' ? 'bg-warning/10 text-warning' :
                    'bg-negative/10 text-negative'
                  }`}>
                    {ownership.commonRepair.frequency}
                  </div>
                </div>
                <div className="p-4 bg-surface rounded-xl border border-border">
                  <div className="text-sm text-text-muted mb-1">Average repair cost</div>
                  <div className="font-bold text-text-primary text-2xl">₹{ownership.commonRepair.avgCost.toLocaleString()}</div>
                  <div className="text-xs text-text-muted mt-2">Out of warranty estimate</div>
                </div>
                <div className="p-4 bg-surface rounded-xl border border-border">
                  <div className="text-sm text-text-muted mb-1">Lifetime repair risk</div>
                  <div className={`font-bold text-2xl mb-2 ${
                    activeProduct.scores.reliability >= 90 ? 'text-positive' :
                    activeProduct.scores.reliability >= 80 ? 'text-warning' :
                    'text-negative'
                  }`}>
                    {activeProduct.scores.reliability >= 90 ? 'Low' : activeProduct.scores.reliability >= 80 ? 'Medium' : 'High'}
                  </div>
                  <div className="text-xs text-text-muted">Based on historical reliability score of {activeProduct.scores.reliability}/100</div>
                </div>
              </div>
            </section>

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
