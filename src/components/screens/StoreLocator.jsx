import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { MapPin, Navigation, Copy, Share2 } from 'lucide-react';

export default function StoreLocator() {
  const { scoredProducts, selectedForCompare, answers, goBack } = useAppContext();
  
  const products = selectedForCompare.map(id => scoredProducts.find(p => p.id === id)).filter(Boolean);
  
  if (products.length === 0) return null;

  const city = answers.city || 'Delhi';
  const category = products[0].category;

  const stores = [
    { name: "Croma", type: "Croma", distance: "2.4 km", address: `Main Road, ${city}`, open: true },
    { name: "Reliance Digital", type: "Reliance Digital", distance: "3.1 km", address: `City Center Mall, ${city}`, open: true },
    { name: `${products[0].brand} Exclusive Store`, type: "Brand showroom", distance: "4.5 km", address: `High Street, ${city}`, open: true },
    { name: "Vijay Sales", type: "Local dealer", distance: "5.2 km", address: `Market Area, ${city}`, open: false },
    { name: "Sargam Electronics", type: "Local dealer", distance: "6.8 km", address: `Old Town, ${city}`, open: true }
  ];

  const questions = {
    ac: [
      "Can I see the BEE star label on the actual unit — not just the box? The box rating and unit rating sometimes differ.",
      "Is this current-year production stock or last season's inventory? Ask for the manufacturing date on the label.",
      `What is the address of the nearest service center, and what is their typical response time in ${city}?`,
      "Is installation included, and is it done by your team or a third-party contractor? Who do I call if there's an issue post-install?",
      "Has this specific model had any compressor complaints?"
    ],
    laptop: [
      "Is this an authorized Indian retail unit or a grey import? Grey imports may not have Indian warranty.",
      "Can I see the battery health percentage on the demo unit? If it's been on display for months, the battery may be degraded.",
      "What is the warranty process — do I bring it here or go directly to the brand service center?",
      "Is there a 30-day return or exchange policy if I face a hardware issue?",
      "What's included in the box? Specifically, what wattage is the bundled charger?"
    ],
    phone: [
      "Is this an Indian variant or international? Check the model number.",
      "How long will this model receive software updates from the manufacturer?",
      "Is the screen protector and case that's shown pre-applied — or will I get a fresh sealed unit?",
      "What is the exchange value for my current phone right now, before I commit to buying?",
      "Does this model have any active service advisories or recalls?"
    ],
    mattress: [
      "What is the actual foam density — the number, not just 'high density'?",
      "Does the trial period start from delivery date or purchase date?",
      "If I want to return it during the trial, what is the exact process and how long does the refund take?",
      `Is there a physical service center or pickup point in ${city} for warranty claims, or is it all courier-based?`,
      "Are the materials certified — CertiPUR for foam, OEKO-TEX for fabric?"
    ]
  };

  const handleCopy = () => {
    const text = questions[category].map((q, i) => `${i+1}. ${q}`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Questions copied to clipboard!');
  };

  const handleShare = () => {
    const text = `Questions to ask before buying ${products[0].name}:\n` + questions[category].map((q, i) => `${i+1}. ${q}`).join('\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-surface pb-24">
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-text-primary" aria-label="Go back">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <MapPin size={20} className="text-primary" /> Store Locator
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        <div className="h-64 bg-border rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <MapPin size={48} className="text-primary mb-2 z-10" />
          <div className="text-lg font-bold text-text-primary z-10 bg-white/80 px-4 py-1 rounded-full backdrop-blur-sm">{city}</div>
          <button 
            onClick={() => window.open(`https://maps.google.com/?q=electronics+stores+${city}`, '_blank')}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-medium shadow-md hover:bg-primary/90 transition-colors z-10 flex items-center gap-2"
          >
            Open in Google Maps <Navigation size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Nearby Stores</h2>
            {stores.map((store, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-text-primary">{store.name}</h3>
                    <span className="px-2 py-0.5 bg-surface border border-border rounded-full text-xs font-medium text-text-muted">
                      {store.type}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted mb-3">{store.address} • {store.distance}</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${store.open ? 'bg-positive' : 'bg-negative'}`}></span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${store.open ? 'text-positive' : 'text-negative'}`}>
                      {store.open ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end gap-3">
                  <div className="flex flex-wrap gap-2 justify-end">
                    {products.slice(0, 2).map(p => (
                      <span key={p.id} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium whitespace-nowrap">
                        Demo: {p.brand}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => window.open(`https://maps.google.com/?q=${store.name}+${city}`, '_blank')}
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Get directions <Navigation size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-warning/10 border-2 border-warning/30 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-warning-dark mb-4">Before you buy — ask the salesperson:</h3>
              <ul className="space-y-4 mb-6">
                {questions[category].map((q, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-text-primary">
                    <span className="font-bold text-warning shrink-0">{idx + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleCopy}
                  className="w-full py-2.5 bg-card border border-border text-text-primary rounded-lg font-medium hover:bg-surface transition-colors flex items-center justify-center gap-2"
                >
                  <Copy size={16} /> Copy all questions
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full py-2.5 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Share2 size={16} /> Share via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
