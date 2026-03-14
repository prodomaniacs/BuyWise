import { getCityTier } from './cityTierLookup';
import { getBuySignal } from './saleCalendar';

const BASE_WEIGHTS = {
  ac: { pricing: 15, afterSalesSupport: 25, durability: 20, usageExperience: 15, runningCost: 15, reliability: 10, ratings: 0 },
  laptop: { pricing: 10, afterSalesSupport: 15, durability: 15, usageExperience: 30, runningCost: 5, reliability: 15, ratings: 10 },
  phone: { pricing: 15, afterSalesSupport: 10, durability: 10, usageExperience: 30, runningCost: 5, reliability: 20, ratings: 10 },
  mattress: { pricing: 10, afterSalesSupport: 20, durability: 30, usageExperience: 25, runningCost: 0, reliability: 10, ratings: 5 }
};

export function scoreProducts(category, answers, products, conflictResolutions) {
  let weights = { ...BASE_WEIGHTS[category] };
  
  // Apply buyingFor modifiers
  if (answers.buyingFor === 'parents') {
    weights.afterSalesSupport += 20; weights.durability += 15; weights.usageExperience -= 10; weights.ratings -= 10; weights.pricing -= 15;
  } else if (answers.buyingFor === 'office') {
    weights.reliability += 15; weights.durability += 10; weights.pricing -= 10; weights.ratings -= 15;
  } else if (answers.buyingFor === 'gift') {
    weights.ratings += 10; weights.pricing += 5; weights.reliability -= 5; weights.usageExperience -= 10;
  }
  
  // Apply city tier modifiers
  const tier = getCityTier(answers.city);
  if (tier === 'tier2' || tier === 'tier3') {
    weights.afterSalesSupport += 30; weights.pricing += 10; weights.usageExperience -= 15; weights.ratings -= 15;
  }
  
  // Normalize weights to 100
  let totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  for (let key in weights) {
    weights[key] = Math.max(0, (weights[key] / totalWeight) * 100);
  }
  
  const scored = products.filter(p => p.category === category).map(p => {
    let rawScores = { ...p.scores };
    
    // Recency penalties
    let recencyPenaltyApplied = false;
    let recencyPenaltyReason = "";
    if (p.launchYear < 2022) {
      rawScores.reliability -= 5;
      recencyPenaltyApplied = true;
      recencyPenaltyReason = "Pre-2022 model";
    }
    if (p.launchYear < 2020) {
      rawScores.reliability -= 5;
      rawScores.durability -= 5;
      recencyPenaltyReason = "Pre-2020 model";
    }
    
    let totalScore = 0;
    let scoreBreakdown = {};
    for (let dim in weights) {
      const contribution = (rawScores[dim] || 0) * (weights[dim] / 100);
      totalScore += contribution;
      scoreBreakdown[dim] = {
        raw: rawScores[dim] || 0,
        weight: weights[dim],
        contribution,
        explanation: `Scored ${rawScores[dim] || 0}/100. Weighted at ${Math.round(weights[dim])}% for your profile.`
      };
    }
    
    const isStretch = p.price > answers.budget && p.price <= answers.budget * 1.15;
    const withinBudget = p.price <= answers.budget * 1.15;
    
    let confidenceLevel = 'limited';
    if (p.voc.dataPointCount >= 40) confidenceLevel = 'high';
    else if (p.voc.dataPointCount >= 15) confidenceLevel = 'moderate';
    
    return {
      ...p,
      totalScore: Math.round(totalScore),
      scoreBreakdown,
      withinBudget,
      isStretch,
      stretchAmount: isStretch ? p.price - answers.budget : 0,
      confidenceLevel,
      confidenceDataPoints: p.voc.dataPointCount,
      recencyPenaltyApplied,
      recencyPenaltyReason,
      buyNowSignal: getBuySignal(p, answers, new Date().getMonth() + 1).signal
    };
  });
  
  const validProducts = scored.filter(p => p.withinBudget).sort((a, b) => b.totalScore - a.totalScore);
  return validProducts.slice(0, 10);
}
