import React, { useState } from 'react';
import { useGame } from '../store/GameProvider';
import GameLayout from '../components/layout/GameLayout';

const Level6_AdvScience = () => {
  const { finishLevel, currentLevelInfo } = useGame();
  
  const [gameState, setGameState] = useState({ 
    analyzed: false, 
    complete: false, 
    steps: 0 
  });
  
  const [selectedDiff, setSelectedDiff] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [feedback, setFeedback] = useState({ msg: "THIS ISN'T A GAME ANYMORE.", type: 'neutral' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);

  const differences = [
    { id: 'theory', label: '01_THEORY_TO_PRACTICE' }
  ];

  const submitAction = () => {
    if (!selectedDiff || !selectedAction) return;
    setIsProcessing(true);
    setGameState(prev => ({ ...prev, steps: prev.steps + 1 }));
    
    const a = selectedAction;
    
    setTimeout(() => {
      setIsProcessing(false);
      
      if (a === 'simulate_robotics' || a === 'simulate_cyber') {
        setGameState(prev => ({ ...prev, analyzed: true }));
        setFeedback({ msg: `✅ ${a.replace('simulate_', '').toUpperCase()} ALGORITHM VERIFIED.`, type: 'success' });
      } else if (a === 'apply_mea') {
        if (!gameState.analyzed) {
          setShake(true);
          setFeedback({ msg: '❌ YOU CANNOT APPLY WHAT YOU HAVE NOT ANALYZED.', type: 'error' });
          setTimeout(() => setShake(false), 500);
        } else {
          setGameState(prev => ({ ...prev, complete: true }));
          setFeedback({ msg: '✅ REAL WORLD DEPLOYMENT SUCCESSFUL.', type: 'success' });
          setTimeout(() => {
            finishLevel({
              efficiency: Math.max(1, 10 - gameState.steps),
              mistakes: gameState.steps > 2 ? gameState.steps - 2 : 0,
              concept: "Synthesis & Real World App",
              realWorld: "You have now essentially programmed a basic logic loop that drives self-driving cars, web-crawlers, and automated cyber-defense scripts."
            });
          }, 1500);
        }
      } else if (a === 'play_games') {
        setShake(true);
        setFeedback({ msg: '❌ GO BACK TO FORTNITE.', type: 'error' });
        setTimeout(() => setShake(false), 500);
      } else {
        setFeedback({ msg: '❌ ERROR: IRRATIONAL ACTION.', type: 'error' });
      }
      
      setSelectedDiff(null);
      setSelectedAction(null);
    }, 400);
  };

  const visualComponent = (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 bg-blue-950 relative ${shake ? 'shake-fx' : ''}`}>
      <div className="absolute inset-0 pixel-bg opacity-30"></div>
      
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl justify-center items-center z-10">
         
         <div className="flex-1 border-4 border-blue-500 bg-blue-900/40 p-4 text-center">
            <h3 className="font-impact text-2xl text-blue-300 mb-4 tracking-wider">MARS ROVER PATHFINDING</h3>
            <div className="h-32 bg-black border-2 border-blue-400 relative overflow-hidden">
               <div className="absolute inset-0 grid-brutal opacity-20"></div>
               {gameState.analyzed && (
                 <div className="absolute top-1/2 left-4 right-4 h-1 border-t-2 border-dashed border-lime-500">
                    <div className="absolute -top-3 right-0 w-6 h-6 bg-lime-500 rounded-full animate-ping"></div>
                 </div>
               )}
            </div>
         </div>

         <div className="flex-1 border-4 border-purple-500 bg-purple-900/40 p-4 text-center">
            <h3 className="font-impact text-2xl text-purple-300 mb-4 tracking-wider">CYBER THREAT MITIGATION</h3>
            <div className="h-32 bg-black border-2 border-purple-400 p-2 flex flex-col gap-1 overflow-hidden">
               <div className="text-[8px] text-purple-300 font-mono text-left opacity-50">INIT_SCAN()...</div>
               {gameState.analyzed && (
                 <>
                   <div className="text-[8px] text-lime-400 font-mono text-left">DIFF FOUND: PORT_OPEN</div>
                   <div className="text-[8px] text-lime-400 font-mono text-left mt-1">OPERATOR: FIREWALL_RULE</div>
                   <div className="text-[8px] text-lime-400 font-mono text-left mt-1">RESULT: SECURE</div>
                 </>
               )}
            </div>
         </div>

      </div>

      {gameState.complete && (
         <div className="absolute z-50 px-12 py-4 bg-white text-black font-impact text-6xl rotate-[-5deg] border-8 border-black shadow-[10px_10px_0px_#00FF00]">
            AI IS JUST YOU<br/>BUT FASTER
         </div>
      )}
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
              onClick={() => setSelectedAction('simulate_robotics')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'simulate_robotics' ? 'bg-blue-500 text-black border-blue-500 scale-[0.98]' : 'bg-black text-blue-400 border-blue-900 hover:border-blue-500 hover:bg-blue-900/30'}`}
            >
              SIM_ROBOTICS
            </button>
            <button 
              onClick={() => setSelectedAction('simulate_cyber')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'simulate_cyber' ? 'bg-purple-500 text-black border-purple-500 scale-[0.98]' : 'bg-black text-purple-400 border-purple-900 hover:border-purple-500 hover:bg-purple-900/30'}`}
            >
              SIM_CYBERSEC
            </button>
            <button 
              onClick={() => setSelectedAction('play_games')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'play_games' ? 'bg-pink-500 text-black border-pink-500 scale-[0.98]' : 'bg-black text-pink-400 border-pink-900 hover:border-pink-500 hover:bg-pink-900/30'}`}
            >
              REVERT_TO_MONKEY
            </button>
            <button 
              onClick={() => setSelectedAction('apply_mea')} 
              className={`border-[3px] text-xs font-bold p-2 transition-all ${selectedAction === 'apply_mea' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              APPLY_LOGIC_PROD
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
      goal="REALIZE WHY THIS MATTERS"
      attempts={gameState.steps}
      visualComponent={visualComponent}
      controlsComponent={controlsComponent}
      differences={differences}
      selectedDiff={selectedDiff}
      selectedAction={selectedAction}
      feedback={feedback}
      scoreDetails={{ score: Math.max(1, 10 - gameState.steps), mistakes: gameState.steps > 2 ? gameState.steps - 2 : 0 }}
    />
  );
};

export default Level6_AdvScience;
