import React, { useState, useEffect } from 'react';
import { useGame } from './store/GameProvider';
import { playClick } from './utils/audioManager';
import LandingPage from './screens/LandingPage';
import IntroDocs from './screens/IntroDocs';
import LevelOrchestrator from './screens/LevelOrchestrator';
import LevelResult from './screens/LevelResult';
import FinalEducation from './screens/FinalEducation';

function App() {
  const { screen, reset } = useGame();

  useEffect(() => {
    const handleGlobalClick = (e) => {
      const clickTarget = e.target.closest('button, [role="button"]');
      if (clickTarget) {
        playClick();
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative select-none">
      <div className="absolute inset-0 pixel-bg pointer-events-none"></div>

      {screen === 'landing' && <LandingPage />}
      {screen === 'intro' && <IntroDocs />}
      {screen === 'game' && <LevelOrchestrator />}
      {screen === 'results' && <LevelResult />}
      {screen === 'end' && <FinalEducation />}
    </div>
  )
}

export default App
