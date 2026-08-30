import React, { useEffect, useRef } from 'react';
import { ThemeType } from '../types';

interface NeonBackgroundProps {
  themeId: ThemeType;
}

export default function NeonBackground({ themeId }: NeonBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (themeId !== 'neonblue' && themeId !== 'neongreen' && themeId !== 'cyber' && themeId !== 'space') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Common setup
    const isBlue = themeId === 'neonblue';
    const isCyber = themeId === 'cyber';
    const isSpace = themeId === 'space';

    // Matrix configuration (Neon Green)
    const fontSize = 14;
    let columns = Math.ceil(canvas.width / fontSize);
    let drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100);

    // Stars background configuration (Space theme only)
    interface Star {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      twinkleSpeed: number;
      color: string;
    }
    const spaceStars: Star[] = [];

    // Meteors/Shooting stars configuration (Space theme only)
    interface Meteor {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      speed: number;
      opacity: number;
      active: boolean;
    }
    const meteors: Meteor[] = [];

    // Mouse and touch tracker ref
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Global listener for all interactive backgrounds (both mouse and touch)!
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    const initializeSpaceElements = (width: number, height: number) => {
      if (isSpace) {
        // Initialize 240 twinkling stars
        spaceStars.length = 0;
        const starColors = ['#ffffff', '#e0f2fe', '#f3e8ff', '#fae8ff', '#bae6fd', '#fef08a'];
        for (let i = 0; i < 240; i++) {
          spaceStars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.85 + 0.15,
            twinkleSpeed: (0.007 + Math.random() * 0.015) * (Math.random() > 0.5 ? 1 : -1),
            color: starColors[Math.floor(Math.random() * starColors.length)]
          });
        }

        // Initialize 6 shooting star slots for a highly active sky!
        meteors.length = 0;
        for (let i = 0; i < 6; i++) {
          meteors.push({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            length: 0,
            speed: 0,
            opacity: 0,
            active: false
          });
        }
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeSpaceElements(canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles/Constellation configuration (Neon Blue, Cyber, Space)
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
      isSquare?: boolean;
      text?: string;
    }
    const particles: Particle[] = [];
    const particleCount = isSpace ? 110 : (isCyber ? 40 : 45); // Heavy constellation grid for Space!

    if (isBlue || isCyber || isSpace) {
      const colors = isSpace 
        ? ['#22d3ee', '#818cf8', '#c084fc', '#e879f9', '#ffffff', '#a855f7', '#06b6d4'] 
        : (isCyber ? ['#45f3ff', '#ff007f', '#bd93f9'] : ['#60a5fa']);
      
      for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (isSpace ? 0.35 : 0.5),
          vy: (Math.random() - 0.5) * (isSpace ? 0.35 : 0.5),
          radius: isSpace ? (Math.random() * 2.5 + 0.8) : (Math.random() * 2 + 1),
          alpha: Math.random() * 0.6 + 0.3,
          color: color,
          isSquare: isCyber && Math.random() > 0.6,
          text: isCyber && Math.random() > 0.85 ? ['01', '10', 'FF', 'X', 'Y', '[]'][Math.floor(Math.random() * 6)] : undefined
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (themeId === 'neongreen') {
        // Recalculate columns on screen resize
        columns = Math.ceil(canvas.width / fontSize);
        if (drops.length < columns) {
          const startIdx = drops.length;
          drops.length = columns;
          for (let i = startIdx; i < columns; i++) {
            drops[i] = Math.random() * -100;
          }
        }

        ctx.fillStyle = 'rgba(3, 7, 18, 0.08)'; // Keep it dark
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `bold ${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          // Alternating binary 0 and 1 or standard digital rain characters
          const text = Math.random() > 0.5 ? '1' : '0';
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Fade effect: make top rain items brighter
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#10b981';
          ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';
          ctx.fillText(text, x, y);

          // Reset drop if it goes past screen
          if (y > canvas.height && Math.random() > 0.98) {
            drops[i] = 0;
          }
          drops[i] += 0.1; // drop speed (slowed down to 0.1)
        }
        ctx.shadowBlur = 0; // reset
      } else if (themeId === 'cyber') {
        // Cyber synth grid and node constellation
        ctx.fillStyle = 'rgba(11, 12, 16, 0.15)'; // Slightly darker transparent for trails
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw a faint scrolling digital grid in the background
        ctx.strokeStyle = 'rgba(69, 243, 255, 0.03)';
        ctx.lineWidth = 1;
        const spacing = 50;
        const offset = (Date.now() / 120) % spacing;
        
        for (let y = offset; y < canvas.height; y += spacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Draw and update cyber nodes
        particles.forEach((p, idx) => {
          // Move particle
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          // Interactive magnetic attraction for Cyber Theme nodes
          if (mouse.x > -500) {
            const distToMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (distToMouse < 220) {
              const force = (220 - distToMouse) / 220;
              const angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
              p.x += Math.cos(angle) * force * 0.7;
              p.y += Math.sin(angle) * force * 0.7;
            }
          }

          // Cyber node rendering
          let glowIntensity = 6;
          if (mouse.x > -500 && Math.hypot(p.x - mouse.x, p.y - mouse.y) < 180) {
            glowIntensity = 15; // Extra charged glow when close to mouse!
          }

          ctx.shadowBlur = glowIntensity;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;

          if (p.text) {
            ctx.font = 'bold 9px monospace';
            ctx.fillText(p.text, p.x, p.y);
          } else if (p.isSquare) {
            ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }

          // Connect particles within proximity
          for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 100) {
              const alpha = (1 - dist / 100) * 0.12;
              ctx.strokeStyle = p.color === p2.color ? p.color : 'rgba(69, 243, 255, 0.5)';
              ctx.globalAlpha = alpha;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              ctx.globalAlpha = 1.0;
            }
          }

          // Interactive laser wireframes connecting cyber nodes to the cursor!
          if (mouse.x > -500) {
            const distToMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (distToMouse < 160) {
              const laserAlpha = (1 - distToMouse / 160) * 0.35;
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = laserAlpha;
              ctx.lineWidth = 1.0;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
              ctx.globalAlpha = 1.0;

              // Draw a tiny digital data transfer packet (glowing bit) sliding along the laser line
              const pct = (Date.now() / 1500 + idx) % 1.0;
              const packetX = p.x + (mouse.x - p.x) * pct;
              const packetY = p.y + (mouse.y - p.y) * pct;
              ctx.fillStyle = '#45f3ff';
              ctx.shadowBlur = 8;
              ctx.shadowColor = '#45f3ff';
              ctx.fillRect(packetX - 1.5, packetY - 1.5, 3, 3);
            }
          }
        });

        // Draw a gorgeous rotating holographic cyberpunk reticle/crosshair at the cursor
        if (mouse.x > -500) {
          ctx.strokeStyle = 'rgba(255, 0, 127, 0.65)';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#ff007f';
          ctx.lineWidth = 1.5;

          // Outer rotating square
          ctx.save();
          ctx.translate(mouse.x, mouse.y);
          ctx.rotate(Date.now() / 600);
          ctx.strokeRect(-16, -16, 32, 32);
          ctx.restore();

          // Inner rotating opposite direction cross lines
          ctx.strokeStyle = 'rgba(69, 243, 255, 0.55)';
          ctx.shadowColor = '#45f3ff';
          ctx.save();
          ctx.translate(mouse.x, mouse.y);
          ctx.rotate(-Date.now() / 900);
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            ctx.moveTo(Math.cos(angle) * 6, Math.sin(angle) * 6);
            ctx.lineTo(Math.cos(angle) * 12, Math.sin(angle) * 12);
          }
          ctx.stroke();
          ctx.restore();
        }
        ctx.shadowBlur = 0;
      } else if (themeId === 'neonblue') {
        // Neon Blue Constellation Network
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw soft ambient glowing orbs in the background
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, 0, 50,
          canvas.width / 2, 0, canvas.height * 0.7
        );
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
        gradient.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw and update particles
        particles.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;

          // Bounce off walls
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          // Draw glow
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#3b82f6';
          ctx.fillStyle = `rgba(96, 165, 250, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Connect particles within proximity
          for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 120) {
              const alpha = (1 - dist / 120) * 0.15;
              ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });
        ctx.shadowBlur = 0; // reset
      } else if (themeId === 'space') {
        // Deep Space Background (Cosmic Indigo & Violet)
        ctx.fillStyle = '#03001e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render soft rotating/pulsing purple, cyan and magenta nebulae with an amplified glow
        const timeFactor = Date.now() / 12000;
        
        // Nebula 1: Cyan with gentle oscillating pulsing size
        const neb1Pulse = 0.45 + Math.sin(timeFactor) * 0.1;
        const neb1X = canvas.width * 0.25 + Math.cos(timeFactor * 0.7) * 80;
        const neb1Y = canvas.height * 0.35 + Math.sin(timeFactor * 0.7) * 60;
        
        // Nebula 2: Deep Violet with pulsing size
        const neb2Pulse = 0.5 + Math.sin(timeFactor * 0.9) * 0.12;
        const neb2X = canvas.width * 0.75 + Math.sin(timeFactor * 0.6) * 90;
        const neb2Y = canvas.height * 0.65 + Math.cos(timeFactor * 0.6) * 70;

        // Nebula 3: Hot Pink/Fuchsia/Magenta nebula core
        const neb3Pulse = 0.3 + Math.cos(timeFactor * 1.2) * 0.08;
        const neb3X = canvas.width * 0.5 + Math.sin(timeFactor * 1.1) * 120;
        const neb3Y = canvas.height * 0.5 + Math.cos(timeFactor * 1.1) * 80;

        const nebulaGradient1 = ctx.createRadialGradient(
          neb1X, neb1Y, 10,
          neb1X, neb1Y, Math.max(canvas.width, canvas.height) * neb1Pulse
        );
        nebulaGradient1.addColorStop(0, 'rgba(6, 182, 212, 0.14)'); // Cyan nebula
        nebulaGradient1.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)');
        nebulaGradient1.addColorStop(1, 'rgba(3, 0, 30, 0)');
        ctx.fillStyle = nebulaGradient1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const nebulaGradient2 = ctx.createRadialGradient(
          neb2X, neb2Y, 10,
          neb2X, neb2Y, Math.max(canvas.width, canvas.height) * neb2Pulse
        );
        nebulaGradient2.addColorStop(0, 'rgba(168, 85, 247, 0.16)'); // Purple nebula
        nebulaGradient2.addColorStop(0.5, 'rgba(139, 92, 246, 0.06)');
        nebulaGradient2.addColorStop(1, 'rgba(3, 0, 30, 0)');
        ctx.fillStyle = nebulaGradient2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const nebulaGradient3 = ctx.createRadialGradient(
          neb3X, neb3Y, 5,
          neb3X, neb3Y, Math.max(canvas.width, canvas.height) * neb3Pulse
        );
        nebulaGradient3.addColorStop(0, 'rgba(236, 72, 153, 0.12)'); // Magenta nebula
        nebulaGradient3.addColorStop(0.6, 'rgba(236, 72, 153, 0.03)');
        nebulaGradient3.addColorStop(1, 'rgba(3, 0, 30, 0)');
        ctx.fillStyle = nebulaGradient3;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw and update twinkling background stars
        spaceStars.forEach((star) => {
          star.alpha += star.twinkleSpeed;
          if (star.alpha > 0.95 || star.alpha < 0.1) {
            star.twinkleSpeed *= -1;
          }
          ctx.fillStyle = star.color;
          ctx.globalAlpha = Math.max(0.08, Math.min(1, star.alpha));
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0; // reset

        // Draw and update meteors (shooting stars) with increased probability (0.018)
        meteors.forEach((meteor) => {
          if (!meteor.active) {
            if (Math.random() < 0.018) {
              meteor.active = true;
              meteor.x = Math.random() * canvas.width * 0.7;
              meteor.y = Math.random() * canvas.height * 0.4;
              meteor.speed = Math.random() * 12 + 10; // Faster shooting stars!
              meteor.vx = meteor.speed;
              meteor.vy = meteor.speed * (Math.random() * 0.3 + 0.4);
              meteor.length = Math.random() * 120 + 70; // Longer, more epic tails!
              meteor.opacity = 1.0;
            }
          } else {
            // Draw gradient trailing meteor tail
            const trailGrad = ctx.createLinearGradient(
              meteor.x, meteor.y,
              meteor.x - meteor.vx * 1.8, meteor.y - meteor.vy * 1.8
            );
            trailGrad.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
            trailGrad.addColorStop(0.2, `rgba(165, 180, 252, ${meteor.opacity * 0.85})`);
            trailGrad.addColorStop(0.6, `rgba(168, 85, 247, ${meteor.opacity * 0.45})`);
            trailGrad.addColorStop(1, 'rgba(3, 0, 30, 0)');
            
            ctx.strokeStyle = trailGrad;
            ctx.lineWidth = 2.0; // Thicker trail!
            ctx.beginPath();
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(meteor.x - meteor.vx * 1.2, meteor.y - meteor.vy * 1.2);
            ctx.stroke();

            // Draw a tiny sparkling glowing head core for the meteor
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffffff';
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(meteor.x, meteor.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Update meteor position
            meteor.x += meteor.vx;
            meteor.y += meteor.vy;
            meteor.opacity -= 0.015; // slightly slower fade for longer trails

            if (meteor.x > canvas.width + 100 || meteor.y > canvas.height + 100 || meteor.opacity <= 0) {
              meteor.active = false;
            }
          }
        });

        // Draw and update constellation particles
        particles.forEach((p, idx) => {
          // Slow particle drift
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          // Interactive: Gentle gravitational pull from mouse position!
          if (mouse.x > -500) {
            const distToMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (distToMouse < 200) {
              const force = (200 - distToMouse) / 200; // Stronger closer to mouse
              const angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
              // Gently pull the star node
              p.x += Math.cos(angle) * force * 0.5;
              p.y += Math.sin(angle) * force * 0.5;
            }
          }

          // Render glowing orbital rings around a few main stars (e.g. index divisible by 7)
          if (idx % 7 === 0) {
            ctx.strokeStyle = `rgba(168, 85, 247, 0.15)`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            // Pulsing orbit radius
            const orbitRadius = p.radius * 6 + Math.sin(Date.now() / 1000 + idx) * 3;
            ctx.arc(p.x, p.y, orbitRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Draw a tiny satellite star dot on the orbit ring!
            const orbitAngle = (Date.now() / 3000 + idx) % (Math.PI * 2);
            const satX = p.x + Math.cos(orbitAngle) * orbitRadius;
            const satY = p.y + Math.sin(orbitAngle) * orbitRadius;
            ctx.fillStyle = '#22d3ee';
            ctx.beginPath();
            ctx.arc(satX, satY, 1.0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Glowing space star node
          ctx.shadowBlur = 12; // Extra glow!
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Connect stars with thin, translucent constellation threads
          const maxDist = 160; // Increased constellation connection distance!
          for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.22; // Brighter lines!
              
              // Gradient connecting threads!
              const lineGrad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
              lineGrad.addColorStop(0, p.color);
              lineGrad.addColorStop(1, p2.color);

              ctx.strokeStyle = lineGrad;
              ctx.globalAlpha = alpha;
              ctx.lineWidth = 0.9; // Thicker lines!
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              ctx.globalAlpha = 1.0;
            }
          }

          // Interactive: Connect to mouse cursor with elegant glowing threads!
          if (mouse.x > -500) {
            const distToMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (distToMouse < 180) {
              const mouseAlpha = (1 - distToMouse / 180) * 0.35;
              ctx.strokeStyle = `rgba(34, 211, 238, ${mouseAlpha})`;
              ctx.lineWidth = 1.2;
              ctx.shadowBlur = 5;
              ctx.shadowColor = '#22d3ee';
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
          }
        });
        ctx.shadowBlur = 0; // reset shadow glow
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeId]);

  if (themeId !== 'neonblue' && themeId !== 'neongreen' && themeId !== 'cyber' && themeId !== 'space') return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 mix-blend-screen transition-opacity duration-1000 ${
        themeId === 'space' ? 'opacity-90' : 'opacity-40'
      }`}
    />
  );
}
