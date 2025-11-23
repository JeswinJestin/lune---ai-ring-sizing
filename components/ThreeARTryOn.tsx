import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Landmark } from '../types';
import { landmarkToVector, calculateRingRotation, smoothVector, smoothQuaternion } from '../lib/three-utils';

interface ThreeARTryOnProps {
    landmarks: Landmark[] | null;
    ringSizeMm: number;
    materialType: 'gold' | 'silver' | 'platinum' | 'roseGold';
    videoWidth: number;
    videoHeight: number;
}

const RingModel = ({ landmarks, ringSizeMm, materialType, videoWidth, videoHeight }: ThreeARTryOnProps) => {
    const ringRef = useRef<THREE.Mesh>(null);
    const occluderRef = useRef<THREE.Mesh>(null);
    const { camera } = useThree();

    // Smooth transition refs
    const currentPos = useRef(new THREE.Vector3(0, 0, 0));
    const currentRot = useRef(new THREE.Quaternion());
    const currentScale = useRef(new THREE.Vector3(1, 1, 1));

    // Material definitions
    const materials = useMemo(() => ({
        gold: new THREE.MeshStandardMaterial({
            color: '#FFD700',
            metalness: 1,
            roughness: 0.15,
            envMapIntensity: 1.5,
        }),
        silver: new THREE.MeshStandardMaterial({
            color: '#C0C0C0',
            metalness: 1,
            roughness: 0.2,
            envMapIntensity: 1.2,
        }),
        platinum: new THREE.MeshStandardMaterial({
            color: '#E5E4E2',
            metalness: 1,
            roughness: 0.2,
            envMapIntensity: 1.5,
        }),
        roseGold: new THREE.MeshStandardMaterial({
            color: '#B76E79',
            metalness: 1,
            roughness: 0.15,
            envMapIntensity: 1.5,
        }),
    }), []);

    useFrame(() => {
        if (!landmarks || landmarks.length < 17 || !ringRef.current || !occluderRef.current) {
            // Hide if no hand
            if (ringRef.current) ringRef.current.visible = false;
            if (occluderRef.current) occluderRef.current.visible = false;
            return;
        }

        ringRef.current.visible = true;
        occluderRef.current.visible = true;

        const RING_MCP = 13;
        const RING_PIP = 14;

        // Convert 2D landmarks to 3D vectors
        // Depth scale is heuristic; 0.5 width seems reasonable for hand depth relative to screen width
        const mcp = landmarkToVector(landmarks[RING_MCP], videoWidth, videoHeight, 0.5);
        const pip = landmarkToVector(landmarks[RING_PIP], videoWidth, videoHeight, 0.5);

        // Position: Midpoint between MCP and PIP (approximate ring location)
        // Adjust interpolation factor to slide ring up/down finger (0.4 is closer to MCP)
        const targetPos = new THREE.Vector3().lerpVectors(mcp, pip, 0.35);

        // Rotation: Align with finger bone
        const targetRot = calculateRingRotation(mcp, pip);

        // Scale: Based on ring size (mm) vs screen pixels
        // We need a pixel-to-mm ratio. 
        // Heuristic: Palm width ~80mm.
        const PALM_INDEX = 5;
        const PALM_PINKY = 17;
        const p1 = landmarkToVector(landmarks[PALM_INDEX], videoWidth, videoHeight);
        const p2 = landmarkToVector(landmarks[PALM_PINKY], videoWidth, videoHeight);
        const palmWidthPx = p1.distanceTo(p2);
        const pxPerMm = palmWidthPx / 80; // 80mm avg palm width

        const scaleVal = ringSizeMm * pxPerMm;
        // The TorusGeometry is created with radius 1. So we scale it to match half the diameter in pixels.
        // Actually, Torus radius is distance from center to tube center.
        // Ring diameter = (radius + tube) * 2.
        // Let's say radius = 0.5, tube = 0.1. Outer diam = 1.2. Inner diam = 0.8.
        // We want inner diameter to match ringSizeMm.
        // So we scale the whole object.

        const targetScale = new THREE.Vector3(scaleVal, scaleVal, scaleVal);

        // Smoothing
        const alpha = 0.2;
        currentPos.current.lerp(targetPos, alpha);
        currentRot.current.slerp(targetRot, alpha);
        currentScale.current.lerp(targetScale, alpha);

        // Apply transforms
        ringRef.current.position.copy(currentPos.current);
        ringRef.current.quaternion.copy(currentRot.current);
        // We don't scale the mesh directly for size, we scale a parent or use geometry parameters.
        // But scaling mesh is easier for dynamic updates.
        // Torus default: radius 1, tube 0.2. Inner radius = 0.8.
        // We want inner diameter = ringSizeMm.
        // So inner radius = ringSizeMm / 2.
        // Scale factor = (ringSizeMm / 2) / 0.8.
        const scaleFactor = (scaleVal / 2) / 0.85;
        ringRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Occluder transforms (same as ring but slightly smaller/positioned to mask back)
        occluderRef.current.position.copy(currentPos.current);
        occluderRef.current.quaternion.copy(currentRot.current);
        occluderRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor * 2); // Longer cylinder
    });

    return (
        <>
            {/* The Ring */}
            <mesh ref={ringRef}>
                {/* Radius 1, Tube 0.15, RadialSegments 16, TubularSegments 32 */}
                <torusGeometry args={[0.85, 0.15, 16, 32]} />
                <primitive object={materials[materialType]} attach="material" />
            </mesh>

            {/* The Occluder (Finger) */}
            {/* Renders to depth buffer only, effectively 'masking' things behind it */}
            <mesh ref={occluderRef} renderOrder={0}>
                <cylinderGeometry args={[0.75, 0.75, 4, 32]} />
                <meshBasicMaterial colorWrite={false} />
            </mesh>
        </>
    );
};

export const ThreeARTryOn = (props: ThreeARTryOnProps) => {
    const [hasError, setHasError] = React.useState(false);

    useEffect(() => {
        if (!props.landmarks) {
            console.log("ThreeARTryOn: No landmarks detected");
        } else {
            console.log("ThreeARTryOn: Landmarks detected", props.landmarks.length);
        }
    }, [props.landmarks]);

    if (hasError) {
        return <div className="absolute inset-0 flex items-center justify-center text-red-500">AR Error</div>;
    }

    return (
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            <Canvas
                camera={{ position: [0, 0, 1000], fov: 50 }} // Orthographic-ish perspective
                gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
                style={{ width: '100%', height: '100%' }}
                onCreated={({ gl }) => {
                    gl.domElement.width = props.videoWidth || 640;
                    gl.domElement.height = props.videoHeight || 480;
                    console.log("Canvas created with size:", gl.domElement.width, gl.domElement.height);
                }}
                onError={(e) => {
                    console.error("Canvas error:", e);
                    setHasError(true);
                }}
            >
                {/* Lights */}
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} />

                {/* Environment for reflections */}
                <Environment preset="city" />

                <RingModel {...props} />
            </Canvas>
        </div>
    );
};
