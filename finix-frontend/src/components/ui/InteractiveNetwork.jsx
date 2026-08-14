import React, { useCallback, memo } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const InteractiveNetwork = memo(({ themeColor }) => {
  // themeColor debe ser un código hex, ej: "#ff6b00" o "#dc2626"

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 z-0"
      options={{
        fullScreen: { enable: false },
        background: {
          color: { value: "transparent" }, // Fondo transparente para ver el gradiente de atrás
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab", // "grab" hace que se conecten a tu mouse
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 150,
              links: {
                opacity: 0.5,
                color: themeColor
              }
            },
          },
        },
        particles: {
          color: { value: themeColor },
          links: {
            color: themeColor,
            distance: 150,
            enable: true,
            opacity: 0.2, // Líneas muy sutiles
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: false,
            speed: 0.8, // Movimiento lento y elegante
            straight: false,
          },
          number: {
            density: { enable: true, area: 800 },
            value: 80, // Cantidad de puntos
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
});

export default InteractiveNetwork;