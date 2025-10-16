import { useEffect, useRef } from 'react';

const MagicLine = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const activePathRef = useRef<SVGPathElement>(null);
    const bgPathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const updateSvgPath = () => {
            const docHeight = document.body.offsetHeight;
            const viewBoxWidth = 100;
            if (!svgRef.current || !activePathRef.current || !bgPathRef.current) return;

            svgRef.current.setAttribute('viewBox', `0 0 ${viewBoxWidth} ${docHeight}`);
            svgRef.current.style.height = `${docHeight}px`;

            const verticalStep = 250;
            const waveAmplitude = 50;
            const initialX = 50;

            const points: string[] = [`M ${initialX} 0`];
            for (let y = 0; y <= docHeight; y += verticalStep) {
                const nextY = Math.min(y + verticalStep, docHeight);
                const x = initialX + Math.sin(y / 1200) * waveAmplitude;
                const nextX = initialX + Math.sin(nextY / 1200) * waveAmplitude;
                const x1 = initialX + Math.cos((y + verticalStep / 3) / 1200) * waveAmplitude * 0.9;
                const x2 = initialX - Math.sin((y + (2 * verticalStep) / 3) / 1200) * waveAmplitude * 1.1;
                const y1 = y + verticalStep / 3;
                const y2 = y + (2 * verticalStep) / 3;

                if (nextY >= docHeight) {
                    points.push(`L ${nextX} ${docHeight}`);
                    break;
                }
                points.push(`C ${x1} ${y1}, ${x2} ${y2}, ${nextX} ${nextY}`);
            }

            const pathD = points.join(' ');
            activePathRef.current.setAttribute('d', pathD);
            bgPathRef.current.setAttribute('d', pathD);

            const pathLength = activePathRef.current.getTotalLength();
            activePathRef.current.style.strokeDasharray = `${pathLength}`;
            activePathRef.current.style.strokeDashoffset = `${pathLength}`;

            return pathLength;
        };

        const handleScroll = () => {
            const pathLength = updateSvgPath();
            const scrollY = window.scrollY;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const progress = docHeight > 0 ? scrollY / docHeight : 0;
            if (activePathRef.current && pathLength)
                activePathRef.current.style.strokeDashoffset = `${pathLength - pathLength * progress}`;
        };

        window.addEventListener('load', handleScroll);
        window.addEventListener('resize', handleScroll);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('load', handleScroll);
            window.removeEventListener('resize', handleScroll);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <svg
            ref={svgRef}
            id="magic-line-svg"
            xmlns="http://www.w3.org/2000/svg"
            className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none overflow-visible opacity-80"
        >
            <path ref={bgPathRef} className="wave-path" stroke="#cbd5e1" />
            <path ref={activePathRef} className="wave-path" stroke="#10b981" />
        </svg>
    );
};

export default MagicLine;