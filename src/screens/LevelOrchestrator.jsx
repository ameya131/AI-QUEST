import React from 'react';
import { useGame } from '../store/GameProvider';
import Level1_RoomEscape from '../levels/Level1_RoomEscape';
import Level2_Phishing from '../levels/Level2_Phishing';
import Level3_BrokenBridge from '../levels/Level3_BrokenBridge';
import Level4_PasswordGuess from '../levels/Level4_PasswordGuess';
import Level5_BombDefusal from '../levels/Level5_BombDefusal';
import Level6_AdvScience from '../levels/Level6_AdvScience';
import Level7_MouseDot from '../levels/Level7_MouseDot';

const LevelOrchestrator = () => {
  const { currentLevelInfo } = useGame();

  switch (currentLevelInfo.id) {
    case 'level1': return <Level1_RoomEscape />;
    case 'level2': return <Level2_Phishing />;
    case 'level3': return <Level3_BrokenBridge />;
    case 'level4': return <Level4_PasswordGuess />;
    case 'level5': return <Level5_BombDefusal />;
    case 'level6': return <Level6_AdvScience />;
    case 'level7': return <Level7_MouseDot />;
    default:
      return <div className="text-white text-center mt-20 font-impact text-5xl">CORRUPT_SIMULATION_DATA</div>;
  }
};

export default LevelOrchestrator;
