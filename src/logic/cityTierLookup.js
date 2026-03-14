export const cityTierLookup = {
  "Mumbai": "metro",
  "Delhi": "metro",
  "Bengaluru": "metro",
  "Chennai": "metro",
  "Hyderabad": "metro",
  "Kolkata": "metro",
  "Pune": "tier2",
  "Ahmedabad": "tier2",
  "Jaipur": "tier2",
  "Lucknow": "tier2",
  "Chandigarh": "tier2",
  "Indore": "tier2",
  "Coimbatore": "tier2",
  "Kochi": "tier2",
  "Bhubaneswar": "tier2",
  "Guwahati": "tier2",
  "default": "tier3"
};

export function getCityTier(city) {
  if (!city) return "tier3";
  return cityTierLookup[city] || "tier3";
}
