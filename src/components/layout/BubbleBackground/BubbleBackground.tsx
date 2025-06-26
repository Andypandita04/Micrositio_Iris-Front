import React, { useEffect, useRef } from 'react';
import styles from './BubbleBackground.module.css';

interface Bubble {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  element: HTMLDivElement;
}

const BubbleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animationFrameRef = useRef<number>(0);

  const colors = [
    'rgba(134, 64, 128, 0.3)', // purple
    'rgba(255, 208, 15, 0.3)',  // yellow
    'rgba(147, 54, 255, 0.3)',  // bright purple
    'rgba(128, 45, 74, 0.3)',   // dark red
    'rgba(255, 88, 34, 0.3)',   // orange
    'rgba(175, 209, 54, 0.3)',  // lime green
  ];

  const createBubble = (): Bubble => {
    const container = containerRef.current;
    if (!container) return {} as Bubble;

    const bubble = document.createElement('div');
    bubble.className = styles.bubble;
    container.appendChild(bubble);

    const size = Math.random() * 30 + 20;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.backgroundColor = color;
    
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * container.offsetHeight,
      size,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      color,
      element: bubble
    };
  };

  const updateBubbles = () => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    bubblesRef.current.forEach(bubble => {
      bubble.x += bubble.speedX;
      bubble.y += bubble.speedY;

      if (bubble.x <= 0 || bubble.x + bubble.size >= width) {
        bubble.speedX *= -1;
      }

      if (bubble.y <= 0 || bubble.y + bubble.size >= height) {
        bubble.speedY *= -1;
      }

      bubble.element.style.transform = `translate(${bubble.x}px, ${bubble.y}px)`;
    });

    animationFrameRef.current = requestAnimationFrame(updateBubbles);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    for (let i = 0; i < 15; i++) {
      bubblesRef.current.push(createBubble());
    }

    animationFrameRef.current = requestAnimationFrame(updateBubbles);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      bubblesRef.current.forEach(bubble => bubble.element.remove());
      bubblesRef.current = [];
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={styles['bubble-container']}
    />
  );
};

export default BubbleBackground;