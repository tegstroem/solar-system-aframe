# Solar System Explorer

An immersive, interactive 3D solar system visualization inspired by the vibe from the game Mass Effect built with A-Frame and Three.js. Explore the planets, learn facts about each celestial body, and experience the cosmos from your browser.

## Features

- **Interactive 3D Visualization** — Fully explorable solar system with accurate orbital mechanics
- **Click-to-Explore** — Click any planet to fly closer and read educational facts
- **Real-time Orbital Animation** — Watch planets orbit the sun with adjustable time scales (0x to 1000x speed)
- **Pause/Resume Controls** — Freeze orbital motion to observe planetary positions
- **Immersive UI** — Glassmorphic HUD with film grain effect and window frame overlay
- **Ambient Soundscape** — Mass Effect-inspired audio atmosphere
- **Click Feedback** — Universal click sound across all interactions
- **VR Ready** — WebXR support for compatible VR headsets
- **Starfield Background** — 2,500+ procedurally generated stars
- **Educational Content** — Planet facts including composition, orbital characteristics, and notable features

## Getting Started

### Prerequisites

- Node.js and npm installed
- A modern web browser with WebGL support

### Installation

1. Clone or download this project:
```bash
cd /Users/isabeltegstrom/Projects/solar-system-aframe
```

2. Install dependencies:
```bash
npm install
```

3. Start the local development server:
```bash
npm start
```

4. Open your browser to `http://127.0.0.1:3000`

## How to Use

### Desktop/Mobile Browser

- **Click a planet** to fly closer and view its information panel
- **Return to overview** button takes you back to the full solar system view
- **Time scale slider** adjusts orbital speed (0x = paused, 1000x = fast-forward)
- **Pause orbits** button freezes all planetary motion
- **WASD keys** to move the camera (when not flying to a planet)
- **Mouse look** to rotate the view

### VR Mode

- Click the **VR button** (bottom right) to enter immersive mode
- Gaze at planets to select them
- Use controller buttons to navigate and return to overview

### Mobile (Touch)

- **Tap a planet** to explore it
- **Tap return button** to go back
- Use two-finger gestures to rotate the view

## How to Build

### Development

The project uses vanilla JavaScript with no build step required. All changes to files in `js/`, `css/`, or `index.html` are reflected immediately when you refresh the browser.

### File Structure

```
solar-system-aframe/
├── index.html              # Main HTML file with scene setup
├── css/
│   └── style.css           # Styling for UI, film grain, and animations
├── js/
│   └── solar-system.js     # A-Frame components and scene logic
├── assets/
│   ├── masseffect-audio.mp3 # Ambient background music
│   ├── click.mp3           # Click interaction sound
│   ├── window.png          # Window frame overlay texture
│   └── space.png           # (Optional) Space background
├── package.json            # Project metadata and scripts
└── README.md              # This file
```

## Project Files Index

### `index.html`
- **Purpose:** Main scene structure and DOM layout
- **Contents:**
  - A-Frame scene setup with starfield and WebXR support
  - HUD with info panel, time controls, and hint text
  - All planet entities with orbits and rings
  - Camera rig and raycaster configuration
  - Audio elements for ambient sound and click feedback

### `css/style.css`
- **Purpose:** UI styling and visual effects
- **Key sections:**
  - Film grain overlay effect
  - Info panel and time controls styling
  - Glassmorphic UI with backdrop blur
  - Responsive media queries for mobile
  - Window overlay frame positioning

### `js/solar-system.js`
- **Purpose:** A-Frame components and scene interaction logic
- **Key components:**
  - `starfield` — Generates 2,500+ stars in a spherical pattern
  - `orbit` — Handles planetary orbital animation
  - `moon-orbit` — Manages moon orbital mechanics
  - `solar-system` — Main scene controller with camera animations, UI binding, and planet data
- **Key functions:**
  - `sliderToSpeed()` — Converts slider input to orbital speed multiplier
  - `getCameraTargetPosition()` — Calculates ideal camera position for each planet
  - `animateCamera()` — Smoothly transitions camera with easing
  - `flyToPlanet()` / `flyToOverview()` — Navigation functions

### `assets/`
- **masseffect-audio.mp3** — Ambient background music (loops at 0.5 volume)
- **click.mp3** — Sound effect for all UI interactions
- **window.png** — Window frame overlay (HUD chrome effect)
- **space.png** — Optional space texture (currently unused)

### `package.json`
- **Purpose:** Project metadata and npm scripts
- **Scripts:**
  - `npm start` — Launches local dev server on port 3000

## Technical Stack

- **A-Frame 1.6.0** — WebGL framework built on Three.js
- **Three.js** — 3D graphics library
- **WebXR** — Immersive web API for VR support
- **Vanilla JavaScript** — No frameworks, pure DOM manipulation
- **CSS3** — Modern CSS with backdrop filters and gradients


## Future Enhancements

- [ ] AR.js integration for mobile AR experience
- [ ] Planetary size/distance comparison tools
- [ ] Satellite tracking and moon information
- [ ] Custom orbital simulation sandbox
- [ ] Multilingual planet facts