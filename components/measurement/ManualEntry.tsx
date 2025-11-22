import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { ArrowLeftIcon, HelpCircleIcon, CheckCircleIcon, AlertTriangleIcon } from '../icons/UtilIcons';
import {
    findByUSSize,
    findByUKSize,
    findByEUSize,
    diameterToSize,
    circumferenceToSize,
    adjustSizeForBandWidth,
    getBandWidthRecommendation,
    validateUSSize,
    validateEUSize,
    validateDiameter,
    validateCircumference,
    RING_SIZE_TABLE
} from '../../lib/sizeConversion';
import type { RingSize } from '../../types';

interface ManualEntryProps {
    onComplete: (size: RingSize, bandWidth?: number) => void;
    onBack: () => void;
}

type InputMethod = 'us-size' | 'uk-size' | 'eu-size' | 'diameter' | 'circumference';

export const ManualEntry = ({ onComplete, onBack }: ManualEntryProps) => {
    const [inputMethod, setInputMethod] = useState<InputMethod>('us-size');
    const [inputValue, setInputValue] = useState('');
    const [bandWidth, setBandWidth] = useState(2);
    const [showHelp, setShowHelp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultSize, setResultSize] = useState<RingSize | null>(null);

    useEffect(() => {
        // Clear error and result when input method or value changes
        setError(null);
        setResultSize(null);

        if (!inputValue) return;

        const value = parseFloat(inputValue);
        if (isNaN(value) && inputMethod !== 'uk-size') return;

        let size: RingSize | null = null;

        try {
            switch (inputMethod) {
                case 'us-size':
                    if (!validateUSSize(value)) {
                        setError('US sizes range from 3 to 13');
                        return;
                    }
                    size = findByUSSize(value);
                    break;

                case 'uk-size':
                    size = findByUKSize(inputValue.toUpperCase());
                    if (!size) {
                        setError('UK sizes range from F to Z');
                        return;
                    }
                    break;

                case 'eu-size':
                    if (!validateEUSize(value)) {
                        setError('EU sizes range from 44 to 70');
                        return;
                    }
                    size = findByEUSize(value);
                    break;

                case 'diameter':
                    if (!validateDiameter(value)) {
                        setError('Diameter should be between 14mm and 23mm');
                        return;
                    }
                    size = diameterToSize(value);
                    break;

                case 'circumference':
                    if (!validateCircumference(value)) {
                        setError('Circumference should be between 44mm and 72mm');
                        return;
                    }
                    size = circumferenceToSize(value);
                    break;
            }

            if (!size) {
                setError('Could not find matching ring size');
                return;
            }

            setResultSize(size);
        } catch (err) {
            setError('Invalid input');
        }
    }, [inputValue, inputMethod]);

    const handleContinue = () => {
        if (resultSize) {
            onComplete(resultSize, bandWidth);
        }
    };

    // Fix TypeScript error by converting resultSize.us to number
    const adjustedSize = resultSize ? adjustSizeForBandWidth(Number(resultSize.us), bandWidth) : null;
    const needsAdjustment = adjustedSize && adjustedSize !== Number(resultSize.us);

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
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                        aria-label="Go back"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-silver-300 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
                    </button>
                    <div>
                        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-1">Manual Entry</h1>
                        <p className="text-silver-400 text-base md:text-lg">Enter your ring size directly</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
                    {/* Input Section */}
                    <Card className="flex flex-col">
                        <h2 className="text-2xl font-display text-white mb-6">Enter Your Size</h2>

                        {/* Input Method Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-silver-300 mb-3">Measurement Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: 'us-size', label: 'US Size' },
                                    { value: 'uk-size', label: 'UK Size' },
                                    { value: 'eu-size', label: 'EU Size' },
                                    { value: 'diameter', label: 'Diameter (mm)' },
                                    { value: 'circumference', label: 'Circumference (mm)' },
                                ].map((method) => (
                                    <button
                                        key={method.value}
                                        onClick={() => {
                                            setInputMethod(method.value as InputMethod);
                                            setInputValue('');
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${inputMethod === method.value
                                            ? 'bg-bronze-400 text-white shadow-lg'
                                            : 'bg-white/5 text-silver-300 hover:bg-white/10'
                                            }`}
                                    >
                                        {method.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Field */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-silver-300 mb-2">
                                {inputMethod === 'us-size' && 'US Ring Size (e.g., 7)'}
                                {inputMethod === 'uk-size' && 'UK Ring Size (e.g., N)'}
                                {inputMethod === 'eu-size' && 'EU Ring Size (e.g., 54)'}
                                {inputMethod === 'diameter' && 'Inner Diameter (mm)'}
                                {inputMethod === 'circumference' && 'Inner Circumference (mm)'}
                            </label>
                            <input
                                type={inputMethod === 'uk-size' ? 'text' : 'number'}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={
                                    inputMethod === 'us-size' ? '7' :
                                        inputMethod === 'uk-size' ? 'N' :
                                            inputMethod === 'eu-size' ? '54' :
                                                inputMethod === 'diameter' ? '17.3' :
                                                    '54.4'
                                }
                                step={inputMethod === 'us-size' ? '0.5' : inputMethod === 'diameter' || inputMethod === 'circumference' ? '0.1' : '1'}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-silver-500 focus:outline-none focus:border-bronze-400 focus:ring-2 focus:ring-bronze-400/20 transition-all"
                            />
                            {error && (
                                <div className="mt-2 flex items-center gap-2 text-error text-sm">
                                    <AlertTriangleIcon className="w-4 h-4" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        {/* Band Width Slider */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-silver-300">Band Width</label>
                                <span className="text-bronze-400 font-semibold">{bandWidth}mm</span>
                            </div>
                            <input
                                type="range"
                                min="2"
                                max="12"
                                step="0.5"
                                value={bandWidth}
                                onChange={(e) => setBandWidth(parseFloat(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-bronze-400"
                            />
                            <p className="text-xs text-silver-500 mt-2">{getBandWidthRecommendation(bandWidth)}</p>
                        </div>

                        {/* Help Button */}
                        <button
                            onClick={() => setShowHelp(true)}
                            className="flex items-center gap-2 text-sm text-bronze-400 hover:text-bronze-300 transition-colors mt-auto"
                        >
                            <HelpCircleIcon className="w-4 h-4" />
                            <span>How to measure your ring size</span>
                        </button>
                    </Card>

                    {/* Results Section */}
                    <Card className="flex flex-col">
                        <h2 className="text-2xl font-display text-white mb-6">Size Conversions</h2>

                        {resultSize ? (
                            <div className="space-y-4 flex-grow">
                                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                    <div className="text-sm text-silver-400 mb-1">US Size</div>
                                    <div className="text-3xl font-bold text-white">{resultSize.us}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <div className="text-xs text-silver-400 mb-1">UK</div>
                                        <div className="text-xl font-semibold text-white">{resultSize.uk}</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <div className="text-xs text-silver-400 mb-1">EU</div>
                                        <div className="text-xl font-semibold text-white">{resultSize.eu}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <div className="text-xs text-silver-400 mb-1">Diameter</div>
                                        <div className="text-lg font-semibold text-white">{resultSize.diameter_mm}mm</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <div className="text-xs text-silver-400 mb-1">Circumference</div>
                                        <div className="text-lg font-semibold text-white">{resultSize.circumference_mm}mm</div>
                                    </div>
                                </div>

                                {needsAdjustment && (
                                    <div className="p-4 bg-bronze-500/10 border border-bronze-500/30 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <CheckCircleIcon className="w-5 h-5 text-bronze-400 mt-0.5" />
                                            <div>
                                                <div className="text-sm font-medium text-bronze-300 mb-1">Recommended Adjustment</div>
                                                <div className="text-xs text-silver-400">
                                                    For a {bandWidth}mm band, we recommend size <span className="font-semibold text-white">{adjustedSize}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handleContinue}
                                    className="w-full mt-auto"
                                    icon={<ArrowLeftIcon className="w-5 h-5 rotate-180" />}
                                >
                                    Continue to Results
                                </Button>
                            </div>
                        ) : (
                            <div className="flex-grow flex items-center justify-center text-center">
                                <div className="text-silver-500">
                                    <div className="text-4xl mb-4">📏</div>
                                    <p>Enter your ring size to see conversions</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Help Modal */}
            {showHelp && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-display text-white">How to Measure Your Ring Size</h3>
                            <button
                                onClick={() => setShowHelp(false)}
                                className="text-silver-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6 text-silver-300">
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Method 1: Measure an Existing Ring</h4>
                                <ol className="list-decimal list-inside space-y-2 text-sm">
                                    <li>Find a ring that fits the intended finger</li>
                                    <li>Measure the inner diameter in millimeters</li>
                                    <li>Enter the measurement in the "Diameter" field</li>
                                </ol>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Method 2: Measure Your Finger</h4>
                                <ol className="list-decimal list-inside space-y-2 text-sm">
                                    <li>Wrap a string or paper strip around your finger</li>
                                    <li>Mark where it overlaps</li>
                                    <li>Measure the length in millimeters</li>
                                    <li>Enter the measurement in the "Circumference" field</li>
                                </ol>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Tips for Accurate Measurement</h4>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    <li>Measure at the end of the day when fingers are largest</li>
                                    <li>Measure 3-4 times to ensure consistency</li>
                                    <li>Consider the knuckle - the ring must fit over it</li>
                                    <li>Temperature affects finger size - measure in normal conditions</li>
                                </ul>
                            </div>
                        </div>

                        <Button onClick={() => setShowHelp(false)} className="w-full mt-6">
                            Got it!
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
};
