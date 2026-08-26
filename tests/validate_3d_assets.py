import os
import sys
import glob
import struct
import json
import subprocess
import shutil
import numpy as np
from PIL import Image

print("=== STARTING 3D ASSET EMPIRICAL VERIFICATION ===")

# 1. 120 WEBP FRAMES AUDIT
frames_dir = os.path.join("public", "assets", "3d-frames")
frame_paths = sorted(glob.glob(os.path.join(frames_dir, "frame_*.webp")))

print(f"[Audit 1.1] Total WebP frames found: {len(frame_paths)}")
assert len(frame_paths) == 120, f"Expected 120 frames, found {len(frame_paths)}"

expected_names = [f"frame_{i:03d}.webp" for i in range(1, 121)]
actual_names = [os.path.basename(p) for p in frame_paths]
assert actual_names == expected_names, "Frame filenames do not strictly match frame_001.webp ... frame_120.webp"
print("[Audit 1.2] All 120 filenames strictly match pattern frame_001.webp to frame_120.webp")

sizes = []
dimensions = []
mean_luminances = []
frame_arrays = []

for i, p in enumerate(frame_paths, start=1):
    sz = os.path.getsize(p)
    assert sz > 0, f"Frame {p} has zero byte length!"
    assert sz > 1000, f"Frame {p} suspiciously small ({sz} bytes)"
    sizes.append(sz)
    
    with Image.open(p) as img:
        w, h = img.size
        assert (w, h) == (1920, 1080), f"Frame {p} has invalid dimensions: {(w, h)}, expected (1920, 1080)"
        arr = np.array(img.convert("RGB"), dtype=np.float32)
        frame_arrays.append(arr)
        lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
        mean_luminances.append(float(np.mean(lum)))

print(f"[Audit 1.3] All 120 frames verified for dimensions 1920x1080 and non-zero byte size.")
print(f"            Min size: {min(sizes)} B ({min(sizes)/1024:.2f} KB), Max size: {max(sizes)} B ({max(sizes)/1024:.2f} KB), Mean size: {np.mean(sizes)/1024:.2f} KB, Total size: {sum(sizes)/(1024*1024):.2f} MB")

# 2. FRAME-TO-FRAME PROGRESSION & DELTA ORACLE
print("\n[Audit 1.4] Calculating Frame-to-Frame Deltas across all 119 transitions...")
mae_deltas = []
mse_deltas = []
pixel_diff_pcts = []

for i in range(len(frame_arrays) - 1):
    f1 = frame_arrays[i]
    f2 = frame_arrays[i + 1]
    diff = np.abs(f1 - f2)
    mae = float(np.mean(diff))
    mse = float(np.mean((f1 - f2) ** 2))
    changed_pixels = np.sum(np.any(diff > 2.0, axis=2))
    total_pixels = 1920 * 1080
    diff_pct = (changed_pixels / total_pixels) * 100.0
    mae_deltas.append(mae)
    mse_deltas.append(mse)
    pixel_diff_pcts.append(diff_pct)
    assert mae > 0.001, f"Transition frame {i+1} -> {i+2} has ZERO delta!"
    assert diff_pct > 0.01, f"Transition frame {i+1} -> {i+2} has only {diff_pct:.4f}% pixel change"

print(f"            Min MAE delta: {min(mae_deltas):.4f}, Max MAE delta: {max(mae_deltas):.4f}, Mean MAE: {np.mean(mae_deltas):.4f}")
print(f"            Min MSE delta: {min(mse_deltas):.4f}, Max MSE delta: {max(mse_deltas):.4f}, Mean MSE: {np.mean(mse_deltas):.4f}")
print(f"            Min Pixel Change %: {min(pixel_diff_pcts):.2f}%, Max: {max(pixel_diff_pcts):.2f}%, Mean: {np.mean(pixel_diff_pcts):.2f}%")
print("            [PASS] Zero static/repeated frames detected across all 120 frames.")

# 3. 4-ACT NARRATIVE TELEMETRY VERIFICATION
print("\n[Audit 1.5] Analyzing 4-Act Cinematic Narrative Arc...")
act1_lum = mean_luminances[0:30]
act2_lum = mean_luminances[30:70]
act3_lum = mean_luminances[70:100]
act4_lum = mean_luminances[100:120]

print(f"            Act 1 (Overview, frames 1-30):       Mean Lum = {np.mean(act1_lum):.2f}, Start={act1_lum[0]:.2f}, End={act1_lum[-1]:.2f}")
print(f"            Act 2 (Quantum Dive, frames 31-70):  Mean Lum = {np.mean(act2_lum):.2f}, Start={act2_lum[0]:.2f}, End={act2_lum[-1]:.2f}")
print(f"            Act 3 (Singularity, frames 71-100):  Mean Lum = {np.mean(act3_lum):.2f}, Start={act3_lum[0]:.2f}, End={act3_lum[-1]:.2f}")
print(f"            Act 4 (Breakout, frames 101-120):    Mean Lum = {np.mean(act4_lum):.2f}, Start={act4_lum[0]:.2f}, End={act4_lum[-1]:.2f}")

assert max(mean_luminances) == max(act2_lum), f"Peak luminance ({max(mean_luminances):.2f}) expected in Act 2, found elsewhere"
print(f"            [PASS] Peak Singularity Luminance ({max(act2_lum):.2f}) correctly localized to Act 2 Core Dive.")

# 4. GLB 3D MODEL BINARY SPEC VALIDATION
print("\n[Audit 2.1] Inspecting glTF / GLB 3D model...")
glb_path = os.path.join("public", "assets", "3d", "neural_core.glb")
assert os.path.isfile(glb_path), f"GLB model not found at {glb_path}"
glb_size = os.path.getsize(glb_path)
print(f"            GLB Path: {glb_path}, File Size: {glb_size} bytes ({glb_size/1024:.2f} KB)")
assert glb_size > 10000, f"GLB file is unexpectedly small ({glb_size} bytes)"

with open(glb_path, "rb") as f:
    glb_data = f.read()

magic, version, length = struct.unpack("<4sII", glb_data[:12])
print(f"            GLB Magic: {magic}, Version: {version}, Declared Length: {length}")
assert magic == b"glTF", f"Invalid GLB magic header: {magic}, expected b'glTF'"
assert version == 2, f"Invalid glTF version: {version}, expected 2"
assert length == len(glb_data), f"Declared GLB length ({length}) != actual file length ({len(glb_data)})"

chunk0_len, chunk0_type = struct.unpack("<II", glb_data[12:20])
print(f"            Chunk 0: Type={chunk0_type:08X} ({chunk0_type.to_bytes(4, 'little')}), Length={chunk0_len}")
assert chunk0_type == 0x4E4F534A, "Chunk 0 is not JSON chunk (0x4E4F534A)"
json_bytes = glb_data[20:20 + chunk0_len]
gltf_json = json.loads(json_bytes.decode("utf-8"))

print(f"            glTF Generator: {gltf_json.get('asset', {}).get('generator', 'unknown')}")
print(f"            glTF Version:   {gltf_json.get('asset', {}).get('version', 'unknown')}")
print(f"            Scenes: {len(gltf_json.get('scenes', []))}, Nodes: {len(gltf_json.get('nodes', []))}, Meshes: {len(gltf_json.get('meshes', []))}, Materials: {len(gltf_json.get('materials', []))}")
print(f"            Extensions Used: {gltf_json.get('extensionsUsed', [])}")
print(f"            Extensions Required: {gltf_json.get('extensionsRequired', [])}")

assert len(gltf_json.get("nodes", [])) > 0, "GLB model contains 0 nodes!"
assert len(gltf_json.get("meshes", [])) > 0, "GLB model contains 0 meshes!"
assert len(gltf_json.get("materials", [])) > 0, "GLB model contains 0 materials!"

offset = 20 + chunk0_len
if offset < len(glb_data):
    chunk1_len, chunk1_type = struct.unpack("<II", glb_data[offset:offset + 8])
    print(f"            Chunk 1: Type={chunk1_type:08X} ({chunk1_type.to_bytes(4, 'little')}), Length={chunk1_len}")
    assert chunk1_type == 0x004E4942, "Chunk 1 is not BIN chunk (0x004E4942)"

print("            [PASS] GLB binary 2.0 structure verified successfully.")

# 5. GENERATOR SCRIPT EXECUTION VERIFICATION
print("\n[Audit 3.1] Testing scripts/generate_3d_assets.py Execution in Fallback Mode...")
tmp_test_dir = os.path.join("tests", "tmp_test_fallback")
if os.path.exists(tmp_test_dir):
    shutil.rmtree(tmp_test_dir)
os.makedirs(tmp_test_dir, exist_ok=True)

test_glb = os.path.join(tmp_test_dir, "test_core.glb")
cmd = [
    sys.executable,
    "scripts/generate_3d_assets.py",
    "--mode=fallback",
    "--frames=4",
    "--res=320x180",
    f"--output-dir={tmp_test_dir}",
    f"--glb-path={test_glb}"
]
res = subprocess.run(cmd, capture_output=True, text=True)
print(f"            Fallback returncode: {res.returncode}")
if res.returncode != 0:
    print(f"STDOUT:\n{res.stdout}")
    print(f"STDERR:\n{res.stderr}")
assert res.returncode == 0, f"generate_3d_assets.py failed in fallback mode with return code {res.returncode}"

test_frames = sorted(glob.glob(os.path.join(tmp_test_dir, "frame_*.webp")))
assert len(test_frames) == 4, f"Expected 4 generated test frames, got {len(test_frames)}"
assert os.path.isfile(test_glb), "Test glTF GLB not generated"
print(f"            [PASS] Generator script executed cleanly in fallback mode (4 frames + GLB).")
shutil.rmtree(tmp_test_dir)

# 6. BLENDER HEADLESS EXECUTION TEST
print("\n[Audit 3.2] Testing scripts/generate_3d_assets.py Execution in Blender Headless Mode (2 frames)...")
tmp_blender_dir = os.path.join("tests", "tmp_test_blender")
if os.path.exists(tmp_blender_dir):
    shutil.rmtree(tmp_blender_dir)
os.makedirs(tmp_blender_dir, exist_ok=True)

blender_glb = os.path.join(tmp_blender_dir, "blender_test.glb")
cmd_blender = [
    sys.executable,
    "scripts/generate_3d_assets.py",
    "--mode=blender",
    "--frames=2",
    "--res=320x180",
    f"--output-dir={tmp_blender_dir}",
    f"--glb-path={blender_glb}"
]
res_blender = subprocess.run(cmd_blender, capture_output=True, text=True)
print(f"            Blender mode returncode: {res_blender.returncode}")
if res_blender.returncode != 0:
    print(f"STDOUT:\n{res_blender.stdout}")
    print(f"STDERR:\n{res_blender.stderr}")
assert res_blender.returncode == 0, f"generate_3d_assets.py failed in blender mode with return code {res_blender.returncode}"

blender_frames = sorted(glob.glob(os.path.join(tmp_blender_dir, "frame_*.webp")))
assert len(blender_frames) == 2, f"Expected 2 generated blender test frames, got {len(blender_frames)}"
assert os.path.isfile(blender_glb), "Blender glTF GLB not generated"
print(f"            [PASS] Generator script executed cleanly in Blender headless mode (2 frames + GLB).")
shutil.rmtree(tmp_blender_dir)

print("\n=== ALL ASSET AUDITS PASSED WITH ZERO ERRORS ===")
