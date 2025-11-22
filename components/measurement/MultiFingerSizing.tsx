import React, { useState } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { ArrowLeftIcon, CheckCircleIcon, PlusIcon, TrashIcon } from '../icons/UtilIcons';
import type { RingSize } from '../../types';

interface FingerMeasurement {
    finger: string;
    hand: 'left' | 'right';
    size: RingSize;
}

interface MultiFingerSizingProps {
    currentSize: RingSize;
    onBack: () => void;
    onComplete: (measurements: FingerMeasurement[]) => void;
}

const FINGERS = [
    { id: 'thumb', label: 'Thumb' },
    { id: 'index', label: 'Index Finger' },
    { id: 'middle', label: 'Middle Finger' },
    { id: 'ring', label: 'Ring Finger' },
    { id: 'pinky', label: 'Pinky Finger' },
];

export const MultiFingerSizing = ({ currentSize, onBack, onComplete }: MultiFingerSizingProps) => {
    const [measurements, setMeasurements] = useState<FingerMeasurement[]>([
        { finger: 'ring', hand: 'left', size: currentSize }
    ]);
    const [selectedFinger, setSelectedFinger] = useState<string>('');
    const [selectedHand, setSelectedHand] = useState<'left' | 'right'>('left');

    const addMeasurement = () => {
        if (!selectedFinger) return;

        const newMeasurement: FingerMeasurement = {
            finger: selectedFinger,
            hand: selectedHand,
            size: currentSize,
        };

        setMeasurements([...measurements, newMeasurement]);
        setSelectedFinger('');
    };

    const removeMeasurement = (index: number) => {
        setMeasurements(measurements.filter((_, i) => i !== index));
    };

    const getFingerLabel = (fingerId: string) => {
        return FINGERS.find(f => f.id === fingerId)?.label || fingerId;
    };

    const handleComplete = () => {
        onComplete(measurements);
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
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                        aria-label="Go back"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-silver-300 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
                    </button>
                    <div>
                        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-1">Multi-Finger Sizing</h1>
                        <p className="text-silver-400 text-base md:text-lg">Save sizes for all your fingers</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
                    {/* Add Measurement Card */}
                    <Card className="flex flex-col">
                        <h2 className="text-2xl font-display text-white mb-6">Add Finger</h2>

                        <div className="space-y-6 flex-grow">
                            {/* Hand Selection */}
                            <div>
                                <label className="block text-sm font-medium text-silver-300 mb-3">Hand</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setSelectedHand('left')}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${selectedHand === 'left'
                                                ? 'bg-bronze-400 text-white shadow-lg'
                                                : 'bg-white/5 text-silver-300 hover:bg-white/10'
                                            }`}
                                    >
                                        Left Hand
                                    </button>
                                    <button
                                        onClick={() => setSelectedHand('right')}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${selectedHand === 'right'
                                                ? 'bg-bronze-400 text-white shadow-lg'
                                                : 'bg-white/5 text-silver-300 hover:bg-white/10'
                                            }`}
                                    >
                                        Right Hand
                                    </button>
                                </div>
                            </div>

                            {/* Finger Selection */}
                            <div>
                                <label className="block text-sm font-medium text-silver-300 mb-3">Finger</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {FINGERS.map((finger) => (
                                        <button
                                            key={finger.id}
                                            onClick={() => setSelectedFinger(finger.id)}
                                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left ${selectedFinger === finger.id
                                                    ? 'bg-bronze-400 text-white shadow-lg'
                                                    : 'bg-white/5 text-silver-300 hover:bg-white/10'
                                                }`}
                                        >
                                            {finger.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Current Size Display */}
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="text-xs text-silver-400 mb-1">Current Measured Size</div>
                                <div className="text-2xl font-semibold text-white">US {currentSize.us}</div>
                                <div className="text-sm text-silver-400 mt-1">
                                    UK {currentSize.uk} / EU {currentSize.eu}
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={addMeasurement}
                            disabled={!selectedFinger}
                            className="w-full mt-6"
                            icon={<PlusIcon className="w-5 h-5" />}
                        >
                            Add Measurement
                        </Button>
                    </Card>

                    {/* Saved Measurements Card */}
                    <Card className="flex flex-col">
                        <h2 className="text-2xl font-display text-white mb-6">Saved Measurements</h2>

                        {measurements.length === 0 ? (
                            <div className="flex-grow flex items-center justify-center text-center py-12">
                                <div className="text-silver-500">
                                    <div className="text-4xl mb-4">👆</div>
                                    <p>No measurements saved yet</p>
                                    <p className="text-sm mt-2">Add your first finger measurement</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 flex-grow overflow-y-auto max-h-[500px]">
                                {measurements.map((measurement, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-white font-semibold">
                                                    {getFingerLabel(measurement.finger)}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-bronze-400/20 text-bronze-300">
                                                    {measurement.hand === 'left' ? 'Left' : 'Right'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-silver-400">
                                                US {measurement.size.us} • UK {measurement.size.uk} • EU {measurement.size.eu}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeMeasurement(index)}
                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                                            aria-label="Remove measurement"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {measurements.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="flex items-center gap-2 text-sm text-silver-400 mb-4">
                                    <CheckCircleIcon className="w-4 h-4 text-green-400" />
                                    <span>{measurements.length} finger{measurements.length !== 1 ? 's' : ''} measured</span>
                                </div>
                                <Button
                                    onClick={handleComplete}
                                    className="w-full"
                                    icon={<ArrowLeftIcon className="w-5 h-5 rotate-180" />}
                                >
                                    Save All Measurements
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};
