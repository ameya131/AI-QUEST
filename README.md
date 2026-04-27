# AI Quest: Think Like a Smart AI

AI Quest is a brutalist, story-driven educational web application designed to teach the fundamentals of Mean-Ends Analysis (MEA).

You follow an immersive, multi-level campaign where each level introduces and reinforces core MEA principles, such as identifying differences, selecting relevant operators, and achieving precise subgoals. A sarcastic AI personality provides meme-heavy feedback, creating a "troll-style" learning experience.

## Tech Stack

The application is built with a modern, performant, and reliable frontend ecosystem:

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [@iconify/react](https://iconify.design/)
- **Design Paradigm**: Brutalist, responsive full-screen desktop layout (no-scroll)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Project Structure

The project leans on a clear and modular architecture in standard Vite+React fashion:

- `/src`: Contains the core application code.
  - `/src/components`: Reusable UI elements building on Tailwind design tokens.
  - `/src/levels`: Sub-modules representing the distinct levels of the AI Quest (e.g., Level1_RoomEscape, Level6_ClassicalMEA).
  - `/src/store`: Application state management (e.g., GameProvider).
  - `App.jsx`, `index.css`, `main.jsx`: Core application entry points and layout definitions.
- `/public`: Static assets, including the modular `/audio` directory structured for ambient and sound-effect handling.
  
## Objectives

The goal of this application is not just to entertain but to actively reinforce systematic problem solving through:
- Breaking down large goals into practical steps.
- Learning to isolate context.
- Prioritizing functional operations toward the main objective. 
