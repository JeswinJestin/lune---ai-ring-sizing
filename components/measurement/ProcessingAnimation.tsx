import React, { useMemo } from 'react';

const messages = [
    "Detecting reference object...",
    "Calibrating measurements...",
    "Analyzing finger dimensions...",
    "Calculating ring size...",
    "Finalizing your result..."
];

const tips = [
    "Did you know? Fingers can be slightly larger in the evening.",
    "For best results, measure when your hands are warm.",
    "A wider ring band may require a slightly larger size.",
    "Your dominant hand is often slightly larger.",
    "Ensure your ring can slide over your knuckle comfortably."
];

export const ProcessingAnimation = ({ percentage, message }: { percentage: number; message: string }) => {
    const randomTip = useMemo(() => tips[Math.floor(Math.random() * tips.length)], []);

    return (
        <div className="fixed inset-0 bg-midnight-700 flex flex-col items-center justify-center text-center p-8 z-50 animate-[fadeIn_0.5s_ease-out]">
            <div className="relative w-40 h-40 mb-12">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="stroke-current text-platinum-300/10"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r="42"
                        fill="transparent"
                    ></circle>
                    <circle
                        className="stroke-current text-bronze-400"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r="42"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - percentage / 100)}`}
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dashoffset 0.5s linear' }}
                    ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-4xl text-silver-100">{Math.round(percentage)}%</span>
                </div>
            </div>
            
            <div className="h-10">
                <h2 className="font-display text-4xl text-silver-100 mb-4 transition-opacity duration-500">
                    {message}
                </h2>
            </div>


            <div className="w-full max-w-md bg-midnight-500/50 rounded-full h-2.5 my-4 overflow-hidden">
                <div 
                  className="bg-bronze-400 h-2.5 rounded-full transition-all duration-500 ease-linear" 
                  style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <p className="text-silver-400 mt-8 h-10">{randomTip}</p>
        </div>
    );
};
