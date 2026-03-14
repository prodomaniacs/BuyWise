import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [screenHistory, setScreenHistory] = useState([]);
  
  const [category, setCategory] = useState(null);
  const [answers, setAnswers] = useState({
    budget: null,
    useCase: null,
    buyingFor: null,
    city: null,
    buyingTimeline: null,
    brandPreference: [],
    brandAvoid: [],
    conflictResolutions: {}
  });
  
  const [conflicts, setConflicts] = useState([]);
  const [scoredProducts, setScoredProducts] = useState([]);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [activeCompareProduct, setActiveCompareProduct] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [emiTenure, setEmiTenure] = useState(12);
  const [emiSelectedProduct, setEmiSelectedProduct] = useState(null);

  const navigate = (screen) => {
    setScreenHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory(prevHistory => prevHistory.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      setCurrentScreen('landing');
    }
  };

  const resetSession = () => {
    setCurrentScreen('landing');
    setScreenHistory([]);
    setCategory(null);
    setAnswers({
      budget: null, useCase: null, buyingFor: null, city: null,
      buyingTimeline: null, brandPreference: [], brandAvoid: [], conflictResolutions: {}
    });
    setConflicts([]);
    setScoredProducts([]);
    setSelectedForCompare([]);
    setActiveCompareProduct(null);
    setExpandedCards({});
  };

  const setDemoSession = () => {
    setCategory('ac');
    setAnswers({
      budget: 45000,
      useCase: 'bedroom',
      buyingFor: 'parents',
      city: 'Jaipur',
      buyingTimeline: 'this-month',
      brandPreference: [],
      brandAvoid: [],
      conflictResolutions: {}
    });
    setScreenHistory(['landing']);
    setCurrentScreen('intake');
  };

  return (
    <AppContext.Provider value={{
      currentScreen, navigate, goBack, screenHistory,
      category, setCategory,
      answers, setAnswers,
      conflicts, setConflicts,
      scoredProducts, setScoredProducts,
      selectedForCompare, setSelectedForCompare,
      activeCompareProduct, setActiveCompareProduct,
      expandedCards, setExpandedCards,
      emiTenure, setEmiTenure,
      emiSelectedProduct, setEmiSelectedProduct,
      resetSession, setDemoSession
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
