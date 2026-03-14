import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getCityTier } from '../../logic/cityTierLookup';
import EdgeCaseHandler from '../shared/EdgeCaseHandler';
import { MapPin } from 'lucide-react';

export default function LocationIntelligence() {
  const { scoredProducts, selectedForCompare, answers, navigate, goBack } = useAppContext();
  
  const products = selectedForCompare.map(id => scoredProducts.find(p => p.id === id)).filter(Boolean);
  
  if (products.length === 0) return null;

  const city = answers.city;
  const tier = getCityTier(city);
  const isUnknown = city === 'unknown' || !city;
  const displayCity = isUnknown ? 'Delhi' : city; // Fallback for display

  const renderServiceRow = (product) => {
    const serviceData = product.location.cityServiceData[displayCity] || product.location.cityServiceData.default;
    const isBest = products.reduce((prev, curr) => {
      const pData = curr.location.cityServiceData[displayCity] || curr.location.cityServiceData.default;
      const prevData = prev.location.cityServiceData[displayCity] || prev.location.cityServiceData.default;
      return pData.centersNearby > prevData.centersNearby ? curr : prev;
    }).id === product.id;

    return (
      <tr key={product.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
        <td className="p-4 font-medium text-text-primary flex items-center gap-2">
          {product.brand}
          {isBest && <span className="px-2 py-0.5 bg-positive/10 text-positive text-xs font-bold rounded-full">Best</span>}
        </td>
        <td className="p-4 text-center font-bold text-text-primary">{serviceData.centersNearby}</td>
        <td className="p-4 text-center text-text-muted">{serviceData.avgResponseDays} days</td>
        <td className="p-4 text-center text-text-muted">₹{product.location.serviceNetwork.avgRepairCostINR.toLocaleString()}</td>
        <td className="p-4 text-center">
          <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
            product.location.serviceNetwork.partsAvailability === 'easy' ? 'bg-positive/10 text-positive' :
            product.location.serviceNetwork.partsAvailability === 'moderate' ? 'bg-warning/10 text-warning' :
            'bg-negative/10 text-negative'
          }`}>
            {product.location.serviceNetwork.partsAvailability}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-surface pb-24">
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-text-primary" aria-label="Go back">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <MapPin size={20} className="text-primary" /> Location Intelligence
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {isUnknown && (
          <EdgeCaseHandler 
            scenario="no_location_data" 
            context={{ nearestCity: 'Delhi' }}
            onAction={(type) => {
              if (type === 'update_city') navigate('intake');
            }}
          />
        )}

        {tier !== 'metro' && !isUnknown && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex gap-3 items-start">
            <div className="text-warning shrink-0 mt-0.5">ⓘ</div>
            <div>
              <h4 className="font-semibold text-warning-dark mb-1">Service matters more here</h4>
              <p className="text-sm text-text-muted">In {displayCity}, service network matters more than in metros. We've weighted it 30% higher in your scores.</p>
            </div>
          </div>
        )}

        <section className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Service Network in {displayCity}</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-surface text-left text-sm font-semibold text-text-muted border-b border-border">
                  <th className="p-4 rounded-tl-lg">Brand</th>
                  <th className="p-4 text-center">Centers Nearby</th>
                  <th className="p-4 text-center">Avg Response</th>
                  <th className="p-4 text-center">Avg Repair Cost/Yr</th>
                  <th className="p-4 text-center rounded-tr-lg">Parts Availability</th>
                </tr>
              </thead>
              <tbody>
                {products.map(renderServiceRow)}
              </tbody>
            </table>
          </div>
          {tier === 'tier3' && (
            <p className="text-sm text-text-muted mt-4 italic">
              Showing estimated data for smaller cities. Service availability may vary — call the brand helpline to confirm centers near you.
            </p>
          )}
        </section>

        <section className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Regional Popularity</h2>
          <div className="space-y-4">
            {products.map(p => {
              const rank = p.location.topCitiesSold.find(c => c.city === displayCity)?.rank;
              if (!rank) return null;
              
              const percentage = rank === 1 ? 85 : rank === 2 ? 65 : 40;
              
              return (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="w-24 font-medium text-text-primary truncate">{p.brand}</div>
                  <div className="flex-1 h-6 bg-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out flex items-center px-3 text-xs font-bold text-white"
                      style={{ width: `${percentage}%` }}
                    >
                      Rank #{rank}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-text-muted mt-6 italic">Based on aggregated regional sales data.</p>
        </section>

      </main>
    </div>
  );
}
