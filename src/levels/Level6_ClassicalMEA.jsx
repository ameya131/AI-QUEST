import React, { useState, useEffect } from 'react';
import { useGame } from '../store/GameProvider';
import GameLayout from '../components/layout/GameLayout';

// Simple Web Audio API sound generator
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch (e) {
    console.error(e);
  }
};

const Level6_ClassicalMEA = () => {
  const { finishLevel, currentLevelInfo } = useGame();
  
  // State elements
  const [gameState, setGameState] = useState({ 
    complete: false, 
    steps: 0 
  });

  const [objects, setObjects] = useState({
    circle: { visible: true, x: -40, y: 30, scale: 1 },
    diamond: { visible: true, x: -40, y: 30, scale: 0.8 },
    dot: { visible: true, x: 40, y: -40, scale: 0.4 }
  });

  const [selectedDiff, setSelectedDiff] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [feedback, setFeedback] = useState({ msg: "TARGET: [EMPTY CIRCLE. EXPANDED DIAMOND OUTSIDE].", type: 'neutral' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);

  const checkWinCondition = (newObjs) => {
    // Expected: dot deleted, expanded diamond moved to top right
    if (!newObjs.dot.visible && 
         newObjs.diamond.x === 40 && newObjs.diamond.y === -40 && 
         newObjs.diamond.scale >= 1.5 &&
         newObjs.circle.visible) {
      return true;
    }
    return false;
  };

  const differences = [
    { id: 'diff_location', label: '01_DIAMOND_TRAPPED' },
    { id: 'diff_noise', label: '02_NOISE_DETECTED' },
  ];

  const submitAction = () => {
    if (!selectedDiff || !selectedAction) return;
    playSound('click');
    setIsProcessing(true);
    setGameState(prev => ({ ...prev, steps: prev.steps + 1 }));
    
    setTimeout(() => {
      setIsProcessing(false);
      let newObjs = { ...objects };
      let success = false;
      let errorMsg = "Nothing happened. Revolutionary.";

      if (!selectedObject) {
         errorMsg = "You didn't select an object. Use your mouse. Duh.";
      } else {
         const obj = newObjs[selectedObject];
         
         if (selectedAction === 'delete') {
            if (selectedObject === 'dot') {
               newObjs.dot.visible = false;
               success = true;
               setFeedback({ msg: '✅ NOISE REDUCED.', type: 'success' });
            } else {
               errorMsg = `Deleting the ${selectedObject} destroys our target. Are you trying?`;
            }
         } else if (selectedAction === 'move') {
            if (selectedObject === 'diamond') {
               newObjs.diamond.x = 40;
               newObjs.diamond.y = -40;
               success = true;
               setFeedback({ msg: '✅ DIAMOND EXTRACTED.', type: 'success' });
            } else if (selectedObject === 'circle') {
               newObjs.circle.x = 0;
               newObjs.circle.y = 0;
               success = true;
               setFeedback({ msg: '✅ CIRCLE CENTERED. NOT TARGET THOUGH.', type: 'success' });
            } else {
               errorMsg = "Moving that is pointless.";
            }
         } else if (selectedAction === 'expand') {
            if (selectedObject === 'diamond') {
               newObjs.diamond.scale = 2;
               success = true;
               setFeedback({ msg: '✅ DIAMOND EXPANDED. SUBGOAL MET.', type: 'success' });
            } else if (selectedObject === 'circle') {
               newObjs.circle.scale = 2;
               success = true;
               setFeedback({ msg: '✅ CIRCLE EXPANDED. DOES NOT HELP.', type: 'success' });
            } else {
               errorMsg = "Expanding that is logically flawed.";
            }
         }
      }

      setObjects(newObjs);

      if (!success) {
         setShake(true);
         playSound('error');
         setFeedback({ msg: `❌ ${errorMsg}`, type: 'error' });
         setTimeout(() => setShake(false), 500);
      } else {
         playSound('success');
         if (checkWinCondition(newObjs)) {
             setGameState(prev => ({ ...prev, complete: true }));
             setFeedback({ msg: '🏆 CLASSICAL MEA STATE ACHIEVED.', type: 'success' });
             playSound('success');
             setTimeout(() => {
               finishLevel({
                 efficiency: Math.max(1, 10 - gameState.steps),
                 mistakes: gameState.steps > 3 ? gameState.steps - 3 : 0,
                 concept: "Classical MEA Transformation",
                 realWorld: "You discovered the roots of AI reasoning: operator discovery, hidden subgoals, sequential execution."
               });
             }, 2500);
         }
      }
      
      setSelectedAction(null);
    }, 500);
  };

  const visualComponent = (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 bg-[#0a0a0c] relative ${shake ? 'shake-fx' : ''}`}>
      <div className="absolute inset-0 pixel-bg opacity-20"></div>
      
      <div className="text-lime-500 font-impact text-xl mb-4 tracking-widest text-center z-10 opacity-70">
         SYMBOLIC REASONING CHAMBER
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center w-full justify-center z-10 pt-4 pb-8">
        <div className="relative w-64 h-64 border border-zinc-800 bg-[#ccd5e0] shadow-[0_0_30px_rgba(255,255,255,0.05)] flex items-center justify-center overflow-hidden z-10">
           <div className="absolute top-2 left-2 text-[10px] uppercase font-bold text-zinc-600">INPUT STATE</div>
           
           {/* Circle */}
           {objects.circle.visible && (
              <div 
                 onClick={() => setSelectedObject('circle')}
                 className={`absolute w-20 h-20 bg-white border-[3px] border-black rounded-full transition-all duration-700 ease-in-out cursor-pointer hover:shadow-[0_0_15px_#ffffff] ${selectedObject === 'circle' ? 'ring-4 ring-black/50' : ''}`}
                 style={{ transform: `translate(${objects.circle.x}px, ${objects.circle.y}px) scale(${objects.circle.scale})`, zIndex: selectedObject === 'circle' ? 20 : 10 }}
              />
           )}

           {/* Diamond */}
           {objects.diamond.visible && (
              <div 
                 onClick={() => setSelectedObject('diamond')}
                 className={`absolute w-12 h-12 bg-[#9fdb95] border-[3px] border-black transition-all duration-700 ease-in-out cursor-pointer hover:shadow-[0_0_15px_#9fdb95] ${selectedObject === 'diamond' ? 'ring-4 ring-black/50' : ''}`}
                 style={{ transform: `translate(${objects.diamond.x}px, ${objects.diamond.y}px) rotate(45deg) scale(${objects.diamond.scale})`, zIndex: selectedObject === 'diamond' ? 20 : 15 }}
              />
           )}

           {/* Dot */}
           {objects.dot.visible && (
              <div 
                 onClick={() => setSelectedObject('dot')}
                 className={`absolute w-6 h-6 bg-black rounded-full transition-all duration-700 ease-in-out cursor-pointer hover:shadow-[0_0_15px_#000000] ${selectedObject === 'dot' ? 'ring-4 ring-white' : ''}`}
                 style={{ transform: `translate(${objects.dot.x}px, ${objects.dot.y}px) scale(${objects.dot.scale})`, zIndex: selectedObject === 'dot' ? 20 : 10 }}
              />
           )}

           {gameState.complete && (
              <div className="absolute inset-0 bg-lime-500/20 mix-blend-overlay z-30 animate-pulse pointer-events-none"></div>
           )}
        </div>

        <div className="hidden md:block font-impact text-2xl text-zinc-600 rotate-90 md:rotate-0">➔</div>

        {/* Goal Canvas */}
        <div className="relative w-48 h-48 border border-zinc-800 bg-[#ccd5e0] flex items-center justify-center overflow-hidden opacity-70 cursor-default pointer-events-none">
           <div className="absolute top-2 left-2 text-[10px] uppercase font-bold text-zinc-600">GOAL STATE</div>
           <div className="absolute w-16 h-16 bg-white border-[3px] border-black rounded-full" style={{ transform: 'translate(-30px, 25px)' }}></div>
           <div className="absolute w-16 h-16 bg-[#9fdb95] border-[3px] border-black" style={{ transform: 'translate(30px, -30px) rotate(45deg)' }}></div>
        </div>
      </div>
      
      <div className="mt-6 text-xs font-mono text-zinc-400 z-10 text-center">
         CLICK A SHAPE TO TARGET. THEN EXECUTE AN OPERATOR.
      </div>
    </div>
  );

  const controlsComponent = (
    <div className="flex flex-col gap-4 h-full relative">
      <div className="flex flex-col lg:flex-row gap-4 h-full z-10">
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-400 border-b border-zinc-800 pb-1">[1] OBSERVE DIFFERENCE</div>
          <div className="grid grid-cols-1 gap-2 flex-1">
            {differences.map(diff => (
              <button 
                key={diff.id}
                onClick={() => { playSound('click'); setSelectedDiff(diff.id); }} 
                className={`border-[1px] text-xs font-black uppercase transition-all flex items-center justify-center p-3 font-mono tracking-widest ${selectedDiff === diff.id ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-zinc-900/50 text-zinc-400 border-zinc-700 hover:bg-zinc-800'}`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-400 border-b border-zinc-800 pb-1">[2] APPLY OPERATOR</div>
          <div className="grid grid-cols-1 gap-2 flex-1">
            <button 
              onClick={() => { playSound('click'); setSelectedAction('delete'); }} 
              className={`border-[1px] text-xs font-bold p-3 transition-all font-mono tracking-widest ${selectedAction === 'delete' ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-zinc-900/50 text-rose-400 border-rose-900 hover:border-rose-500 hover:bg-rose-900/30'}`}
            >
              OP_DELETE()
            </button>
            <button 
              onClick={() => { playSound('click'); setSelectedAction('move'); }} 
              className={`border-[1px] text-xs font-bold p-3 transition-all font-mono tracking-widest ${selectedAction === 'move' ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-zinc-900/50 text-cyan-400 border-cyan-900 hover:border-cyan-500 hover:bg-cyan-900/30'}`}
            >
              OP_MOVE()
            </button>
            <button 
              onClick={() => { playSound('click'); setSelectedAction('expand'); }} 
              className={`border-[1px] text-xs font-bold p-3 transition-all font-mono tracking-widest ${selectedAction === 'expand' ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-900/50 text-emerald-400 border-emerald-900 hover:border-emerald-500 hover:bg-emerald-900/30'}`}
            >
              OP_EXPAND()
            </button>
          </div>
        </div>
      </div>
      <button 
        onClick={submitAction} 
        disabled={!selectedDiff || !selectedAction || isProcessing || gameState.complete} 
        className={`py-4 font-impact text-3xl uppercase border-[2px] transition-all tracking-widest relative z-10 
          ${(!selectedDiff || !selectedAction || isProcessing) 
             ? 'opacity-30 border-zinc-700 text-zinc-500 cursor-not-allowed bg-transparent' 
             : 'border-lime-400 text-lime-400 bg-black hover:bg-lime-400 hover:text-black shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:shadow-[0_0_30px_rgba(0,255,0,0.6)]'}`}
      >
        {!isProcessing ? (
          <span>TRANSFORM_STATE</span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            COMPUTING<span className="animate-ping delay-75">.</span><span className="animate-ping delay-150">.</span>
          </span>
        )}
      </button>
    </div>
  );

  return (
    <GameLayout 
      title={currentLevelInfo.title}
      goal="ACHIEVE FORM: EMPTY CIRCLE. EXPANDED DIAMOND TOP RIGHT."
      attempts={gameState.steps}
      visualComponent={visualComponent}
      controlsComponent={controlsComponent}
      differences={differences}
      selectedDiff={selectedDiff}
      selectedAction={selectedAction}
      feedback={feedback}
      scoreDetails={{ score: Math.max(1, 10 - gameState.steps), mistakes: gameState.steps > 3 ? gameState.steps - 3 : 0 }}
    />
  );
};

export default Level6_ClassicalMEA;
