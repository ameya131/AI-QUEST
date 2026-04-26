import React from 'react';
import { useGame } from '../store/GameProvider';

const LevelResult = () => {
  const { lastLevelResult, nextLevel, currentLevelInfo } = useGame();

  if (!lastLevelResult) return null;

  return (
    <div className="z-10 text-center flex flex-col items-center px-6 max-w-xl w-full min-h-screen justify-center mx-auto">
      <div className="text-9xl mb-6">🏆</div>
      <h2 className="font-impact text-7xl mb-4 italic text-lime-400 uppercase">SYSTEM SURVIVED</h2>
      
      <div className="w-full brutalist-border border-[3px] border-white p-8 mb-8 bg-black flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="border-r-2 border-white/20 p-4">
            <div className="text-xs text-gray-500">EFFICIENCY</div>
            <div className="text-4xl font-impact">{lastLevelResult.efficiency}/10</div>
          </div>
          <div className="p-4">
            <div className="text-xs text-gray-500">MISTAKES</div>
            <div className="text-4xl font-impact text-pink-500">{lastLevelResult.mistakes}</div>
          </div>
        </div>
        
        <div className="text-left border-t-2 border-white/20 pt-4">
          <p className="font-bold text-pink-500 text-xs mb-1">MEA CONCEPT LEARNED</p>
          <p className="text-sm uppercase mb-4">{lastLevelResult.concept}</p>
          
          <p className="font-bold text-lime-500 text-xs mb-1">REAL WORLD APPLICATION</p>
          <p className="text-sm uppercase">{lastLevelResult.realWorld}</p>
        </div>
      </div>
      
      <button 
        onClick={nextLevel} 
        className="w-full brutalist-border-lime bg-lime-400 text-black py-4 text-2xl font-impact uppercase button-glitch chromatic-fx"
      >
        PROCEED TO NEXT SIMULATION
      </button>
    </div>
  );
};

export default LevelResult;
