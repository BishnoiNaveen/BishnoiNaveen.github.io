import bpy
import sys

print("=== BLENDER PROBE ===")
print("Blender version:", bpy.app.version_string)
print("Python version:", sys.version)
print("Engines:", bpy.types.RenderEngine.__subclasses__())
print("Scene render engine default:", bpy.context.scene.render.engine)
print("Image formats supported:", [item.identifier for item in bpy.types.RenderSettings.bl_rna.properties['image_settings'].fixed_type.properties['file_format'].enum_items])
print("=== END PROBE ===")
