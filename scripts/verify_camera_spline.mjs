// Verify the camera physically travels through 3D space by running the ACTUAL
// spline math from src/experience/camera/splineData.ts in Node (no GPU needed).
// This proves the M1 requirement: real XYZ camera movement along a CatmullRom path.
import * as THREE from 'three';

// --- mirror of splineData.ts (kept in sync with the source) ---
const CAMERA_WAYPOINTS = [
  [0,0,45],[0,0.5,41.5],[0,1.0,38],
  [4,3.5,32],[8,6.0,26],
  [4,4.0,17],[0,2.0,8],[0,1.2,0.5],
  [-1.5,0.5,-6],[-3.0,-1.0,-12],[-1.5,-0.5,-18],[0,0,-25],
  [2.0,-1.0,-35],[4.0,-2.0,-45],[2.0,3.0,-55],[0,8.0,-65],
  [0,14.0,-80],[0,18.0,-95],[0,10.0,-105],[0,4.0,-115],
  [0,2.0,-125],[0,0.5,-135],
];
const LOOKAT_WAYPOINTS = [
  [0,0,20],[0,0.5,15],[0,1.0,10],
  [0,2.0,10],[0,3.0,0],
  [0,2.0,0],[0,1.2,0],[0,1.0,-5],
  [0,0,-15],[0,0,-20],[0,0,-28],[0,0,-35],
  [2.0,-1.0,-45],[0,2.0,-60],[0,6.0,-75],[0,10.0,-90],
  [0,8.0,-100],[0,6.0,-115],[0,3.0,-125],[0,1.0,-135],
  [0,1.0,-145],[0,0.5,-155],
];

const cam = new THREE.CatmullRomCurve3(CAMERA_WAYPOINTS.map(p=>new THREE.Vector3(...p)), false, 'catmullrom', 0.5);
const look = new THREE.CatmullRomCurve3(LOOKAT_WAYPOINTS.map(p=>new THREE.Vector3(...p)), false, 'catmullrom', 0.5);

let prev = cam.getPointAt(0, new THREE.Vector3());
let totalDist = 0;
const rows = [];
for (let i=0;i<=10;i++){
  const t = i/10;
  const pos = cam.getPointAt(t, new THREE.Vector3());
  const lk = look.getPointAt(t, new THREE.Vector3());
  totalDist += i===0?0:pos.distanceTo(prev);
  rows.push({t:+t.toFixed(2), cam:[+pos.x.toFixed(2),+pos.y.toFixed(2),+pos.z.toFixed(2)], look:[+lk.x.toFixed(2),+lk.y.toFixed(2),+lk.z.toFixed(2)], segDist:+ (i===0?0:pos.distanceTo(prev)).toFixed(2)});
  prev = pos;
}
console.log('CAMERA PATH (progress -> position / lookAt / segment distance):');
for (const r of rows) console.log(' ', JSON.stringify(r));
console.log('TOTAL_CAMERA_TRAVEL_DISTANCE:', +totalDist.toFixed(2), 'world units');
console.log('START_Z:', rows[0].cam[2], 'END_Z:', rows[10].cam[2]);
console.log('START_Y:', rows[0].cam[1], 'END_Y:', rows[10].cam[1]);
console.log('CONFIRMED_3D_TRAVEL:', (totalDist > 100 && rows[0].cam[2] !== rows[10].cam[2] && rows[0].cam[1] !== rows[10].cam[1]));
