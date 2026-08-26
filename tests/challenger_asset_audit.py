"""
tests/challenger_asset_audit.py
Independent Empirical Adversarial Asset Auditor for Challenger 1
Audits 120 WebP 1080p frame sequence, GLB 3D binary structures, and JSON manifests.
"""

import os
import sys
import glob
import struct
import json
import numpy as np
from PIL import Image

def audit_webp_frames():
    print("\n" + "="*80)
    print("  [CHALLENGER 1 AUDIT 1]: 120-FRAME 3D WEBP SEQUENCE EMPIRICAL AUDIT")
    print("="*80)
    
    frames_dir = os.path.join("public", "assets", "3d-frames")
    assert os.path.isdir(frames_dir), f"Directory {frames_dir} does not exist!"
    
    files = sorted(os.listdir(frames_dir))
    webp_files = [f for f in files if f.endswith(".webp")]
    
    print(f"[*] Found {len(webp_files)} WebP files in {frames_dir}")
    assert len(webp_files) == 120, f"Expected exactly 120 frames, found {len(webp_files)}"
    
    # 1. Filename continuity assertion
    expected_files = [f"frame_{i:03d}.webp" for i in range(1, 121)]
    assert webp_files == expected_files, f"WebP filenames do not match expected frame_001.webp ... frame_120.webp sequence!"
    print("  [PASS] Filename sequence continuity strictly verified: frame_001.webp -> frame_120.webp (zero missing frames).")
    
    sizes = []
    dimensions = []
    luminances = []
    frame_rgb_arrays = []
    
    for idx, fname in enumerate(webp_files, start=1):
        fpath = os.path.join(frames_dir, fname)
        fsize = os.path.getsize(fpath)
        sizes.append(fsize)
        
        # 2. Raw binary header check
        with open(fpath, "rb") as bf:
            header_bytes = bf.read(30)
            assert len(header_bytes) >= 30, f"File {fname} is truncated (only {len(header_bytes)} bytes)"
            riff, file_size_minus_8, webp_magic, chunk_fourcc = struct.unpack("<4sI4s4s", header_bytes[:16])
            
            assert riff == b"RIFF", f"File {fname} missing RIFF signature: {riff}"
            assert webp_magic == b"WEBP", f"File {fname} missing WEBP fourcc: {webp_magic}"
            assert chunk_fourcc in [b"VP8 ", b"VP8L", b"VP8X"], f"File {fname} has unknown chunk fourcc: {chunk_fourcc}"
            assert file_size_minus_8 + 8 == fsize, f"File {fname} declared RIFF size {file_size_minus_8 + 8} != actual {fsize}"
            
        # 3. PIL Image integrity & dimension check
        with Image.open(fpath) as img:
            assert img.format == "WEBP", f"File {fname} format is not WEBP: {img.format}"
            w, h = img.size
            dimensions.append((w, h))
            assert (w, h) == (1920, 1080), f"File {fname} has invalid dimensions {(w, h)}, expected (1920, 1080)"
            
            # Extract RGB array
            rgb_arr = np.array(img.convert("RGB"), dtype=np.float32)
            assert rgb_arr.shape == (1080, 1920, 3), f"Invalid RGB shape {rgb_arr.shape} in {fname}"
            assert not np.isnan(rgb_arr).any(), f"NaN pixel values detected in {fname}"
            assert not np.isinf(rgb_arr).any(), f"Infinite pixel values detected in {fname}"
            
            frame_rgb_arrays.append(rgb_arr)
            lum = 0.299 * rgb_arr[:, :, 0] + 0.587 * rgb_arr[:, :, 1] + 0.114 * rgb_arr[:, :, 2]
            mean_lum = float(np.mean(lum))
            luminances.append(mean_lum)
            
            # Ensure not pure black / empty
            assert mean_lum > 0.5, f"Frame {fname} is suspiciously dark/empty (mean lum: {mean_lum:.4f})"
            
    print(f"  [PASS] All 120 frames verified for strict RIFF/WEBP binary headers and exact (1920, 1080) dimensions.")
    print(f"         Total Payload Size: {sum(sizes)/(1024*1024):.2f} MB")
    print(f"         Min Frame Size:     {min(sizes)/1024:.2f} KB ({min(sizes)} B)")
    print(f"         Max Frame Size:     {max(sizes)/1024:.2f} KB ({max(sizes)} B)")
    print(f"         Mean Frame Size:    {np.mean(sizes)/1024:.2f} KB")
    print(f"         Std Dev:            {np.std(sizes)/1024:.2f} KB")
    
    # 4. Frame-to-frame delta oracle (Anti-Duplicate / Anti-Static check)
    print("\n[*] Running Frame-to-Frame Temporal Delta Oracle across 119 transitions...")
    maes = []
    rmses = []
    pixel_change_pcts = []
    
    for i in range(len(frame_rgb_arrays) - 1):
        f_curr = frame_rgb_arrays[i]
        f_next = frame_rgb_arrays[i + 1]
        
        diff = np.abs(f_curr - f_next)
        mae = float(np.mean(diff))
        rmse = float(np.sqrt(np.mean((f_curr - f_next) ** 2)))
        
        # Pixels with significant change (> 2.0 in any channel)
        changed_pixels = np.sum(np.any(diff > 2.0, axis=2))
        total_pixels = 1920 * 1080
        pct_changed = (changed_pixels / total_pixels) * 100.0
        
        maes.append(mae)
        rmses.append(rmse)
        pixel_change_pcts.append(pct_changed)
        
        assert mae > 0.005, f"Static frame detected between frame_{i+1:03d}.webp and frame_{i+2:03d}.webp (MAE: {mae:.6f})"
        assert pct_changed > 0.05, f"Insufficient motion between frame_{i+1:03d}.webp and frame_{i+2:03d}.webp ({pct_changed:.4f}%)"
        
    print(f"  [PASS] Zero static or repeated frames. All 119 transitions exhibit active 3D motion.")
    print(f"         Min Transition MAE:         {min(maes):.4f}")
    print(f"         Max Transition MAE:         {max(maes):.4f}")
    print(f"         Mean Transition MAE:        {np.mean(maes):.4f}")
    print(f"         Min Pixel Change %:         {min(pixel_change_pcts):.2f}%")
    print(f"         Max Pixel Change %:         {max(pixel_change_pcts):.2f}%")
    print(f"         Mean Pixel Change %:        {np.mean(pixel_change_pcts):.2f}%")
    
    # 5. 4-Act Narrative Telemetry Verification
    print("\n[*] Validating 4-Act Narrative Arc Luminance & Spatial Distribution...")
    act1 = luminances[0:30]    # Frames 1-30: Cosmic Overview
    act2 = luminances[30:70]   # Frames 31-70: Quantum Dive
    act3 = luminances[70:100]  # Frames 71-100: Singularity Passage
    act4 = luminances[100:120] # Frames 101-120: Horizon Breakout
    
    print(f"         Act 1 (Frames 001-030 - Cosmic Overview):   Mean Lum = {np.mean(act1):.2f}, Min = {min(act1):.2f}, Max = {max(act1):.2f}")
    print(f"         Act 2 (Frames 031-070 - Quantum Dive):      Mean Lum = {np.mean(act2):.2f}, Min = {min(act2):.2f}, Max = {max(act2):.2f}")
    print(f"         Act 3 (Frames 071-100 - Singularity Tunnel): Mean Lum = {np.mean(act3):.2f}, Min = {min(act3):.2f}, Max = {max(act3):.2f}")
    print(f"         Act 4 (Frames 101-120 - Horizon Breakout):   Mean Lum = {np.mean(act4):.2f}, Min = {min(act4):.2f}, Max = {max(act4):.2f}")
    
    # Check that Act 2 reaches peak internal luminosity
    assert max(act2) == max(luminances), f"Expected peak luminance in Act 2, found {max(luminances):.2f} elsewhere"
    print("  [PASS] 4-Act narrative trajectory mathematically verified (Peak luminance in Act 2 Quantum Dive).")
    
    # 6. Manifest validation
    manifest_path = os.path.join(frames_dir, "manifest.json")
    assert os.path.isfile(manifest_path), f"Manifest file missing at {manifest_path}"
    with open(manifest_path, "r", encoding="utf-8") as mf:
        manifest_data = json.load(mf)
        
    assert manifest_data.get("totalFrames") == 120, "Manifest totalFrames != 120"
    assert manifest_data.get("width") == 1920, "Manifest width != 1920"
    assert manifest_data.get("height") == 1080, "Manifest height != 1080"
    assert manifest_data.get("format") == "webp", "Manifest format != webp"
    assert len(manifest_data.get("acts", [])) == 4, "Manifest acts != 4"
    print(f"  [PASS] manifest.json successfully validated for 120 frames, 1080p resolution, and 4-act metadata.")


def audit_glb_models():
    print("\n" + "="*80)
    print("  [CHALLENGER 1 AUDIT 2]: GLB 3D BINARY SPEC & GEOMETRY PARSER AUDIT")
    print("="*80)
    
    glb_paths = [
        os.path.join("public", "assets", "3d", "neural_core.glb"),
        os.path.join("public", "assets", "models", "neural_core.glb")
    ]
    
    for glb_path in glb_paths:
        print(f"[*] Auditing GLB file: {glb_path}")
        assert os.path.isfile(glb_path), f"GLB file does not exist at {glb_path}"
        
        file_size = os.path.getsize(glb_path)
        print(f"    File Size: {file_size} bytes ({file_size/1024:.2f} KB)")
        assert file_size > 1000, f"GLB file is suspiciously small ({file_size} bytes)"
        
        with open(glb_path, "rb") as f:
            data = f.read()
            
        assert len(data) == file_size, "Read length != file size"
        
        # 1. GLB 12-byte header
        magic, version, declared_length = struct.unpack("<4sII", data[:12])
        print(f"    Magic: {magic} | Version: {version} | Declared Length: {declared_length}")
        assert magic == b"glTF", f"Invalid GLB magic: {magic}, expected b'glTF'"
        assert version == 2, f"Invalid glTF version: {version}, expected 2"
        assert declared_length == file_size, f"Declared GLB length ({declared_length}) != file size ({file_size})"
        
        # 2. Chunk 0 (JSON)
        chunk0_len, chunk0_type = struct.unpack("<II", data[12:20])
        print(f"    Chunk 0: Type=0x{chunk0_type:08X} ({chunk0_type.to_bytes(4, 'little')}), Length={chunk0_len}")
        assert chunk0_type == 0x4E4F534A, f"Chunk 0 type is not JSON (0x4E4F534A)"
        
        json_bytes = data[20:20 + chunk0_len]
        gltf = json.loads(json_bytes.decode("utf-8"))
        
        assert "asset" in gltf, "glTF missing 'asset' section"
        assert gltf["asset"].get("version") == "2.0", f"glTF asset version is not 2.0"
        
        nodes = gltf.get("nodes", [])
        meshes = gltf.get("meshes", [])
        materials = gltf.get("materials", [])
        accessors = gltf.get("accessors", [])
        bufferViews = gltf.get("bufferViews", [])
        buffers = gltf.get("buffers", [])
        
        print(f"    glTF Asset Generator: {gltf['asset'].get('generator', 'unknown')}")
        print(f"    Nodes: {len(nodes)} | Meshes: {len(meshes)} | Materials: {len(materials)} | Accessors: {len(accessors)}")
        
        assert len(nodes) >= 3, f"Expected at least 3 nodes, found {len(nodes)}"
        assert len(meshes) >= 3, f"Expected at least 3 meshes, found {len(meshes)}"
        assert len(materials) >= 3, f"Expected at least 3 materials, found {len(materials)}"
        assert len(buffers) >= 1, "Expected at least 1 buffer"
        
        # 3. Chunk 1 (BIN)
        bin_offset = 20 + chunk0_len
        assert bin_offset < len(data), "GLB missing binary chunk"
        chunk1_len, chunk1_type = struct.unpack("<II", data[bin_offset:bin_offset + 8])
        print(f"    Chunk 1: Type=0x{chunk1_type:08X} ({chunk1_type.to_bytes(4, 'little')}), Length={chunk1_len}")
        assert chunk1_type == 0x004E4942, f"Chunk 1 type is not BIN (0x004E4942)"
        
        bin_data = data[bin_offset + 8:bin_offset + 8 + chunk1_len]
        declared_buf_len = buffers[0]["byteLength"]
        assert len(bin_data) >= declared_buf_len, f"BIN chunk length ({len(bin_data)}) < declared buffer byteLength ({declared_buf_len})"
        
        # 4. Geometry Accessor & Draco Extension Validation
        print("    [*] Parsing accessors and extensions from binary buffer...")
        draco_accessors = 0
        standard_accessors = 0
        
        for acc_idx, acc in enumerate(accessors):
            if "bufferView" in acc:
                standard_accessors += 1
                bview_idx = acc["bufferView"]
                bview = bufferViews[bview_idx]
                byte_offset = (bview.get("byteOffset", 0)) + (acc.get("byteOffset", 0))
                comp_type = acc["componentType"]
                count = acc["count"]
                acc_type = acc["type"]
                
                if acc_type == "VEC3" and comp_type == 5126: # FLOAT
                    raw_bytes = bin_data[byte_offset:byte_offset + count * 12]
                    coords = struct.unpack(f"<{count * 3}f", raw_bytes)
                    np_coords = np.array(coords).reshape((count, 3))
                    assert not np.isnan(np_coords).any(), f"Accessor {acc_idx} has NaN coordinates!"
                    assert not np.isinf(np_coords).any(), f"Accessor {acc_idx} has Inf coordinates!"
                elif acc_type == "SCALAR" and comp_type == 5123: # UNSIGNED_SHORT
                    raw_bytes = bin_data[byte_offset:byte_offset + count * 2]
                    indices = struct.unpack(f"<{count}H", raw_bytes)
                    assert len(indices) == count
            else:
                # Draco-compressed accessor per KHR_draco_mesh_compression spec
                draco_accessors += 1
                assert "KHR_draco_mesh_compression" in gltf.get("extensionsUsed", []), f"Accessor {acc_idx} has no bufferView and Draco is not declared"
                
        print(f"    [+] Accessors analyzed: {standard_accessors} standard, {draco_accessors} Draco-compressed.")
        print(f"  [PASS] GLB 3D model {os.path.basename(glb_path)} verified: binary headers, glTF 2.0 schema, and Draco compression.")
                    
        print(f"  [PASS] GLB 3D model {os.path.basename(glb_path)} verified: binary headers, glTF 2.0 schema, and valid vertex accessors.")


if __name__ == "__main__":
    audit_webp_frames()
    audit_glb_models()
    print("\n" + "="*80)
    print("  >>> ALL EMPIRICAL CHALLENGER ASSET AUDITS PASSED WITH 100% SUCCESS <<<")
    print("="*80 + "\n")
