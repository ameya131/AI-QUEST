# Audio Assets

Place your audio files in this directory (`public/audio/`).

Current expected files:
- `click.mp3` : For basic UI interactions / buttons.
- `success.mp3` : For solving a level or subgoal.
- `wrong.mp3` : For trolls/errors/wrong moves.
- `bgm.mp3` : Background music.

The application is currently using the Web Audio API synthesizer for placeholder sounds. To switch to these real files, update the `playSound` function in the components (e.g., `Level6_ClassicalMEA.jsx`, `FinalEducation.jsx`) to play an `<audio>` tag or `new Audio('/audio/{type}.mp3')`.
