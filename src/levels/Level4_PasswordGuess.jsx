import React, { useState } from 'react';
import { useGame } from '../store/GameProvider';
import GameLayout from '../components/layout/GameLayout';

const Level4_PasswordGuess = () => {
  const { finishLevel, currentLevelInfo } = useGame();
  
  const [gameState, setGameState] = useState({ 
    searchSpace: 1000000, 
    cluesFound: 0, 
    unlocked: false, 
    steps: 0 
  });
  
  const [selectedDiff, setSelectedDiff] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [feedback, setFeedback] = useState({ msg: "ACCESS DENIED.", type: 'neutral' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);
  const [hackingProgress, setHackingProgress] = useState(0);

  const differences = [
    { id: 'space', label: '01_SEARCH_SPACE_HUGE' },
    { id: 'auth', label: '02_NOT_AUTHENTICATED' }
  ];

  const submitAction = () => {
    if (!selectedDiff || !selectedAction) return;
    setIsProcessing(true);
    setGameState(prev => ({ ...prev, steps: prev.steps + 1 }));
    
    const d = selectedDiff;
    const a = selectedAction;
    
    setTimeout(() => {
      setIsProcessing(false);
      
      if (a === 'brute_force') {
        if (gameState.searchSpace > 100) {
          setShake(true);
          setHackingProgress(5);
          setFeedback({ msg: `❌ BRUTE FORCE ESTIMATED TIME: 400 YEARS. I'LL WAIT.`, type: 'error' });
          setTimeout(() => { setShake(false); setHackingProgress(0); }, 500);
        } else {
          setHackingProgress(100);
          setGameState(prev => ({ ...prev, unlocked: true }));
          setFeedback({ msg: '✅ BRUTE FORCE SUCCESSFUL DUE TO TINY SEARCH SPACE.', type: 'success' });
          setTimeout(() => {
            finishLevel({
              efficiency: Math.max(1, 10 - gameState.steps),
              mistakes: gameState.steps > 4 ? gameState.steps - 4 : 0,
              concept: "Reduce Search Space",
              realWorld: "Search algorithms (like A* or Alpha-Beta pruning) don't try everything. They actively look for ways to eliminate millions of wrong answers before guessing."
            });
          }, 1500);
        }
      } else if (d === 'space' && a === 'find_clues') {
        if (gameState.cluesFound === 0) {
          setGameState(prev => ({ ...prev, cluesFound: 1, searchSpace: 5000 }));
          setFeedback({ msg: '✅ CLUE 1: IT\'S A 4 DIGIT PIN. SEARCH SPACE REDUCED.', type: 'success' });
        } else if (gameState.cluesFound === 1) {
          setGameState(prev => ({ ...prev, cluesFound: 2, searchSpace: 10 }));
          setFeedback({ msg: '✅ CLUE 2: STARTS WITH 123. JUST GUESS IT NOW.', type: 'success' });
        } else {
          setFeedback({ msg: '⚠️ NO MORE CLUES. JUST LOG IN.', type: 'neutral' });
        }
      } else if (d === 'auth' && a === 'login') {
        if (gameState.searchSpace > 100) {
          setShake(true);
          setFeedback({ msg: '❌ INCORRECT PASSWORD. STOP GUESSING RANDOMLY.', type: 'error' });
          setTimeout(() => setShake(false), 500);
        } else {
          setFeedback({ msg: '⚠️ JUST BRUTE FORCE THE LAST 10, GENIUS.', type: 'neutral' });
        }
      } else {
        setFeedback({ msg: '❌ ERROR: THIS ACTION DOES NOT MAKE SENSE HERE.', type: 'error' });
      }
      
      setSelectedDiff(null);
      setSelectedAction(null);
    }, 400);
  };

  const visualComponent = (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 ${shake ? 'shake-fx' : ''} bg-zinc-950`}>
      <h2 className="text-pink-500 font-impact text-4xl mb-8 tracking-widest text-center">SYSTEM MAINFRAME</h2>
      
      <div className="w-full max-w-sm border-4 border-zinc-800 bg-black p-6 relative">
        <div className="flex justify-between text-[10px] text-zinc-500 mb-6 font-mono border-b-2 border-zinc-800 pb-2">
          <span>TERMINAL_V1.0</span>
          <span>ROOT_OVR</span>
        </div>
        
        <div className="flex flex-col gap-4 text-center">
          <div className="font-mono text-zinc-400 text-sm">POSSIBLE COMBINATIONS:</div>
          <div className={`font-impact text-5xl transition-all ${gameState.searchSpace < 100 ? 'text-lime-500' : 'text-red-500'}`}>
            {gameState.searchSpace.toLocaleString()}
          </div>
        </div>

        {hackingProgress > 0 && (
          <div className="mt-8 border-2 border-white p-1">
             <div className="h-4 bg-lime-500 transition-all duration-[400s]" style={{ width: `${hackingProgress}%` }}></div>
             <div className="text-[10px] text-center mt-1">BRUTE_FORCING_WAIT...</div>
          </div>
        )}

        {gameState.unlocked && (
           <div className="absolute inset-0 bg-lime-500 text-black flex items-center justify-center font-impact text-5xl">
             ACCESS GRANTED
           </div>
        )}
      </div>

      <div className="mt-8 flex gap-4 text-xs font-mono">
         <div className={`px-4 py-2 border-2 ${gameState.cluesFound >= 1 ? 'border-lime-500 text-lime-500' : 'border-zinc-800 text-zinc-500'}`}>
           [CLUE_01] {gameState.cluesFound >= 1 ? '4_DIGITS' : 'HIDDEN'}
         </div>
         <div className={`px-4 py-2 border-2 ${gameState.cluesFound >= 2 ? 'border-lime-500 text-lime-500' : 'border-zinc-800 text-zinc-500'}`}>
           [CLUE_02] {gameState.cluesFound >= 2 ? 'STARTS_123' : 'HIDDEN'}
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
              onClick={() => setSelectedAction('find_clues')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'find_clues' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              SEARCH_CLUES
            </button>
            <button 
              onClick={() => setSelectedAction('login')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'login' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              LOG_IN
            </button>
            <button 
              onClick={() => setSelectedAction('brute_force')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all col-span-2 ${selectedAction === 'brute_force' ? 'bg-pink-500 text-black border-pink-500 scale-[0.98]' : 'bg-black text-pink-400 border-pink-900 hover:border-pink-500 hover:bg-pink-900/30'}`}
            >
              INITIATE_BRUTE_FORCE
            </button>
          </div>
        </div>
      </div>
      <button 
        onClick={submitAction} 
        disabled={!selectedDiff || !selectedAction || isProcessing} 
        className={`bg-white text-black py-4 font-impact text-3xl uppercase border-[4px] border-white transition-all shrink-0 ${(!selectedDiff || !selectedAction || isProcessing) ? 'opacity-20 cursor-not-allowed' : 'button-glitch active:scale-95 hover:bg-lime-400 hover:border-lime-400 hover:text-black'}`}
      >
        {!isProcessing ? (
          <span>EXECUTE_LOGIC</span>
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
      goal="UNLOCK THE MAINFRAME"
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

export default Level4_PasswordGuess;
