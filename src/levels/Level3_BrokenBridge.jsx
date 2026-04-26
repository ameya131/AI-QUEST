import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useGame } from '../store/GameProvider';
import GameLayout from '../components/layout/GameLayout';

const Level3_BrokenBridge = () => {
  const { finishLevel, currentLevelInfo } = useGame();
  
  const [gameState, setGameState] = useState({ 
    hasWood: false, 
    bridgeBuilt: false, 
    crossed: false, 
    steps: 0 
  });
  
  const [selectedDiff, setSelectedDiff] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [feedback, setFeedback] = useState({ msg: "ANALYZE THE ENVIRONMENT.", type: 'neutral' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);
  const [characterPos, setCharacterPos] = useState(10); // percentage

  const differences = [
    { id: 'gap', label: '01_PHYSICAL_GAP' },
    { id: 'material', label: '02_NO_MATERIALS' }
  ];

  const submitAction = () => {
    if (!selectedDiff || !selectedAction) return;
    setIsProcessing(true);
    setGameState(prev => ({ ...prev, steps: prev.steps + 1 }));
    
    const d = selectedDiff;
    const a = selectedAction;
    
    setTimeout(() => {
      setIsProcessing(false);
      
      if (a === 'jump') {
        if (gameState.bridgeBuilt) {
          setShake(true);
          setFeedback({ msg: '❌ YOU HAVE A BRIDGE. WHY JUMP?', type: 'error' });
          setTimeout(() => setShake(false), 500);
        } else {
           setCharacterPos(45); // jump halfway and fall
           setShake(true);
           setFeedback({ msg: '❌ GRAVITY > YOUR OPTIMISM. YOU FELL.', type: 'error' });
           setTimeout(() => {
             setCharacterPos(10);
             setShake(false);
           }, 1000);
        }
      } else if (a === 'walk') {
        if (gameState.bridgeBuilt) {
          setCharacterPos(90);
          setGameState(prev => ({ ...prev, crossed: true }));
          setFeedback({ msg: '✅ CROSSED SUCCESSFULLY. LOGIC PREVAILS.', type: 'success' });
          setTimeout(() => {
            finishLevel({
              efficiency: Math.max(1, 10 - gameState.steps),
              mistakes: gameState.steps > 4 ? gameState.steps - 4 : 0,
              concept: "Creating Path / Re-evaluating State",
              realWorld: "Robotics/Pathfinding: If a direct path A->B is blocked, the agent must execute subgoals to alter the environment (build bridge), creating a new valid path."
            });
          }, 1500);
        } else {
          setShake(true);
          setFeedback({ msg: '❌ WALKING ON AIR IS NOT IN YOUR INSTRUCTION SET.', type: 'error' });
          setTimeout(() => setShake(false), 500);
        }
      } else if (d === 'material' && a === 'harvest') {
        setGameState(prev => ({ ...prev, hasWood: true }));
        setFeedback({ msg: '✅ WOOD ACQUIRED. YOU ARE NOW A LUMBERJACK.', type: 'success' });
      } else if (d === 'gap' && a === 'build') {
        if (gameState.hasWood) {
          setGameState(prev => ({ ...prev, bridgeBuilt: true }));
          setFeedback({ msg: '✅ BRIDGE CONSTRUCTED. GAP ELIMINATED.', type: 'success' });
        } else {
          setShake(true);
          setFeedback({ msg: '❌ BUILD WITH WHAT? YOUR IMAGINATION?', type: 'error' });
          setTimeout(() => setShake(false), 500);
        }
      } else {
        setFeedback({ msg: '❌ ERROR: IRRATIONAL ACTION COMBO.', type: 'error' });
      }
      
      setSelectedDiff(null);
      setSelectedAction(null);
    }, 400);
  };

  const visualComponent = (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 ${shake ? 'shake-fx' : ''} relative overflow-hidden bg-sky-900`}>
      <div className="absolute top-4 left-4 text-xs font-bold text-white opacity-40">CAM_03_EXTERIOR</div>
      
      {/* Sun/Moon */}
      <div className="absolute top-10 right-20 w-16 h-16 bg-white rounded-full opacity-80 shadow-[0_0_50px_#FFF]"></div>
      
      {/* Landmass Left */}
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-zinc-950 border-t-8 border-r-8 border-lime-800"></div>
      
      {/* Landmass Right */}
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-zinc-950 border-t-8 border-l-8 border-lime-800">
        {/* Goal Flag */}
        <div className="absolute bottom-full right-10">
           <div className="w-1 h-32 bg-white"></div>
           <div className="absolute top-0 left-0 w-16 h-10 bg-lime-500 border-2 border-white flex items-center justify-center font-bold text-xs text-black">GOAL</div>
        </div>
      </div>
      
      {/* The Gap (Lava/Water) */}
      <div className="absolute bottom-0 left-[40%] text-center right-[40%] h-[30%] bg-pink-600/30 border-t-4 border-pink-500 flex items-center justify-center">
        <div className="font-impact text-pink-500 text-3xl opacity-50 tracking-widest animate-pulse">DANGER</div>
      </div>

      {/* Tree for harvesting */}
      {!gameState.hasWood && (
        <div className="absolute bottom-[40%] left-4 flex flex-col items-center">
           <div className="w-16 h-16 bg-lime-700 rounded-full border-4 border-lime-500 -mb-4"></div>
           <div className="w-6 h-20 bg-amber-800 border-4 border-amber-950"></div>
           <div className="text-[10px] bg-black px-1 font-bold mt-2 border border-white">RESOURCES</div>
        </div>
      )}

      {/* Bridge */}
      {gameState.bridgeBuilt && (
        <div className="absolute bottom-[35%] left-[38%] right-[38%] h-4 bg-amber-600 border-y-4 border-amber-900 z-10 shadow-[0_10px_20px_#000]"></div>
      )}

      {/* Character */}
      <div 
        className="absolute bottom-[40%] z-20 transition-all duration-500 ease-in-out"
        style={{ left: `${characterPos}%`, transform: `translateY(${characterPos > 30 && characterPos < 70 && !gameState.bridgeBuilt ? '150px' : '0'})` }}
      >
        <div className="text-5xl">🤖</div>
      </div>
    </div>
  );

  const controlsComponent = (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="flex-1 flex flex-col gap-2">
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
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-500 bg-zinc-900 border-2 border-zinc-800 p-1 pl-2">[2] SELECT OPERATOR</div>
          <div className="grid grid-cols-2 gap-2 flex-1">
            <button 
              onClick={() => setSelectedAction('harvest')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'harvest' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              HARVEST_WOOD
            </button>
            <button 
              onClick={() => setSelectedAction('build')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'build' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              BUILD_BRIDGE
            </button>
            <button 
              onClick={() => setSelectedAction('jump')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'jump' ? 'bg-pink-500 text-black border-pink-500 scale-[0.98]' : 'bg-black text-pink-400 border-pink-900 hover:border-pink-500 hover:bg-pink-900/30'}`}
            >
              YEET_ACROSS (DUMB)
            </button>
            <button 
              onClick={() => setSelectedAction('walk')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'walk' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              WALK_FORWARD
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
      goal="CROSS TO THE OTHER SIDE"
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

export default Level3_BrokenBridge;
