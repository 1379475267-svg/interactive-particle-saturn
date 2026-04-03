# Interactive Particle Saturn

A static Three.js demo of a cinematic particle-based Saturn with orbital motion, brightness scaling, and a controlled chaos burst as the planet approaches the camera.

## Features

- Dense particle core plus layered particle rings
- Kepler-inspired orbital motion for ring particles
- Brightness response tied to scale
- High-frequency chaotic burst when expanded near the screen
- Mouse wheel and pointer drag interaction
- Fullscreen toggle for presentation or GitHub Pages demos

## Run Locally

This project should be served over HTTP instead of opened from `file://`.

```powershell
cd C:\Users\Mechrevo\Desktop\saturn-particle-hand
py -3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Controls

- Mouse wheel: expand or contract Saturn
- Drag vertically: expand or contract Saturn
- Drag horizontally: orbit the view
- Fullscreen button: switch presentation mode

## Deploy To GitHub Pages

1. Push the repository to GitHub.
2. Open repository `Settings`.
3. Open `Pages`.
4. Set `Source` to `Deploy from a branch`.
5. Select branch `main` and folder `/root`.

After GitHub Pages finishes deploying, the project will be available at your Pages URL.

## Notes

- The project currently loads `three` from jsDelivr CDN
- If you want maximum portability, vendor `three.module.js` into the repository and switch imports to local files
- The scene intentionally prioritizes visual richness over optimization
