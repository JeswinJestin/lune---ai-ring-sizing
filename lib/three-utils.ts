import * as THREE from 'three';
import { Landmark } from '../types';

// Convert MediaPipe landmark to Three.js Vector3
// Z is inverted because WebGL/Three.js uses right-handed coordinate system where -Z is forward
export const landmarkToVector = (landmark: Landmark, width: number, height: number, depthScale: number = 1): THREE.Vector3 => {
  const x = (landmark.x - 0.5) * width;
  const y = -(landmark.y - 0.5) * height; // Invert Y for 3D space
  const z = -landmark.z * width * depthScale; // Scale Z depth
  return new THREE.Vector3(x, y, z);
};

// Calculate rotation quaternion for the ring based on finger bone direction
export const calculateRingRotation = (mcp: THREE.Vector3, pip: THREE.Vector3): THREE.Quaternion => {
  const fingerDir = new THREE.Vector3().subVectors(pip, mcp).normalize();
  
  // Default ring orientation (assuming ring cylinder axis is Y-aligned or Z-aligned depending on geometry)
  // Let's assume our Torus lies flat on XY plane, so its normal is Z.
  // We want the ring's normal (Z) to align with the finger direction.
  
  const targetDir = fingerDir.clone();
  const defaultDir = new THREE.Vector3(0, 0, 1); // Ring normal
  
  const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDir, targetDir);
  return quaternion;
};

// Simple low-pass filter for smoothing
export const smoothVector = (current: THREE.Vector3, target: THREE.Vector3, alpha: number): THREE.Vector3 => {
  return current.clone().lerp(target, alpha);
};

export const smoothQuaternion = (current: THREE.Quaternion, target: THREE.Quaternion, alpha: number): THREE.Quaternion => {
  return current.clone().slerp(target, alpha);
};
