import React from 'react';
import { useGame } from '../store/GameProvider';

const IntroDocs = () => {
  const { playLevel } = useGame();

  return (
    <div className="z-10 text-center flex flex-col items-center px-6 min-h-screen justify-center w-full max-w-2xl mx-auto">
      <h2 className="font-impact text-5xl mb-6 text-pink-500 uppercase glitch-title">What is MEA?</h2>
      
      <div className="w-full brutalist-border border-[3px] border-white p-6 mb-8 bg-zinc-900 flex flex-col gap-6 text-left">
        <p className="font-bold text-sm text-lime-400">MEAN-END ANALYSIS (MEA)</p>
        <p className="text-sm">AI doesn't guess. It thinks.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-zinc-700 p-3 bg-black">
            <span className="text-pink-500 font-bold block mb-1">1. CURRENT STATE</span>
            <span className="text-xs">Where you are now. (Usually failing).</span>
          </div>
          <div className="border-2 border-zinc-700 p-3 bg-black">
            <span className="text-lime-500 font-bold block mb-1">2. GOAL STATE</span>
            <span className="text-xs">Where you want to be.</span>
          </div>
          <div className="border-2 border-white p-3 bg-white text-black font-bold col-span-1 md:col-span-2">
            <span className="block mb-1">3. THE DIFFERENCE (PROBLEM)</span>
            <span className="text-xs">What is stopping you from reaching the goal?</span>
          </div>
          <div className="border-2 border-zinc-700 p-3 bg-black">
            <span className="text-blue-400 font-bold block mb-1">4. OPERATOR (ACTION)</span>
            <span className="text-xs">An action that specifically reduces the difference.</span>
          </div>
          <div className="border-2 border-zinc-700 p-3 bg-black">
            <span className="text-yellow-400 font-bold block mb-1">5. RESULT</span>
            <span className="text-xs">Profit. Or failure. Repeat until win.</span>
          </div>
        </div>
      </div>

      <button 
        onClick={playLevel} 
        className="w-full brutalist-border-lime bg-lime-400 text-black py-4 text-2xl font-impact uppercase button-glitch chromatic-fx"
      >
        I UNDERSTAND (PROBABLY A LIE) --&gt; START SIMULATION
      </button>
    </div>
  );
};

export default IntroDocs;
