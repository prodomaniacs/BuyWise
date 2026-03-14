export function detectConflicts(category, answers) {
  const conflicts = [];
  
  if (category === 'ac') {
    if (answers.useCase === 'bedroom' && answers.budget < 38000) {
      conflicts.push({
        id: 'ac_cooling_efficiency',
        dimension1: 'usageExperience',
        dimension2: 'runningCost',
        explanation: "5-star inverter ACs that cool fast start at ₹38,000. Below that, you trade either speed or efficiency.",
        choice1Label: "Cool my room fast",
        choice2Label: "Keep my electricity bills low",
        choice1WeightEffect: { usageExperience: 20, runningCost: -20 },
        choice2WeightEffect: { runningCost: 20, usageExperience: -20 },
        balancedWeightEffect: { usageExperience: 0, runningCost: 0 }
      });
    }
    if (answers.useCase === 'bedroom' && answers.budget < 25000) {
      conflicts.push({
        id: 'ac_budget_low',
        type: 'informational',
        message: "Under ₹25,000, ACs are basic models. We'll find the best available, but performance will be limited."
      });
    }
  } else if (category === 'laptop') {
    if (answers.useCase === 'gaming' && answers.budget < 60000) {
      conflicts.push({
        id: 'laptop_gaming_budget',
        dimension1: 'usageExperience',
        dimension2: 'pricing',
        explanation: "Gaming laptops with a dedicated GPU start at ₹60,000. Under that, we can find a good general-use laptop, but gaming performance will be limited.",
        choice1Label: "I specifically need gaming performance",
        choice2Label: "Gaming is nice-to-have — show me best overall",
        choice1WeightEffect: { usageExperience: 30 },
        choice2WeightEffect: {},
        balancedWeightEffect: { usageExperience: 15 }
      });
    }
    if (answers.useCase === 'creative' && answers.budget < 70000) {
      conflicts.push({
        id: 'laptop_creative_budget',
        type: 'informational',
        message: "Laptops good enough for design and video editing start at ₹70,000. Below that, basic editing is possible but render times will be slow."
      });
    }
  } else if (category === 'phone') {
    if (answers.useCase === 'camera' && answers.budget < 25000) {
      conflicts.push({
        id: 'phone_camera_battery',
        dimension1: 'usageExperience',
        dimension2: 'reliability',
        explanation: "Camera and battery both need hardware investment. Under ₹25,000, one will be noticeably compromised.",
        choice1Label: "Camera quality is my priority",
        choice2Label: "I need the battery to last all day",
        choice1WeightEffect: { usageExperience: 20, reliability: -10 },
        choice2WeightEffect: { reliability: 20, usageExperience: -10 },
        balancedWeightEffect: { usageExperience: 0, reliability: 0 }
      });
    }
    if (answers.useCase === 'gaming' && answers.budget < 15000) {
      conflicts.push({
        id: 'phone_gaming_budget',
        type: 'informational',
        message: "Gaming phones start at ₹15,000. We'll show the best available but frame rate will be limited."
      });
    }
  } else if (category === 'mattress') {
    if (answers.useCase === 'back_pain') {
      conflicts.push({
        id: 'mattress_soft_back',
        dimension1: 'usageExperience',
        dimension2: 'durability',
        explanation: "Soft mattresses feel comfortable but don't provide the spinal support needed for back pain. Medium-firm is what physiotherapists recommend.",
        choice1Label: "Comfort over support — I'll manage the back pain separately",
        choice2Label: "Back support is my priority — I'll adjust to firmer feel",
        choice1WeightEffect: { usageExperience: 20, durability: -20 },
        choice2WeightEffect: { durability: 20, usageExperience: -20 },
        balancedWeightEffect: { usageExperience: 0, durability: 0 }
      });
    }
  }
  
  return {
    hasConflicts: conflicts.length > 0,
    conflicts
  };
}

export function resolveConflict(conflictId, choice, currentWeights, conflictDef) {
  const effect = choice === 'choice1' ? conflictDef.choice1WeightEffect :
                 choice === 'choice2' ? conflictDef.choice2WeightEffect :
                 conflictDef.balancedWeightEffect;
                 
  const newWeights = { ...currentWeights };
  for (const [dim, val] of Object.entries(effect || {})) {
    if (newWeights[dim] !== undefined) {
      newWeights[dim] += val;
    }
  }
  return newWeights;
}
