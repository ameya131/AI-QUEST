import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useGame } from '../store/GameProvider';
import GameLayout from '../components/layout/GameLayout';

const Level1_RoomEscape = () => {
  const { finishLevel, currentLevelInfo } = useGame();
  
  const [gameState, setGameState] = useState({ powerOn: false, hasKey: false, doorOpen: false, steps: 0 });
  const [selectedDiff, setSelectedDiff] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [feedback, setFeedback] = useState({ msg: "SYSTEM READY. DON'T DISAPPOINT ME.", type: 'neutral' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);

  const differences = [
    { id: 'power', label: '01_POWER_OFF' },
    { id: 'key', label: '02_KEY_MISSING' },
    { id: 'door', label: '03_DOOR_LOCKED' }
  ];

  const submitAction = () => {
    if (!selectedDiff || !selectedAction) return;
    setIsProcessing(true);
    setGameState(prev => ({ ...prev, steps: prev.steps + 1 }));
    
    const d = selectedDiff;
    const a = selectedAction;
    
    setTimeout(() => {
      setIsProcessing(false);
      
      if (a === 'kick') {
        setShake(true);
        setFeedback({ msg: '❌ KICKING? YOUR IQ IS IN SINGLE DIGITS. THIS IS A DOOR, NOT A PIÑATA.', type: 'error' });
        setTimeout(() => setShake(false), 300);
      } else if (a === 'cry') {
        setFeedback({ msg: "❌ EMOTIONAL INSTABILITY DETECTED. YOU'RE EMBARRASSING AI.", type: 'error' });
      } else if (d === 'power' && a === 'battery') {
        setGameState(prev => ({ ...prev, powerOn: true }));
        setFeedback({ msg: '✅ POWER RESTORED. EVEN A BROKEN CLOCK IS RIGHT TWICE A DAY.', type: 'success' });
      } else if (d === 'key' && a === 'search') {
        if (gameState.powerOn) {
          setGameState(prev => ({ ...prev, hasKey: true }));
          setFeedback({ msg: '✅ FOUND KEY. DID YOUR MOM HELP YOU?', type: 'success' });
        } else {
          setShake(true);
          setFeedback({ msg: "❌ IT'S DARK, EINSTEIN. YOU CAN'T SEE. THIS IS SAD.", type: 'error' });
          setTimeout(() => setShake(false), 300);
        }
      } else if (d === 'door' && a === 'open') {
        if (gameState.hasKey) {
          setGameState(prev => ({ ...prev, doorOpen: true }));
          setFeedback({ msg: '✅ ESCAPED. SURPRISING GIVEN YOUR DATASET.', type: 'success' });
          setTimeout(() => {
            finishLevel({
              efficiency: Math.max(1, 10 - gameState.steps),
              mistakes: gameState.steps > 4 ? gameState.steps - 4 : 0,
              concept: "Subgoal Decomposition",
              realWorld: "Robots use this to plan movements. You can't open a door before finding the key, and you can't find a key in the dark."
            });
          }, 1500);
        } else {
          setShake(true);
          setFeedback({ msg: "❌ IT'S LOCKED. OBVIOUSLY. ARE YOU EVEN TRYING?", type: 'error' });
          setTimeout(() => setShake(false), 300);
        }
      } else {
        setFeedback({ msg: '❌ ERROR: LOGIC NOT FOUND. WHAT WERE YOU THINKING?', type: 'error' });
      }
      
      setSelectedDiff(null);
      setSelectedAction(null);
    }, 400);
  };

  const visualComponent = (
    <div className={`relative w-full h-full flex items-center justify-center p-8 ${shake ? 'shake-fx' : ''}`}>
      <div className="absolute top-4 left-4 text-xs font-bold text-white opacity-40">CAM_01_INPUT</div>
      
      <div className={`absolute bottom-0 w-32 md:w-48 h-64 border-4 overflow-hidden top-auto transition-colors duration-1000 ${gameState.doorOpen ? 'border-lime-500 shadow-[0_0_50px_#00FF00]' : 'border-white'}`}>
         {/* Exit background */}
         <div className="absolute inset-0 bg-lime-500/20 flex items-center justify-center">
            <span className="font-impact text-4xl text-lime-400 animate-pulse">EXIT</span>
         </div>
         
         {/* The Sliding Door */}
         <div className={`absolute inset-0 bg-zinc-900 border-l-2 border-r-2 border-zinc-700 transition-transform duration-[1500ms] ease-in-out z-10 ${gameState.doorOpen ? 'translate-x-[105%]' : 'translate-x-0'}`}>
            <div className="absolute top-1/2 left-4 w-2 h-16 bg-zinc-600 -translate-y-1/2"></div>
         </div>
      </div>
      
      {!gameState.hasKey && (
        <div className="absolute bottom-12 left-12 md:left-24">
          <Icon icon="lucide:key" className={`text-6xl transition-opacity ${gameState.powerOn ? 'text-white' : 'text-white opacity-10'}`} />
        </div>
      )}
      
      <div className={`absolute top-12 right-12 md:right-24 w-16 h-16 bg-black border-[4px] flex items-center justify-center ${gameState.powerOn ? 'border-lime-500 shadow-[0_0_20px_#00FF00]' : 'border-white'}`}>
        <div className={`w-3 h-10 ${gameState.powerOn ? 'bg-lime-500 shadow-[0_0_15px_#00FF00]' : 'bg-zinc-800 shadow-none'}`}></div>
      </div>
      
      {!gameState.powerOn && (
        <div className="absolute inset-0 bg-black/80 backdrop-grayscale pointer-events-none display-flex items-center justify-center">
            <div className="font-impact text-zinc-700 text-6xl rotate-45 opacity-50 select-none">NO POWER</div>
        </div>
      )}
    </div>
  );

  const controlsComponent = (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-500 bg-zinc-900 border-2 border-zinc-800 p-1 pl-2">[1] SELECT GAP (DIFFERENCE)</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
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
              onClick={() => setSelectedAction('battery')} 
              className={`border-[3px] font-bold p-2 transition-all ${selectedAction === 'battery' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              INSERT_BATT
            </button>
            <button 
              onClick={() => setSelectedAction('search')} 
              className={`border-[3px] font-bold p-2 transition-all ${selectedAction === 'search' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              SCAN_KEY
            </button>
            <button 
              onClick={() => setSelectedAction('open')} 
              className={`border-[3px] font-bold p-2 transition-all ${selectedAction === 'open' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              TRIGGER_DOOR
            </button>
            <button 
              onClick={() => setSelectedAction('kick')} 
              className={`border-[3px] font-bold p-2 transition-all ${selectedAction === 'kick' ? 'bg-pink-500 text-black border-pink-500 scale-[0.98]' : 'bg-black text-pink-400 border-pink-900 hover:border-pink-500 hover:bg-pink-900/30'}`}
            >
              KICK_ALL (DUMB)
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
      goal="ESCAPE THE ROOM INTELLIGENTLY"
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

export default Level1_RoomEscape;
