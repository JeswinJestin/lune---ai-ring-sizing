import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { ArrowLeftIcon, UploadIcon, CheckCircleIcon, AlertTriangleIcon, RefreshCwIcon } from '../icons/UtilIcons';
import { analyzeHand, HandAnalysisResult } from '../../lib/handAnalysis';
import { HandGender } from '../../types';

// Declare MediaPipe types for TypeScript
declare global {
    interface Window {
        Hands: any;
        drawConnectors: any;
        drawLandmarks: any;
        HAND_CONNECTIONS: any;
    }
}

interface PhotoUploadSizerProps {
    onBack: () => void;
    onComplete: (size: any) => void; // Replace 'any' with proper result type if available
}

export const PhotoUploadSizer = ({ onBack, onComplete }: PhotoUploadSizerProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<HandAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<HandGender>('female');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const handsRef = useRef<any>(null);

    useEffect(() => {
        // Initialize MediaPipe Hands
        if (typeof window.Hands === 'undefined') {
            setError("MediaPipe Hands library not loaded. Please refresh the page.");
            return;
        }

        const hands = new window.Hands({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        return () => {
            hands.close();
        };
    }, []);

    const onResults = (results: any) => {
        setIsProcessing(false);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx || !imageRef.current) return;

        // Draw image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];

            // Draw landmarks
            if (window.drawConnectors && window.drawLandmarks) {
                window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, { color: '#C9A668', lineWidth: 2 });
                window.drawLandmarks(ctx, landmarks, { color: '#E8E8EA', lineWidth: 1, radius: 2 });
            }

            // Analyze hand
            const result = analyzeHand(landmarks, canvas.width, canvas.height);

            // Override gender if selected manually (since static image gender detection might be less accurate)
            // But analyzeHand returns a confidence score, we can use that or just use the manual selection.
            // For now, let's respect the manual selection for better UX.
            result.gender = selectedGender;

            setAnalysisResult(result);
        } else {
            setError("No hand detected. Please try another photo.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target?.result as string);
                setAnalysisResult(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const processImage = async () => {
        if (!imageRef.current || !handsRef.current) return;

        setIsProcessing(true);
        setError(null);

        try {
            await handsRef.current.send({ image: imageRef.current });
        } catch (err) {
            console.error("Processing error:", err);
            setError("Failed to process image. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleRetake = () => {
        setImageSrc(null);
        setAnalysisResult(null);
        setError(null);
    };

    const handleComplete = () => {
        if (analysisResult) {
            // Map 'xs' | 's' | 'm' | 'l' | 'xl' to a ring size or pass the raw result
            // For now, let's pass the whole result object
            onComplete(analysisResult);
        }
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
                <div className="flex items-center gap-4 mb-8 relative z-20">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                        aria-label="Go back"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-silver-300 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
                    </button>
                    <div>
                        <h1 className="font-display text-3xl md:text-4xl text-white mb-1">Upload Photo</h1>
                        <p className="text-silver-400 text-base">Upload a photo of your hand for AI sizing</p>
                    </div>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center">
                    {!imageSrc ? (
                        <Card className="w-full max-w-xl p-8 flex flex-col items-center text-center border-dashed border-2 border-white/20 hover:border-bronze-400/50 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}>
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <UploadIcon className="w-10 h-10 text-silver-400" />
                            </div>
                            <h3 className="text-2xl font-display text-white mb-2">Upload a Photo</h3>
                            <p className="text-silver-400 mb-8 max-w-sm">
                                Select a clear photo of your hand. Ensure your hand is flat and fingers are slightly spread.
                            </p>
                            <Button variant="primary" className="pointer-events-none">
                                Select Photo
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </Card>
                    ) : (
                        <div className="w-full max-w-2xl flex flex-col gap-6">
                            <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 aspect-[4/3]">
                                <img
                                    ref={imageRef}
                                    src={imageSrc}
                                    alt="Uploaded hand"
                                    className={`absolute inset-0 w-full h-full object-contain ${analysisResult ? 'hidden' : ''}`}
                                />
                                <canvas
                                    ref={canvasRef}
                                    width={800} // Set a default width, will be scaled by CSS
                                    height={600}
                                    className={`absolute inset-0 w-full h-full object-contain ${!analysisResult ? 'hidden' : ''}`}
                                />

                                {isProcessing && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                        <div className="w-12 h-12 border-4 border-bronze-400/30 border-t-bronze-400 rounded-full animate-spin mb-4"></div>
                                        <p className="text-white font-medium">Analyzing Hand...</p>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-200">
                                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {!analysisResult ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                        <span className="text-silver-400 flex items-center">Gender:</span>
                                        {(['female', 'male', 'child'] as HandGender[]).map(g => (
                                            <button
                                                key={g}
                                                onClick={() => setSelectedGender(g)}
                                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedGender === g ? 'bg-bronze-400 text-white shadow-lg' : 'text-silver-400 hover:text-white hover:bg-white/10'}`}
                                            >
                                                {g.charAt(0).toUpperCase() + g.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="secondary" onClick={handleRetake} className="flex-1">
                                            Choose Different Photo
                                        </Button>
                                        <Button variant="primary" onClick={processImage} className="flex-1" isLoading={isProcessing}>
                                            Analyze Photo
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4 text-success">
                                        <CheckCircleIcon className="w-6 h-6" />
                                        <h3 className="text-xl font-display text-white">Analysis Complete</h3>
                                    </div>
                                    <p className="text-silver-300 mb-6">
                                        We've analyzed your hand structure. Based on the measurements, we've estimated your size.
                                    </p>
                                    <div className="flex gap-4">
                                        <Button variant="secondary" onClick={handleRetake} className="flex-1">
                                            <RefreshCwIcon className="w-4 h-4 mr-2" /> Try Again
                                        </Button>
                                        <Button variant="primary" onClick={handleComplete} className="flex-1">
                                            View Results
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
