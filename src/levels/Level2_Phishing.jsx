import React, { useState } from 'react';
import { useGame } from '../store/GameProvider';
import GameLayout from '../components/layout/GameLayout';

const Level2_Phishing = () => {
  const { finishLevel, currentLevelInfo } = useGame();
  
  const [gameState, setGameState] = useState({ 
    urlChecked: false, 
    isPhishing: true, // we toggle this via 'refresh' 
    loggedIn: false, 
    steps: 0 
  });
  
  const [selectedDiff, setSelectedDiff] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [feedback, setFeedback] = useState({ msg: "YOUR DATA IS VERY VALUABLE TO ME.", type: 'neutral' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [shake, setShake] = useState(false);
  const [trollModal, setTrollModal] = useState(null);

  const differences = [
    { id: 'auth', label: '01_NOT_LOGGED_IN' },
    { id: 'trust', label: '02_UNKNOWN_SOURCE' }
  ];

  const submitAction = () => {
    if (!selectedDiff || !selectedAction) return;
    setIsProcessing(true);
    setGameState(prev => ({ ...prev, steps: prev.steps + 1 }));
    
    const d = selectedDiff;
    const a = selectedAction;
    
    setTimeout(() => {
      setIsProcessing(false);
      
      if (a === 'enter_pass') {
        if (!gameState.urlChecked) {
          setShake(true);
          setTrollModal("YOU JUST GAVE YOUR PASSWORD TO AN IP IN RUSSIA.");
          setFeedback({ msg: '❌ ACCOUNT STOLEN. YOU FELL FOR IT.', type: 'error' });
          setTimeout(() => { setShake(false); setTrollModal(null); }, 2000);
        } else if (gameState.isPhishing) {
          setShake(true);
          setTrollModal("I LITERALLY TOLD YOU IT WAS FAKE.");
          setFeedback({ msg: '❌ IGNORING RED FLAGS LIKE IT\'S A FIRST DATE.', type: 'error' });
          setTimeout(() => { setShake(false); setTrollModal(null); }, 2000);
        } else {
          setGameState(prev => ({ ...prev, loggedIn: true }));
          setFeedback({ msg: '✅ AUTHENTICATED SUCCESSFULLY.', type: 'success' });
          setTimeout(() => {
            finishLevel({
              efficiency: Math.max(1, 10 - gameState.steps),
              mistakes: gameState.steps > 3 ? gameState.steps - 3 : 0,
              concept: "Verification as Subgoal",
              realWorld: "In Cybersecurity, establishing trust (checking the URL/SSL) must be solved before the primary goal (logging in) can be safely attempted."
            });
          }, 1500);
        }
      } else if (d === 'trust' && a === 'check_url') {
        setGameState(prev => ({ ...prev, urlChecked: true }));
        setFeedback({ msg: gameState.isPhishing ? '⚠️ SCAM DETECTED. DO NOT PROCEED.' : '✅ URL VERIFIED. IT IS SAFE.', type: gameState.isPhishing ? 'error' : 'success' });
      } else if (a === 'refresh') {
        // Change from phishing to safe
        setGameState(prev => ({ ...prev, isPhishing: false, urlChecked: false }));
        setFeedback({ msg: '🔄 RELOADED CLEAN DOMAIN.', type: 'neutral' });
      } else if (a === 'download_ram') {
        setShake(true);
        setTrollModal("YOUR PC HAS BEEN ENCRYPTED BY RANSOMWARE.");
        setFeedback({ msg: '❌ YOU DOWNLOADED MALWARE.', type: 'error' });
        setTimeout(() => { setShake(false); setTrollModal(null); }, 2000);
      } else {
        setFeedback({ msg: '❌ ERROR: THIS ACTION DOES NOT REDUCE THE DIFFERENCE.', type: 'error' });
      }
      
      setSelectedDiff(null);
      setSelectedAction(null);
    }, 400);
  };

  const visualComponent = (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 ${shake ? 'shake-fx' : ''} relative`}>
      {trollModal && (
        <div className="absolute inset-0 z-50 bg-pink-600/90 flex items-center justify-center font-impact text-5xl text-white text-center p-8">
           {trollModal}
        </div>
      )}
      
      <div className="w-full max-w-sm bg-zinc-100 p-4 border-4 border-zinc-500 shadow-2xl relative mt-10">
        <div className="absolute -top-12 left-0 w-full bg-zinc-300 border-4 border-zinc-500 flex items-center p-2 mb-2">
           <div className="flex gap-2 mr-4">
             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
             <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
           </div>
           <div className={`flex-1 bg-white border-2 border-zinc-400 px-2 text-xs font-mono truncate ${gameState.urlChecked ? (gameState.isPhishing ? 'text-red-500' : 'text-green-600') : 'text-zinc-800'}`}>
             {gameState.isPhishing ? 'http://www.paypaI-secure-login-1.info.cc/login' : 'https://www.paypal.com/login'}
           </div>
        </div>
        
        <div className="flex flex-col gap-4 text-center select-none">
          <div className="font-sans text-3xl font-bold text-blue-800 tracking-tighter">PayPaI</div>
          <p className="text-zinc-600 text-xs uppercase font-bold">Sign in to your account</p>
          <div className="h-10 border-2 border-zinc-400 bg-white"></div>
          <div className="h-10 border-2 border-zinc-400 bg-white mb-4"></div>
          <div className={`h-12 w-full flex items-center justify-center text-white font-bold font-sans ${gameState.loggedIn ? 'bg-green-600' : 'bg-blue-600'}`}>
            {gameState.loggedIn ? 'SUCCESS' : 'Log In'}
          </div>
        </div>
      </div>
      
      {gameState.urlChecked && (
        <div className={`mt-8 px-4 py-2 border-4 text-xl font-impact uppercase ${gameState.isPhishing ? 'border-red-500 text-red-500 bg-red-900/30' : 'border-green-500 text-green-500 bg-green-900/30'}`}>
          {gameState.isPhishing ? 'SECURITY WARNING' : 'SSL VERIFIED'}
        </div>
      )}
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
              onClick={() => setSelectedAction('check_url')} 
              className={`border-[3px] text-[10px] sm:text-xs font-bold p-2 transition-all ${selectedAction === 'check_url' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              INSPECT_URL
            </button>
            <button 
              onClick={() => setSelectedAction('enter_pass')} 
              className={`border-[3px] text-[10px] sm:text-xs font-bold p-2 transition-all ${selectedAction === 'enter_pass' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              SUBMIT_CREDS
            </button>
            <button 
              onClick={() => setSelectedAction('refresh')} 
              className={`border-[3px] text-[10px] sm:text-xs font-bold p-2 transition-all ${selectedAction === 'refresh' ? 'bg-lime-500 text-black border-lime-500 scale-[0.98]' : 'bg-black text-lime-400 border-lime-900 hover:border-lime-500 hover:bg-lime-900/30'}`}
            >
              RELOAD_CLEAN
            </button>
            <button 
              onClick={() => setSelectedAction('download_ram')} 
              className={`border-[3px] text-[10px] sm:text-xs font-bold p-2 transition-all ${selectedAction === 'download_ram' ? 'bg-pink-500 text-black border-pink-500 scale-[0.98]' : 'bg-black text-pink-400 border-pink-900 hover:border-pink-500 hover:bg-pink-900/30'}`}
            >
              DOWNLD_RAM
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
      goal="SECURELY ACCESS SYSTEM"
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

export default Level2_Phishing;
