// A lightweight singleton utility for managing application audio

let bgmInstance = null;
let sfxClick = null;
let sfxSuccess = null;
let sfxWrong = null;

let isMuted = false;

// Initializes the audio objects (lazy loading to prevent SSR/early render issues)
export const initAudio = () => {
    if (typeof Audio === 'undefined') return; // Guard for non-browser environments just in case
    
    if (!bgmInstance) {
        bgmInstance = new Audio('/audio/bgm.mp3');
        bgmInstance.loop = true;
        bgmInstance.volume = 0.65;
    }
    if (!sfxClick) {
        sfxClick = new Audio('/audio/click.mp3');
        sfxClick.volume = 0.5;
    }
    if (!sfxSuccess) {
        sfxSuccess = new Audio('/audio/success.mp3');
        sfxSuccess.volume = 0.7;
    }
    if (!sfxWrong) {
        sfxWrong = new Audio('/audio/wrong.mp3');
        sfxWrong.volume = 0.6;
    }
};

export const playBGM = () => {
    if (isMuted) return;
    initAudio();
    // Play might reject if user hasn't interacted with document
    if (bgmInstance?.paused) {
        bgmInstance.play().catch(e => console.warn("BGM autoplay prevented:", e));
    }
};

export const stopBGM = () => {
    if (bgmInstance) {
        bgmInstance.pause();
        bgmInstance.currentTime = 0;
    }
};

export const playClick = () => {
    if (isMuted) return;
    initAudio();
    if (sfxClick) {
        sfxClick.currentTime = 0;
        sfxClick.play().catch(() => {});
    }
};

export const playSuccess = () => {
    if (isMuted) return;
    initAudio();
    if (sfxSuccess) {
        sfxSuccess.currentTime = 0;
        sfxSuccess.play().catch(() => {});
    }
};

export const playWrong = () => {
    if (isMuted) return;
    initAudio();
    if (sfxWrong) {
        sfxWrong.currentTime = 0;
        sfxWrong.play().catch(() => {});
    }
};

export const toggleMute = () => {
    isMuted = !isMuted;
    if (isMuted && bgmInstance) {
        bgmInstance.pause();
    } else if (!isMuted && bgmInstance) {
        bgmInstance.play().catch(() => {});
    }
    return isMuted;
};

export const getMuteState = () => isMuted;
