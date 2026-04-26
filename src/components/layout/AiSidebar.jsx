import React, { useState, useEffect } from 'react';

const AiSidebar = ({ differences, selectedDiff, selectedAction, feedback, scoreDetails }) => {
  const [ticker, setTicker] = useState('ANALYZING YOUR INTELLECT...');

  useEffect(() => {
    const messages = [
      "MEA = REDUCE DIFFERENCE. REPEAT.",
      "BRUTE FORCE IS FOR AMATEURS.",
      "ANALYZING QUESTIONABLE INTELLIGENCE...",
      "PREPARING NEURAL DISAPPOINTMENT...",
      "DID YOU READ THE MANUAL?",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setTicker(messages[i]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex w-80 h-full brutalist-border border-l-4 border-white bg-black flex-col text-sm border-l-zinc-700 p-0 overflow-hidden">
      <div className="bg-white text-black p-2 font-impact text-2xl uppercase italic border-b-4 border-white">
        AI_THINKING_PANEL
      </div>
      
      <div className="p-4 flex flex-col gap-4 flex-1">
        <div className="border-2 border-zinc-800 p-2 relative">
          <div className="absolute -top-2 left-2 bg-black px-1 text-[10px] text-lime-500 font-bold">FOCUS_VAR</div>
          <div className="font-mono text-xs uppercase overflow-hidden text-ellipsis whitespace-nowrap text-lime-400">
            {selectedDiff ? differences.find(d => d.id === selectedDiff)?.label : 'NONE'}
          </div>
        </div>

        <div className="border-2 border-zinc-800 p-2 relative">
          <div className="absolute -top-2 left-2 bg-black px-1 text-[10px] text-pink-500 font-bold">OPERATOR_VAR</div>
          <div className="font-mono text-xs uppercase overflow-hidden text-ellipsis whitespace-nowrap text-pink-400">
            {selectedAction || 'NONE'}
          </div>
        </div>
        
        <div className={`mt-auto border-2 ${feedback.type === 'error' ? 'border-pink-500 text-pink-500' : (feedback.type==='success' ? 'border-lime-500 text-lime-500' : 'border-zinc-500 text-zinc-500')} p-3 min-h-[100px] flex items-center justify-center text-center font-bold uppercase`}>
          {feedback.msg}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-center border-t-2 border-zinc-800 pt-4 mt-2">
          <div>
            <div className="text-[10px] text-zinc-500">EFFICIENCY</div>
            <div className="font-impact text-xl text-white">{scoreDetails.score}/10</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-500">MISTAKES</div>
            <div className="font-impact text-xl text-pink-500">{scoreDetails.mistakes}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-lime-500 text-black p-1 text-[10px] font-bold overflow-hidden whitespace-nowrap">
        <div className="animate-pulse">{ticker}</div>
      </div>
    </div>
  );
};

export default AiSidebar;
