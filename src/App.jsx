import React, { useState } from 'react';
import { useGame } from './store/GameProvider';
import LandingPage from './screens/LandingPage';
import IntroDocs from './screens/IntroDocs';
import LevelOrchestrator from './screens/LevelOrchestrator';
import LevelResult from './screens/LevelResult';

function App() {
  const { screen, reset } = useGame();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative select-none">
      <div className="absolute inset-0 pixel-bg pointer-events-none"></div>

      {screen === 'landing' && <LandingPage />}
      {screen === 'intro' && <IntroDocs />}
      {screen === 'game' && <LevelOrchestrator />}
      {screen === 'results' && <LevelResult />}
      {screen === 'end' && (
        <div className="text-center text-lime-400 z-10 w-full max-w-xl">
           <h1 className="text-7xl font-impact glitch-title mb-4">SIMULATION COMPLETE</h1>
           <p className="font-bold">YOUR DATASET IS DEEMED: ACCEPTABLE.</p>
           <button onClick={() => window.location.reload()} className="mt-8 brutalist-border-lime bg-lime-400 text-black py-4 px-8 text-xl font-impact uppercase button-glitch chromatic-fx">
             RESTART REALITY
           </button>
        </div>
      )}
    </div>
  )
}

export default App
