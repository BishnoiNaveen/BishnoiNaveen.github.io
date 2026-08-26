/**
 * src/experience/camera/splineData.ts
 * Unified 3D Catmull-Rom Camera Spline & LookAt Trajectory
 * 
 * Maps continuous progress s in [0.0, 1.0] across all 7 scenes:
 * Scene 01: The Void Boot (z: 45 -> 38)
 * Scene 02: The AI Megalith (z: 38 -> 26, crane up)
 * Scene 03: The Humanoid Titan (z: 26 -> 0.5, exoskeleton penetration)
 * Scene 04: The Synaptic Brain (z: 0.5 -> -25, macro neural dive)
 * Scene 05: The Signal & Morph (z: -25 -> -65, warp pursuit)
 * Scene 06: The Digital Metropolis (z: -65 -> -115, grand city flyover)
 * Scene 07: The Inner Sanctum (z: -115 -> -135, grand entrance & portfolio reveal)
 */

import * as THREE from 'three';

export const CAMERA_WAYPOINTS: THREE.Vector3[] = [
  // SCENE 01: The Void Boot (s: 0.00 -> 0.14)
  new THREE.Vector3(0, 0, 45),
  new THREE.Vector3(0, 0.5, 41.5),
  new THREE.Vector3(0, 1.0, 38),

  // SCENE 02: The AI Megalith (s: 0.14 -> 0.28)
  new THREE.Vector3(4, 3.5, 32),
  new THREE.Vector3(8, 6.0, 26),

  // SCENE 03: The Humanoid Titan (s: 0.28 -> 0.44)
  new THREE.Vector3(4, 4.0, 17),
  new THREE.Vector3(0, 2.0, 8),
  new THREE.Vector3(0, 1.2, 0.5),

  // SCENE 04: The Synaptic Brain (s: 0.44 -> 0.60)
  new THREE.Vector3(-1.5, 0.5, -6),
  new THREE.Vector3(-3.0, -1.0, -12),
  new THREE.Vector3(-1.5, -0.5, -18),
  new THREE.Vector3(0, 0, -25),

  // SCENE 05: The Signal & Morph (s: 0.60 -> 0.74)
  new THREE.Vector3(2.0, -1.0, -35),
  new THREE.Vector3(4.0, -2.0, -45),
  new THREE.Vector3(2.0, 3.0, -55),
  new THREE.Vector3(0, 8.0, -65),

  // SCENE 06: The Digital Metropolis (s: 0.74 -> 0.88)
  new THREE.Vector3(0, 14.0, -80),
  new THREE.Vector3(0, 18.0, -95),
  new THREE.Vector3(0, 10.0, -105),
  new THREE.Vector3(0, 4.0, -115),

  // SCENE 07: The Inner Sanctum (s: 0.88 -> 1.00)
  new THREE.Vector3(0, 2.0, -125),
  new THREE.Vector3(0, 0.5, -135),
];

// Target / LookAt Points along the trajectory to ensure dramatic focal composition
export const LOOKAT_WAYPOINTS: THREE.Vector3[] = [
  // Scene 01: Focus on origin / distant seed
  new THREE.Vector3(0, 0, 20),
  new THREE.Vector3(0, 0.5, 15),
  new THREE.Vector3(0, 1.0, 10),

  // Scene 02: Focus on AI megalith monoliths
  new THREE.Vector3(0, 2.0, 10),
  new THREE.Vector3(0, 3.0, 0),

  // Scene 03: Focus on robot chest/visor aperture
  new THREE.Vector3(0, 2.0, 0),
  new THREE.Vector3(0, 1.2, 0),
  new THREE.Vector3(0, 1.0, -5),

  // Scene 04: Focus into brain core
  new THREE.Vector3(0, 0, -15),
  new THREE.Vector3(0, 0, -20),
  new THREE.Vector3(0, 0, -28),
  new THREE.Vector3(0, 0, -35),

  // Scene 05: Focus ahead on the racing photon signal
  new THREE.Vector3(2.0, -1.0, -45),
  new THREE.Vector3(0, 2.0, -60),
  new THREE.Vector3(0, 6.0, -75),
  new THREE.Vector3(0, 10.0, -90),

  // Scene 06: Focus on city skyline & towers
  new THREE.Vector3(0, 8.0, -100),
  new THREE.Vector3(0, 6.0, -115),
  new THREE.Vector3(0, 3.0, -125),
  new THREE.Vector3(0, 1.0, -135),

  // Scene 07: Focus into the grand entrance gate
  new THREE.Vector3(0, 1.0, -145),
  new THREE.Vector3(0, 0.5, -155),
];

/**
 * Continuous CatmullRom 3D Splines
 */
export const cameraSpline = new THREE.CatmullRomCurve3(
  CAMERA_WAYPOINTS,
  false, // closed = false
  'catmullrom',
  0.5 // tension
);

export const lookAtSpline = new THREE.CatmullRomCurve3(
  LOOKAT_WAYPOINTS,
  false,
  'catmullrom',
  0.5
);

/**
 * Sample camera position on spline at normalized progress s in [0.0, 1.0]
 */
export function getCameraPositionAt(progress: number, out: THREE.Vector3 = new THREE.Vector3()): THREE.Vector3 {
  const p = Math.max(0, Math.min(1, progress));
  return cameraSpline.getPointAt(p, out);
}

/**
 * Sample camera tangent / direction on spline at progress s
 */
export function getCameraTangentAt(progress: number, out: THREE.Vector3 = new THREE.Vector3()): THREE.Vector3 {
  const p = Math.max(0, Math.min(1, progress));
  return cameraSpline.getTangentAt(p, out);
}

/**
 * Sample lookAt target position on lookAt spline at progress s
 */
export function getLookAtPositionAt(progress: number, out: THREE.Vector3 = new THREE.Vector3()): THREE.Vector3 {
  const p = Math.max(0, Math.min(1, progress));
  return lookAtSpline.getPointAt(p, out);
}
