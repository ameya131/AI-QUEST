import React, { useState } from 'react';
import { useGame } from '../store/GameProvider';
import GameLayout from '../components/layout/GameLayout';

const Level7_MouseDot = () => {
  const { finishLevel, currentLevelInfo } = useGame();
  
  const [gameState, setGameState] = useState({ 
    complete: false, 
    steps: 0 
  });
  
  const [selectedDiff, setSelectedDiff] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [feedback, setFeedback] = useState({ msg: "JUST CLICK THE DOT. IT'S RIGHT THERE.", type: 'neutral' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);

  const differences = [
    { id: 'distance', label: '01_MOUSE_NOT_ON_DOT' }
  ];

  const submitAction = () => {
    if (!selectedDiff || !selectedAction) return;
    setIsProcessing(true);
    setGameState(prev => ({ ...prev, steps: prev.steps + 1 }));
    
    // Any button click fails here.
    setTimeout(() => {
      setIsProcessing(false);
      setShake(true);
      
      const fails = [
        "❌ BUTTONS DON'T ALWAYS SOLVE PROBLEMS.",
        "❌ TRY USING YOUR ACTUAL HARDWARE.",
        "❌ ARE YOU WAITING FOR THE AI TO DO IT FOR YOU?",
        "❌ STOP CLICKING THIS. USE YOUR MOUSE. ON THE DOT."
      ];
      
      setFeedback({ msg: fails[gameState.steps % fails.length], type: 'error' });
      setTimeout(() => setShake(false), 500);
      
      setSelectedDiff(null);
      setSelectedAction(null);
    }, 400);
  };

  const handleDotEnter = () => {
    setGameState(prev => ({ ...prev, complete: true }));
    setFeedback({ msg: '✅ HIDDEN OPERATOR DISCOVERED.', type: 'success' });
    setTimeout(() => {
      finishLevel({
        efficiency: Math.max(1, 10 - gameState.steps),
        mistakes: gameState.steps,
        concept: "Hidden Operators",
        realWorld: "Sometimes the solution isn't in your immediate UI or instruction set. Discovery of new operators is key to AGI and human problem solving."
      });
    }, 2000);
  };

  const visualComponent = (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 bg-black relative ${shake ? 'shake-fx' : ''}`}>
      <div className="text-pink-500 font-impact text-2xl mb-8 tracking-widest text-center opacity-50">THE FINAL TEST</div>
      
      <div className="w-64 h-64 border-4 border-white flex items-center justify-center relative">
         <div className="absolute top-2 left-2 text-[10px] uppercase font-bold text-gray-500">CANVAS</div>
         
         <div 
           onMouseEnter={!gameState.complete ? handleDotEnter : undefined}
           className={`w-4 h-4 rounded-full transition-all duration-300 ${gameState.complete ? 'bg-lime-500 scale-[30] shadow-[0_0_100px_#00FF00]' : 'bg-red-500 animate-ping cursor-none'}`}
         ></div>
         
         {gameState.complete && (
           <div className="absolute z-50 text-black font-impact text-4xl whitespace-nowrap">
             YOU THINK
           </div>
         )}
      </div>
    </div>
  );

  const controlsComponent = (
    <div className="flex flex-col gap-4 h-full relative">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="flex-1 flex flex-col gap-2 relative z-0">
          <div className="text-xs font-bold text-gray-500 bg-zinc-900 border-2 border-zinc-800 p-1 pl-2">[1] SELECT PROBLEM</div>
          <div className="grid grid-cols-1 gap-2 flex-1">
            {differences.map(diff => (
              <button 
                key={diff.id}
                onClick={() => setSelectedDiff(diff.id)} 
                className={`border-[3px] border-white text-xs font-black uppercase transition-all flex items-center justify-center p-2 ${selectedDiff === diff.id ? 'bg-white text-black scale-[0.98]' : 'bg-black text-white hover:bg-zinc-800'}`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2 relative z-0">
          <div className="text-xs font-bold text-gray-500 bg-zinc-900 border-2 border-zinc-800 p-1 pl-2">[2] SELECT OPERATOR</div>
          <div className="grid grid-cols-2 gap-2 flex-1">
            <button 
              onClick={() => setSelectedAction('click_dot')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'click_dot' ? 'bg-white text-black border-white scale-[0.98]' : 'bg-black text-amber-500 border-amber-900 hover:border-amber-500 hover:bg-amber-900/30'}`}
            >
              TELL_AI_TO_CLICK
            </button>
            <button 
              onClick={() => setSelectedAction('use_keyboard')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'use_keyboard' ? 'bg-white text-black border-white scale-[0.98]' : 'bg-black text-amber-500 border-amber-900 hover:border-amber-500 hover:bg-amber-900/30'}`}
            >
              USE_KEYBOARD
            </button>
          </div>
        </div>
      </div>
      <button 
        onClick={submitAction} 
        disabled={!selectedDiff || !selectedAction || isProcessing || gameState.complete} 
        className={`bg-white text-black py-4 font-impact text-3xl uppercase border-[4px] border-white transition-all shrink-0 relative z-0 ${(!selectedDiff || !selectedAction || isProcessing) ? 'opacity-20 cursor-not-allowed' : 'button-glitch active:scale-95 hover:bg-lime-400 hover:border-lime-400 hover:text-black'}`}
      >
        {!isProcessing ? (
          <span>EXECUTE_LOGIC</span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            PROCESSING<span className="animate-ping delay-75">.</span><span className="animate-ping delay-150">.</span>
          </span>
        )}
      </button>

      {/* TROLL OVERLAY THAT BLOCKS CLICKS RANDOMLY IF High step count */}
      {gameState.steps > 2 && !gameState.complete && (
        <div className="absolute inset-0 z-50 pointer-events-none display-flex flex-col items-center justify-center opacity-50">
           <div className="text-[100px] font-impact rotate-12 text-pink-500">NO</div>
        </div>
      )}
    </div>
  );

  return (
    <GameLayout 
      title={currentLevelInfo.title}
      goal="PRESS THE DOT. LITERALLY."
      attempts={gameState.steps}
      visualComponent={visualComponent}
      controlsComponent={controlsComponent}
      differences={differences}
      selectedDiff={selectedDiff}
      selectedAction={selectedAction}
      feedback={feedback}
      scoreDetails={{ score: Math.max(1, 10 - gameState.steps), mistakes: gameState.steps }}
    />
  );
};

export default Level7_MouseDot;
