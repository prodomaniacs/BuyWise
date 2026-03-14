/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Landing from './components/screens/Landing';
import Intake from './components/screens/Intake';
import ConflictResolution from './components/screens/ConflictResolution';
import Results from './components/screens/Results';
import Compare from './components/screens/Compare';
import VoiceOfCustomer from './components/screens/VoiceOfCustomer';
import OwnershipCost from './components/screens/OwnershipCost';
import BuyNowOrWait from './components/screens/BuyNowOrWait';
import LocationIntelligence from './components/screens/LocationIntelligence';
import StoreLocator from './components/screens/StoreLocator';

function MainApp() {
  const { currentScreen } = useAppContext();

  return (
    <div className="min-h-screen bg-surface font-sans text-text-primary">
      {currentScreen === 'landing' && <Landing />}
      {currentScreen === 'intake' && <Intake />}
      {currentScreen === 'conflict' && <ConflictResolution />}
      {currentScreen === 'results' && <Results />}
      {currentScreen === 'compare' && <Compare />}
      {currentScreen === 'voc' && <VoiceOfCustomer />}
      {currentScreen === 'cost' && <OwnershipCost />}
      {currentScreen === 'timing' && <BuyNowOrWait />}
      {currentScreen === 'location' && <LocationIntelligence />}
      {currentScreen === 'store' && <StoreLocator />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

