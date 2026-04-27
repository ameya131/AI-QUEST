import React, { useState, useEffect } from 'react';
import { useGame } from '../store/GameProvider';

const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'ambient') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 4);
      osc.start();
      osc.stop(ctx.currentTime + 4);
    } else if (type === 'hover') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {}
};

const FinalEducation = () => {
  const { totalScore, reboot } = useGame();
  const [activeTab, setActiveTab] = useState('definition');
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Ambient sound on load
    setTimeout(() => {
      setEntered(true);
      playSound('ambient');
      const interval = setInterval(() => playSound('ambient'), 4000);
      return () => clearInterval(interval);
    }, 500);
  }, []);

  const tabs = [
    { id: 'definition', label: 'WHAT IS M.E.A.?' },
    { id: 'realworld', label: 'REAL WORLD APP' },
    { id: 'history', label: 'CLASSICAL AI ORIGINS' },
    { id: 'journey', label: 'YOUR JOURNEY' }
  ];

  const handleTabClick = (id) => {
    playSound('click');
    setActiveTab(id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'definition':
        return (
          <div className="space-y-6 text-zinc-300 font-mono leading-relaxed animate-fade-in">
            <h2 className="text-3xl font-impact text-white tracking-widest border-b border-zinc-800 pb-4">FORMAL DEFINITION</h2>
            <p>
              <strong className="text-blue-400">Means-End Analysis (MEA)</strong> is a problem-solving strategy first introduced in 1957. 
              It involves envisioning the <span className="text-lime-400">Goal State</span>, evaluating the current <span className="text-pink-400">Current State</span>, 
              and identifying the <span className="text-cyan-400">Difference</span> between them.
            </p>
            <div className="bg-zinc-900/50 p-6 border-l-4 border-lime-500 rounded-r-md">
              <h3 className="text-lime-500 font-bold mb-2">How it differs from Brute Force:</h3>
              <p className="text-sm">Brute force explores every possible move blindly. MEA strictly selects an <strong>Operator</strong> that reduces the specific <strong>Difference</strong> observed.</p>
            </div>
            <div className="bg-zinc-900/50 p-6 border-l-4 border-pink-500 rounded-r-md">
              <h3 className="text-pink-500 font-bold mb-2">The Power of Subgoals:</h3>
              <p className="text-sm">If an operator cannot be applied immediately, MEA creates a <strong>Subgoal</strong>: "Change the state so the operator CAN be applied." This recursive decomposition is the core of human logic.</p>
            </div>
          </div>
        );
      case 'realworld':
        return (
          <div className="space-y-6 text-zinc-300 font-mono leading-relaxed animate-fade-in">
            <h2 className="text-3xl font-impact text-white tracking-widest border-b border-zinc-800 pb-4">REAL WORLD DEPLOYMENT</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InteractiveFact 
                title="CYBERSECURITY" 
                color="border-purple-500"
                text="Automated incident response platforms use MEA. Goal: Secure state. Diff: Open malicious port. Operator: Firewall rule update."
              />
              <InteractiveFact 
                title="ROBOTICS / GPS" 
                color="border-cyan-500"
                text="Pathfinding algorithms rely on heuristic search variations. Goal: Destination. Diff: Distance + Obstacles. Subgoal: Navigate around obstacle."
              />
              <InteractiveFact 
                title="GAME AI" 
                color="border-amber-500"
                text="NPC behavior planners (like GOAP - Goal Oriented Action Planning) are direct descendants of MEA, sequencing actions to satisfy dynamic goals."
              />
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6 text-zinc-300 font-mono leading-relaxed animate-fade-in">
             <h2 className="text-3xl font-impact text-white tracking-widest border-b border-zinc-800 pb-4">CLASSICAL AI ORIGINS</h2>
             <div className="flex flex-col md:flex-row gap-8 items-center bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
                <div className="flex-1 space-y-4">
                   <p>Originating with <strong>Allen Newell</strong> and <strong>Herbert A. Simon</strong>, MEA was the central heuristic in the <strong>General Problem Solver (GPS)</strong> computer program developed in 1957.</p>
                   <p>It was one of the first times a machine was able to separate the "problem knowledge" from the "problem-solving strategy", laying the groundwork for all modern symbolic reasoning.</p>
                </div>
                <div className="w-1/3 flex flex-col items-center justify-center p-4 border border-zinc-700 bg-black shadow-[0_0_20px_rgba(255,255,255,0.05)] text-center">
                   <div className="text-xs text-zinc-500 mb-2 uppercase">Core Concept</div>
                   <div className="text-white font-impact tracking-widest text-xl">SYMBOLIC REASONING</div>
                   <div className="text-xs text-zinc-400 mt-2">Abstract representation of states & operators.</div>
                </div>
             </div>
          </div>
        );
      case 'journey':
        return (
          <div className="space-y-6 text-zinc-300 font-mono leading-relaxed animate-fade-in">
             <h2 className="text-3xl font-impact text-white tracking-widest border-b border-zinc-800 pb-4">THE BREAKDOWN</h2>
             <p className="mb-4">Why did we subject you to those simulations? Because every level represented a fundamental pillar of MEA.</p>
             <ul className="space-y-3">
               <li className="bg-zinc-900/50 p-3 rounded flex items-center gap-4 border-l-2 border-zinc-700"><span className="text-lime-500 font-bold min-w-24">ESCAPE:</span> Identifying differences vs irrelevant actions.</li>
               <li className="bg-zinc-900/50 p-3 rounded flex items-center gap-4 border-l-2 border-zinc-700"><span className="text-cyan-500 font-bold min-w-24">PHISHING:</span> Rejecting easy operators that violate constraints.</li>
               <li className="bg-zinc-900/50 p-3 rounded flex items-center gap-4 border-l-2 border-zinc-700"><span className="text-amber-500 font-bold min-w-24">BRIDGE:</span> Subgoal creation. You can't cross until you build.</li>
               <li className="bg-zinc-900/50 p-3 rounded flex items-center gap-4 border-l-2 border-zinc-700"><span className="text-pink-500 font-bold min-w-24">PASSWORD:</span> Iterative difference reduction without brute force.</li>
               <li className="bg-zinc-900/50 p-3 rounded flex items-center gap-4 border-l-2 border-zinc-700"><span className="text-purple-500 font-bold min-w-24">BOMB:</span> Sequential logic under constraint.</li>
               <li className="bg-zinc-900/50 p-3 rounded flex items-center gap-4 border-l-2 border-zinc-700"><span className="text-rose-500 font-bold min-w-24">SHAPES:</span> Pure classical symbolic manipulation.</li>
             </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-4 transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background FX */}
      <div className="absolute inset-0 pixel-bg opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-black pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-5xl flex flex-col h-[85vh] bg-black/80 border border-zinc-800 shadow-2xl backdrop-blur-sm rounded-xl overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-zinc-800 p-6 flex justify-between items-center bg-zinc-950">
           <div>
             <h1 className="text-4xl font-impact tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">MASTERY CHAMBER</h1>
             <p className="text-zinc-500 text-xs font-mono mt-1 tracking-widest uppercase">System Graduation • Efficiency Score: {totalScore}</p>
           </div>
           <div className="text-right">
             <div className="text-[10px] text-lime-500 font-mono uppercase tracking-widest">Status</div>
             <div className="text-lg text-white font-impact tracking-widest">STRUCTURED PROBLEM SOLVER</div>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
           
           {/* Sidebar Navigation */}
           <div className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950/50 flex flex-col p-4 gap-2">
              <div className="text-xs text-zinc-600 font-mono mb-4 px-2 uppercase tracking-widest">Select Module</div>
              {tabs.map(tab => (
                 <button 
                   key={tab.id}
                   onMouseEnter={() => playSound('hover')}
                   onClick={() => handleTabClick(tab.id)}
                   className={`text-left font-mono text-sm p-4 transition-all duration-300 border-l-2 ${activeTab === tab.id ? 'border-white text-white bg-zinc-900 shadow-[inset_4px_0_0_0_#ffffff]' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
                 >
                   {tab.label}
                 </button>
              ))}
           </div>

           {/* Main Display */}
           <div className="flex-1 p-8 overflow-y-auto">
              {renderContent()}
           </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 p-4 bg-zinc-950 flex justify-between items-center">
           <div className="text-xs text-zinc-600 font-mono">
              "You have progressed from chaotic decision-maker to structured problem solver."
           </div>
           <button 
             onClick={() => { playSound('click'); reboot(); }}
             className="px-6 py-2 bg-white text-black font-impact tracking-widest hover:bg-lime-400 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(0,255,0,0.5)] uppercase"
           >
             RETURN TO REALITY
           </button>
        </div>

      </div>
    </div>
  );
};

const InteractiveFact = ({ title, text, color }) => {
   return (
      <div 
         onMouseEnter={() => playSound('hover')}
         onClick={() => playSound('click')}
         className={`p-6 bg-zinc-900/40 border-t-4 ${color} rounded hover:bg-zinc-800/80 transition-colors cursor-pointer group`}
      >
         <h4 className={`text-xl font-impact tracking-widest mb-3 text-zinc-400 group-hover:text-white transition-colors`}>{title}</h4>
         <p className="text-sm text-zinc-400">{text}</p>
      </div>
   );
};

export default FinalEducation;
