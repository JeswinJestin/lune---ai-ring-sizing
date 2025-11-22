import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

interface DisintegrationEffectProps {
    targetRef?: React.RefObject<HTMLElement>;
    imageSrc?: string;
    onComplete: () => void;
    isActive: boolean;
}

export const DisintegrationEffect: React.FC<DisintegrationEffectProps> = ({ targetRef, imageSrc, onComplete, isActive }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isActive && !isAnimating) {
            startDisintegration();
        }
    }, [isActive]);

    const startDisintegration = async () => {
        if (!canvasRef.current) return;
        setIsAnimating(true);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {
            let sourceCanvas: HTMLCanvasElement | HTMLImageElement;
            let startX = 0;
            let startY = 0;
            let width = window.innerWidth;
            let height = window.innerHeight;

            if (imageSrc) {
                const img = new Image();
                img.src = imageSrc;
                await new Promise((resolve) => { img.onload = resolve; });
                sourceCanvas = img;
                width = img.width;
                height = img.height;

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            } else if (targetRef && targetRef.current) {
                sourceCanvas = await html2canvas(targetRef.current, {
                    backgroundColor: null,
                    scale: 1,
                    logging: false,
                    useCORS: true,
                });
                const rect = targetRef.current.getBoundingClientRect();
                startX = rect.left;
                startY = rect.top;
                width = sourceCanvas.width;
                height = sourceCanvas.height;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                targetRef.current.style.visibility = 'hidden';
            } else {
                return;
            }

            canvas.style.display = 'block';

            // Draw source to canvas
            ctx.drawImage(sourceCanvas, startX, startY, width, height);

            // Create Particles
            const particles: { x: number; y: number; vx: number; vy: number; alpha: number; color: Uint8ClampedArray }[] = [];
            const particleSize = 6;

            const imageData = ctx.getImageData(startX, startY, width, height);
            const data = imageData.data;

            for (let x = 0; x < width; x += particleSize) {
                for (let y = 0; y < height; y += particleSize) {
                    if (Math.random() > 0.6) continue;

                    const i = (y * width + x) * 4;
                    if (data[i + 3] > 0) {
                        particles.push({
                            x: startX + x,
                            y: startY + y,
                            vx: (Math.random() - 0.5) * 10,
                            vy: (Math.random() - 1) * 10 - 2,
                            alpha: 1,
                            color: data.slice(i, i + 4)
                        });
                    }
                }
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let startTime = Date.now();
            const duration = 2000;

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;

                if (progress >= 1) {
                    onComplete();
                    return;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.95;
                    p.vy -= 0.1;
                    p.x += (Math.random() - 0.2) * 3;
                    p.y -= Math.random() * 3;

                    p.alpha -= 0.015;

                    if (p.alpha > 0) {
                        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.alpha})`;
                        ctx.fillRect(p.x, p.y, particleSize, particleSize);
                    }
                });

                requestAnimationFrame(animate);
            };

            animate();

        } catch (err) {
            console.error("Disintegration failed", err);
            onComplete();
        }
    };

    if (!isActive) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[100]"
        />
    );
};
