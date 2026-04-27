import React, { useState, useEffect } from 'react';
import { useGame } from '../store/GameProvider';
import GameLayout from '../components/layout/GameLayout';

const Level5_BombDefusal = () => {
  const { finishLevel, currentLevelInfo } = useGame();
  
  const [gameState, setGameState] = useState({ 
    timer: 60,
    clueRead: false,
    defused: false,
    exploded: false,
    steps: 0 
  });
  
  const [selectedDiff, setSelectedDiff] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [feedback, setFeedback] = useState({ msg: "RELAX. JUST DON'T EXPLODE.", type: 'neutral' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);

  const differences = [
    { id: 'bomb', label: '01_BOMB_ACTIVE' },
    { id: 'intel', label: '02_NO_INTEL' }
  ];

  const restartLevel = () => {
    setGameState({ timer: 60, clueRead: false, defused: false, exploded: false, steps: 0 });
    setSelectedDiff(null);
    setSelectedAction(null);
    setFeedback({ msg: "RELAX. JUST DON'T EXPLODE.", type: 'neutral' });
    setIsProcessing(false);
    setShake(false);
  };

  useEffect(() => {
    if (gameState.defused || gameState.exploded) return;
    
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.timer <= 1) {
          clearInterval(interval);
          setFeedback({ msg: '💥 BOOM. YOU WERE TOO SLOW.', type: 'error' });
          return { ...prev, timer: 0, exploded: true };
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameState.defused, gameState.exploded]);

  const submitAction = () => {
    if (!selectedDiff || !selectedAction || gameState.exploded || gameState.defused) return;
    setIsProcessing(true);
    setGameState(prev => ({ ...prev, steps: prev.steps + 1 }));
    
    const d = selectedDiff;
    const a = selectedAction;
    
    setTimeout(() => {
      setIsProcessing(false);
      
      if (a === 'cut_red' || a === 'cut_blue') {
        if (!gameState.clueRead) {
          setShake(true);
          setGameState(prev => ({ ...prev, exploded: true }));
          setFeedback({ msg: '💥 BOOM. WHY WOULD YOU GUESS?', type: 'error' });
        } else {
          if (a === 'cut_blue') {
            setGameState(prev => ({ ...prev, defused: true }));
            setFeedback({ msg: '✅ DEFUSED. GOOD JOB READING.', type: 'success' });
            setTimeout(() => {
              finishLevel({
                efficiency: Math.max(1, 10 - gameState.steps),
                mistakes: gameState.steps > 4 ? gameState.steps - 4 : 0,
                concept: "Information Gathering",
                realWorld: "Risk Assessment: Action without information in high-stakes environments (Surgery, Bomb Defusal, Production Deployments) is catastrophic. Gathering information IS a valid operator."
              });
            }, 1500);
          } else {
            setShake(true);
            setGameState(prev => ({ ...prev, exploded: true }));
            setFeedback({ msg: '💥 BOOM. THE MANUAL SAID CUT BLUE. CAN YOU READ?', type: 'error' });
          }
        }
      } else if (d === 'intel' && a === 'read_manual') {
        setGameState(prev => ({ ...prev, clueRead: true }));
        setFeedback({ msg: '✅ MANUAL SAYS: THE RED WIRE IS A TRAP. CUT BLUE.', type: 'success' });
      } else if (a === 'panic') {
        setGameState(prev => ({ ...prev, timer: Math.max(0, prev.timer - 10) }));
        setShake(true);
        setFeedback({ msg: '❌ PANICKING COSTS 10 SECONDS.', type: 'error' });
        setTimeout(() => setShake(false), 500);
      } else {
        setFeedback({ msg: '❌ ERROR: THIS ACTION DOES NOT REDUCE THE DIFFERENCE.', type: 'error' });
      }
      
      setSelectedDiff(null);
      setSelectedAction(null);
    }, 400);
  };

  const visualComponent = (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 bg-zinc-950 relative ${shake || gameState.exploded ? 'shake-fx' : ''}`}>
      {gameState.exploded && (
        <div className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center z-50">
           <div className="font-impact text-[150px] text-yellow-400 rotate-12 scale-150 animate-pulse mix-blend-screen mb-12">BOOM</div>
           <button 
             onClick={restartLevel} 
             className="px-8 py-4 bg-black border-4 border-white text-white font-impact text-3xl hover:bg-white hover:text-black transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer active:scale-95"
           >
             REBOOT SYSTEM
           </button>
        </div>
      )}
      
      {gameState.defused && (
        <div className="absolute inset-0 bg-green-900/50 flex items-center justify-center z-40">
           <div className="font-impact text-7xl text-green-400 border-8 border-green-400 p-4 rotate-[-10deg]">SAFE</div>
        </div>
      )}

      <div className="w-64 h-48 bg-zinc-800 border-8 border-zinc-700 p-4 relative shadow-2xl">
        <div className="absolute top-2 right-2 bg-black px-2 py-1 flex items-center gap-2">
           <div className={`w-3 h-3 rounded-full animate-pulse ${gameState.defused ? 'bg-green-500' : 'bg-red-500'}`}></div>
           <div className="font-mono text-red-500 text-2xl font-bold tracking-widest">{Math.floor(gameState.timer / 60)}:{(gameState.timer % 60).toString().padStart(2, '0')}</div>
        </div>
        
        <div className="mt-12 flex flex-col gap-4">
           {/* RED WIRE */}
           <div className="w-full h-6 bg-red-600 border-y-2 border-red-900 shadow-lg relative">
              <div className="absolute top-1/2 left-3 w-4 h-4 rounded-full bg-zinc-400 -translate-y-1/2"></div>
              <div className="absolute top-1/2 right-3 w-4 h-4 rounded-full bg-zinc-400 -translate-y-1/2"></div>
              {gameState.exploded && selectedAction === 'cut_red' && <div className="absolute top-0 left-1/2 w-4 h-full bg-black -translate-x-1/2"></div>}
           </div>
           
           {/* BLUE WIRE */}
           <div className="w-full h-6 bg-blue-600 border-y-2 border-blue-900 shadow-lg relative">
              <div className="absolute top-1/2 left-3 w-4 h-4 rounded-full bg-zinc-400 -translate-y-1/2"></div>
              <div className="absolute top-1/2 right-3 w-4 h-4 rounded-full bg-zinc-400 -translate-y-1/2"></div>
              {gameState.defused && <div className="absolute top-0 left-1/2 w-4 h-full bg-black -translate-x-1/2"></div>}
           </div>
        </div>
      </div>
      
      {/* MANUAL */}
      <div className="absolute bottom-10 right-10 opacity-80 hover:opacity-100 transition-opacity">
        <div className={`w-24 h-32 border-4 p-2 bg-yellow-100 rotate-12 flex flex-col items-center justify-center text-black font-serif text-center font-bold relative ${gameState.clueRead ? 'border-lime-500 shadow-[0_0_20px_#00FF00]' : 'border-zinc-800'}`}>
           <div className="text-[10px] uppercase">Defusal<br/>Manual</div>
           {gameState.clueRead && (
             <div className="absolute inset-0 bg-white border-4 border-lime-500 p-2 text-[8px] flex items-center justify-center leading-tight">
               "Red is decoy. Cut Blue to live."
             </div>
           )}
        </div>
      </div>
    </div>
  );

  const controlsComponent = (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-500 bg-zinc-900 border-2 border-zinc-800 p-1 pl-2">[1] SELECT PROBLEM</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
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
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-500 bg-zinc-900 border-2 border-zinc-800 p-1 pl-2">[2] SELECT OPERATOR</div>
          <div className="grid grid-cols-2 gap-2 flex-1">
            <button 
              onClick={() => setSelectedAction('read_manual')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'read_manual' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              READ_MANUAL
            </button>
            <button 
              onClick={() => setSelectedAction('panic')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'panic' ? 'bg-pink-500 text-black border-pink-500 scale-[0.98]' : 'bg-black text-pink-400 border-pink-900 hover:border-pink-500 hover:bg-pink-900/30'}`}
            >
              PANIC_FLAIL
            </button>
            <button 
              onClick={() => setSelectedAction('cut_red')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'cut_red' ? 'bg-red-500 text-white border-red-500 scale-[0.98]' : 'bg-black text-red-400 border-red-900 hover:border-red-500 hover:bg-red-900/30'}`}
            >
              CUT_RED
            </button>
            <button 
              onClick={() => setSelectedAction('cut_blue')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'cut_blue' ? 'bg-blue-500 text-white border-blue-500 scale-[0.98]' : 'bg-black text-blue-400 border-blue-900 hover:border-blue-500 hover:bg-blue-900/30'}`}
            >
              CUT_BLUE
            </button>
          </div>
        </div>
      </div>
      <button 
        onClick={submitAction} 
        disabled={!selectedDiff || !selectedAction || isProcessing || gameState.exploded || gameState.defused} 
        className={`bg-white text-black py-4 font-impact text-3xl uppercase border-[4px] border-white transition-all shrink-0 ${(!selectedDiff || !selectedAction || isProcessing) ? 'opacity-20 cursor-not-allowed' : 'button-glitch active:scale-95 hover:bg-lime-400 hover:border-lime-400 hover:text-black'}`}
      >
        {!isProcessing ? (
          <span>{gameState.exploded ? 'SYSTEM DESTROYED' : 'EXECUTE_LOGIC'}</span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            PROCESSING<span className="animate-ping delay-75">.</span><span className="animate-ping delay-150">.</span>
          </span>
        )}
      </button>
    </div>
  );

  return (
    <GameLayout 
      title={currentLevelInfo.title}
      goal="DEFUSE SAFELY. DON'T GUESS."
      attempts={gameState.steps}
      visualComponent={visualComponent}
      controlsComponent={controlsComponent}
      differences={differences}
      selectedDiff={selectedDiff}
      selectedAction={selectedAction}
      feedback={feedback}
      scoreDetails={{ score: Math.max(1, 10 - gameState.steps), mistakes: gameState.steps > 4 ? gameState.steps - 4 : 0 }}
    />
  );
};

export default Level5_BombDefusal;
