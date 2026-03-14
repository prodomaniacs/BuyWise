import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Play, MessageSquare, ThumbsUp, AlertTriangle } from 'lucide-react';

export default function VoiceOfCustomer() {
  const { scoredProducts, selectedForCompare, activeCompareProduct, setActiveCompareProduct, goBack } = useAppContext();
  
  const products = selectedForCompare.map(id => scoredProducts.find(p => p.id === id)).filter(Boolean);
  
  useEffect(() => {
    if (!activeCompareProduct && products.length > 0) {
      setActiveCompareProduct(products[0].id);
    }
  }, [activeCompareProduct, products, setActiveCompareProduct]);

  if (products.length === 0) return null;

  const activeProduct = products.find(p => p.id === activeCompareProduct) || products[0];
  const voc = activeProduct.voc;

  const renderYoutubeCard = (video) => {
    const isOld = new Date(video.date) < new Date(new Date().setFullYear(new Date().getFullYear() - 2));
    const isOlder = new Date(video.date) < new Date(new Date().setMonth(new Date().getMonth() - 18));
    
    let borderClass = 'border-border';
    let warningMsg = null;
    if (isOld) {
      borderClass = 'border-border/50 opacity-75';
      warningMsg = "Old review — weighted at 25%";
    } else if (isOlder) {
      borderClass = 'border-warning/50';
      warningMsg = "Older review — weighted at 50% in score";
    }

    return (
      <div key={video.id} className={`bg-card rounded-xl border ${borderClass} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
        <div className="h-32 bg-primary/10 relative flex items-center justify-center group cursor-pointer" style={{ backgroundColor: `${activeProduct.imageColor}20` }}>
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Play className="text-primary ml-1" size={24} fill="currentColor" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">
            {video.views} views
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {video.channel.charAt(0)}
            </div>
            <span className="text-sm font-medium text-text-muted truncate">{video.channel}</span>
            <span className="text-xs text-text-muted/60 ml-auto">{video.date}</span>
          </div>
          <h4 className="font-semibold text-text-primary text-sm line-clamp-2 mb-2 leading-snug" title={video.title}>
            {video.title}
          </h4>
          <p className="text-sm text-text-muted line-clamp-2 mb-3">"{video.summary}"</p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1 text-xs text-text-muted font-medium">
              <MessageSquare size={14} /> {video.comments}
            </div>
            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
              video.sentiment === 'positive' ? 'bg-positive/10 text-positive' :
              video.sentiment === 'mixed' ? 'bg-warning/10 text-warning' :
              'bg-negative/10 text-negative'
            }`}>
              {video.sentiment}
            </span>
          </div>
          {warningMsg && (
            <div className="mt-3 pt-2 border-t border-border text-xs font-medium text-warning flex items-center gap-1">
              <AlertTriangle size={12} /> {warningMsg}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRedditRow = (thread) => {
    const isOld = new Date(thread.date) < new Date(new Date().setFullYear(new Date().getFullYear() - 2));
    const isOlder = new Date(thread.date) < new Date(new Date().setMonth(new Date().getMonth() - 18));
    
    let borderClass = 'border-border';
    if (isOld) borderClass = 'border-border/50 opacity-75';
    else if (isOlder) borderClass = 'border-warning/50';

    return (
      <div key={thread.id} className={`p-4 border-b ${borderClass} last:border-0 hover:bg-surface/50 transition-colors`}>
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1 shrink-0 w-12 pt-1">
            <ThumbsUp size={16} className="text-text-muted" />
            <span className="text-sm font-bold text-text-primary">{thread.upvotes}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2 py-0.5 bg-surface border border-border rounded-full text-xs font-medium text-text-muted">
                {thread.subreddit}
              </span>
              <span className="text-xs text-text-muted/60">{thread.date}</span>
            </div>
            <h4 className="font-semibold text-text-primary text-base mb-1 truncate" title={thread.title}>
              {thread.title}
            </h4>
            <p className="text-sm text-text-muted line-clamp-3 mb-2">"{thread.summary}"</p>
            <div className="flex items-center gap-1 text-xs text-text-muted font-medium">
              <MessageSquare size={14} /> {thread.comments} comments
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface pb-24">
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-text-primary" aria-label="Go back">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-text-primary">Voice of Customer</h1>
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
            {/* Verdict Card */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Synthesized Verdict</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-positive mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-positive"></span> Pros
                      </h3>
                      <ul className="space-y-2">
                        {voc.pros.map((pro, idx) => (
                          <li key={idx} className="text-sm text-text-primary flex items-start gap-2">
                            <span className="text-positive mt-0.5">✓</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-negative mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-negative"></span> Cons
                      </h3>
                      <ul className="space-y-2">
                        {voc.cons.map((con, idx) => (
                          <li key={idx} className="text-sm text-text-primary flex items-start gap-2">
                            <span className="text-negative mt-0.5">✕</span> {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-64 shrink-0 flex flex-col items-center justify-center p-6 bg-surface rounded-xl border border-border text-center">
                  <div className={`text-5xl font-black mb-2 ${
                    voc.vocRating >= 8 ? 'text-positive' : voc.vocRating >= 5 ? 'text-warning' : 'text-negative'
                  }`}>
                    {voc.vocRating}
                  </div>
                  <div className="font-bold text-text-primary text-lg mb-1">{voc.vocLabel}</div>
                  <div className="text-xs text-text-muted">Based on {voc.dataPointCount} sources</div>
                </div>
              </div>

              {voc.dissentingView.exists && (
                <div className="mt-6 p-4 bg-warning/5 border-l-4 border-warning rounded-r-lg">
                  <h4 className="font-semibold text-warning-dark mb-1 flex items-center gap-2">
                    <AlertTriangle size={16} /> Some users disagree:
                  </h4>
                  <p className="text-sm text-text-primary">{voc.dissentingView.text}</p>
                </div>
              )}
            </div>

            {/* YouTube Section */}
            <section>
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="text-[#FF0000]">▶</span> What reviewers are saying on YouTube
              </h3>
              {voc.youtube.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {voc.youtube.map(renderYoutubeCard)}
                </div>
              ) : (
                <p className="text-text-muted italic bg-surface p-4 rounded-lg border border-border">YouTube review data not available for this product.</p>
              )}
            </section>

            {/* Reddit Section */}
            <section>
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="text-[#FF4500]">👾</span> What the community is saying on Reddit
              </h3>
              {voc.reddit.length > 0 ? (
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  {voc.reddit.map(renderRedditRow)}
                </div>
              ) : (
                <p className="text-text-muted italic bg-surface p-4 rounded-lg border border-border">Reddit discussion data not available for this product.</p>
              )}
            </section>

            {/* Instagram/Shorts Section */}
            <section className="bg-card rounded-xl border border-border shadow-sm p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Short-form Content Sentiment (Instagram/Shorts)</h3>
              <div className="flex flex-wrap items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
                  voc.instagramSentiment === 'positive' ? 'bg-positive/10 text-positive border border-positive/20' :
                  voc.instagramSentiment === 'mixed' ? 'bg-warning/10 text-warning border border-warning/20' :
                  'bg-negative/10 text-negative border border-negative/20'
                }`}>
                  {voc.instagramSentiment} Sentiment
                </span>
                <div className="flex flex-wrap gap-2">
                  {voc.instagramThemes.map((theme, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-surface border border-border rounded-full text-xs font-medium text-text-muted">
                      #{theme.toLowerCase().replace(' ', '')}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-text-muted mt-4 italic">Based on aggregated short-form content — directional only. Content older than 18 months weighted at 50%, older than 2 years at 25%.</p>
            </section>

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
