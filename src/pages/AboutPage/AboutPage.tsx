// App.tsx
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Advantages from './components/Advantages';
import Examples from './components/Examples';
import Pricing from './components/Pricing';
import MagicLine from './components/MagicLine';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Типы для TypeScript
interface UserActivity {
    text: string;
    emoji: string;
}

const USER_ACTIVITIES: UserActivity[] = [
    { text: "Рассчитал ипотеку", emoji: "💳" },
    { text: "Оставил заявку", emoji: "📋" },
    { text: "Ищет 3-комнатную", emoji: "⌂" },
    { text: "Поделился страницей", emoji: "🔗" },
    { text: "Смотрит видео-тур", emoji: "▶️" },
    { text: "Добавил в избранное", emoji: "★" },
];

// Параметры отрисовки
const FLIGHT_DURATION_SECONDS = 15;
const FONT_SIZE = 16;
const TEXT_Y_OFFSET = 3;
const BUBBLE_PADDING_X = 16;
const BUBBLE_PADDING_Y = 10;
const FIXED_ACCENT_COLOR = "#007BFF";

/**
 * Класс Частицы (Сообщение) для отрисовки на Canvas.
 */
class Particle {
    canvasHeight: number;
    canvasWidth: number;
    message: string;
    size: number;
    accentColor: string;
    initialX: number;
    x: number;
    y: number;
    speedY: number;
    swayAmplitude: number;
    swayFrequency: number;
    swayOffset: number;
    opacity: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvasHeight = canvas.height;
        this.canvasWidth = canvas.width;

        const activity = USER_ACTIVITIES[Math.floor(Math.random() * USER_ACTIVITIES.length)];
        this.message = `${activity.emoji} ${activity.text}`;
        this.size = FONT_SIZE;
        this.accentColor = FIXED_ACCENT_COLOR;

        // Начинаем из центра нижней части контейнера
        this.initialX = canvas.width / 2;
        this.x = this.initialX;
        this.y = this.canvasHeight;

        // Скорость: рассчитывается исходя из 10-секундного полета
        const DURATION_FRAMES = FLIGHT_DURATION_SECONDS * 60;
        this.speedY = this.canvasHeight / DURATION_FRAMES;

        // Логика для плавного качания (Sway/Дрейф)
        this.swayAmplitude = Math.random() * (this.canvasWidth / 16) + (this.canvasWidth / 16);
        this.swayFrequency = Math.random() * 0.01 + 0.005;
        this.swayOffset = Math.random() * 2 * Math.PI;

        this.opacity = 1;
    }

    update(): void {
        this.y -= this.speedY; // Движение вверх

        // Горизонтальный дрейф
        this.x = this.initialX + Math.sin(this.y * this.swayFrequency + this.swayOffset) * this.swayAmplitude;

        const verticalProgress = this.y / this.canvasHeight;

        // Плавное исчезновение в верхней трети
        if (verticalProgress < 0.3) {
            this.opacity = verticalProgress / 0.3;
        } else {
            this.opacity = 1;
        }

        if (this.y < 0) {
            this.opacity = 0;
        }
    }

    drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
        ctx.fill();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.globalAlpha = Math.max(0, this.opacity);

        ctx.font = `700 ${this.size}px Inter, sans-serif`;
        ctx.textAlign = 'center'; // центрирование по ширине

        const metrics = ctx.measureText(this.message);
        const textWidth = metrics.width;

        const bubbleWidth = textWidth + BUBBLE_PADDING_X * 2;
        const bubbleHeight = this.size + BUBBLE_PADDING_Y;

        const bubbleY = this.y - bubbleHeight + TEXT_Y_OFFSET;
        const bubbleX = this.x - bubbleWidth / 2;

        // === 1. Фон пузыря (белый, не жёлтый!) ===
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';

        // Тень для объемности
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        this.drawRoundedRect(ctx, bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8);

        // Сброс тени
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // === 3. Текст — по центру по ширине и высоте ===
        const textCenterX = bubbleX + bubbleWidth / 2; // центр всего пузыря

        const textHeight = this.size;
        const bubbleCenterY = bubbleY + bubbleHeight / 2;
        const textY = bubbleCenterY + textHeight / 4; // компенсация baseline

        ctx.fillStyle = '#333333';
        ctx.fillText(this.message, textCenterX, textY);

        ctx.globalAlpha = 1;
    }

    isDead(): boolean {
        return this.y < -this.size || this.opacity <= 0;
    }
}

// React-компонент, управляющий Canvas
const FloatingCanvas: React.FC = React.memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const frameId = useRef<number>(0);
    const spawnInterval = useRef<number>(0);

    const randomRange = (min: number, max: number): number => Math.random() * (max - min) + min;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Настройка размеров canvas, чтобы он занимал весь родительский контейнер
        const setCanvasSize = (): void => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            }
        };

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const animate = (): void => {
            // Очистка canvas (прозрачный фон)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;

            // Спавн новых сообщений (интервал 3-5 секунд)
            const framesPerInterval = randomRange(180, 300);

            if (spawnInterval.current >= framesPerInterval) {
                if (Math.random() < 0.9) {
                    particles.current.push(new Particle(canvas));
                }
                spawnInterval.current = 0;
            }
            spawnInterval.current++;

            // Обновление и отрисовка существующих сообщений
            const aliveParticles: Particle[] = [];
            for (let i = 0; i < particles.current.length; i++) {
                const p = particles.current[i];
                p.update();
                p.draw(ctx);

                if (!p.isDead()) {
                    aliveParticles.push(p);
                }
            }
            particles.current = aliveParticles;

            frameId.current = requestAnimationFrame(animate);
        };

        animate();

        // Очистка при демонтировании компонента
        return () => {
            cancelAnimationFrame(frameId.current);
            window.removeEventListener('resize', setCanvasSize);
        };
    }, []);

    // Canvas должен растягиваться на весь родительский контейнер
    return <canvas ref={canvasRef} className="w-full h-full block" />;
});

FloatingCanvas.displayName = 'FloatingCanvas';

const AboutPage: React.FC = () => {
    return (
        <div className="relative">
            <MagicLine />
            <main className="relative z-10">
                <Hero />
                <HowItWorks />
                <Advantages />
                <Examples />
                <Pricing />
            </main>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                className="fixed bottom-0 right-0 w-80 h-[500px] z-50 overflow-hidden"
            >
                <div className="relative w-full h-full pointer-events-none">
                    <FloatingCanvas />
                </div>
            </motion.div>
        </div>
    );
}

export default AboutPage;