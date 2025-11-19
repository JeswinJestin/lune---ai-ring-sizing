import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from './Button';
// Fix: Import missing ArrowRightIcon.
import { CloseIcon, HeartIcon, CameraIcon, SlidersIcon, ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, RefreshCwIcon, SaveIcon, TrashIcon } from './icons/UtilIcons';
import type { MeasurementResult, Landmark } from '../types';
import { computeAutoAdjustments } from '../lib/arAutoAdjust';
import { measureFromAR, stabilizeMeasurements } from '../lib/measurement';
import { resolveRingUrl, resolveBandUrl, resolveGemUrl, preloadAndChoose } from '../lib/assetsResolver';
import { alphaBounds, centerOf } from '../lib/imageAnalysis';

const rings = [
  { id: 1, name: 'Solitaire Diamond', image: '/1_RING.png', description: 'A timeless platinum band with a solitaire diamond.' , hasGem: true },
  { id: 2, name: 'Emerald Cut', image: '/2_RING.png', description: 'Platinum band with emerald-cut halo setting.' , hasGem: true },
  { id: 3, name: 'Vintage Halo', image: '/3_RING.png', description: 'Engraved vintage band with halo cluster.' , hasGem: true },
  { id: 4, name: 'Sapphire Band', image: '/4_RING.png', description: 'Polished gold band with alternating sockets.' , hasGem: true },
  { id: 5, name: 'Classic Gold Band', image: '/5_RING.png', description: 'Plain polished gold band.' , hasGem: false },
  { id: 6, name: 'Twisted Vine', image: '/6_RING.png', description: 'Twisted vine-style band.' , hasGem: true },
  { id: 7, name: 'Modern Bezel', image: '/7_RING.png', description: 'Minimal band with bezel opening.' , hasGem: true },
  { id: 8, name: 'Rose Gold Pearl', image: '/8_RING.png', description: 'Rose-gold band with pearl setting.' , hasGem: true },
  { id: 9, name: 'Art Deco Emerald', image: '/9_RING.png', description: 'Geometric Art Deco-style band.' , hasGem: true },
];

interface Ring { id: number; name: string; image: string; description: string; hasGem: boolean; }

interface ARTryOnProps {
  result: MeasurementResult;
  onBack: () => void;
}

type RingSettings = {
  positionOffset: { x: number; y: number };
  rotation: number;
  zoom: number;
};

// Helper to calculate distance between two 3D landmarks
const getDistance = (p1: Landmark, p2: Landmark): number => {
    return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) +
        Math.pow(p1.y - p2.y, 2) +
        Math.pow(p1.z - p2.z, 2)
    );
};

declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

const SWIPE_THRESHOLD = 100; // pixels to swipe down to dismiss

export const ARTryOn = ({ result, onBack }: ARTryOnProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const handsRef = useRef<any>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const screenshotCanvasRef = useRef<HTMLCanvasElement>(null);
  const compositeCanvasRef = useRef<HTMLCanvasElement>(null);
  const resultRef = useRef(result);

  const [selectedRing, setSelectedRing] = useState(rings[0]);
  const [hasBandLayer, setHasBandLayer] = useState(false);
  const [hasGemLayer, setHasGemLayer] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [liveDiameterMm, setLiveDiameterMm] = useState<number | null>(null);
  const [liveCircumferenceMm, setLiveCircumferenceMm] = useState<number | null>(null);
  const [rawCoords, setRawCoords] = useState<{ x: number; y: number; z?: number }[] | null>(null);
  const diametersWindow: number[] = [];
  const [error, setError] = useState<string | null>(null);
  const [favoriteRings, setFavoriteRings] = useState<number[]>([]);
  
  // State for dynamic AR positioning and scaling
  const [dynamicRingSize, setDynamicRingSize] = useState<number | null>(null);
  const [ringPosition, setRingPosition] = useState<{ x: number, y: number } | null>(null);
  const [isHandDetected, setIsHandDetected] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // State for user adjustments
  const [positionOffset, setPositionOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [savedSettings, setSavedSettings] = useState<Record<number, RingSettings>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving'>('idle');
  const [ringImageUrl, setRingImageUrl] = useState<string | null>(null);
  const [bandImageUrl, setBandImageUrl] = useState<string | null>(null);
  const [gemImageUrl, setGemImageUrl] = useState<string | null>(null);
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null);
  const smoothPosRef = useRef<{ x: number; y: number } | null>(null);
  const smoothRotRef = useRef<number>(0);
  const smoothScaleRef = useRef<number>(0);

  // State for swipe-to-dismiss gesture
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchDeltaY, setTouchDeltaY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  const onResults = useCallback((results: any) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0 && videoRef.current) {
        setIsHandDetected(true);
        const landmarks = results.multiHandLandmarks[0];

        // --- Dynamic Scaling Logic ---
        const vw = videoRef.current.clientWidth;
        const vh = videoRef.current.clientHeight;
        const adj = computeAutoAdjustments({ landmarks, viewport: { width: vw, height: vh }, fingerDiameterMm: resultRef.current.fingerDiameter_mm * 1.15 });
        const alphaPos = 0.22;
        const alphaRot = 0.18;
        const alphaScale = 0.15;
        const prevPos = smoothPosRef.current || adj.position;
        const smPos = { x: prevPos.x * (1 - alphaPos) + adj.position.x * alphaPos, y: prevPos.y * (1 - alphaPos) + adj.position.y * alphaPos };
        const smRot = smoothRotRef.current * (1 - alphaRot) + adj.rotationDeg * alphaRot;
        const smScale = smoothScaleRef.current * (1 - alphaScale) + adj.scalePx * alphaScale;
        const dx = Math.abs(smPos.x - (smoothPosRef.current?.x ?? smPos.x));
        const dy = Math.abs(smPos.y - (smoothPosRef.current?.y ?? smPos.y));
        const dtheta = Math.abs(smRot - (smoothRotRef.current ?? smRot));
        const dscale = Math.abs(smScale - (smoothScaleRef.current ?? smScale));
        const posDeadzone = 1.5;
        const rotDeadzone = 0.8;
        const scaleDeadzone = 0.8;
        const nextPos = (dx > posDeadzone || dy > posDeadzone) ? smPos : (smoothPosRef.current || smPos);
        const nextRot = dtheta > rotDeadzone ? smRot : (smoothRotRef.current || smRot);
        const nextScale = dscale > scaleDeadzone ? smScale : (smoothScaleRef.current || smScale);
        smoothPosRef.current = nextPos;
        smoothRotRef.current = nextRot;
        smoothScaleRef.current = nextScale;
        setDynamicRingSize(nextScale);
        setRingPosition(nextPos);
        setRotation(nextRot);
        setZoom(1);

        const m = measureFromAR(landmarks, { width: vw, height: vh });
        diametersWindow.push(m.diameterMm);
        const stabilized = stabilizeMeasurements(diametersWindow, 0.1, 10);
        setLiveDiameterMm(stabilized);
        setLiveCircumferenceMm(stabilized * Math.PI);
        setRawCoords(m.coordinates);
        
    } else {
        setIsHandDetected(false);
        setRingPosition(null);
    }
  }, []);
  
  useEffect(() => {
    if (typeof window.Hands === 'undefined' || typeof window.Camera === 'undefined') {
        setError("AI libraries could not be loaded. Please check your connection and try again.");
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

    let camera: any = null;
    if (videoRef.current) {
        camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
                if(videoRef.current) {
                    await hands.send({ image: videoRef.current });
                }
            },
            width: 1280,
            height: 720,
            facingMode: 'user'
        });
    camera.start().catch((err: Error) => {
        console.error("Camera start error:", err);
        setError("Could not access camera. Please check permissions.");
    });

    return () => {
        if (camera) {
          camera.stop();
        }
        hands.close();
    };
  }
  }, [onResults]);

  useEffect(() => {
    const onVisibilityChange = () => {
      try {
        if (videoRef.current) {
          if (document.hidden) {
            videoRef.current.pause();
          } else {
            videoRef.current.play().catch(() => {});
          }
        }
      } catch {}
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => { document.removeEventListener('visibilitychange', onVisibilityChange); };
  }, []);


  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('lune_favorite_rings');
      if (storedFavorites) {
        setFavoriteRings(JSON.parse(storedFavorites));
      }
      const storedSettings = localStorage.getItem('lune_ring_settings');
      if (storedSettings) {
        setSavedSettings(JSON.parse(storedSettings));
      }
    } catch (e) {
      console.error("Failed to parse data from localStorage", e);
    }
  }, []);

  const toggleFavorite = (ringId: number) => {
    setFavoriteRings(prevFavorites => {
      const newFavorites = prevFavorites.includes(ringId)
        ? prevFavorites.filter(id => id !== ringId)
        : [...prevFavorites, ringId];
      localStorage.setItem('lune_favorite_rings', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const sortedRings = useMemo(() => {
    return [...rings].sort((a, b) => {
        const aIsFav = favoriteRings.includes(a.id);
        const bIsFav = favoriteRings.includes(b.id);
        if (aIsFav && !bIsFav) return -1;
        if (!aIsFav && bIsFav) return 1;
        return 0;
    });
  }, [favoriteRings]);

  const handleRingSelect = useCallback((ring: Ring) => {
    setSelectedRing(ring);
    
    const settings = savedSettings[ring.id];
    if (settings) {
      setPositionOffset(settings.positionOffset);
      setRotation(settings.rotation);
      setZoom(settings.zoom);
    } else {
      setPositionOffset({ x: 0, y: 0 });
      setRotation(0);
      setZoom(1);
    }
    
    const element = document.getElementById(`ring-item-${ring.id}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    // Attempt to detect layered assets
    const bandCandidates = [resolveBandUrl(ring.id), `/band_${ring.id}.png`, `/band_${ring.id}.jpg`];
    const gemCandidates = [resolveGemUrl(ring.id), `/gem_${ring.id}.png`, `/gem_${ring.id}.jpg`];
    const mainCandidates = [resolveRingUrl(ring.id), `/ring_${ring.id}.png`, `/ring_${ring.id}.jpg`, ring.image];
    Promise.all([preloadAndChoose(bandCandidates), preloadAndChoose(gemCandidates), preloadAndChoose(mainCandidates)])
      .then(([b, g, m]) => {
        setHasBandLayer(!!b);
        setHasGemLayer(ring.id === 5 ? false : !!g);
        setBandImageUrl(b);
        setGemImageUrl(g);
        setRingImageUrl(m || ring.image);
      });
    // Runtime validation: naming and resolution
    const mainUrl = (ringImageUrl || ring.image);
    const mainImg = new Image();
    mainImg.onload = () => {
      const okName = /ring_\d+\.jpg$/i.test(mainUrl) || /band_5\.jpg$/i.test(mainUrl);
      const okSize = (mainImg.naturalWidth >= 2000 && mainImg.naturalHeight >= 2000);
      if (!okName || !okSize) {
        console.warn('AR asset validation warning:', { url: mainUrl, okName, okSize, w: mainImg.naturalWidth, h: mainImg.naturalHeight });
      }
    };
    mainImg.src = mainUrl;
  }, [savedSettings]);
  
  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    setTouchStartY(clientY);
  }, []);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const delta = clientY - touchStartY;
    setTouchDeltaY(Math.max(0, delta));
  }, [isDragging, touchStartY]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    if (touchDeltaY > SWIPE_THRESHOLD) {
      onBack();
    }
    setIsDragging(false);
    setTouchDeltaY(0);
    setTouchStartY(0);
  }, [isDragging, touchDeltaY, onBack]);
  
  const AVG_DIAMETER_MM = 17.3;
  const BASE_VISUAL_SIZE_PX = 80;
  const heuristicScale = result.ringSize.diameter_mm / AVG_DIAMETER_MM;
  const fallbackRingSize = BASE_VISUAL_SIZE_PX * heuristicScale;
  
  const baseRingSize = dynamicRingSize ?? fallbackRingSize;
  const finalRingSize = baseRingSize * zoom;

  const layerConfig: Record<number, { band: { offsetX: number; offsetY: number; scale: number }; gem: { offsetX: number; offsetY: number; scale: number } }> = {
    1: { band: { offsetX: 0, offsetY: 0, scale: 1 }, gem: { offsetX: 0, offsetY: 0, scale: 1 } },
    2: { band: { offsetX: 0, offsetY: 0, scale: 1 }, gem: { offsetX: 0, offsetY: -6, scale: 1 } },
    3: { band: { offsetX: 0, offsetY: 0, scale: 1 }, gem: { offsetX: 0, offsetY: -4, scale: 1 } },
    4: { band: { offsetX: 0, offsetY: 0, scale: 1 }, gem: { offsetX: 2, offsetY: 0, scale: 1 } },
    5: { band: { offsetX: 0, offsetY: 0, scale: 1 }, gem: { offsetX: 0, offsetY: 0, scale: 1 } },
    6: { band: { offsetX: 0, offsetY: 0, scale: 1 }, gem: { offsetX: -2, offsetY: 0, scale: 1 } },
    7: { band: { offsetX: 0, offsetY: 0, scale: 1 }, gem: { offsetX: 0, offsetY: 0, scale: 1 } },
    8: { band: { offsetX: 0, offsetY: 0, scale: 1 }, gem: { offsetX: 0, offsetY: 0, scale: 1 } },
    9: { band: { offsetX: 0, offsetY: 0, scale: 1 }, gem: { offsetX: 0, offsetY: 0, scale: 1 } },
  };

  useEffect(() => {
    const bandSrc = hasBandLayer && bandImageUrl ? bandImageUrl : null;
    const gemSrc = hasGemLayer && gemImageUrl && selectedRing.hasGem ? gemImageUrl : null;
    if (!bandSrc && !gemSrc) {
      setCompositeUrl(null);
      return;
    }
    const canvas = compositeCanvasRef.current || document.createElement('canvas');
    compositeCanvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const targetSize = 1024;
    canvas.width = targetSize;
    canvas.height = targetSize;
    ctx.clearRect(0, 0, targetSize, targetSize);
    const bandImg = bandSrc ? new Image() : null;
    const gemImg = gemSrc ? new Image() : null;
    const cfg = layerConfig[selectedRing.id];
    let loaded = 0;
    const tryCommit = () => {
      const need = (bandSrc ? 1 : 0) + (gemSrc ? 1 : 0);
      if (loaded === need) {
        ctx.imageSmoothingEnabled = true;
        let bandDraw = cfg.band;
        let gemDraw = cfg.gem;
        if (bandImg) {
          const bb = alphaBounds(bandImg, targetSize);
          if (bb) {
            const bc = centerOf(bb);
            bandDraw = { offsetX: Math.round(targetSize / 2 - bc.cx), offsetY: Math.round(targetSize / 2 - bc.cy), scale: 1 };
          }
        }
        if (gemImg && selectedRing.id !== 5) {
          const gb = alphaBounds(gemImg, targetSize);
          if (gb) {
            const gc = centerOf(gb);
            gemDraw = { offsetX: Math.round(targetSize / 2 - gc.cx), offsetY: Math.round(targetSize / 2 - gc.cy - 4), scale: 1 };
          }
        }
        if (bandImg) {
          const bw = targetSize * bandDraw.scale;
          const bh = targetSize * bandDraw.scale;
          const bx = (targetSize - bw) / 2 + bandDraw.offsetX;
          const by = (targetSize - bh) / 2 + bandDraw.offsetY;
          ctx.globalAlpha = 1;
          ctx.drawImage(bandImg, bx, by, bw, bh);
        }
        if (gemImg && selectedRing.id !== 5) {
          const gw = targetSize * gemDraw.scale;
          const gh = targetSize * gemDraw.scale;
          const gx = (targetSize - gw) / 2 + gemDraw.offsetX;
          const gy = (targetSize - gh) / 2 + gemDraw.offsetY;
          ctx.globalAlpha = 0.98;
          ctx.drawImage(gemImg, gx, gy, gw, gh);
        }
        setCompositeUrl(canvas.toDataURL('image/png'));
      }
    };
    if (bandImg && bandSrc) {
      bandImg.crossOrigin = 'anonymous';
      bandImg.onload = () => { loaded += 1; tryCommit(); };
      bandImg.src = bandSrc;
    }
    if (gemImg && gemSrc) {
      gemImg.crossOrigin = 'anonymous';
      gemImg.onload = () => { loaded += 1; tryCommit(); };
      gemImg.src = gemSrc;
    }
    if (!bandImg && !gemImg) setCompositeUrl(null);
  }, [bandImageUrl, gemImageUrl, hasBandLayer, hasGemLayer, selectedRing]);

  const handleScreenshot = () => {
    if (!videoRef.current || !screenshotCanvasRef.current || !selectedRing || !ringPosition) {
      alert("Please ensure your hand is visible to take a screenshot.");
      return;
    }

    const video = videoRef.current;
    const canvas = screenshotCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const ringImage = new Image();
    ringImage.crossOrigin = 'anonymous';
    ringImage.src = compositeUrl || ringImageUrl || selectedRing.image;

    ringImage.onload = () => {
      const finalX = ringPosition.x + positionOffset.x;
      const finalY = ringPosition.y + positionOffset.y;
      
      ctx.translate(finalX, finalY);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.drawImage(ringImage, -finalRingSize / 2, -finalRingSize / 2, finalRingSize, finalRingSize);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 300);

      const link = document.createElement('a');
      link.download = 'lune-try-on.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    ringImage.onerror = () => {
      alert("Could not load ring image for screenshot. Please try again.");
    };
  };

  const handleSaveSettings = () => {
    const newSettings = {
      ...savedSettings,
      [selectedRing.id]: { positionOffset, rotation, zoom }
    };
    setSavedSettings(newSettings);
    localStorage.setItem('lune_ring_settings', JSON.stringify(newSettings));
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const handleClearSettings = () => {
    const newSettings = { ...savedSettings };
    delete newSettings[selectedRing.id];
    setSavedSettings(newSettings);
    localStorage.setItem('lune_ring_settings', JSON.stringify(newSettings));
    setPositionOffset({ x: 0, y: 0 });
    setRotation(0);
    setZoom(1);
  };

  const resetPosition = () => {
    const saved = savedSettings[selectedRing.id];
    setPositionOffset(saved ? saved.positionOffset : { x: 0, y: 0 });
  };
  const resetRotation = () => {
    const saved = savedSettings[selectedRing.id];
    setRotation(saved ? saved.rotation : 0);
  };
  const resetZoom = () => {
    const saved = savedSettings[selectedRing.id];
    setZoom(saved ? saved.zoom : 1);
  };

  if (error) {
    return (
      <div className="text-center p-8 bg-midnight-500 rounded-lg shadow-lg">
        <p className="text-error mb-4">{error}</p>
        <Button onClick={onBack} variant="secondary">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-midnight-900 relative flex items-center justify-center animate-[fadeInUp_0.5s_ease-out] overflow-hidden">
      {selectedBackground && (
        <img src={`/${selectedBackground}`} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"></video>
      <canvas ref={screenshotCanvasRef} className="hidden"></canvas>
      {isFlashing && <div className="absolute inset-0 bg-white/80 z-50 animate-fadeOut pointer-events-none"></div>}
      
      {liveDiameterMm && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 bg-black/50 text-silver-100 px-3 py-2 rounded-lg font-mono text-sm animate-fadeIn">
          {`Live Diameter: ${liveDiameterMm.toFixed(1)} mm`}
        </div>
      )}

      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-yellow-500/20 text-yellow-300 text-xs px-3 py-1 rounded-full border border-yellow-500/40 backdrop-blur-sm z-20">
        This feature is currently in its testing stage.
      </div>

      {!isHandDetected && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 p-6 rounded-2xl text-white text-center pointer-events-none z-10 backdrop-blur-2xl border border-white/20 shadow-2xl">
            <p className="font-semibold text-lg">Show your hand to the camera</p>
            <p className="text-sm opacity-80 mt-1">We will auto-fit and align your ring.</p>
         </div>
      )}
      
      {selectedRing && ringPosition && (
        <div 
          className="absolute pointer-events-none flex items-center justify-center transition-all duration-100 ease-linear"
          style={{ 
            width: `${finalRingSize}px`, 
            height: `${finalRingSize}px`,
            top: `${ringPosition.y + positionOffset.y}px`,
            left: `${ringPosition.x + positionOffset.x}px`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${zoom})`
          }}
        >
            <img src={compositeUrl || ringImageUrl || selectedRing.image} alt={`${selectedRing.name}`} className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl" />
        </div>
      )}
      
      <div className="absolute top-5 right-5 z-20 flex flex-col gap-3">
        <button onClick={onBack} className="w-12 h-12 rounded-full bg-midnight-400/60 backdrop-blur-xl border border-platinum-300/20 flex items-center justify-center text-silver-300 transition-all duration-300 hover:border-platinum-300/40 hover:bg-midnight-400/80 hover:scale-110 active:scale-95" aria-label="Close AR view">
          <CloseIcon className="w-6 h-6" />
        </button>
        <button onClick={handleScreenshot} className="w-12 h-12 rounded-full bg-midnight-400/60 backdrop-blur-xl border border-platinum-300/20 flex items-center justify-center text-silver-300 transition-all duration-300 hover:border-platinum-300/40 hover:bg-midnight-400/80 hover:scale-110 active:scale-95" aria-label="Take Screenshot">
          <CameraIcon className="w-6 h-6" />
        </button>
      </div>

      {showAdjustments && (
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-full max-w-sm mx-auto bg-midnight-600/90 backdrop-blur-xl rounded-2xl p-4 space-y-4 z-20 border border-white/10 animate-[fadeInUp_0.3s_ease-out]">
            <div className="space-y-4">
                <div>
                    <label className="block text-center text-silver-300 text-xs font-medium uppercase tracking-wider mb-2">Position</label>
                    <div className="grid grid-cols-3 gap-2 items-center justify-items-center w-36 mx-auto text-silver-200">
                        <div></div>
                        <button onClick={() => setPositionOffset(p => ({...p, y: p.y - 2}))} className="p-2 bg-midnight-500/50 rounded-md hover:bg-midnight-500 transition-colors" aria-label="Nudge Up"><ArrowUpIcon className="w-5 h-5"/></button>
                        <div></div>
                        <button onClick={() => setPositionOffset(p => ({...p, x: p.x - 2}))} className="p-2 bg-midnight-500/50 rounded-md hover:bg-midnight-500 transition-colors" aria-label="Nudge Left"><ArrowLeftIcon className="w-5 h-5"/></button>
                        <button onClick={resetPosition} className="p-2 bg-midnight-500/50 rounded-md hover:bg-midnight-500 transition-colors" aria-label="Reset Position"><RefreshCwIcon className="w-5 h-5"/></button>
                        <button onClick={() => setPositionOffset(p => ({...p, x: p.x + 2}))} className="p-2 bg-midnight-500/50 rounded-md hover:bg-midnight-500 transition-colors" aria-label="Nudge Right"><ArrowRightIcon className="w-5 h-5"/></button>
                        <div></div>
                        <button onClick={() => setPositionOffset(p => ({...p, y: p.y + 2}))} className="p-2 bg-midnight-500/50 rounded-md hover:bg-midnight-500 transition-colors" aria-label="Nudge Down"><ArrowDownIcon className="w-5 h-5"/></button>
                        <div></div>
                    </div>
                </div>
                <div>
                    <label className="block text-center text-silver-300 text-xs font-medium uppercase tracking-wider mb-2">Rotation</label>
                    <div className="flex items-center gap-2">
                      <input
                          type="range"
                          min="-45"
                          max="45"
                          step="1"
                          value={rotation}
                          onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                          className="w-full h-2 bg-midnight-400 rounded-lg appearance-none cursor-pointer range-lg accent-bronze-400"
                      />
                      <button onClick={resetRotation} className="p-2 bg-midnight-500/50 rounded-md hover:bg-midnight-500 transition-colors" aria-label="Reset Rotation"><RefreshCwIcon className="w-5 h-5"/></button>
                    </div>
                </div>
                <div>
                    <label className="block text-center text-silver-300 text-xs font-medium uppercase tracking-wider mb-2">Adjust Scale (Zoom)</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="0.60"
                            max="1.60"
                            step="0.01"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full h-2 bg-midnight-400 rounded-lg appearance-none cursor-pointer range-lg accent-bronze-400"
                        />
                        <button onClick={resetZoom} className="p-2 bg-midnight-500/50 rounded-md hover:bg-midnight-500 transition-colors" aria-label="Reset Scale"><RefreshCwIcon className="w-5 h-5"/></button>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-platinum-300/10">
                <Button onClick={handleSaveSettings} variant="secondary" className="w-full !py-2 text-sm">
                  {saveStatus === 'saving' ? 'Saved!' : <><SaveIcon className="w-4 h-4 mr-2"/> Save Fit</>}
                </Button>
                {savedSettings[selectedRing.id] && (
                  <Button onClick={handleClearSettings} variant="ghost" className="w-full !py-2 text-sm !text-error/80 hover:!text-error hover:!bg-error/10">
                    <TrashIcon className="w-4 h-4 mr-2"/> Clear Saved Fit
                  </Button>
                )}
            </div>
        </div>
      )}

      <div
        className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-4 flex flex-col gap-4 cursor-grab active:cursor-grabbing"
        style={{
            transform: `translateY(${touchDeltaY}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e) => handleDragStart(e.clientY)}
        onMouseMove={(e) => handleDragMove(e.clientY)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div className="w-full flex justify-center gap-3">
          <button 
            onClick={() => setShowAdjustments(s => !s)} 
            className="bg-midnight-600/80 backdrop-blur-lg rounded-xl p-3 text-silver-200 font-medium flex items-center justify-center border border-platinum-300/10 hover:border-platinum-300/30 transition-colors"
          >
            <SlidersIcon className="w-5 h-5 mr-2" />
            Adjust Position & Rotation
          </button>
          <select
            onChange={(e) => setSelectedBackground(e.target.value || null)}
            className="bg-midnight-600/80 backdrop-blur-lg rounded-xl p-3 text-silver-200 font-medium border border-platinum-300/10 hover:border-platinum-300/30"
          >
            <option value="">Viewing Styles Background</option>
            <option value="bg_garden_1080p.jpg">Garden 1080p</option>
            <option value="bg_studio_1080p.jpg">Studio 1080p</option>
            <option value="bg_plain_1080p.jpg">Plain 1080p</option>
          </select>
        </div>

        <div ref={carouselRef} className="w-full overflow-x-auto pb-4 pt-2 px-4 snap-x snap-mandatory flex gap-3 no-scrollbar" style={{WebkitOverflowScrolling: 'touch'}}>
          {sortedRings.map(ring => (
            <div
              key={ring.id}
              id={`ring-item-${ring.id}`}
              onClick={() => handleRingSelect(ring)}
              className={`relative snap-center flex-shrink-0 w-24 h-32 rounded-2xl p-2 cursor-pointer transition-all duration-300 border-2 bg-black/20 ${selectedRing.id === ring.id ? 'border-bronze-400 scale-105' : 'border-platinum-300/20'}`}
            >
              <div className="w-full h-20 rounded-xl bg-midnight-500 mb-1 flex items-center justify-center overflow-hidden">
                <img src={resolveRingUrl(ring.id)} alt={ring.name} className="w-16 h-16 object-contain" />
              </div>
              <p className="text-xs text-center text-silver-200 font-medium truncate">{ring.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(ring.id);
                }}
                className={`absolute top-0 right-0 m-1 p-1 rounded-full transition-colors ${favoriteRings.includes(ring.id) ? 'text-error' : 'text-silver-400 hover:text-white'}`}
                aria-label={favoriteRings.includes(ring.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <HeartIcon filled={favoriteRings.includes(ring.id)} className="w-5 h-5"/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
