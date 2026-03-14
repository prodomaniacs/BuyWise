export const SALES = [
  { event: "Republic Day Sale", month: 1, avgDropByCategory: { ac: 8, laptop: 10, phone: 12, mattress: 6 } },
  { event: "Holi Offers", month: 3, avgDropByCategory: { ac: 5, laptop: 6, phone: 8, mattress: 4 } },
  { event: "Mid-year Sale", month: 7, avgDropByCategory: { ac: 12, laptop: 10, phone: 10, mattress: 8 } },
  { event: "Independence Day Sale", month: 8, avgDropByCategory: { ac: 10, laptop: 8, phone: 10, mattress: 6 } },
  { event: "Navratri/Festive", month: 10, avgDropByCategory: { ac: 15, laptop: 12, phone: 15, mattress: 10 } },
  { event: "Big Billion Day", month: 10, avgDropByCategory: { ac: 18, laptop: 15, phone: 18, mattress: 12 } },
  { event: "Diwali Offers", month: 11, avgDropByCategory: { ac: 12, laptop: 12, phone: 15, mattress: 10 } },
  { event: "Year-end Clearance", month: 12, avgDropByCategory: { ac: 10, laptop: 12, phone: 10, mattress: 8 } }
];

export function getBuySignal(product, answers, currentMonth) {
  let nextSales = [];
  let signal = 'buy-now';
  let reason = '';
  let priceContext = '';
  let modelCycleNote = null;
  let urgencyOverride = false;

  const category = product.category;
  
  // Find upcoming sales
  for (let i = 0; i < 12; i++) {
    let checkMonth = ((currentMonth - 1 + i) % 12) + 1;
    let salesInMonth = SALES.filter(s => s.month === checkMonth);
    for (let sale of salesInMonth) {
      if (nextSales.length < 3) {
        nextSales.push({
          event: sale.event,
          month: sale.month,
          avgDropPercent: sale.avgDropByCategory[category] || 5,
          weeksAway: Math.max(1, i * 4)
        });
      }
    }
  }

  const nextSale = nextSales[0];
  const priceDropAmt = Math.round(product.price * (nextSale.avgDropPercent / 100));

  if (answers.buyingTimeline === 'this-week') {
    urgencyOverride = true;
    signal = 'buy-now';
    reason = "Since you need it urgently, here's the best available deal right now.";
  } else {
    if (nextSale.weeksAway <= 4 && nextSale.avgDropPercent > 12) {
      signal = 'wait-price-drop';
      reason = `${nextSale.event} is ${nextSale.weeksAway} weeks away. Last year ${category}s dropped ${nextSale.avgDropPercent}%. At current price of ₹${product.price.toLocaleString()}, you could save ~₹${priceDropAmt.toLocaleString()} by waiting.`;
    } else if (nextSale.weeksAway <= 6 && nextSale.avgDropPercent >= 5) {
      signal = 'consider-waiting';
      reason = `${nextSale.event} is ${nextSale.weeksAway} weeks away. You might see a ${nextSale.avgDropPercent}% drop.`;
    } else if (product.deals.priceVs3MonthAvg === 'above' && product.deals.priceDropPercent > 8) {
      signal = 'wait-price-drop';
      reason = `Price is currently inflated compared to its 3-month average. Wait for it to drop back down.`;
    } else {
      signal = 'buy-now';
      reason = `No major sales in the next 6 weeks and price is stable. Good time to buy.`;
    }
  }

  if (product.deals.priceVs3MonthAvg === 'above') {
    priceContext = `₹${Math.round(product.price * 0.05).toLocaleString()} above its 3-month average`;
  } else if (product.deals.priceVs3MonthAvg === 'below') {
    priceContext = `At its lowest price in 3 months`;
  } else {
    priceContext = `Tracking at its 3-month average`;
  }

  if (product.buyTiming.monthsSinceRefresh > 10) {
    modelCycleNote = `This model is ${product.buyTiming.monthsSinceRefresh} months old. Next refresh typically expected ${product.buyTiming.nextRefreshExpectedQ}. Buying now means you won't get the updated version.`;
  }

  return {
    signal,
    reason,
    priceContext,
    modelCycleNote,
    nextSales,
    urgencyOverride
  };
}
