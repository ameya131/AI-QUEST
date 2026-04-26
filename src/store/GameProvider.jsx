import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [screen, setScreen] = useState('landing'); // 'landing', 'intro', 'game', 'results', 'end'
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [levelHistory, setLevelHistory] = useState([]);
  
  // To pass data from the completed game to the results screen
  const [lastLevelResult, setLastLevelResult] = useState(null);

  const levels = [
    { id: 'level1', title: 'SIM_01: EXIT_ROOM', component: 'Level1_RoomEscape' },
    { id: 'level2', title: 'SIM_02: PHISHING_TRAP', component: 'Level2_Phishing' },
    { id: 'level3', title: 'SIM_03: BRIDGE_BUILD', component: 'Level3_BrokenBridge' },
    { id: 'level4', title: 'SIM_04: PASSWORD_CRACK', component: 'Level4_PasswordGuess' },
    { id: 'level5', title: 'SIM_05: DEFUSE_BOMB', component: 'Level5_BombDefusal' },
    { id: 'level6', title: 'SIM_06: ADV_SCIENCE', component: 'Level6_AdvScience' },
    { id: 'level7', title: 'SIM_07: MOUSE_DOT', component: 'Level7_MouseDot' }
  ];

  const startGame = () => {
    setScreen('intro');
    setCurrentLevelIndex(0);
    setTotalScore(0);
    setLevelHistory([]);
  };

  const playLevel = () => {
    setScreen('game');
  };

  const finishLevel = (results) => {
    // results = { efficiency: 0-10, mistakes: 0+, concept: 'string', realWorld: 'string' }
    setLastLevelResult(results);
    setTotalScore(prev => prev + results.efficiency);
    setLevelHistory(prev => [...prev, { level: levels[currentLevelIndex].id, ...results }]);
    setScreen('results');
  };

  const nextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setScreen('game');
    } else {
      setScreen('end');
    }
  };

  const reboot = () => {
    setScreen('landing');
  };

  const currentLevelInfo = levels[currentLevelIndex];

  return (
    <GameContext.Provider value={{ 
      screen, setScreen, 
      currentLevelIndex, currentLevelInfo, 
      startGame, playLevel, finishLevel, nextLevel, reboot,
      totalScore, levelHistory, lastLevelResult 
    }}>
      {children}
    </GameContext.Provider>
  );
};
