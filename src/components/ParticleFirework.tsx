import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';

interface ParticleFireworkProps {
    show: boolean;
    parentRef: React.RefObject<HTMLElement | null>;
    style?: React.CSSProperties;
}

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    alpha: number;
    color: string;
};

const defaultWidth = 300;
const defaultHeight = 400;

const genEdgePosition = (width: number, height: number): { x: number; y: number; angle: number } => {
    // 边缘四条边随机生成
    const edge = Math.floor(Math.random() * 4);
    let x = 0, y = 0, angle = 0;
    if (edge === 0) { // 上
        x = Math.random() * width;
        y = 0;
        angle = Math.PI / 2 + (Math.random() - 0.5);
    } else if (edge === 1) { // 右
        x = width;
        y = Math.random() * height;
        angle = Math.PI + (Math.random() - 0.5);
    } else if (edge === 2) { // 下
        x = Math.random() * width;
        y = height;
        angle = -Math.PI / 2 + (Math.random() - 0.5);
    } else { // 左
        x = 0;
        y = Math.random() * height;
        angle = 0 + (Math.random() - 0.5);
    }
    return { x, y, angle };
};

const ParticleFirework: React.FC<ParticleFireworkProps> = ({
    show, parentRef, style
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    // 监听父元素大小
    useLayoutEffect(() => {
        if (!parentRef.current) return;
        const handleResize = () => {
            const parent = parentRef.current!;
            const rect = parent.getBoundingClientRect();
            setSize({ width: rect.width, height: rect.height });
        };

        handleResize(); // 初始化

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [parentRef]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animation: number;
        let particleInterval: number;
        let particles: Particle[] = [];
        // 渲染函数
        const draw = () => {
            ctx.clearRect(0, 0, size.width, size.height);
            particles = particles.filter(p => p.alpha > 0.05 && p.r > 0.5);
            for (const p of particles) {
                ctx.beginPath();
                ctx.globalAlpha = p.alpha;
                ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
                ctx.fillStyle = p.color;
                ctx.fill();
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.006;
                p.r *= 0.985;
            }
            animation = requestAnimationFrame(draw);
        };

        // 悬停时，不断定时添加新粒子
        if (show) {
            // 定期添加
            particleInterval = window.setInterval(() => {
                for (let i = 0; i < 2; ++i) { // 每次出几个
                    const { x, y, angle } = genEdgePosition(size.width, size.height);
                    const speed = Math.random() * 2 + 1.8;
                    const spread = (Math.random() - 0.5) * 0.7; // 方向有些扩散
                    particles.push({
                        x,
                        y,
                        vx: Math.cos(angle + spread) * speed,
                        vy: Math.sin(angle + spread) * speed,
                        r: Math.random() * 2.2 + 1.2,
                        alpha: 1,
                        color: `hsl(${Math.random() * 360},80%,65%)`
                    });
                }
            }, 28); // 30ms 一波
            animation = requestAnimationFrame(draw);
        }

        // 鼠标离开/不显示时：停止动画 & 停止产生粒子
        return () => {
            cancelAnimationFrame(animation);
            clearInterval(particleInterval);
            particles = []; // 可选：不保留旧粒子
            ctx.clearRect(0, 0, size.width, size.height);
        };
    }, [show, size]);

    if (!show) return null;
    return (
        <canvas
            ref={canvasRef}
            width={size.width}
            height={size.height}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9,
                ...style,
            }}
        />
    );
};

export default ParticleFirework;