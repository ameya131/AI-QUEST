import React, { useState } from 'react';
import { useGame } from './store/GameProvider';
import LandingPage from './screens/LandingPage';
import IntroDocs from './screens/IntroDocs';
import LevelOrchestrator from './screens/LevelOrchestrator';
import LevelResult from './screens/LevelResult';
import FinalEducation from './screens/FinalEducation';

function App() {
  const { screen, reset } = useGame();

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
