// import Starfield from 'react-starfield';

// function App() {
//   return (
//     <div className="App">
//       <Starfield
//         starCount={1000}
//         starColor={[255, 255, 255]}
//         speedFactor={0.2}
//         backgroundColor="black"
//       />
//       {/* Other components */}


//     </div>
//   );
// }

// export default App;
// React-starfield is nothing more than an HTML canvas element with a little bit of math in a useEffect:
// but the size could not be change , its a predefined component used


// This React component creates an animated starfield background using the built-in HTML5 <canvas> API.
//  No external libraries like Three.js or tsparticles are used
//  — it's pure JavaScript rendering stars that simulate 3D parallax motion,
//  giving a space/floating/flying illusion behind your app UI
import React, { useEffect } from 'react';

export default function Starfield({
  speedFactor = 0.05, // How fast the stars move toward the viewer
  backgroundColor = 'black', // Background color of the canvas
  starColor = [255, 255, 255], // RGB color for the stars
  starCount = 1000, // Number of stars to draw
}) {
  useEffect(() => {
    // Get canvas element
    const canvas = document.getElementById('starfield');
    if (!canvas) return;

    // Get drawing context
    const ctx = canvas.getContext('2d');

    // Store window dimensions
    let w = window.innerWidth;
    let h = window.innerHeight;

    // Resize canvas to fill screen
    const setCanvasExtents = () => {
      canvas.width = w;
      canvas.height = h;
    };
    setCanvasExtents();

    // Update dimensions on window resize
    window.onresize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      setCanvasExtents();
    };

    // Create stars with random position and size
    const makeStars = (count) => {
      const stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * 1600 - 800, // horizontal offset
          y: Math.random() * 900 - 450,  // vertical offset
          z: Math.random() * 1000,       // depth (distance from viewer)
          size: Math.random() * 2 + 1,   // star size between 1 and 3
        });
      }
      return stars;
    };

    let stars = makeStars(starCount);

    // Fill background
    const clear = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Draw individual star
    const putPixel = (x, y, brightness, size) => {
      const rgb = `rgba(${starColor[0]},${starColor[1]},${starColor[2]},${brightness})`;
      ctx.fillStyle = rgb;
      ctx.fillRect(x, y, size, size); // Draw a square pixel of given size
    };

    // Move stars closer to viewer
    const moveStars = (distance) => {
      for (let star of stars) {
        star.z -= distance;
        if (star.z <= 1) {
          star.z += 1000; // Reset star when it gets too close
        }
      }
    };

    // Animation loop
    let prevTime;
    const tick = (time) => {
      let elapsed = time - prevTime;
      prevTime = time;

      moveStars(elapsed * speedFactor);
      clear();

      const cx = w / 2;
      const cy = h / 2;

      for (let star of stars) {
        // Project 3D star to 2D screen
        const x = cx + star.x / (star.z * 0.001);
        const y = cy + star.y / (star.z * 0.001);

        if (x < 0 || x >= w || y < 0 || y >= h) continue;

        // Brightness based on distance
        const depthRatio = star.z / 1000.0;
        const brightness = 1 - depthRatio * depthRatio;

        putPixel(x, y, brightness, star.size);
      }

      requestAnimationFrame(tick);
    };

    // Start animation
    const init = (time) => {
      prevTime = time;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(init);

    // Clean up on unmount
    return () => {
      window.onresize = null;
    };
  }, [starColor, backgroundColor, speedFactor, starCount]);

  // Canvas element rendered in React
  return (
    <canvas
      id="starfield"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: -1,
        pointerEvents: 'none',
        mixBlendMode: 'screen', // Blends well with bright UI themes
      }}
    />
  );
}


// Why It Works Automatically in the Background
// Your Starfield.jsx component uses a <canvas> that is:
// position: fixed → sticks to the viewport and doesn't scroll
// z-index: 0 → stays behind all other app content (except things with lower z-index)
// pointer-events: none → it doesn't interfere with clicks
// Takes full width & height of the screen
// Renders stars with JavaScript continuously using requestAnimationFrame

// ✅ So What Happens?
// When App.jsx renders, the <Starfield /> is mounted and renders the canvas first
// All your other content (from shadcn UI or pages) renders on top of it
// Since the canvas is fixed and behind everything, it becomes a moving background layer