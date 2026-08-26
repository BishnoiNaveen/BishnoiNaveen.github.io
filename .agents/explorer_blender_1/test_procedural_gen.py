import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import os
import time

def render_procedural_frame(frame_idx, total_frames, width=960, height=540):
    t = frame_idx / max(1, total_frames - 1) # 0.0 to 1.0 (scroll progress)
    
    # 1. Dark canvas with subtle gradient
    img = Image.new("RGBA", (width, height), (8, 8, 10, 255)) # Match portfolio dark canvas #08080A
    draw = ImageDraw.Draw(img)
    
    cx, cy = width / 2, height / 2
    
    # Camera trajectory:
    # t=0.0 -> wide overview (zoom 1.0)
    # t=0.5 -> dive into core (zoom 4.5)
    # t=0.75 -> core pass-through (zoom 9.0)
    # t=1.0 -> pull-out / reveal into clean space
    
    if t < 0.5:
        zoom = 1.0 + (t / 0.5) ** 2 * 3.5
        fade = 1.0
    elif t < 0.75:
        prog = (t - 0.5) / 0.25
        zoom = 4.5 + prog * 4.5
        fade = 1.0 - prog * 0.4
    else:
        prog = (t - 0.75) / 0.25
        zoom = 9.0 + prog * 5.0
        fade = 0.6 * (1.0 - prog)
    
    # Draw ambient background aura
    aura_radius = int(220 * zoom * (0.8 + 0.2 * math.sin(t * math.pi * 2)))
    if aura_radius > 10 and fade > 0.01:
        aura_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        aura_draw = ImageDraw.Draw(aura_img)
        # Deep royal blue to electric cyan glow
        aura_draw.ellipse(
            (cx - aura_radius, cy - aura_radius, cx + aura_radius, cy + aura_radius),
            fill=(0, 113, 227, int(45 * fade))
        )
        aura_img = aura_img.filter(ImageFilter.GaussianBlur(radius=int(min(60, aura_radius * 0.3))))
        img = Image.alpha_composite(img, aura_img)
        draw = ImageDraw.Draw(img)
    
    # 2. Draw 3D Synaptic Nodes & Neural Connections
    np.random.seed(42)
    num_nodes = 80
    
    # Generate 3D sphere points (Fibonacci distribution)
    phi = math.pi * (math.sqrt(5.0) - 1.0) # golden angle
    nodes_3d = []
    for i in range(num_nodes):
        y = 1 - (i / float(num_nodes - 1)) * 2
        radius = math.sqrt(1 - y * y)
        theta = phi * i
        x = math.cos(theta) * radius
        z = math.sin(theta) * radius
        r_scale = 140 + 30 * math.sin(i * 0.5 + t * 4)
        nodes_3d.append((x * r_scale, y * r_scale, z * r_scale))
    
    # Rotation angle based on time/scroll
    rot_y = t * math.pi * 1.5
    rot_x = math.sin(t * math.pi) * 0.4
    
    projected = []
    for (x, y, z) in nodes_3d:
        # Rotate Y
        rx = x * math.cos(rot_y) + z * math.sin(rot_y)
        rz = -x * math.sin(rot_y) + z * math.cos(rot_y)
        # Rotate X
        ry = y * math.cos(rot_x) - rz * math.sin(rot_x)
        rz2 = y * math.sin(rot_x) + rz * math.cos(rot_x)
        
        # Camera distance
        cam_dist = 400.0 / zoom
        depth = rz2 + cam_dist
        if depth > 10:
            scale = 400.0 / depth
            px = cx + rx * scale
            py = cy + ry * scale
            projected.append((px, py, depth, scale))
    
    # Sort by depth (back to front)
    projected.sort(key=lambda p: p[2], reverse=True)
    
    # Draw connections between near nodes
    for i in range(len(projected)):
        for j in range(i + 1, min(i + 4, len(projected))):
            p1 = projected[i]
            p2 = projected[j]
            dist = math.hypot(p1[0] - p2[0], p1[1] - p2[1])
            if dist < 120 * (p1[3] + p2[3]) * 0.5:
                alpha = int(max(0, min(180, (1.0 - dist / (120 * (p1[3] + p2[3]) * 0.5)) * 120 * fade)))
                if alpha > 5:
                    draw.line([(p1[0], p1[1]), (p2[0], p2[1])], fill=(0, 210, 255, alpha), width=1)
    
    # Draw nodes
    for (px, py, depth, scale) in projected:
        node_r = max(1.5, min(8.0, 3.0 * scale))
        alpha = int(max(10, min(240, 200 * fade)))
        draw.ellipse((px - node_r, py - node_r, px + node_r, py + node_r), fill=(41, 151, 255, alpha))
        if scale > 1.2:
            glow_r = node_r * 2.0
            draw.ellipse((px - glow_r, py - glow_r, px + glow_r, py + glow_r), outline=(0, 245, 212, int(alpha * 0.4)), width=1)
    
    # 3. Central Core & Quantum Rings
    core_r = max(4.0, min(160.0, 45.0 * zoom * (0.9 + 0.1 * math.sin(t * 10))))
    if fade > 0.05:
        # Outer concentric cyber rings
        for ring_idx, (r_mult, tilt) in enumerate([(1.6, 0.4), (2.2, -0.6), (2.8, 0.8)]):
            ring_w = core_r * r_mult
            ring_h = ring_w * 0.35
            bbox = (cx - ring_w, cy - ring_h, cx + ring_w, cy + ring_h)
            ring_alpha = int(max(0, min(160, 120 * fade * (1.0 - ring_idx * 0.2))))
            draw.arc(bbox, start=int(t * 360 + ring_idx * 60), end=int(t * 360 + ring_idx * 60 + 260), fill=(0, 245, 212, ring_alpha), width=2)
            
        # Core glowing orb
        draw.ellipse((cx - core_r, cy - core_r, cx + core_r, cy + core_r), fill=(0, 113, 227, int(180 * fade)), outline=(0, 245, 212, int(220 * fade)), width=2)
    
    return img.convert("RGB")

# Test single frame render
t0 = time.time()
frame = render_procedural_frame(15, 60)
out_dir = os.path.abspath(".agents/explorer_blender_1/test_output")
frame_path = os.path.join(out_dir, "frame_procedural_0015.webp")
frame.save(frame_path, "WEBP", quality=85)
print(f"Standalone procedural frame rendered in {time.time() - t0:.3f}s -> {frame_path} ({os.path.getsize(frame_path)} bytes)")
