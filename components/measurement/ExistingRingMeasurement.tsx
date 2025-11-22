import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { ArrowLeftIcon, CheckCircleIcon, AlertTriangleIcon, HelpCircleIcon } from '../icons/UtilIcons';
import { diameterToSize } from '../../lib/sizeConversion';
import type { RingSize } from '../../types';

interface ExistingRingMeasurementProps {
    onComplete: (size: RingSize) => void;
    onBack: () => void;
}

export const ExistingRingMeasurement = ({ onComplete, onBack }: ExistingRingMeasurementProps) => {
    const [step, setStep] = useState<'instructions' | 'measuring' | 'result'>('instructions');
    const [circleDiameter, setCircleDiameter] = useState(200);
    const [resultSize, setResultSize] = useState<RingSize | null>(null);
    const [pixelsPerMm, setPixelsPerMm] = useState<number | null>(null);

    useEffect(() => {
        const dpi = window.devicePixelRatio * 96;
        const pxPerMm = dpi / 25.4;
        setPixelsPerMm(pxPerMm);
        setCircleDiameter(Math.round(17 * pxPerMm));
    }, []);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCircleDiameter(Number(e.target.value));
    };

    const calculateSize = () => {
        if (!pixelsPerMm) return;

        const diameterMm = circleDiameter / pixelsPerMm;
        const size = diameterToSize(diameterMm);

        if (size) {
            setResultSize(size);
            setStep('result');
        }
    };

    const handleRetry = () => {
        setResultSize(null);
        setStep('measuring');
    };

    const handleComplete = () => {
        if (resultSize) {
            onComplete(resultSize);
        }
    };

    const currentDiameterMm = pixelsPerMm ? (circleDiameter / pixelsPerMm).toFixed(1) : '0';

    return (
        <div className="min-h-screen w-full bg-midnight-600 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-bronze-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12 flex-grow flex flex-col max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                        aria-label="Go back"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-silver-300 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
                    </button>
                    <div>
                        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-1">Measure Existing Ring</h1>
                        <p className="text-silver-400 text-base md:text-lg">Place your ring on the screen and adjust to match</p>
                    </div>
                </div>

                {step === 'instructions' && (
                    <Card className="flex flex-col max-w-2xl mx-auto w-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-bronze-400/20 rounded-full">
                                <HelpCircleIcon className="w-6 h-6 text-bronze-400" />
                            </div>
                            <h2 className="text-2xl font-display text-white">How to Measure</h2>
                        </div>

                        <div className="space-y-6 flex-grow mb-6">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bronze-400 text-white flex items-center justify-center font-bold">1</div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Get Your Ring</h3>
                                    <p className="text-silver-400 text-sm">Find a ring that fits the finger you want to measure.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bronze-400 text-white flex items-center justify-center font-bold">2</div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Place on Screen</h3>
                                    <p className="text-silver-400 text-sm">Place your ring flat on the screen. Make sure it's centered and the inner circle is visible.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bronze-400 text-white flex items-center justify-center font-bold">3</div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Adjust the Circle</h3>
                                    <p className="text-silver-400 text-sm">Use the slider to resize the circle until it perfectly matches the inner diameter of your ring.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-6">
                            <div className="flex items-start gap-2">
                                <HelpCircleIcon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-300 mb-1">Tip for Best Results</h4>
                                    <p className="text-xs text-silver-400">
                                        Increase your screen brightness and ensure the ring is completely flat on the screen for the most accurate measurement.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button onClick={() => setStep('measuring')} className="w-full">
                            Start Measuring
                        </Button>
                    </Card>
                )}

                {step === 'measuring' && (
                    <div className="flex-grow flex flex-col">
                        <div className="flex-grow bg-midnight-800 rounded-2xl overflow-hidden relative min-h-[500px] flex items-center justify-center border border-white/10">
                            <div
                                className="absolute border-4 border-bronze-400 rounded-full transition-all duration-150 ease-out"
                                style={{
                                    width: `${circleDiameter}px`,
                                    height: `${circleDiameter}px`,
                                    boxShadow: '0 0 0 2px rgba(255,255,255,0.3), inset 0 0 0 2px rgba(255,255,255,0.3)'
                                }}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-8 h-0.5 bg-bronze-400"></div>
                                    <div className="w-0.5 h-8 bg-bronze-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                            </div>

                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-6 py-3 rounded-full">
                                <p className="text-white text-sm font-medium">Place ring and adjust slider below</p>
                            </div>

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-bronze-500 px-6 py-2 rounded-full">
                                <p className="text-white text-lg font-bold">{currentDiameterMm} mm</p>
                            </div>
                        </div>

                        <Card className="mt-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-silver-300">Adjust Circle Size</label>
                                    <span className="text-sm text-silver-400">{currentDiameterMm} mm</span>
                                </div>
                                <input
                                    type="range"
                                    min={pixelsPerMm ? Math.round(10 * pixelsPerMm) : 100}
                                    max={pixelsPerMm ? Math.round(30 * pixelsPerMm) : 400}
                                    value={circleDiameter}
                                    onChange={handleSliderChange}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                                    style={{
                                        background: `linear-gradient(to right, #D4A574 0%, #D4A574 ${((circleDiameter - (pixelsPerMm ? Math.round(10 * pixelsPerMm) : 100)) / ((pixelsPerMm ? Math.round(30 * pixelsPerMm) : 400) - (pixelsPerMm ? Math.round(10 * pixelsPerMm) : 100))) * 100}%, rgba(255,255,255,0.1) ${((circleDiameter - (pixelsPerMm ? Math.round(10 * pixelsPerMm) : 100)) / ((pixelsPerMm ? Math.round(30 * pixelsPerMm) : 400) - (pixelsPerMm ? Math.round(10 * pixelsPerMm) : 100))) * 100}%, rgba(255,255,255,0.1) 100%)`
                                    }}
                                />
                                <div className="flex justify-between text-xs text-silver-500">
                                    <span>Smaller (10mm)</span>
                                    <span>Larger (30mm)</span>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-yellow-300 mb-1">Important</h4>
                                        <p className="text-xs text-silver-400">
                                            Match the circle to the <strong>inner diameter</strong> of your ring (the hole, not the outer edge). The circle should fit perfectly inside your ring.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <Button onClick={() => setStep('instructions')} variant="secondary" className="flex-1">
                                    Back
                                </Button>
                                <Button onClick={calculateSize} className="flex-1" icon={<CheckCircleIcon className="w-5 h-5" />}>
                                    Confirm Size
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {step === 'result' && resultSize && (
                    <Card className="flex flex-col max-w-2xl mx-auto w-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-green-500/20 rounded-full">
                                <CheckCircleIcon className="w-6 h-6 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-display text-white">Ring Size Measured</h2>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-6 bg-white/5 rounded-lg border border-white/10 text-center">
                                <div className="text-sm text-silver-400 mb-2">Inner Diameter</div>
                                <div className="text-4xl font-bold text-bronze-400 mb-1">
                                    {currentDiameterMm} mm
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="text-xs text-silver-400 mb-1">US Size</div>
                                    <div className="text-2xl font-semibold text-white">{resultSize.us}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="text-xs text-silver-400 mb-1">UK Size</div>
                                    <div className="text-2xl font-semibold text-white">{resultSize.uk}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="text-xs text-silver-400 mb-1">EU Size</div>
                                    <div className="text-2xl font-semibold text-white">{resultSize.eu}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="text-xs text-silver-400 mb-1">Circumference</div>
                                    <div className="text-2xl font-semibold text-white">{resultSize.circumference_mm.toFixed(1)}mm</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={handleRetry} variant="secondary" className="flex-1">
                                Measure Again
                            </Button>
                            <Button onClick={handleComplete} className="flex-1" icon={<ArrowLeftIcon className="w-5 h-5 rotate-180" />}>
                                Continue to Results
                            </Button>
                        </div>
                    </Card>
                )}
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
