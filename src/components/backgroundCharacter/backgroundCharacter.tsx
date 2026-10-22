import { useEffect, useRef, useState } from "react";
import styles from "./backgroundCharacter.module.scss";

const BackgroundCharacter = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    const [gaze, setGaze] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const svg = svgRef.current;
            if (!svg) return;

            const rect = svg.getBoundingClientRect();

            // Центр лица в координатах SVG
            const faceX = rect.left + rect.width * (150 / 300);
            const faceY = rect.top + rect.height * (145 / 420);

            // Нормализуем направление взгляда
            const dx = (event.clientX - faceX) / (window.innerWidth / 2);
            const dy = (event.clientY - faceY) / (window.innerHeight / 2);

            setGaze({
                x: Math.max(-1, Math.min(1, dx)) * 5,
                y: Math.max(-1, Math.min(1, dy)) * 4,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className={styles.character}>
            <svg
                ref={svgRef}
                viewBox="0 0 300 420"
                className={styles.character__drawing}
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <g
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Плечи и тело */}
                    <path d="M70 390 C75 330 95 290 150 285 C205 290 225 330 230 390" />
                    <path d="M110 295 C120 320 180 320 190 295" />

                    {/* Шея */}
                    <path d="M125 245 L125 285" />
                    <path d="M175 245 L175 285" />

                    {/* Контур лица */}
                    <path d="M90 125 C88 185 103 235 150 255 C197 235 212 185 210 125" />

                    {/* Уши */}
                    <path d="M90 165 C72 150 75 190 94 195" />
                    <path d="M210 165 C228 150 225 190 206 195" />

                    {/* Волосы */}
                    <path d="M90 155 C70 105 90 65 135 60 C180 45 215 80 210 145" />
                    <path d="M92 125 C110 100 130 110 145 82" />
                    <path d="M145 82 C170 108 190 95 207 125" />
                    <path d="M100 95 C115 70 145 72 160 60" />

                    {/* Брови */}
                    <path d="M102 130 Q120 120 135 132" />
                    <path d="M165 132 Q182 120 198 130" />

                    {/* Глаза */}
                    <ellipse cx="118" cy="150" rx="17" ry="10" />
                    <ellipse cx="182" cy="150" rx="17" ry="10" />

                    {/* Зрачки следят за мышью */}
                    <g
                        transform={`translate(${gaze.x} ${gaze.y})`}
                    >
                        <circle cx="118" cy="150" r="5" fill="currentColor" />
                        <circle cx="182" cy="150" r="5" fill="currentColor" />
                    </g>

                    {/* Нос */}
                    <path d="M150 155 L143 190 Q150 195 157 190" />

                    {/* Рот */}
                    <path d="M132 215 Q150 225 168 215" />

                    {/* Дополнительные штрихи карандаша */}
                    <path
                        d="M95 165 C97 190 103 205 110 215"
                        strokeWidth="1"
                        opacity="0.5"
                    />
                    <path
                        d="M205 165 C203 190 197 205 190 215"
                        strokeWidth="1"
                        opacity="0.5"
                    />
                </g>

                {/* Вторичные линии создают ощущение ручного рисунка */}
                <g
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.35"
                >
                    <path d="M93 127 C90 170 105 230 150 258" />
                    <path d="M152 258 C198 235 213 180 207 128" />
                    <path d="M73 387 C82 333 104 302 130 294" />
                    <path d="M227 387 C218 333 196 302 170 294" />
                </g>
            </svg>
        </div>
    );
};

export default BackgroundCharacter;