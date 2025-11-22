import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { ArrowLeftIcon, CheckCircleIcon } from '../icons/UtilIcons';
import { RulerIcon } from '../icons/MethodIcons';
import { FadeIn } from '../animations/FadeIn';

interface RulerCalibrationProps {
    onCalibrate: (pxPerMm: number) => void;
    onBack: () => void;
}

export const RulerCalibration = ({ onCalibrate, onBack }: RulerCalibrationProps) => {
    const [calibrationLengthMm, setCalibrationLengthMm] = useState(50); // Default 50mm
    const [sliderValue, setSliderValue] = useState(50); // Percentage of screen width
    const [pxPerMm, setPxPerMm] = useState(0);

    // Calculate pxPerMm based on slider and known length
    useEffect(() => {
        const screenWidth = window.innerWidth;
        const lineLengthPx = (screenWidth * sliderValue) / 100;
        setPxPerMm(lineLengthPx / calibrationLengthMm);
    }, [sliderValue, calibrationLengthMm]);

    const handleSave = () => {
        onCalibrate(pxPerMm);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-black/50 backdrop-blur-md z-10 absolute top-0 w-full">
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeftIcon className="mr-2" /> Back
                </Button>
                <h2 className="text-lg font-semibold">Ruler Calibration</h2>
                <div className="w-20" /> {/* Spacer */}
            </div>

            {/* Main Content */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-4">
                <FadeIn>
                    <div className="text-center mb-8 mt-16">
                        <p className="text-silver-300 mb-2">Place a ruler against the screen.</p>
                        <p className="text-xl font-medium text-white">Adjust the slider to match <span className="text-bronze-400">{calibrationLengthMm}mm</span> on your ruler.</p>
                    </div>
                </FadeIn>

                {/* Calibration UI */}
                <div className="w-full max-w-md relative mb-12">
                    {/* The Line */}
                    <div
                        className="h-16 border-x-2 border-bronze-500 bg-bronze-500/10 flex items-center justify-center relative mx-auto transition-all duration-75"
                        style={{ width: `${sliderValue}%` }}
                    >
                        <div className="absolute top-1/2 left-0 w-full h-px bg-bronze-500/50"></div>
                        <span className="text-bronze-400 font-mono text-sm bg-black/50 px-2 rounded">{calibrationLengthMm}mm</span>

                        {/* Drag Handles (Visual only, controlled by slider) */}
                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-bronze-500/20 cursor-ew-resize flex items-center justify-center">
                            <div className="w-1 h-8 bg-bronze-500 rounded-full"></div>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-4 bg-bronze-500/20 cursor-ew-resize flex items-center justify-center">
                            <div className="w-1 h-8 bg-bronze-500 rounded-full"></div>
                        </div>
                    </div>

                    {/* Slider Control */}
                    <input
                        type="range"
                        min="10"
                        max="90"
                        step="0.1"
                        value={sliderValue}
                        onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                        className="w-full mt-8 accent-bronze-500 cursor-pointer"
                    />
                </div>

                {/* Options */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <Button
                        variant={calibrationLengthMm === 50 ? 'primary' : 'secondary'}
                        onClick={() => setCalibrationLengthMm(50)}
                        className="text-sm"
                    >
                        50mm
                    </Button>
                    <Button
                        variant={calibrationLengthMm === 85.6 ? 'primary' : 'secondary'}
                        onClick={() => setCalibrationLengthMm(85.6)} // Credit card width
                        className="text-sm"
                    >
                        Credit Card (85.6mm)
                    </Button>
                    <Button
                        variant={calibrationLengthMm === 100 ? 'primary' : 'secondary'}
                        onClick={() => setCalibrationLengthMm(100)}
                        className="text-sm"
                    >
                        100mm
                    </Button>
                </div>

                <Button onClick={handleSave} className="w-full max-w-xs py-4 text-lg shadow-glow">
                    <CheckCircleIcon className="mr-2" /> Confirm Calibration
                </Button>
            </div>
        </div>
    );
};
