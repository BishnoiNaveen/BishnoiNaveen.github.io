import bpy
import math
import os
import time

# Clean scene
bpy.ops.wm.read_factory_settings(use_empty=True)

world = bpy.data.worlds.new("AI_World")
bpy.context.scene.world = world
bg_node = world.node_tree.nodes.get("Background")
if bg_node:
    bg_node.inputs[0].default_value = (0.01, 0.02, 0.04, 1.0)
    bg_node.inputs[1].default_value = 0.5

# Neural Core
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1.8, location=(0, 0, 0))
core = bpy.context.active_object
core.name = "AI_Neural_Core"

mat_core = bpy.data.materials.new(name="Mat_Neural_Core")
nodes = mat_core.node_tree.nodes
links = mat_core.node_tree.links
nodes.clear()

node_output = nodes.new(type='ShaderNodeOutputMaterial')
node_principled = nodes.new(type='ShaderNodeBsdfPrincipled')
node_principled.inputs['Base Color'].default_value = (0.05, 0.4, 0.9, 1.0)
node_principled.inputs['Roughness'].default_value = 0.15
node_principled.inputs['Metallic'].default_value = 0.8
node_principled.inputs['Emission Color'].default_value = (0.0, 0.6, 1.0, 1.0)
node_principled.inputs['Emission Strength'].default_value = 3.5

links.new(node_principled.outputs['BSDF'], node_output.inputs['Surface'])
core.data.materials.append(mat_core)

# Concentric Cyber Rings
for i, r in enumerate([2.6, 3.4, 4.2]):
    bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=0.03, location=(0,0,0))
    ring = bpy.context.active_object
    ring.name = f"Cyber_Ring_{i}"
    ring.rotation_euler = (math.radians(25 * (i+1)), math.radians(45 * i), 0)
    ring.data.materials.append(mat_core)

# Camera setup
bpy.ops.object.camera_add(location=(0, -12, 4), rotation=(math.radians(72), 0, 0))
camera = bpy.context.active_object
bpy.context.scene.camera = camera

scene = bpy.context.scene
scene.render.resolution_x = 960
scene.render.resolution_y = 540
scene.render.image_settings.file_format = 'WEBP'
scene.render.image_settings.quality = 85

# Test glTF export first
test_out_dir = os.path.abspath(".agents/explorer_blender_1/test_output")
os.makedirs(test_out_dir, exist_ok=True)
gltf_path = os.path.join(test_out_dir, "neural_core.glb")
t0 = time.time()
bpy.ops.export_scene.gltf(filepath=gltf_path, export_format='GLB')
print(f"GLTF export completed in {time.time() - t0:.2f}s -> {gltf_path}")

# Test Cycles CPU fast render (16 samples)
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 16
scene.cycles.use_denoising = False
scene.render.filepath = os.path.join(test_out_dir, "frame_cycles_0001.webp")

t0 = time.time()
print("Starting Cycles CPU render (16 samples)...")
bpy.ops.render.render(write_still=True)
print(f"Cycles render completed in {time.time() - t0:.2f}s -> {scene.render.filepath}")

# Test Workbench render (instant real-time)
scene.render.engine = 'BLENDER_WORKBENCH'
scene.render.filepath = os.path.join(test_out_dir, "frame_workbench_0001.webp")
t0 = time.time()
print("Starting Workbench render...")
bpy.ops.render.render(write_still=True)
print(f"Workbench render completed in {time.time() - t0:.2f}s -> {scene.render.filepath}")
