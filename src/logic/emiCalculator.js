export function calculateEMI(principal, tenureMonths, isNoCost) {
  if (isNoCost) {
    return Math.round(principal / tenureMonths);
  } else {
    // 14% standard interest rate reducing balance
    const r = 14 / 12 / 100;
    const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
    return Math.round(emi);
  }
}
