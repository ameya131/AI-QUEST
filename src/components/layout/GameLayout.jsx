import React from 'react';
import AiSidebar from './AiSidebar';

const GameLayout = ({ 
  title, 
  goal, 
  attempts, 
  visualComponent, 
  controlsComponent,
  
  // Data for sidebar
  differences, 
  selectedDiff, 
  selectedAction, 
  feedback,
  scoreDetails
}) => {
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-black text-white relative">
      {/* HEADER */}
      <div className="h-16 border-b-4 border-white flex justify-between items-center px-4 bg-zinc-900 shrink-0">
        <div className="flex flex-col">
          <div className="font-impact text-2xl italic tracking-wide">{title}</div>
          <div className="text-[10px] uppercase font-bold text-lime-400">GOAL: {goal}</div>
        </div>
        <div className="text-right flex items-center gap-4">
          <div className="hidden sm:block text-xs font-bold text-pink-500 uppercase tracking-widest animate-pulse">
            ANALYZING MEA...
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase leading-none">ATTEMPTS</div>
            <div className="text-2xl font-impact text-pink-500 leading-none">{attempts}</div>
          </div>
        </div>
      </div>
      
      {/* BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT / CENTER - MAIN SCENE & CONTROLS */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto lg:overflow-hidden relative">
          
          {/* VISUAL SCENE */}
          <div className="flex-1 relative border-b-4 lg:border-b-0 lg:border-r-4 border-white bg-zinc-900 flex items-center justify-center overflow-hidden min-h-[50vh]">
             <div className="absolute inset-0 grid-brutal pointer-events-none opacity-20"></div>
             {visualComponent}
          </div>

          {/* BOTTOM CONTROLS */}
          <div className="shrink-0 lg:h-72 border-r-4 border-white bg-black p-4 flex flex-col border-t-4 border-zinc-700">
             {controlsComponent}
          </div>

        </div>

        {/* RIGHT - AI SIDEBAR */}
        <AiSidebar 
          differences={differences}
          selectedDiff={selectedDiff}
          selectedAction={selectedAction}
          feedback={feedback}
          scoreDetails={scoreDetails}
        />
      </div>
    </div>
  );
};

export default GameLayout;
