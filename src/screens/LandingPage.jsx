import React, { useState } from 'react';
import { useGame } from '../store/GameProvider';

const LandingPage = () => {
  const { startGame } = useGame();
  const [trollRot, setTrollRot] = useState({ x: 0, y: 0, s: 1.5 });

  const handleTrollMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTrollRot({
      x: y * 60,
      y: -x * 60,
      s: 1.5 + (Math.abs(x) + Math.abs(y))
    });
  };

  return (
    <div className="z-10 text-center flex flex-col items-center px-6 min-h-screen justify-center w-full relative">
      <div 
        className="relative mb-12 group cursor-none" 
        onMouseMove={handleTrollMove}
      >
        <div 
          className="text-[180px] leading-none transition-transform duration-100" 
          style={{ transform: `rotateX(${trollRot.x}deg) rotateY(${trollRot.y}deg) scale(${trollRot.s})` }}
        >
          😈
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 font-bold text-xl uppercase skew-x-12">
          U SMART?
        </div>
      </div>
      <h1 className="font-impact text-7xl md:text-9xl mb-2 glitch-title tracking-tighter">AI QUEST</h1>
      <p className="text-xl font-bold text-lime-400 mb-12 uppercase tracking-widest">ONLY 1% OF DATASETS PASS</p>
      
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <button 
          onClick={startGame} 
          className="brutalist-border-lime bg-black text-lime-400 py-6 text-3xl font-impact uppercase button-glitch chromatic-fx"
        >
          <span className="relative">PROCEED</span>
        </button>
        <div className="text-xs text-red-500 font-bold uppercase animate-pulse">WARNING: HIGH RISK OF FRUSTRATION</div>
      </div>
    </div>
  );
};

export default LandingPage;
