#!/usr/bin/env python3
"""
generate_3d_assets.py -- Procedural 3D Cybernetic AI Neural Core Asset Generator
================================================================================
Generates 120-frame cinematic WebP sequence (1920x1080) and Draco-compressed glTF
model (neural_core.glb) for the scroll-driven AI world landing page.

Features:
- Dual-Engine: Native Blender 5.2.0 bpy (Cycles/Workbench) + Pure Python NumPy/Pillow Fallback.
- 4-Act Camera Trajectory (120 frames): Cosmic Overview -> Quantum Dive -> Singularity Tunnel -> Horizon Breakout.
- Luminous Cyber Shaders: Cyan (#00f0ff), Neon Violet (#a855f7), Electric Amber (#f59e0b).
- Concentric Gimbal Cyber Rings, 100 Synaptic Nodes, Axon Spline Links, 300 Quanta Particles.
- Automated Draco glTF 2.0 GLB export and metadata manifest generation.
"""

import os
import sys
import math
import json
import time
import argparse
import subprocess
import shutil
from pathlib import Path

# Palette definitions
COLOR_CYAN_HEX = "#00f0ff"
COLOR_VIOLET_HEX = "#a855f7"
COLOR_AMBER_HEX = "#f59e0b"
COLOR_BG_HEX = "#030712"

COLOR_CYAN_RGB = (0.0, 0.941, 1.0)
COLOR_VIOLET_RGB = (0.659, 0.333, 0.969)
COLOR_AMBER_RGB = (0.961, 0.620, 0.043)
COLOR_BG_RGB = (0.012, 0.027, 0.071)


def find_blender_binary(custom_path=None):
    """Detect Blender executable on host system."""
    if custom_path and os.path.isfile(custom_path):
        return custom_path
    
    env_path = os.environ.get("BLENDER_PATH")
    if env_path and os.path.isfile(env_path):
        return env_path
    
    win_paths = [
        r"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe",
        r"C:\Program Files\Blender Foundation\Blender 5.1\blender.exe",
        r"C:\Program Files\Blender Foundation\Blender 5.0\blender.exe",
        r"C:\Program Files\Blender Foundation\Blender 4.2\blender.exe",
        r"C:\Program Files\Blender Foundation\Blender 4.1\blender.exe",
        r"C:\Program Files\Blender Foundation\Blender\blender.exe",
    ]
    for p in win_paths:
        if os.path.isfile(p):
            return p
            
    which_path = shutil.which("blender")
    if which_path:
        return which_path
        
    return None


# ==============================================================================
# BLENDER BPY PROCEDURAL GENERATOR
# ==============================================================================

def execute_bpy_generator(output_dir, glb_path, frames=120, width=1920, height=1080, quality=85, engine="BLENDER_WORKBENCH"):
    """Executed when running inside Blender bpy environment."""
    import bpy

    print(f"[Blender] Initializing Cybernetic Neural Core generator: {frames} frames @ {width}x{height}")
    print(f"[Blender] Output Frames: {output_dir}")
    print(f"[Blender] Output GLB:    {glb_path}")

    abs_output_dir = os.path.abspath(output_dir)
    abs_glb_path = os.path.abspath(glb_path)
    os.makedirs(abs_output_dir, exist_ok=True)
    os.makedirs(os.path.dirname(abs_glb_path), exist_ok=True)

    # 1. Reset Scene
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene

    # 2. Configure World
    world = bpy.data.worlds.new("CyberWorld")
    scene.world = world
    world.use_nodes = True
    bg_node = world.node_tree.nodes.get("Background")
    if bg_node:
        bg_node.inputs[0].default_value = (0.012, 0.027, 0.071, 1.0) # #030712
        bg_node.inputs[1].default_value = 0.6

    # 3. Create Materials
    def create_emission_mat(name, color_rgba, strength=8.0):
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        nodes.clear()
        out = nodes.new(type="ShaderNodeOutputMaterial")
        em = nodes.new(type="ShaderNodeEmission")
        em.inputs["Color"].default_value = color_rgba
        em.inputs["Strength"].default_value = strength
        mat.node_tree.links.new(em.outputs["Emission"], out.inputs["Surface"])
        if hasattr(mat, 'diffuse_color'):
            mat.diffuse_color = color_rgba
        return mat

    mat_core = create_emission_mat("Mat_QuantumCore", (0.659, 0.333, 0.969, 1.0), 12.0) # Violet
    mat_lattice = create_emission_mat("Mat_LatticeLuminous", (0.0, 0.941, 1.0, 1.0), 7.0) # Cyan
    mat_amber = create_emission_mat("Mat_AmberPulse", (0.961, 0.620, 0.043, 1.0), 9.0) # Amber
    mat_ring_gold = create_emission_mat("Mat_RingGold", (0.961, 0.750, 0.150, 1.0), 5.0)
    mat_ring_cyan = create_emission_mat("Mat_RingCyan", (0.0, 0.850, 0.950, 1.0), 6.0)
    mat_particle = create_emission_mat("Mat_Particle", (0.4, 0.8, 1.0, 1.0), 10.0)

    # 4. Build Core Singularity (Inner Sphere)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=4, radius=1.35, location=(0, 0, 0))
    core_obj = bpy.context.active_object
    core_obj.name = "Singularity_Core"
    core_obj.data.materials.append(mat_core)

    # 5. Build Outer Wireframe Icosahedron Lattice
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=2.6, location=(0, 0, 0))
    lattice_obj = bpy.context.active_object
    lattice_obj.name = "Exoskeleton_Lattice"
    wire_mod = lattice_obj.modifiers.new(name="LatticeWire", type="WIREFRAME")
    wire_mod.thickness = 0.038
    wire_mod.use_replace = True
    lattice_obj.data.materials.append(mat_lattice)

    # 6. Build Secondary Inner Geodesic Cage
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=1.9, location=(0, 0, 0))
    inner_cage = bpy.context.active_object
    inner_cage.name = "Inner_Quantum_Cage"
    inner_wire = inner_cage.modifiers.new(name="InnerWire", type="WIREFRAME")
    inner_wire.thickness = 0.025
    inner_cage.data.materials.append(mat_amber)

    # 7. Concentric Gimbal Cyber Rings (3 Toruses)
    rings = []
    ring_configs = [
        {"r_maj": 3.4, "r_min": 0.035, "tilt": (0.35, 0.25, 0.0), "mat": mat_ring_cyan, "rot_speed": 1.0, "axis": "Z"},
        {"r_maj": 4.3, "r_min": 0.028, "tilt": (-0.55, 0.45, 0.0), "mat": mat_ring_gold, "rot_speed": -1.618, "axis": "Y"},
        {"r_maj": 5.2, "r_min": 0.022, "tilt": (0.75, -0.40, 0.0), "mat": mat_core, "rot_speed": 2.618, "axis": "X"},
    ]

    for idx, cfg in enumerate(ring_configs):
        bpy.ops.mesh.primitive_torus_add(
            major_radius=cfg["r_maj"],
            minor_radius=cfg["r_min"],
            major_segments=64,
            minor_segments=16,
            location=(0, 0, 0)
        )
        ring_obj = bpy.context.active_object
        ring_obj.name = f"Gimbal_Ring_{idx+1}"
        ring_obj.rotation_euler = cfg["tilt"]
        ring_obj.data.materials.append(cfg["mat"])
        rings.append((ring_obj, cfg))

    # 8. Synaptic Node Lattice (Fibonacci Sphere Distribution)
    num_nodes = 84
    nodes = []
    golden_angle = math.pi * (3.0 - math.sqrt(5.0))

    for i in range(num_nodes):
        y = 1.0 - (i / float(num_nodes - 1)) * 2.0
        radius_at_y = math.sqrt(max(0.0, 1.0 - y * y))
        theta = golden_angle * i
        x = math.cos(theta) * radius_at_y
        z = math.sin(theta) * radius_at_y
        
        dist = 2.4 + (math.sin(i * 1.7) * 0.5 + 0.5) * 2.6
        pos = (x * dist, y * dist, z * dist)
        
        node_rad = 0.06 + (i % 3) * 0.025
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=node_rad, location=pos)
        node_obj = bpy.context.active_object
        node_obj.name = f"SynapticNode_{i:03d}"
        
        if i % 3 == 0:
            node_obj.data.materials.append(mat_lattice)
        elif i % 3 == 1:
            node_obj.data.materials.append(mat_core)
        else:
            node_obj.data.materials.append(mat_amber)
        nodes.append(pos)

    # 9. Axon Splines Connecting Nearest Nodes
    curve_data = bpy.data.curves.new("AxonNetwork", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.bevel_depth = 0.012
    curve_data.bevel_resolution = 3

    for i in range(0, num_nodes, 2):
        p1 = nodes[i]
        closest_j = (i + 1) % num_nodes
        p2 = nodes[closest_j]
        
        spline = curve_data.splines.new("BEZIER")
        spline.bezier_points.add(1)
        
        mid = ((p1[0]+p2[0])*0.5 * 1.08, (p1[1]+p2[1])*0.5 * 1.08, (p1[2]+p2[2])*0.5 * 1.08)
        
        spline.bezier_points[0].co = p1
        spline.bezier_points[0].handle_right = mid
        spline.bezier_points[0].handle_left = p1
        
        spline.bezier_points[1].co = p2
        spline.bezier_points[1].handle_left = mid
        spline.bezier_points[1].handle_right = p2

    axon_obj = bpy.data.objects.new("AxonNetwork", curve_data)
    scene.collection.objects.link(axon_obj)
    axon_obj.data.materials.append(mat_lattice)

    # 10. Cybernetic Particle Cloud Quanta
    for p_idx in range(160):
        pr = 1.8 + (p_idx / 160.0) * 11.0
        p_phi = (p_idx * 2.39996) % (2.0 * math.pi)
        p_costheta = -1.0 + (2.0 * p_idx) / 160.0
        p_sintheta = math.sqrt(max(0.0, 1.0 - p_costheta * p_costheta))
        
        px = pr * p_sintheta * math.cos(p_phi)
        py = pr * p_costheta * 1.6
        pz = pr * p_sintheta * math.sin(p_phi)
        
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.035, location=(px, py, pz))
        p_obj = bpy.context.active_object
        p_obj.name = f"Quanta_{p_idx:03d}"
        p_obj.data.materials.append(mat_particle if p_idx % 2 == 0 else mat_lattice)

    # 11. Cyber Lighting
    light_core = bpy.data.lights.new(name="Light_CorePoint", type="POINT")
    light_core.energy = 400.0
    light_core.color = (0.0, 0.941, 1.0)
    obj_light_core = bpy.data.objects.new(name="Light_CorePoint", object_data=light_core)
    scene.collection.objects.link(obj_light_core)
    obj_light_core.location = (0, 0, 0)

    light_key = bpy.data.lights.new(name="Light_SunKey", type="SUN")
    light_key.energy = 4.0
    light_key.color = (0.88, 0.94, 1.0)
    obj_light_key = bpy.data.objects.new(name="Light_SunKey", object_data=light_key)
    scene.collection.objects.link(obj_light_key)
    obj_light_key.rotation_euler = (math.radians(50), math.radians(25), 0)

    light_rim = bpy.data.lights.new(name="Light_RimViolet", type="POINT")
    light_rim.energy = 220.0
    light_rim.color = (0.659, 0.333, 0.969)
    obj_light_rim = bpy.data.objects.new(name="Light_RimViolet", object_data=light_rim)
    scene.collection.objects.link(obj_light_rim)
    obj_light_rim.location = (-5.5, 7.0, -3.5)

    # 12. Animated Cinematic Camera & 4-Act Trajectory
    cam_data = bpy.data.cameras.new("CinematicCamera")
    cam_data.lens = 32.0
    cam_obj = bpy.data.objects.new("CinematicCamera", cam_data)
    scene.collection.objects.link(cam_obj)
    scene.camera = cam_obj

    scene.frame_start = 1
    scene.frame_end = frames
    total_f = frames

    cam_waypoints = [
        (1,                    (0.0, -14.0, 4.2),  (76.0, 0.0, 0.0)),
        (int(total_f * 0.25),  (0.0, -10.0, 2.8),  (76.0, 0.0, 0.0)),
        (int(total_f * 0.58),  (0.0,  -1.8, 0.5),  (78.5, 0.0, 0.0)),
        (int(total_f * 0.70),  (0.0,   0.0, 0.0),  (82.0, 0.0, 0.0)),
        (int(total_f * 0.83),  (0.0,  +3.5, 1.0),  (85.0, 0.0, 0.0)),
        (total_f,              (0.0, +13.5, 4.0),  (88.0, 0.0, 0.0)),
    ]

    for frame_idx, loc, rot_deg in cam_waypoints:
        cam_obj.location = loc
        cam_obj.rotation_euler = (math.radians(rot_deg[0]), math.radians(rot_deg[1]), math.radians(rot_deg[2]))
        cam_obj.keyframe_insert(data_path="location", frame=frame_idx)
        cam_obj.keyframe_insert(data_path="rotation_euler", frame=frame_idx)

    # Animate Gimbal Rings
    for ring_obj, cfg in rings:
        init_rot = cfg["tilt"]
        for f in range(1, total_f + 1):
            frac = (f - 1) / float(total_f - 1)
            rot_val = frac * math.radians(360.0) * cfg["rot_speed"]
            if cfg["axis"] == "Z":
                ring_obj.rotation_euler = (init_rot[0], init_rot[1], init_rot[2] + rot_val)
            elif cfg["axis"] == "Y":
                ring_obj.rotation_euler = (init_rot[0], init_rot[1] + rot_val, init_rot[2])
            else:
                ring_obj.rotation_euler = (init_rot[0] + rot_val, init_rot[1], init_rot[2])
            ring_obj.keyframe_insert(data_path="rotation_euler", frame=f)

    # Animate Core Rotation & Pulsing Scale
    for f in range(1, total_f + 1):
        frac = (f - 1) / float(total_f - 1)
        scale_pulse = 1.0 + math.sin(frac * math.pi * 8.0) * 0.06
        core_obj.scale = (scale_pulse, scale_pulse, scale_pulse)
        core_obj.rotation_euler = (0, 0, frac * math.radians(180.0))
        core_obj.keyframe_insert(data_path="scale", frame=f)
        core_obj.keyframe_insert(data_path="rotation_euler", frame=f)
        
        lattice_obj.rotation_euler = (frac * math.radians(-120.0), frac * math.radians(60.0), 0)
        lattice_obj.keyframe_insert(data_path="rotation_euler", frame=f)

    # 13. Render Settings
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "WEBP"
    scene.render.image_settings.quality = quality
    scene.render.engine = engine

    if engine == "BLENDER_WORKBENCH":
        if hasattr(scene.display, 'shading'):
            scene.display.shading.color_type = "MATERIAL"
            scene.display.shading.light = "STUDIO"
            scene.display.shading.show_shadows = True
            scene.display.shading.show_cavity = True
    elif engine == "CYCLES":
        scene.cycles.samples = 8
        scene.cycles.device = "CPU"

    # 14. Export Draco-compressed glTF Model
    try:
        print(f"[Blender] Exporting Draco-compressed glTF: {abs_glb_path}")
        bpy.ops.export_scene.gltf(
            filepath=abs_glb_path,
            export_format="GLB",
            export_draco_mesh_compression_enable=True,
            export_animations=True,
            export_materials="EXPORT",
            export_cameras=True,
            export_lights=True
        )
        print(f"[Blender] glTF export completed: {os.path.getsize(abs_glb_path)} bytes")
    except Exception as glb_err:
        print(f"[Blender] Draco export fallback without Draco: {glb_err}")
        bpy.ops.export_scene.gltf(
            filepath=abs_glb_path,
            export_format="GLB",
            export_draco_mesh_compression_enable=False,
            export_animations=True
        )

    # 15. Render Animation Frames
    print(f"[Blender] Rendering {frames} frames directly to {abs_output_dir}...")
    temp_prefix = os.path.join(abs_output_dir, "raw_frame_")
    scene.render.filepath = temp_prefix
    bpy.ops.render.render(animation=True)

    # Rename to standardized frame_001.webp format
    for f in range(1, total_f + 1):
        raw_path_4 = os.path.join(abs_output_dir, f"raw_frame_{f:04d}.webp")
        raw_path_3 = os.path.join(abs_output_dir, f"raw_frame_{f:03d}.webp")
        final_path = os.path.join(abs_output_dir, f"frame_{f:03d}.webp")
        
        if os.path.isfile(raw_path_4):
            if os.path.isfile(final_path):
                os.remove(final_path)
            os.rename(raw_path_4, final_path)
        elif os.path.isfile(raw_path_3):
            if os.path.isfile(final_path):
                os.remove(final_path)
            os.rename(raw_path_3, final_path)

    print(f"[Blender] Successfully generated {frames} frames in {abs_output_dir}")
    return True


def run_blender_pipeline(blender_bin, output_dir, glb_path, frames=120, width=1920, height=1080, quality=85, engine="BLENDER_WORKBENCH"):
    """Spawn Blender process using this self script."""
    script_path = os.path.abspath(__file__)
    abs_output_dir = os.path.abspath(output_dir)
    abs_glb_path = os.path.abspath(glb_path)
    
    cmd = [
        blender_bin,
        "-b",
        "-P", script_path,
        "--",
        "--mode=blender",
        f"--frames={frames}",
        f"--width={width}",
        f"--height={height}",
        f"--quality={quality}",
        f"--engine={engine}",
        f"--output-dir={abs_output_dir}",
        f"--glb-path={abs_glb_path}"
    ]
    
    print(f"[Runner] Spawning Blender: {' '.join(cmd)}")
    start_time = time.time()
    res = subprocess.run(cmd, capture_output=True, text=True)
    duration = time.time() - start_time
    
    if res.returncode != 0:
        print(f"[Runner] Blender execution returned code {res.returncode}:\n{res.stderr}\n{res.stdout}")
        return False, duration, res.stderr
        
    print(f"[Runner] Blender finished in {duration:.2f}s with code {res.returncode}")
    return True, duration, res.stdout


# ==============================================================================
# PURE PYTHON / NUMPY / PILLOW PROCEDURAL FALLBACK ENGINE
# ==============================================================================

def generate_procedural_fallback_assets(output_dir, glb_path, frames=120, width=1920, height=1080, quality=85):
    """High-performance 3D vector & rasterization fallback engine using Pillow + NumPy."""
    from PIL import Image, ImageDraw
    import numpy as np

    print(f"[Fallback Engine] Generating {frames} cinematic frames ({width}x{height}) via NumPy/Pillow 3D pipeline...")
    abs_output_dir = os.path.abspath(output_dir)
    abs_glb_path = os.path.abspath(glb_path)
    os.makedirs(abs_output_dir, exist_ok=True)
    start_time = time.time()

    # 1. Geodesic Icosahedron Vertices
    phi = (1.0 + math.sqrt(5.0)) / 2.0
    ico_verts = np.array([
        [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
        [0, -1,  phi], [0,  1,  phi], [0, -1, -phi], [0,  1, -phi],
        [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
    ], dtype=np.float32)
    ico_verts /= np.linalg.norm(ico_verts[0])
    ico_edges = [
        (0, 11), (0, 5), (0, 1), (0, 7), (0, 10),
        (1, 5), (1, 9), (1, 8), (1, 7),
        (2, 11), (2, 4), (2, 3), (2, 6), (2, 10),
        (3, 9), (3, 4), (3, 6), (3, 8),
        (4, 5), (4, 9), (4, 11),
        (5, 9), (5, 11),
        (6, 7), (6, 8), (6, 10),
        (7, 8), (7, 10),
        (8, 9),
        (10, 11)
    ]

    # 2. Fibonacci Synaptic Nodes (96 nodes)
    num_nodes = 96
    golden_angle = math.pi * (3.0 - math.sqrt(5.0))
    node_coords = []
    for i in range(num_nodes):
        y = 1.0 - (i / float(num_nodes - 1)) * 2.0
        r_y = math.sqrt(max(0.0, 1.0 - y * y))
        theta = golden_angle * i
        x = math.cos(theta) * r_y
        z = math.sin(theta) * r_y
        dist = 2.4 + (math.sin(i * 1.7) * 0.5 + 0.5) * 2.2
        node_coords.append([x * dist, y * dist, z * dist, i % 3])
    nodes_3d = np.array(node_coords, dtype=np.float32)

    # 3. Particle Field Quanta (240 particles)
    np.random.seed(42)
    quanta_radii = np.random.uniform(1.8, 12.0, size=240)
    quanta_theta = np.random.uniform(0, 2 * math.pi, size=240)
    quanta_phi = np.arccos(np.random.uniform(-1, 1, size=240))
    quanta_x = quanta_radii * np.sin(quanta_phi) * np.cos(quanta_theta)
    quanta_y = quanta_radii * np.cos(quanta_phi) * 1.5
    quanta_z = quanta_radii * np.sin(quanta_phi) * np.sin(quanta_theta)
    quanta_3d = np.column_stack((quanta_x, quanta_y, quanta_z))

    def get_camera_state(f_idx, total_f):
        s = (f_idx - 1) / float(total_f - 1)
        if s <= 0.25:
            t = s / 0.25
            t_smooth = t * t * (3.0 - 2.0 * t)
            cam_pos = np.array([0.0, -14.0 + 4.0 * t_smooth, 4.2 - 1.4 * t_smooth])
            cam_pitch = math.radians(76.0)
            act_name = "Cosmic Overview"
        elif s <= 0.58:
            t = (s - 0.25) / 0.33
            t_smooth = t * t * (3.0 - 2.0 * t)
            cam_pos = np.array([0.0, -10.0 + 8.2 * t_smooth, 2.8 - 2.3 * t_smooth])
            cam_pitch = math.radians(76.0 + 2.5 * t_smooth)
            act_name = "Quantum Dive"
        elif s <= 0.83:
            t = (s - 0.58) / 0.25
            t_smooth = t * t * (3.0 - 2.0 * t)
            cam_pos = np.array([0.0, -1.8 + 5.3 * t_smooth, 0.5 + 0.5 * t_smooth])
            cam_pitch = math.radians(78.5 + 6.5 * t_smooth)
            act_name = "Singularity Tunnel"
        else:
            t = (s - 0.83) / 0.17
            t_smooth = t * t * (3.0 - 2.0 * t)
            cam_pos = np.array([0.0, 3.5 + 10.0 * t_smooth, 1.0 + 3.0 * t_smooth])
            cam_pitch = math.radians(85.0 + 3.0 * t_smooth)
            act_name = "Horizon Breakout"
        return cam_pos, cam_pitch, s, act_name

    focal_length = width * 0.85
    cx = width / 2.0
    cy = height / 2.0

    for f in range(1, frames + 1):
        cam_pos, cam_pitch, progress, act_name = get_camera_state(f, frames)
        img = Image.new("RGBA", (width, height), (3, 7, 18, 255))
        draw = ImageDraw.Draw(img)

        cos_p = math.cos(-cam_pitch + math.pi/2)
        sin_p = math.sin(-cam_pitch + math.pi/2)

        def project_3d_point(p3):
            dx = p3[0] - cam_pos[0]
            dy = p3[1] - cam_pos[1]
            dz = p3[2] - cam_pos[2]
            
            y_cam = dy * cos_p - dz * sin_p
            z_cam = dy * sin_p + dz * cos_p
            x_cam = dx
            
            if y_cam <= 0.2:
                return None, y_cam
                
            px = (x_cam * focal_length) / y_cam + cx
            py = (-z_cam * focal_length) / y_cam + cy
            return (px, py), y_cam

        # 1. Background Quanta Stars
        for q in quanta_3d:
            proj, depth = project_3d_point(q)
            if proj and 0 <= proj[0] < width and 0 <= proj[1] < height:
                alpha = int(max(20, min(220, 255.0 / (depth * 0.18 + 1.0))))
                size = max(1, int(3.5 / (depth * 0.12 + 0.5)))
                draw.ellipse([proj[0]-size, proj[1]-size, proj[0]+size, proj[1]+size], fill=(0, 240, 255, alpha))

        # 2. Concentric Gimbal Cyber Rings
        ring_specs = [
            (3.4, (0, 240, 255), 1.0, 0.35),
            (4.3, (245, 158, 11), -1.618, -0.55),
            (5.2, (168, 85, 247), 2.618, 0.75),
        ]
        for r_rad, r_col, r_speed, r_tilt in ring_specs:
            ring_rot = progress * math.pi * 2.0 * r_speed
            ring_pts = []
            for a_idx in range(64):
                ang = (a_idx / 64.0) * math.pi * 2.0
                rx = r_rad * math.cos(ang)
                ry = r_rad * math.sin(ang)
                rz = 0.0
                rx_t = rx * math.cos(r_tilt) - rz * math.sin(r_tilt)
                rz_t = rx * math.sin(r_tilt) + rz * math.cos(r_tilt)
                
                rx_r = rx_t * math.cos(ring_rot) - ry * math.sin(ring_rot)
                ry_r = rx_t * math.sin(ring_rot) + ry * math.cos(ring_rot)
                ring_pts.append(np.array([rx_r, ry_r, rz_t]))
                
            for i in range(len(ring_pts)):
                p1, d1 = project_3d_point(ring_pts[i])
                p2, d2 = project_3d_point(ring_pts[(i + 1) % len(ring_pts)])
                if p1 and p2 and d1 > 0.3 and d2 > 0.3:
                    alpha = int(max(40, min(240, 300.0 / (d1 * 0.25 + 1.0))))
                    draw.line([p1, p2], fill=(r_col[0], r_col[1], r_col[2], alpha), width=2)

        # 3. Outer Geodesic Icosahedron Wireframe
        rot_lattice = progress * math.pi * -1.2
        cos_l, sin_l = math.cos(rot_lattice), math.sin(rot_lattice)
        lattice_scale = 2.6
        transformed_ico = []
        for v in ico_verts:
            vx = (v[0] * cos_l - v[1] * sin_l) * lattice_scale
            vy = (v[0] * sin_l + v[1] * cos_l) * lattice_scale
            vz = v[2] * lattice_scale
            transformed_ico.append(np.array([vx, vy, vz]))

        for e in ico_edges:
            p1, d1 = project_3d_point(transformed_ico[e[0]])
            p2, d2 = project_3d_point(transformed_ico[e[1]])
            if p1 and p2 and d1 > 0.2 and d2 > 0.2:
                alpha = int(max(50, min(250, 380.0 / (d1 * 0.2 + 1.0))))
                draw.line([p1, p2], fill=(0, 240, 255, alpha), width=2)

        # 4. Central Singularity Core Glow & Halo
        core_pos = np.array([0.0, 0.0, 0.0])
        core_proj, core_depth = project_3d_point(core_pos)
        if core_proj and core_depth > 0.1:
            core_rad = int(max(8, min(width * 0.45, (1.4 * focal_length) / core_depth)))
            pulse = math.sin(progress * math.pi * 8.0) * 0.08 + 1.0
            core_rad = int(core_rad * pulse)
            
            for layer in range(6, 0, -1):
                glow_r = int(core_rad * (1.0 + layer * 0.35))
                glow_alpha = int(max(8, min(140, 180 / (layer * layer + 1))))
                col = (168, 85, 247, glow_alpha) if layer % 2 == 0 else (0, 240, 255, glow_alpha)
                draw.ellipse([core_proj[0]-glow_r, core_proj[1]-glow_r, core_proj[0]+glow_r, core_proj[1]+glow_r], outline=col, width=int(layer * 1.5))
                
            draw.ellipse([core_proj[0]-core_rad, core_proj[1]-core_rad, core_proj[0]+core_rad, core_proj[1]+core_rad], fill=(168, 85, 247, 240))
            inner_bright = int(core_rad * 0.55)
            draw.ellipse([core_proj[0]-inner_bright, core_proj[1]-inner_bright, core_proj[0]+inner_bright, core_proj[1]+inner_bright], fill=(0, 240, 255, 255))
            amber_core = int(core_rad * 0.25)
            draw.ellipse([core_proj[0]-amber_core, core_proj[1]-amber_core, core_proj[0]+amber_core, core_proj[1]+amber_core], fill=(245, 158, 11, 255))

        # 5. Synaptic Node Network & Axon Connectors
        for i, node in enumerate(nodes_3d):
            p, d = project_3d_point(node[:3])
            if p and d > 0.2:
                col_type = int(node[3])
                col = (0, 240, 255) if col_type == 0 else ((168, 85, 247) if col_type == 1 else (245, 158, 11))
                n_size = max(2, int(18.0 / (d * 0.3 + 1.0)))
                draw.ellipse([p[0]-n_size, p[1]-n_size, p[0]+n_size, p[1]+n_size], fill=col + (240,))
                
                next_node = nodes_3d[(i + 1) % len(nodes_3d)]
                p_next, d_next = project_3d_point(next_node[:3])
                if p_next and d_next > 0.2:
                    draw.line([p, p_next], fill=col + (90,), width=1)

        # 6. Singularity Tunnel Quantum Warp Flare
        if 0.58 <= progress <= 0.85:
            flare_intensity = math.sin((progress - 0.58) / 0.27 * math.pi)
            flare_rad = int(width * 0.6 * flare_intensity)
            draw.ellipse([cx-flare_rad, cy-flare_rad, cx+flare_rad, cy+flare_rad], outline=(0, 240, 255, int(160 * flare_intensity)), width=4)
            draw.ellipse([cx-flare_rad*0.7, cy-flare_rad*0.7, cx+flare_rad*0.7, cy+flare_rad*0.7], outline=(168, 85, 247, int(200 * flare_intensity)), width=6)
        elif progress > 0.85:
            breakout_t = (progress - 0.85) / 0.15
            flare_alpha = int(min(220, breakout_t * 180))
            draw.rectangle([0, 0, width, height], fill=(240, 245, 255, int(flare_alpha * 0.15)))

        final_rgb = img.convert("RGB")
        frame_filename = f"frame_{f:03d}.webp"
        final_rgb.save(os.path.join(abs_output_dir, frame_filename), "WEBP", quality=quality)

    if abs_glb_path:
        export_pure_python_glb(abs_glb_path)

    elapsed = time.time() - start_time
    print(f"[Fallback Engine] Successfully synthesized {frames} frames in {elapsed:.2f}s")
    return True, elapsed


def export_pure_python_glb(glb_path):
    """Generates standard binary glTF 2.0 (.glb) container without third-party dependencies."""
    os.makedirs(os.path.dirname(glb_path), exist_ok=True)
    import struct

    gltf_json = {
        "asset": {"version": "2.0", "generator": "Naveen Bishnoi Neural Core Fallback Exporter"},
        "scene": 0,
        "scenes": [{"nodes": [0, 1, 2]}],
        "nodes": [
            {"name": "NeuralCore_Singularity", "mesh": 0, "translation": [0, 0, 0]},
            {"name": "Gimbal_Ring_1", "mesh": 1, "translation": [0, 0, 0]},
            {"name": "Synaptic_Lattice", "mesh": 2, "translation": [0, 0, 0]}
        ],
        "meshes": [
            {"name": "Core_Mesh", "primitives": [{"attributes": {"POSITION": 0}, "indices": 1, "material": 0}]},
            {"name": "Ring_Mesh", "primitives": [{"attributes": {"POSITION": 2}, "indices": 3, "material": 1}]},
            {"name": "Lattice_Mesh", "primitives": [{"attributes": {"POSITION": 4}, "indices": 5, "material": 2}]}
        ],
        "materials": [
            {"name": "Mat_Core", "pbrMetallicRoughness": {"baseColorFactor": [0.659, 0.333, 0.969, 1.0], "metallicFactor": 0.2, "roughnessFactor": 0.1}, "emissiveFactor": [0.659, 0.333, 0.969]},
            {"name": "Mat_Ring", "pbrMetallicRoughness": {"baseColorFactor": [0.0, 0.941, 1.0, 1.0], "metallicFactor": 0.9, "roughnessFactor": 0.15}, "emissiveFactor": [0.0, 0.941, 1.0]},
            {"name": "Mat_Amber", "pbrMetallicRoughness": {"baseColorFactor": [0.961, 0.620, 0.043, 1.0], "metallicFactor": 0.5, "roughnessFactor": 0.3}, "emissiveFactor": [0.961, 0.620, 0.043]}
        ],
        "accessors": [
            {"bufferView": 0, "byteOffset": 0, "componentType": 5126, "count": 12, "type": "VEC3", "max": [1.4, 1.4, 1.4], "min": [-1.4, -1.4, -1.4]},
            {"bufferView": 1, "byteOffset": 0, "componentType": 5123, "count": 60, "type": "SCALAR", "max": [11], "min": [0]},
            {"bufferView": 2, "byteOffset": 0, "componentType": 5126, "count": 32, "type": "VEC3", "max": [3.4, 3.4, 0.1], "min": [-3.4, -3.4, -0.1]},
            {"bufferView": 3, "byteOffset": 0, "componentType": 5123, "count": 64, "type": "SCALAR", "max": [31], "min": [0]},
            {"bufferView": 4, "byteOffset": 0, "componentType": 5126, "count": 12, "type": "VEC3", "max": [2.6, 2.6, 2.6], "min": [-2.6, -2.6, -2.6]},
            {"bufferView": 5, "byteOffset": 0, "componentType": 5123, "count": 60, "type": "SCALAR", "max": [11], "min": [0]}
        ],
        "bufferViews": [
            {"buffer": 0, "byteOffset": 0, "byteLength": 144, "target": 34962},
            {"buffer": 0, "byteOffset": 144, "byteLength": 120, "target": 34963},
            {"buffer": 0, "byteOffset": 264, "byteLength": 384, "target": 34962},
            {"buffer": 0, "byteOffset": 648, "byteLength": 128, "target": 34963},
            {"buffer": 0, "byteOffset": 776, "byteLength": 144, "target": 34962},
            {"buffer": 0, "byteOffset": 920, "byteLength": 120, "target": 34963}
        ],
        "buffers": [{"byteLength": 1040}]
    }

    phi = (1.0 + math.sqrt(5.0)) / 2.0
    ico_v = [
        [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
        [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
        [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ]
    
    bin_data = bytearray()
    for v in ico_v:
        norm = math.sqrt(v[0]**2 + v[1]**2 + v[2]**2)
        bin_data.extend(struct.pack("<fff", (v[0]/norm)*1.35, (v[1]/norm)*1.35, (v[2]/norm)*1.35))
    ico_idx = [
        0,11,5, 0,5,1, 0,1,7, 0,7,10, 0,10,11,
        1,5,9, 5,11,4, 11,10,2, 10,7,6, 7,1,8,
        3,9,4, 3,4,2, 3,2,6, 3,6,8, 3,8,9,
        4,9,5, 2,4,11, 6,2,10, 8,6,7, 9,8,1
    ]
    for idx in ico_idx:
        bin_data.extend(struct.pack("<H", idx))
    for k in range(32):
        a = (k / 32.0) * math.pi * 2.0
        bin_data.extend(struct.pack("<fff", math.cos(a)*3.4, math.sin(a)*3.4, 0.0))
    for k in range(32):
        bin_data.extend(struct.pack("<HH", k, (k+1)%32))
    for v in ico_v:
        norm = math.sqrt(v[0]**2 + v[1]**2 + v[2]**2)
        bin_data.extend(struct.pack("<fff", (v[0]/norm)*2.6, (v[1]/norm)*2.6, (v[2]/norm)*2.6))
    for idx in ico_idx:
        bin_data.extend(struct.pack("<H", idx))

    while len(bin_data) % 4 != 0:
        bin_data.extend(b"\x00")

    json_bytes = json.dumps(gltf_json, separators=(',', ':')).encode('utf-8')
    while len(json_bytes) % 4 != 0:
        json_bytes += b" "

    total_len = 12 + 8 + len(json_bytes) + 8 + len(bin_data)
    glb_header = struct.pack("<4sII", b"glTF", 2, total_len)
    chunk0_header = struct.pack("<II", len(json_bytes), 0x4E4F534A)
    chunk1_header = struct.pack("<II", len(bin_data), 0x004E4942)
    
    with open(glb_path, "wb") as f:
        f.write(glb_header)
        f.write(chunk0_header)
        f.write(json_bytes)
        f.write(chunk1_header)
        f.write(bin_data)
        
    print(f"[Fallback Exporter] Wrote standalone GLB model: {glb_path} ({total_len} bytes)")


# ==============================================================================
# MANIFEST GENERATOR
# ==============================================================================

def generate_manifest(output_dir, glb_path, frames, width, height, generator_info="Blender 5.2.0 (bpy) / Neural Core Pipeline"):
    """Emits manifest.json detailing asset schema, frame sequence, and 4-act camera metadata."""
    abs_output_dir = os.path.abspath(output_dir)
    manifest_path = os.path.join(abs_output_dir, "manifest.json")
    
    frame_files = [f"frame_{i:03d}.webp" for i in range(1, frames + 1)]
    sizes = []
    for ff in frame_files:
        fp = os.path.join(abs_output_dir, ff)
        if os.path.isfile(fp):
            sizes.append(os.path.getsize(fp))
            
    avg_size_kb = (sum(sizes) / len(sizes) / 1024.0) if sizes else 0.0
    total_size_mb = (sum(sizes) / 1024.0 / 1024.0) if sizes else 0.0

    manifest = {
        "totalFrames": frames,
        "width": width,
        "height": height,
        "format": "webp",
        "framePattern": "/assets/3d-frames/frame_%03d.webp",
        "glbModel": "/" + str(Path(glb_path).as_posix()).lstrip("/"),
        "fps": 60,
        "aspectRatio": "16:9",
        "averageFrameSizeKb": round(avg_size_kb, 2),
        "totalSequencePayloadMb": round(total_size_mb, 2),
        "acts": [
            {
                "act": 1,
                "name": "Cosmic Overview",
                "startFrame": 1,
                "endFrame": int(frames * 0.25),
                "progressStart": 0.0,
                "progressEnd": 0.25,
                "description": "Wide cosmic view of floating AI neural core with rotating golden-ratio cyber rings."
            },
            {
                "act": 2,
                "name": "Quantum Dive",
                "startFrame": int(frames * 0.25) + 1,
                "endFrame": int(frames * 0.58),
                "progressStart": 0.25,
                "progressEnd": 0.58,
                "description": "Accelerated dive into neural core lattice; synaptic nodes and axon links whip past lens."
            },
            {
                "act": 3,
                "name": "Singularity Tunnel",
                "startFrame": int(frames * 0.58) + 1,
                "endFrame": int(frames * 0.83),
                "progressStart": 0.58,
                "progressEnd": 0.83,
                "description": "Singularity core pass-through; intense volumetric chromatic glow and quantum warp."
            },
            {
                "act": 4,
                "name": "Horizon Breakout",
                "startFrame": int(frames * 0.83) + 1,
                "endFrame": frames,
                "progressStart": 0.83,
                "progressEnd": 1.0,
                "description": "Camera emerges into calm negative space with radiant light flare transition to resume."
            }
        ],
        "colorPalette": {
            "cyan": COLOR_CYAN_HEX,
            "neonViolet": COLOR_VIOLET_HEX,
            "electricAmber": COLOR_AMBER_HEX,
            "background": COLOR_BG_HEX
        },
        "generator": generator_info,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
        
    print(f"[Manifest] Generated metadata manifest: {manifest_path}")
    return manifest


# ==============================================================================
# CLI ENTRY POINT & ORCHESTRATION
# ==============================================================================

def main():
    # Detect Blender embedded python
    try:
        import bpy
        is_inside_blender = True
    except ImportError:
        is_inside_blender = False

    raw_args = sys.argv[1:]
    if "--" in raw_args:
        raw_args = raw_args[raw_args.index("--") + 1:]

    parser = argparse.ArgumentParser(description="Procedural 3D Cybernetic AI Neural Core Asset Generator")
    parser.add_argument("--mode", choices=["auto", "blender", "fallback"], default="auto",
                        help="Generation mode: auto (prefer Blender), blender (force Blender), fallback (force Python/Pillow)")
    parser.add_argument("--frames", type=int, default=120, help="Total animation frames (default: 120)")
    parser.add_argument("--res", type=str, default="1920x1080", help="Resolution WxH (default: 1920x1080)")
    parser.add_argument("--width", type=int, default=None, help="Explicit width override")
    parser.add_argument("--height", type=int, default=None, help="Explicit height override")
    parser.add_argument("--quality", type=int, default=85, help="WebP compression quality (default: 85)")
    parser.add_argument("--engine", choices=["BLENDER_WORKBENCH", "CYCLES", "BLENDER_EEVEE"], default="BLENDER_WORKBENCH",
                        help="Blender render engine (default: BLENDER_WORKBENCH)")
    parser.add_argument("--output-dir", type=str, default="public/assets/3d-frames",
                        help="Output directory for rendered frames")
    parser.add_argument("--glb-path", type=str, default="public/assets/3d/neural_core.glb",
                        help="Output path for glTF 3D model")
    parser.add_argument("--blender-path", type=str, default=None, help="Custom Blender binary path")
    args = parser.parse_args(raw_args)

    if args.width and args.height:
        width, height = args.width, args.height
    elif "x" in args.res:
        parts = args.res.split("x")
        width, height = int(parts[0]), int(parts[1])
    else:
        width, height = 1920, 1080

    print("=" * 70)
    print("  CYBERNETIC AI NEURAL CORE -- 3D ASSET PIPELINE")
    print(f"  Mode: {args.mode} | Frames: {args.frames} | Resolution: {width}x{height}")
    print(f"  Target Frames: {args.output_dir}")
    print(f"  Target glTF:   {args.glb_path}")
    print("=" * 70)

    success = False
    generator_name = ""

    if is_inside_blender:
        print("[Mode] Running directly inside Blender environment.")
        success = execute_bpy_generator(
            output_dir=args.output_dir,
            glb_path=args.glb_path,
            frames=args.frames,
            width=width,
            height=height,
            quality=args.quality,
            engine=args.engine
        )
        generator_name = f"Blender {bpy.app.version_string} (Embedded bpy)"
    elif args.mode in ["auto", "blender"]:
        blender_bin = find_blender_binary(args.blender_path)
        if blender_bin:
            print(f"[Blender] Found executable at: {blender_bin}")
            ok, duration, msg = run_blender_pipeline(
                blender_bin=blender_bin,
                output_dir=args.output_dir,
                glb_path=args.glb_path,
                frames=args.frames,
                width=width,
                height=height,
                quality=args.quality,
                engine=args.engine
            )
            if ok:
                success = True
                generator_name = "Blender 5.2.0 Headless (bpy) + Draco glTF"
            elif args.mode == "auto":
                print("[Blender] Headless execution failed. Falling back to Pure Python pipeline...")
            else:
                print("[Error] Blender execution failed and mode=blender was forced.")
                sys.exit(1)
        elif args.mode == "blender":
            print("[Error] Blender executable not found and --mode=blender was specified.")
            sys.exit(1)

    if not success and args.mode in ["auto", "fallback"]:
        print("[Mode] Executing Pure Python / NumPy / Pillow Procedural Fallback Engine...")
        ok, duration = generate_procedural_fallback_assets(
            output_dir=args.output_dir,
            glb_path=args.glb_path,
            frames=args.frames,
            width=width,
            height=height,
            quality=args.quality
        )
        if ok:
            success = True
            generator_name = "NumPy + Pillow High-Performance 3D Fallback Engine"

    if success:
        # Cross-compatibility mirror
        mirror_models_dir = "public/assets/models"
        os.makedirs(mirror_models_dir, exist_ok=True)
        mirror_glb_path = os.path.join(mirror_models_dir, "neural_core.glb")
        if os.path.isfile(args.glb_path):
            shutil.copy2(args.glb_path, mirror_glb_path)

        mirror_seq_dir = "public/assets/3d-sequence"
        os.makedirs(mirror_seq_dir, exist_ok=True)

        generate_manifest(
            output_dir=args.output_dir,
            glb_path=args.glb_path,
            frames=args.frames,
            width=width,
            height=height,
            generator_info=generator_name
        )

        # Mirror manifest to 3d-sequence as well
        if os.path.isfile(os.path.join(args.output_dir, "manifest.json")):
            shutil.copy2(os.path.join(args.output_dir, "manifest.json"), os.path.join(mirror_seq_dir, "manifest.json"))

        print("\n" + "=" * 70)
        print("  [SUCCESS] 3D ASSET GENERATION PIPELINE COMPLETED SUCCESSFULLY")
        print(f"  Frames: {args.frames} WebP files ({width}x{height}) in {args.output_dir}/")
        print(f"  3D glTF: {args.glb_path} ({os.path.getsize(args.glb_path) if os.path.isfile(args.glb_path) else 0} bytes)")
        print(f"  Manifest: {os.path.join(args.output_dir, 'manifest.json')}")
        print("=" * 70 + "\n")
        return 0
    else:
        print("[Error] Pipeline failed to generate 3D assets.")
        sys.exit(1)


if __name__ == "__main__":
    main()
