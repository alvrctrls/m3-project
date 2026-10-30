/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { TabType } from './types/transit';
import { Header } from './components/common/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HomeScreen } from './components/home/HomeScreen';
import { ActivityScreen } from './components/activity/ActivityScreen';
import { AccountScreen } from './components/account/AccountScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedSaccoId, setSelectedSaccoId] = useState<string>('all');
  const [activeDestination, setActiveDestination] = useState<string>('Westlands (Sarit/The Mall)');
  const [activeOrigin, setActiveOrigin] = useState<string>('Kencom Terminal (CBD)');
  const [activeRouteId, setActiveRouteId] = useState<string | undefined>('route-e105-westlands');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  // Navigate to Activity with pre-filled destination/route/origin
  const handleNavigateToActivity = (
    destinationQuery?: string,
    selectedRouteId?: string,
    originQuery?: string
  ) => {
    if (destinationQuery) {
      setActiveDestination(destinationQuery);
    }
    if (originQuery) {
      setActiveOrigin(originQuery);
    }
    setActiveRouteId(selectedRouteId);
    setCurrentTab('activity');
  };

  // Keep journey selections synchronized when user edits them in Activity
  const handleUpdateJourneyState = (
    originQuery: string,
    destinationQuery: string,
    selectedRouteId?: string | null
  ) => {
    setActiveOrigin(originQuery);
    setActiveDestination(destinationQuery);
    setActiveRouteId(selectedRouteId || undefined);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#111827] flex flex-col selection:bg-[#00e575] selection:text-[#0b1b3d]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-slate-300 focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-[#0b1b3d] focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Top Header with lowercase m3 branding */}
      <Header
        onOpenProfile={() => setCurrentTab('account')}
        activeSaccoCount={7}
      />

      {/* Keep primary navigation early in keyboard order; it remains fixed visually. */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 w-full max-w-5xl mx-auto">
        {currentTab === 'home' && (
          <HomeScreen
            selectedSaccoId={selectedSaccoId}
            onSelectSacco={setSelectedSaccoId}
            onNavigateToActivity={handleNavigateToActivity}
          />
        )}

        {currentTab === 'activity' && (
          <ActivityScreen
            selectedSaccoId={selectedSaccoId}
            onSelectSacco={setSelectedSaccoId}
            initialOrigin={activeOrigin}
            initialDestination={activeDestination}
            initialRouteId={activeRouteId}
            onUpdateJourneyState={handleUpdateJourneyState}
          />
        )}

        {currentTab === 'account' && (
          <AccountScreen
            onReturnToPlanner={() => setCurrentTab('activity')}
          />
        )}
      </main>

    </div>
  );
}

