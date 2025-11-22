import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { ArrowLeftIcon, CheckCircleIcon, HelpCircleIcon } from '../icons/UtilIcons';
import { RulerIcon } from '../icons/MethodIcons';
import { FadeIn } from '../animations/FadeIn';

interface RulerCalibrationProps {
    onCalibrate: (pxPerMm: number) => void;
    onBack: () => void;
}

export const RulerCalibration = ({ onCalibrate, onBack }: RulerCalibrationProps) => {
    const [calibrationLengthMm, setCalibrationLengthMm] = useState(50);
    const [sliderValue, setSliderValue] = useState(50);
    const [pxPerMm, setPxPerMm] = useState(0);

    useEffect(() => {
        const screenWidth = window.innerWidth;
        const lineLengthPx = (screenWidth * sliderValue) / 100;
        setPxPerMm(lineLengthPx / calibrationLengthMm);
    }, [sliderValue, calibrationLengthMm]);

    const handleSave = () => {
        onCalibrate(pxPerMm);
    };

    return (
        <div className="min-h-screen w-full bg-midnight-600 relative overflow-hidden flex flex-col">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-bronze-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12 flex-grow flex flex-col max-w-4xl">
                {/* Header */}
                <FadeIn direction="down">
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={onBack}
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                            aria-label="Go back"
                        >
                            <ArrowLeftIcon className="h-5 w-5 text-silver-300 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
                        </button>
                        <div>
                            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-1">Ruler Calibration</h1>
                            <p className="text-silver-400 text-base md:text-lg">Calibrate your screen for accurate measurements</p>
                        </div>
                    </div>
                </FadeIn>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <FadeIn delay={0.1}>
                        <Card className="w-full max-w-2xl">
                            {/* Instructions */}
                            <div className="mb-8 text-center">
                                <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-full">
                                    <RulerIcon className="w-6 h-6 text-blue-400" />
                                    <span className="text-blue-300 font-medium">Place a ruler against your screen</span>
                                </div>
                                <p className="text-xl text-white mb-2">
                                    Adjust the slider to match <span className="text-bronze-400 font-bold">{calibrationLengthMm}mm</span> on your ruler
                                </p>
                                <p className="text-sm text-silver-400">
                                    The line below should exactly match the measurement on your physical ruler
                                </p>
                            </div>

                            {/* Ruler Visualization */}
                            <div className="mb-10">
                                <div className="relative w-full h-32 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                    {/* Grid background for reference */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="grid grid-cols-10 h-full">
                                            {[...Array(10)].map((_, i) => (
                                                <div key={i} className="border-r border-white/20"></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* The Measurement Line */}
                                    <div
                                        className="relative h-20 border-x-4 border-bronze-400 bg-gradient-to-r from-bronze-500/20 via-bronze-500/10 to-bronze-500/20 transition-all duration-150 ease-out shadow-[0_0_30px_rgba(201,166,104,0.3)]"
                                        style={{ width: `${sliderValue}%` }}
                                    >
                                        {/* Center line */}
                                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-bronze-400/50"></div>

                                        {/* Measurement markers */}
                                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-bronze-400"></div>
                                        <div className="absolute top-0 right-0 bottom-0 w-1 bg-bronze-400"></div>

                                        {/* Label */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-midnight-600 px-4 py-2 rounded-lg border border-bronze-400/50 shadow-lg">
                                            <span className="text-bronze-400 font-bold text-lg font-mono">{calibrationLengthMm}mm</span>
                                        </div>

                                        {/* Drag handles */}
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-bronze-400 rounded-full border-4 border-midnight-600 shadow-lg cursor-ew-resize"></div>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-bronze-400 rounded-full border-4 border-midnight-600 shadow-lg cursor-ew-resize"></div>
                                    </div>
                                </div>

                                {/* Slider Control */}
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-silver-400">Adjust Size</span>
                                        <span className="text-sm text-silver-400">{sliderValue.toFixed(1)}% of screen</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="20"
                                        max="90"
                                        step="0.1"
                                        value={sliderValue}
                                        onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                                        className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                                        style={{
                                            background: `linear-gradient(to right, #D4A574 0%, #D4A574 ${sliderValue}%, rgba(255,255,255,0.1) ${sliderValue}%, rgba(255,255,255,0.1) 100%)`
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Quick Select Options */}
                            <div className="mb-8">
                                <p className="text-sm text-silver-400 mb-3 text-center">Quick select reference object:</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setCalibrationLengthMm(50)}
                                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${calibrationLengthMm === 50
                                                ? 'bg-bronze-400 border-bronze-400 text-white shadow-lg shadow-bronze-400/30'
                                                : 'bg-white/5 border-white/10 text-silver-300 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="font-bold text-lg">50mm</div>
                                        <div className="text-xs opacity-75">Standard</div>
                                    </button>
                                    <button
                                        onClick={() => setCalibrationLengthMm(85.6)}
                                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${calibrationLengthMm === 85.6
                                                ? 'bg-bronze-400 border-bronze-400 text-white shadow-lg shadow-bronze-400/30'
                                                : 'bg-white/5 border-white/10 text-silver-300 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="font-bold text-lg">85.6mm</div>
                                        <div className="text-xs opacity-75">Credit Card</div>
                                    </button>
                                    <button
                                        onClick={() => setCalibrationLengthMm(100)}
                                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${calibrationLengthMm === 100
                                                ? 'bg-bronze-400 border-bronze-400 text-white shadow-lg shadow-bronze-400/30'
                                                : 'bg-white/5 border-white/10 text-silver-300 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="font-bold text-lg">100mm</div>
                                        <div className="text-xs opacity-75">10cm</div>
                                    </button>
                                </div>
                            </div>

                            {/* Help Tip */}
                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-6">
                                <div className="flex items-start gap-2">
                                    <HelpCircleIcon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-blue-300 mb-1">Tip for Best Results</h4>
                                        <p className="text-xs text-silver-400">
                                            Use a physical ruler or credit card for the most accurate calibration. Adjust the slider until the line exactly matches your reference object.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Confirm Button */}
                            <Button
                                onClick={handleSave}
                                className="w-full py-4 text-lg"
                                icon={<CheckCircleIcon className="w-5 h-5" />}
                            >
                                Confirm Calibration
                            </Button>
                        </Card>
                    </FadeIn>
                </div>
            </div>

            <style>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #D4A574;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    border: 3px solid white;
                }
                
                .slider::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #D4A574;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    border: 3px solid white;
                }
            `}</style>
        </div>
    );
};
