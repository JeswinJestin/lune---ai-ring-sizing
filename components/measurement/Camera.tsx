import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../Button';
import {
    ChevronLeftIcon, SettingsIcon, HelpCircleIcon, ZapIcon, GridIcon, RefreshCwIcon, UploadIcon, ArrowRightIcon,
    CheckCircleIcon, SunIcon, AlertTriangleIcon, CloseIcon
} from '../icons/UtilIcons';
import type { SizingMethod, CameraGuidance, Landmark, HandGender } from '../../types';
import { analyzeCameraFrame } from '../../lib/ai/cameraGuidance';
import { extractFingerData, AllFingersData, analyzeHand } from '../../lib/handAnalysis';
import { DisintegrationEffect } from '../effects/DisintegrationEffect';

// Declare MediaPipe types for TypeScript
declare global {
    interface Window {
        Hands: any;
        drawConnectors: any;
        drawLandmarks: any;
        HAND_CONNECTIONS: any;
        Camera: any;
    }
}

type CameraStatus = 'idle' | 'initializing' | 'permission_denied' | 'error' | 'live' | 'preview';
type FacingMode = 'environment' | 'user';

interface CameraProps {
    onCapture: (imageBlob: Blob, gender?: HandGender, landmarks?: any) => void;
    onBack: () => void;
    onCancel?: () => void;
    method?: SizingMethod | null;
    isProcessing?: boolean;
    processingProgress?: { percentage: number; message: string } | null;
    processingError?: string | null;
}

const FeedbackItem: React.FC<{ status: 'good' | 'warn' | 'bad'; goodText: string; warnText: string; badText?: string }> = ({ status, goodText, warnText, badText }) => {
    const Icon = status === 'good' ? CheckCircleIcon : AlertTriangleIcon;
    const color = status === 'good' ? 'text-success' : 'text-warning';
    const text = status === 'good' ? goodText : (status === 'warn' ? warnText : badText || warnText);

    return (
        <div className={`flex items-center gap-2 transition-colors duration-300 ${color}`}>
            <Icon className="w-5 h-5" />
            <span className="font-medium">{text}</span>
        </div>
    );
};

export const Camera = ({ onCapture, onBack, onCancel, method, isProcessing, processingProgress, processingError }: CameraProps) => {
    // Use onBack as the primary cancel handler
    const handleCancel = onBack || onCancel || (() => { });
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handsRef = useRef<any>(null);

    const [status, setStatus] = useState<CameraStatus>('initializing');
    const [cameraError, setCameraError] = useState<{ title: string; message: string } | null>(null);
    const [facingMode, setFacingMode] = useState<FacingMode>('environment');
    const [gridOn, setGridOn] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [zoomRange, setZoomRange] = useState<{ min: number; max: number; step: number } | null>(null);
    const [guidance, setGuidance] = useState<CameraGuidance | null>(null);
    const [restartCounter, setRestartCounter] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    // AI Scan specific state
    const [isHandDetected, setIsHandDetected] = useState(false);
    const [aiStatusText, setAiStatusText] = useState('Place your hand inside the outline.');
    const [liveAnalysis, setLiveAnalysis] = useState<{
        fingerWidth: number;
        handSize: string;
        confidence: number;
    } | null>(null);

    // Gender State (size will be auto-detected)
    const [selectedGender, setSelectedGender] = useState<HandGender>('female');


    const isCardMethod = method === 'credit-card';
    const isAiScanMethod = method === 'ai-scan';

    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const [snapDetected, setSnapDetected] = useState(false);
    const [disintegrationImage, setDisintegrationImage] = useState<string | null>(null);

    const triggerSnapCapture = useCallback(() => {
        if (!videoRef.current || snapDetected || isProcessing) return;

        const video = videoRef.current;
        const captureCanvas = document.createElement('canvas');
        captureCanvas.width = video.videoWidth;
        captureCanvas.height = video.videoHeight;
        const captureCtx = captureCanvas.getContext('2d');

        if (captureCtx) {
            // Mirror if user facing
            if (isAiScanMethod) {
                captureCtx.translate(captureCanvas.width, 0);
                captureCtx.scale(-1, 1);
            }

            captureCtx.drawImage(video, 0, 0);
            const dataUrl = captureCanvas.toDataURL('image/jpeg');
            setDisintegrationImage(dataUrl);
            setSnapDetected(true);

            // Play Audio
            const utterance = new SpeechSynthesisUtterance("I am Iron Man");
            utterance.rate = 0.9;
            utterance.pitch = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    }, [isAiScanMethod, snapDetected, isProcessing]);

    // Ref to hold the latest trigger function to avoid re-initializing MediaPipe
    const triggerSnapRef = useRef(triggerSnapCapture);
    useEffect(() => {
        triggerSnapRef.current = triggerSnapCapture;
    }, [triggerSnapCapture]);

    // AI Scan hand tracking effect
    useEffect(() => {
        if (status !== 'live' || !isAiScanMethod || typeof window.Hands === 'undefined' || !overlayCanvasRef.current || !videoRef.current) return;

        let isMounted = true;
        const video = videoRef.current;
        const canvas = overlayCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const onResults = (results: any) => {
            if (!isMounted) return;
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            let handInCorrectPosition = false;

            // Debug logging
            console.log('MediaPipe Results:', {
                hasLandmarks: !!(results.multiHandLandmarks && results.multiHandLandmarks.length > 0),
                landmarkCount: results.multiHandLandmarks?.length || 0
            });

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                try {
                    const landmarks: Landmark[] = results.multiHandLandmarks[0];
                    console.log('Hand detected! Landmarks:', landmarks.length);

                    // Safety check for landmarks
                    if (!landmarks || landmarks.length < 21) {
                        console.warn('Insufficient landmarks:', landmarks?.length);
                        ctx.restore();
                        return;
                    }

                    // Calculate analysis for live display
                    try {
                        const analysis = analyzeHand(landmarks, canvas.width, canvas.height);
                        setLiveAnalysis({
                            fingerWidth: analysis.fingerWidth,
                            handSize: analysis.handSize,
                            confidence: analysis.confidence
                        });
                        console.log('Live Analysis:', analysis);
                    } catch (e) {
                        console.error('Analysis failed:', e);
                    }

                    // Extract structured finger data with safety check
                    let fingers: AllFingersData | undefined;
                    try {
                        fingers = extractFingerData(landmarks);
                        console.log('Finger data extracted:', Object.keys(fingers));
                    } catch (e) {
                        console.warn("Failed to extract finger data", e);
                    }

                    // ... existing bounding box logic
                    let minX = 1.0, minY = 1.0, maxX = 0.0, maxY = 0.0;
                    for (const landmark of landmarks) {
                        minX = Math.min(minX, landmark.x);
                        minY = Math.min(minY, landmark.y);
                        maxX = Math.max(maxX, landmark.x);
                        maxY = Math.max(maxY, landmark.y);
                    }
                    const handCenterX = (minX + maxX) / 2;
                    const handCenterY = (minY + maxY) / 2;

                    const targetXMin = 0.25, targetXMax = 0.75;
                    const targetYMin = 0.20, targetYMax = 0.80;

                    // ALWAYS draw standard skeleton (this should always show)
                    if (window.drawConnectors && window.drawLandmarks) {
                        console.log('Drawing skeleton...');
                        window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, { color: '#C9A668', lineWidth: 3 });
                        window.drawLandmarks(ctx, landmarks, { color: '#E8E8EA', lineWidth: 2, radius: 4 });
                    } else {
                        console.error('MediaPipe drawing functions not available!');
                    }

                    // Draw enhanced finger tracking - BIGGER and MORE VISIBLE
                    if (fingers) {
                        console.log('Drawing finger markers...');
                        const fingerColors = {
                            thumb: '#FF6B6B',
                            index: '#4ECDC4',
                            middle: '#45B7D1',
                            ring: '#96CEB4',
                            pinky: '#FFEEAD'
                        };

                        Object.entries(fingers).forEach(([fingerName, data]: [string, any]) => {
                            if (!data || !data.tip) return;
                            const tip = data.tip;
                            const x = tip.x * canvas.width;
                            const y = tip.y * canvas.height;

                            // Draw LARGER circles
                            ctx.beginPath();
                            ctx.arc(x, y, 12, 0, 2 * Math.PI);
                            ctx.fillStyle = fingerColors[fingerName as keyof typeof fingerColors] || '#fff';
                            ctx.fill();
                            ctx.strokeStyle = '#fff';
                            ctx.lineWidth = 3;
                            ctx.stroke();

                            // Draw label with background
                            ctx.save();
                            ctx.scale(-1, 1); // Flip text back
                            ctx.fillStyle = 'rgba(0,0,0,0.7)';
                            ctx.fillRect(-x - 40, y - 25, 80, 20);
                            ctx.fillStyle = '#fff';
                            ctx.font = 'bold 14px Inter';
                            ctx.textAlign = 'center';
                            ctx.fillText(fingerName.toUpperCase(), -x, y - 10);
                            ctx.restore();
                        });
                    }

                    if (handCenterX > targetXMin && handCenterX < targetXMax && handCenterY > targetYMin && handCenterY < targetYMax) {
                        handInCorrectPosition = true;
                        const bx = (1 - maxX) * canvas.width;
                        const by = minY * canvas.height;
                        const bw = (maxX - minX) * canvas.width;
                        const bh = (maxY - minY) * canvas.height;
                        ctx.strokeStyle = '#C9A668';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(bx, by, bw, bh);

                        // SNAP GESTURE DETECTION
                        const thumbTip = landmarks[4];
                        const middleTip = landmarks[12];
                        const distance = Math.sqrt(Math.pow(thumbTip.x - middleTip.x, 2) + Math.pow(thumbTip.y - middleTip.y, 2));

                        if (distance < 0.05) {
                            triggerSnapRef.current();
                        }
                    }
                } catch (err) {
                    console.error("Error in onResults:", err);
                }
            } else {
                console.log('No hand detected in frame');
                setLiveAnalysis(null);
            }

            setIsHandDetected(handInCorrectPosition);
            ctx.restore();
        };

        // ... existing hands setup
        console.log('Initializing MediaPipe Hands for AI Scan...');
        const hands = new window.Hands({ locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
        hands.onResults((results: any) => {
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                (window as any).lastLandmarks = results.multiHandLandmarks[0];
            }
            onResults(results);
        });
        handsRef.current = hands;
        console.log('MediaPipe Hands initialized successfully');

        // ... existing loop
        let frameRequest: number;
        let lastTs = performance.now();
        let sum = 0; let count = 0;
        let loopCount = 0;
        async function detectionLoop() {
            loopCount++;
            if (loopCount % 30 === 0) {
                console.log(`Detection loop running (${loopCount} frames), video ready: ${video.readyState >= 2}`);
            }
            if (isMounted && video.readyState >= 2) {
                try {
                    await hands.send({ image: video });
                } catch (e) {
                    console.error('Error sending frame to MediaPipe:', e);
                }
            }
            if (isMounted) {
                const now = performance.now();
                const dt = now - lastTs; lastTs = now; sum += dt; count++;
                if (count >= 30) {
                    try { (await import('../../lib/monitoring')).recordLiveFrameAvgMs(sum / count); } catch { }
                    sum = 0; count = 0;
                }
                frameRequest = requestAnimationFrame(detectionLoop);
            }
        }
        detectionLoop();

        return () => {
            isMounted = false;
            cancelAnimationFrame(frameRequest);
            hands.close();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

    }, [status, isAiScanMethod, snapDetected, isProcessing]); // Added snapDetected dependency

    useEffect(() => {
        if (status !== 'live' || !videoRef.current || !isCardMethod) return;

        let animationFrameId: number;
        const video = videoRef.current;

        const guidanceLoop = async () => {
            if (video.readyState >= 2) {
                try {
                    const newGuidance = await analyzeCameraFrame(video);
                    setGuidance(newGuidance);
                } catch (e) {
                    console.warn("Guidance analysis failed for frame:", e);
                }
            }
            animationFrameId = requestAnimationFrame(guidanceLoop);
        };

        guidanceLoop();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [status, isCardMethod]);

    useEffect(() => {
        let isMounted = true;
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const initializeCamera = async () => {
            stopStream();
            setStatus('initializing');
            setCameraError(null);

            try {
                const constraints: MediaStreamConstraints = {
                    video: {
                        facingMode: isAiScanMethod ? 'user' : facingMode,
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                    },
                    audio: false
                };
                const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

                if (!isMounted) {
                    mediaStream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamRef.current = mediaStream;
                videoElement.srcObject = mediaStream;

                await new Promise<void>((resolve) => {
                    videoElement.addEventListener('playing', () => {
                        if (!isMounted) return resolve();
                        try {
                            const track = mediaStream.getVideoTracks()[0];
                            if ((track?.getCapabilities() as any)?.zoom) {
                                setZoomRange((track.getCapabilities() as any).zoom);
                                setZoomLevel((track.getSettings() as any).zoom || 1);
                            }
                        } catch (e) {
                            console.warn("Could not read camera zoom capabilities:", e);
                        } finally {
                            if (isMounted) setStatus('live');
                            resolve();
                        }
                    }, { once: true });
                });
            } catch (err: any) {
                console.error("Camera Initialization Error:", err);
                if (!isMounted) return;
                const errors = {
                    NotAllowedError: { title: 'Camera Access Denied', message: "To continue, please allow camera access in your browser's settings for this site.", status: 'permission_denied' },
                    NotFoundError: { title: 'No Camera Found', message: 'No camera was found on your device. Please connect a camera and try again.', status: 'error' },
                    NotReadableError: { title: 'Camera In Use', message: 'The camera is currently in use by another application. Please close other apps and retry.', status: 'error' }
                };
                const errorInfo = errors[err.name as keyof typeof errors] || { title: 'Camera Error', message: 'Could not start the camera. It might be in use by another app or not supported.', status: 'error' };
                setCameraError({ title: errorInfo.title, message: errorInfo.message });
                setStatus(errorInfo.status as CameraStatus);
            }
        };

        initializeCamera();

        return () => {
            isMounted = false;
            stopStream();
        };
    }, [facingMode, restartCounter, stopStream, isAiScanMethod]);

    useEffect(() => {
        const onVisibilityChange = () => { if (document.hidden) { stopStream(); } };
        document.addEventListener('visibilitychange', onVisibilityChange);
        return () => { document.removeEventListener('visibilitychange', onVisibilityChange); };
    }, [stopStream]);

    // Ensure camera is stopped when component unmounts
    useEffect(() => {
        return () => {
            stopStream();
        };
    }, [stopStream]);


    const handleCapture = useCallback(() => {
        if (isAiScanMethod) {
            triggerSnapCapture();
            return;
        }

        if (videoRef.current && canvasRef.current) {
            setIsFlashing(true);
            setTimeout(() => setIsFlashing(false), 200);

            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const currentFacingMode = isAiScanMethod ? 'user' : facingMode;
            if (currentFacingMode === 'user') {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
                async (blob) => {
                    let finalBlob = blob || null;
                    try {
                        if (!finalBlob || finalBlob.size === 0) {
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                            const res = await fetch(dataUrl);
                            finalBlob = await res.blob();
                        }
                        if (finalBlob) {
                            const url = URL.createObjectURL(finalBlob);
                            setCapturedImage(url);
                            setStatus('preview');
                            stopStream();
                        }
                    } catch { }
                },
                'image/jpeg',
                0.95
            );
        }
    }, [stopStream, facingMode, isAiScanMethod, triggerSnapCapture]);

    const handleRetake = useCallback(() => {
        if (capturedImage) URL.revokeObjectURL(capturedImage);
        setCapturedImage(null);
        setRestartCounter(c => c + 1);
    }, [capturedImage]);

    const handleUsePhoto = useCallback(async () => {
        if (capturedImage) {
            const blob = await (await fetch(capturedImage)).blob();
            onCapture(blob, selectedGender);
        }
    }, [capturedImage, onCapture, selectedGender]);

    const handleToggleFlash = useCallback(async () => {
        if (!streamRef.current) return;
        const track = streamRef.current.getVideoTracks()[0];
        if ((track?.getCapabilities() as any).torch) {
            try {
                const newFlashState = !flashOn;
                await track.applyConstraints({ advanced: [{ torch: newFlashState } as any] });
                setFlashOn(newFlashState);
            } catch (e) { console.error("Failed to toggle flash:", e); }
        } else {
            alert("Flash not available on this device.");
        }
    }, [flashOn]);

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCapturedImage(event.target?.result as string);
                setStatus('preview');
                stopStream();
            };
            reader.readAsDataURL(file);
        }
    };

    const renderGuidanceOverlay = () => {
        if (isCardMethod) {
            const isReady = guidance?.message.startsWith('✅');
            const handDetected = guidance?.fingerDetected;
            const cardDetected = guidance?.objectDetected;

            return (
                <>
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-sm p-4 pointer-events-none z-10">
                        <div className={`text-center text-white/90 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg transition-all duration-300 ${isReady ? 'bg-emerald-500/20 border-emerald-500/30' : ''}`}>
                            <p className="font-display text-lg tracking-wide">{guidance?.message || 'Align Hand & Card'}</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none p-8">
                        <div className={`w-3/5 aspect-[1.4] rounded-3xl border-2 transition-all duration-300 ${handDetected ? 'border-bronze-400 border-solid shadow-[0_0_20px_rgba(201,166,104,0.3)]' : 'border-white/30 border-dashed'}`}></div>
                        <div className={`w-2/5 aspect-[1.586] rounded-lg border-2 transition-all duration-300 ${cardDetected ? 'border-bronze-400 border-solid shadow-[0_0_20px_rgba(201,166,104,0.3)]' : 'border-white/30 border-dashed'}`}></div>
                    </div>
                </>
            );
        }
        if (isAiScanMethod) {
            return (
                <>
                    <canvas ref={overlayCanvasRef} className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10" />
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 w-auto pointer-events-none z-20">
                        <div className={`px-6 py-2 rounded-full backdrop-blur-md border transition-all duration-300 ${isHandDetected ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100' : 'bg-black/40 border-white/10 text-white/80'}`}>
                            <span className="flex items-center gap-2 text-sm font-medium">
                                {isHandDetected ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Hand Detected
                                    </>
                                ) : (
                                    'Place hand in outline'
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Live Measurement Display */}
                    {liveAnalysis && isHandDetected && (
                        <div className="absolute top-40 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                            <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-[280px]">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-silver-400 text-xs mb-1">Finger Width</span>
                                        <span className="text-white font-bold text-lg">{liveAnalysis.fingerWidth.toFixed(1)}px</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-silver-400 text-xs mb-1">Hand Size</span>
                                        <span className="text-bronze-400 font-bold text-lg uppercase">{liveAnalysis.handSize}</span>
                                    </div>
                                    <div className="col-span-2 flex flex-col">
                                        <span className="text-silver-400 text-xs mb-1">Confidence</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${liveAnalysis.confidence > 80 ? 'bg-emerald-400' : liveAnalysis.confidence > 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                                    style={{ width: `${liveAnalysis.confidence}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-white font-bold text-sm">{liveAnalysis.confidence}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        <div className={`w-2/5 aspect-square border-2 rounded-3xl transition-all duration-500 ${isHandDetected ? 'border-bronze-400/0 scale-105' : 'border-white/30 border-dashed'}`}></div>
                    </div>
                </>
            );
        }
        return null;
    };

    const renderControls = () => {
        const isCaptureDisabled = (isCardMethod && guidance?.message !== "✅ Perfect! Tap to capture") || (isAiScanMethod && !isHandDetected);

        return (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
                {/* Gender Selector for AI Scan (Size auto-detected) */}
                {isAiScanMethod && (
                    <div className="flex justify-center mb-4">
                        <div className="bg-black/60 backdrop-blur-md rounded-lg p-1.5 flex gap-1">
                            <span className="text-silver-400 text-xs px-2 py-1.5 flex items-center">Gender:</span>
                            {(['female', 'male', 'child'] as HandGender[]).map(g => (
                                <button
                                    key={g}
                                    onClick={() => setSelectedGender(g)}
                                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${selectedGender === g ? 'bg-bronze-400 text-white shadow-lg' : 'text-silver-400 hover:text-white hover:bg-white/10'}`}
                                >
                                    {g.charAt(0).toUpperCase() + g.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-4 items-center">
                        <button onClick={() => setGridOn(!gridOn)} className="control-btn" aria-pressed={gridOn}><GridIcon className={`${gridOn ? 'text-bronze-400' : 'text-white'}`} /></button>
                        <button onClick={handleToggleFlash} className="control-btn" aria-pressed={flashOn} disabled={isAiScanMethod}><ZapIcon className={`${flashOn ? 'text-bronze-400' : 'text-white'} ${isAiScanMethod ? 'opacity-50' : ''}`} /></button>
                    </div>
                    <button
                        onClick={handleCapture}
                        disabled={isCaptureDisabled}
                        className={`w-20 h-20 rounded-full bg-white border-4 border-black/20 ring-4 ring-white/30 shadow-2xl transition-all duration-200 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed ${!isCaptureDisabled ? 'animate-pulse-slow ring-bronze-400/50 scale-105' : ''}`}
                        aria-label="Capture Photo"
                    >
                        {!isCaptureDisabled && (
                            <span className="absolute inset-0 rounded-full animate-ping bg-bronze-400/30"></span>
                        )}
                    </button>
                    <div className="flex flex-col gap-4 items-center">
                        <button onClick={() => setFacingMode(p => p === 'user' ? 'environment' : 'user')} className="control-btn" aria-label="Switch camera" disabled={isAiScanMethod}><RefreshCwIcon className={isAiScanMethod ? 'opacity-50' : ''} /></button>
                        <button onClick={handleUploadClick} className="control-btn" aria-label="Upload photo"><UploadIcon /></button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,image/heic,image/heif" className="hidden" />
                    </div>
                </div>
            </div>
        );
    };

    const renderPreview = () => (
        <div className="w-full h-full relative animate-[fadeIn_0.3s_ease-out]">
            {capturedImage && <img src={capturedImage} alt="Captured preview" className="w-full h-full object-contain" />}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-6">
                <Button onClick={handleRetake} variant="secondary" className="!px-8 !py-4 text-lg">Retake</Button>
                <Button onClick={handleUsePhoto} variant="primary" className="!px-8 !py-4 text-lg">Use This Photo <ArrowRightIcon className="inline ml-2" /></Button>
            </div>
        </div>
    );

    const renderInitialState = () => (
        <div className="flex flex-col items-center justify-center text-center p-8">
            {status === 'initializing' && <>
                <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 border-4 border-platinum-300/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-platinum-300 rounded-full animate-spin"></div>
                </div>
                <p className="text-lg">Starting Camera...</p>
            </>}
            {(status === 'permission_denied' || status === 'error') && cameraError && <>
                <h3 className={`text-2xl font-semibold mb-2 ${status === 'error' ? 'text-error' : ''}`}>{cameraError.title}</h3>
                <p className="max-w-md mb-6 text-silver-400">{cameraError.message}</p>
                <div className="flex gap-4">
                    <Button onClick={onCancel} variant="secondary">Go Back</Button>
                    <Button onClick={() => setRestartCounter(c => c + 1)}>
                        {status === 'permission_denied' ? 'Retry Access' : 'Try Again'}
                    </Button>
                </div>
            </>}
        </div>
    );

    const HelpModal = () => (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-30 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-midnight-500 border border-platinum-300/20 rounded-2xl p-6 max-w-sm w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-2xl text-silver-100">Quick Guide</h3>
                    <button onClick={() => setShowHelp(false)} className="text-silver-400 hover:text-white"><CloseIcon /></button>
                </div>
                {isAiScanMethod ? (
                    <div className="space-y-3 text-silver-300">
                        <p>1. Use your front-facing camera for the AI Scan.</p>
                        <p>2. Hold your hand flat, with your palm facing the camera.</p>
                        <p>3. Position your hand inside the guide outline until it glows.</p>
                        <p>4. Hold steady until the capture button is enabled, then tap to measure!</p>
                    </div>
                ) : (
                    <div className="space-y-3 text-silver-300">
                        <p>1. Place a standard credit card on a flat, well-lit surface.</p>
                        <p>2. Place your ring finger next to the card.</p>
                        <p>3. Align both within the on-screen guides.</p>
                        <p>4. Follow the real-time feedback and tap to capture when ready!</p>
                    </div>
                )}
            </div>
        </div>
    );

    const SettingsModal = () => (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-30 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-midnight-500 border border-platinum-300/20 rounded-2xl p-6 max-w-sm w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-2xl text-silver-100">Settings</h3>
                    <button onClick={() => setShowSettings(false)} className="text-silver-400 hover:text-white"><CloseIcon /></button>
                </div>
                <div className="space-y-4 text-silver-300">
                    <div className="flex justify-between items-center">
                        <label htmlFor="grid-toggle">Show Alignment Grid</label>
                        <button
                            id="grid-toggle"
                            role="switch"
                            aria-checked={gridOn}
                            onClick={() => setGridOn(!gridOn)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${gridOn ? 'bg-bronze-400' : 'bg-midnight-400'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${gridOn ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                    <p className="text-sm text-silver-500 pt-2 border-t border-platinum-300/10">More settings will be available soon.</p>
                </div>
            </div>
        </div>
    );

    const currentFacingMode = isAiScanMethod ? 'user' : facingMode;

    const handleDisintegrationComplete = async () => {
        if (disintegrationImage) {
            const blob = await (await fetch(disintegrationImage)).blob();
            onCapture(blob, selectedGender);
            setSnapDetected(false);
            setDisintegrationImage(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-midnight-900 text-silver-200 z-50 flex flex-col items-center justify-center animate-[fadeInUp_0.3s_ease-out]">
            {/* Disintegration Effect Overlay */}
            <DisintegrationEffect
                isActive={snapDetected}
                imageSrc={disintegrationImage || undefined}
                onComplete={handleDisintegrationComplete}
            />

            {isFlashing && <div className="absolute inset-0 bg-white z-50 animate-fadeOut"></div>}
            {showHelp && <HelpModal />}
            {showSettings && <SettingsModal />}
            <canvas ref={canvasRef} className="hidden"></canvas>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${status === 'live' && !snapDetected ? 'opacity-100' : 'opacity-0'} ${currentFacingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />

            {status === 'live' && !snapDetected && (
                <>
                    {/* ... existing live UI ... */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none"></div>
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
                        <button onClick={handleCancel} className="control-btn"><ChevronLeftIcon /></button>
                        {zoomRange && <div className="bg-black/50 text-white text-xs font-mono px-3 py-1 rounded-full backdrop-blur-sm">{zoomLevel.toFixed(1)}x</div>}
                        <div className="flex items-center gap-3">
                            <button className="control-btn" onClick={() => setShowSettings(true)}><SettingsIcon /></button>
                            <button className="control-btn" onClick={() => setShowHelp(true)}><HelpCircleIcon /></button>
                        </div>
                    </div>
                    {renderGuidanceOverlay()}
                    {gridOn && (
                        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10">
                            {[...Array(9)].map((_, i) => <div key={i} className="border border-white/20"></div>)}
                        </div>
                    )}
                    {isCardMethod && guidance && (
                        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-full max-w-sm p-4 pointer-events-none z-10">
                            <div className="text-white text-sm bg-black/60 p-4 rounded-lg backdrop-blur-sm grid grid-cols-2 gap-x-4 gap-y-3">
                                <FeedbackItem status={guidance.lighting === 'good' ? 'good' : 'warn'} goodText="Lighting Good" warnText="Poor Lighting" />
                                <FeedbackItem status={guidance.quality === 'good' ? 'good' : 'warn'} goodText="Hold Steady" warnText="Blurry Image" />
                                <FeedbackItem status={guidance.objectDetected ? 'good' : 'warn'} goodText="Card Visible" warnText="Card Not Found" />
                                <FeedbackItem status={guidance.fingerDetected ? 'good' : 'warn'} goodText="Finger Visible" warnText="Finger Not Clear" />
                            </div>
                        </div>
                    )}
                    {renderControls()}
                </>
            )}

            {status === 'preview' && renderPreview()}

            {(status === 'initializing' || status === 'permission_denied' || status === 'error') && renderInitialState()}
        </div>
    );
};

const style = document.createElement('style');
style.innerHTML = `
.control-btn {
    width: 48px; height: 48px; border-radius: 9999px;
    background-color: rgba(22,22,29,0.5);
    display: flex; align-items: center; justify-content: center;
    color: white; transition: all 0.2s; backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.1);
}
.control-btn:hover { background-color: rgba(22,22,29,0.7); transform: scale(1.1); }
.control-btn:active { transform: scale(0.95); }
.control-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;
document.head.appendChild(style);
