import requests
from flask import Flask, send_file, render_template, request, jsonify, make_response, send_from_directory, Response
from flask import render_template_string
from flask_cors import CORS
import json
import os
import io
import re
import time
import shutil
import zipfile
import uuid
import urllib3
from pathlib import Path
import logging
import base64
from urllib.parse import quote

# Silence InsecureRequestWarning for self-signed certificates
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Disable Flask/Werkzeug HTTP access logs (the GET/POST request logs)
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(BASE_DIR, 'static/js/device_library/roomTemplate.js')
ROOMS_DIR = os.path.join(BASE_DIR, 'static/js/main_layout')


def get_js_files(subdirectory):
    """Helper to list all .js files in a specific static/js subdirectory."""
    js_dir = os.path.join(app.static_folder, 'js', subdirectory)
    if not os.path.exists(js_dir):
        return []
    # Returns a list like ['box.js', 'container.js']
    files = [f for f in os.listdir(js_dir) if f.endswith('.js')]
    files = sorted(files, reverse=True)
    #return sorted(files)
    ##print(f"\n--- Loading JS files from: static/js/{subdirectory} ---")
    ##for f in files:
    ##    print(f"  > {f}")
    return files

@app.route('/log_functions', methods=['POST'])
def log_functions():
    data = request.json
    functions = data.get('functions', [])

    ##print("\n" + "="*40)
    ##print("JS FUNCTIONS EXECUTED IN BROWSER:")
    ##print("="*40)
    ##for func in functions:
    ##    print(f" -> [OK] {func}()")
    ##print("="*40 + "\n")

    return jsonify({"status": "success"})


@app.route('/')
def editor():
    # Gather lists for each folder
    # Note: Pass '' for the root static/js folder
    lib_files = get_js_files('device_library')
    layout_files = get_js_files('main_layout')
    editor_files = get_js_files('editor')
    root_js_files = get_js_files('') 

    return render_template('editor.html', 
                           lib_files=lib_files,
                           layout_files=layout_files,
                           editor_files=editor_files,
                           root_js_files=root_js_files)


@app.route('/add_room', methods=['POST'])
def add_room():
    data = request.json
    room_name = data.get('name', '').strip().lower()

    if not room_name:
        return jsonify({"error": "Name is required"}), 400

    new_filename = f"{room_name}room.js"
    target_path = os.path.join(ROOMS_DIR, new_filename)

    try:
        # Copy template to new file
        shutil.copy(TEMPLATE_PATH, target_path)

        # Replace the function name inside the new file
        with open(target_path, 'r') as f:
            content = f.read()

        updated_content = content.replace("function room() {", f"function {room_name}_room() {{")

        with open(target_path, 'w') as f:
            f.write(updated_content)

        return jsonify({"success": True, "file": new_filename})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/remove_room', methods=['POST'])
def remove_room():
    data = request.json
    filename = data.get('filename') # e.g., 'serverroom.js'

    target_path = os.path.join(ROOMS_DIR, filename)

    if os.path.exists(target_path):
        try:
            os.remove(target_path)
            return jsonify({"success": True})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "File not found"}), 404


@app.route('/api/tree')
def get_tree():
    MAIN_LAYOUT_DIR = Path(__file__).parent / 'static' / 'js' / 'main_layout'

    #print(f"MAIN_LAYOUT_DIR: {MAIN_LAYOUT_DIR.absolute()}")
    #print(f"Exists: {MAIN_LAYOUT_DIR.exists()}")

    tree = []
    if MAIN_LAYOUT_DIR.exists():
        for js_file in MAIN_LAYOUT_DIR.glob('*.js'):
            file_data = {'name': js_file.name[:-3], 'devices': []}
            content = js_file.read_text()
            const_pattern = r'const\s+(\w+)\s*=\s*(?!function)(?!class)[^;]+;?'
            matches = re.finditer(const_pattern, content, re.MULTILINE)

            for match in matches:
                var_name = match.group(1)
                if var_name != 'masterGroup':
                    file_data['devices'].append({'name': var_name})
            tree.append(file_data)

    #print(f"Tree data: {tree}")
    return jsonify(tree)

@app.route('/api/device_library')
def get_device_library():
    DEVICE_LIB_DIR = Path(__file__).parent / 'static' / 'js' / 'device_library'
    devices = []
    if DEVICE_LIB_DIR.exists():
        for js_file in sorted(DEVICE_LIB_DIR.glob('*.js')):
            if js_file.name != '__pycache__':  # Skip hidden
                # Clean filename for display (remove .js, title case)
                display_name = js_file.name[:-3]    # js_file.stem.replace('_', ' ').title()
                devices.append({
                    'filename': js_file.name,
                    'display': display_name
                })
    #print(f"Device library: {len(devices)} devices found")
    return jsonify(devices)


@app.route('/api/room_library')
def get_room_library():
    ROOM_LIB_DIR = Path(__file__).parent / 'static' / 'js' / 'main_layout'
    rooms = []
    if ROOM_LIB_DIR.exists():
        for js_file in sorted(ROOM_LIB_DIR.glob('*.js')):
            if js_file.name != '__pycache__':
                display_name = js_file.name[:-3]  # js_file.stem.replace('_', ' ').title() 
                rooms.append({
                    'filename': js_file.name,
                    'display': display_name
                })
    #print(f"Room library: {len(rooms)} rooms found")
    return jsonify(rooms)


                                                                                                                                            


@app.route('/api/add_device', methods=['POST'])
def add_device():
    data = request.json
    room_file = data['room']
    device_file = data['device']

    room_path = Path(__file__).parent / 'static' / 'js' / 'main_layout' / room_file
    device_path = Path(__file__).parent / 'static' / 'js' / 'device_library' / device_file

    if not room_path.exists() or not device_path.exists():
        return jsonify({'error': 'Files not found'}), 400

    device_content = device_path.read_text(encoding='utf-8')
    func_match = re.search(r'function\s+(create\w+)', device_content, re.I)
    create_func_name = func_match.group(1) if func_match else "createDevice"

    destruct_match = re.search(r'const\s*\{\s*(.*?)\s*\}\s*=\s*options\s*;', device_content, re.DOTALL)
    if not destruct_match:
        return jsonify({'error': 'Options block not found'}), 400

    raw_block = destruct_match.group(1)
    var_values = {}
    for line in raw_block.splitlines():
        line = line.strip()
        if line and '=' in line and not line.startswith('//'):
            m = re.match(r'^([a-zA-Z_]\w*)\s*=\s*([^,//]+)', line)
            if m:
                var_values[m.group(1).strip()] = m.group(2).strip()

    sorted_vars = sorted(var_values.items(), key=lambda x: len(x[0]), reverse=True)
    options_lines = []
    for line in raw_block.splitlines():
        processed = re.sub(r'^(\s*)([a-zA-Z_]\w*)(\s*)=', r'\1\2:', line)
        if ':' in processed:
            key_part, val_part = processed.split(':', 1)
            for vname, vvalue in sorted_vars:
                val_part = re.sub(rf'\b{re.escape(vname)}\b', vvalue, val_part)
            processed = f"{key_part}:{val_part}"
        options_lines.append(processed)

    device_stem = device_file.replace('.js', '')
    room_text = room_path.read_text(encoding='utf-8')
    existing_count = len(re.findall(rf'const\s+{device_stem}\d+', room_text))
    unique_name = f"{device_stem}{existing_count + 1}"

    # MODIFICATION: Check if it's a container to determine the position target
    pos_target = "masterGroup" if "container" in device_stem.lower() or "containment" in device_stem.lower() else unique_name

    device_code = f"""
// --- AUTO-GENERATED: {unique_name} from {device_file} ---
const {unique_name} = {create_func_name}(masterGroup, {{
{chr(10).join(options_lines)}
}});
{pos_target}.position.set(0, 0, 0);
"""

    if '}' in room_text:
        last_brace_idx = room_text.rfind('}')
        updated_room = room_text[:last_brace_idx] + device_code + "\n}"
    else:
        updated_room = room_text + device_code

    room_path.write_text(updated_room, encoding='utf-8')
    return jsonify({'success': True, 'name': unique_name})


                                                                                                                                            

@app.route('/api/remove_device', methods=['POST'])
def remove_device():
    r"""
    Remove a full AUTO-GENERATED device block from main_layout/<room>.js:
    From:
        // --- AUTO-GENERATED: ups1 from ups.js ---
    down through:
        ups1.position.set(...);
    """
    data = request.json
    room_file = data['room']          # e.g. "serverroom.js"
    device_name = data['device_name'] # e.g. "ups1"

    room_path = Path(__file__).parent / 'static' / 'js' / 'main_layout' / room_file

    if not room_path.exists():
        return jsonify({'error': f'Room file not found: {room_file}'}), 400

    ##print(f"🗑️ remove_device: {device_name} from {room_file}")

    room_text = room_path.read_text()
    room_lines = room_text.splitlines()

    start_idx = -1
    end_idx = -1

    # 1) Find the AUTO-GENERATED header line
    for i, line in enumerate(room_lines):
        if f'// --- AUTO-GENERATED: {device_name} ' in line:
            start_idx = i
            break

    if start_idx == -1:
        # Fallback: if comment is somehow missing, try to find const line
        for i, line in enumerate(room_lines):
            if f'const {device_name} = ' in line:
                start_idx = i
                break

    if start_idx == -1:
        return jsonify({'error': f'Device {device_name} not found in {room_file}'}), 404

    # 2) From start_idx, find the `<device_name>.position.set(` line
    for j in range(start_idx, len(room_lines)):
        if f'{device_name}.position.set' in room_lines[j]:
            end_idx = j + 1  # include this line
            break

    if end_idx == -1:
        # If no position.set, remove until next AUTO-GENERATED or EOF
        for j in range(start_idx + 1, len(room_lines)):
            if room_lines[j].startswith('// --- AUTO-GENERATED:'):
                end_idx = j
                break
        if end_idx == -1:
            end_idx = len(room_lines)

    removed_block = room_lines[start_idx:end_idx]
    ##print(f"🔎 Removing lines {start_idx}..{end_idx} (count={len(removed_block)})")

    # 3) Splice out the block
    new_lines = room_lines[:start_idx] + room_lines[end_idx:]

    room_path.write_text('\n'.join(new_lines) + '\n', encoding='utf-8')
    ##print(f"✅ Removed {device_name} from {room_file}")

    return jsonify({
        'success': True,
        'device': device_name,
        'room': room_file,
        'start': start_idx,
        'end': end_idx,
        'removed_lines': len(removed_block)
    })


                                                                                                                                            


@app.route('/api/reload_room/<room_file>')
def reload_room(room_file):
    # Force tree reload (client will call /api/tree)
    return jsonify({'reload': 'tree'})


@app.route('/api/load_layout/<filename>')
def load_layout(filename):
    # Adjust this path to match your folder structure
    filepath = os.path.join(app.root_path, 'static', 'js', 'main_layout', filename)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        return jsonify({"success": True, "content": content})
    return jsonify({"success": False, "error": "File not found"}), 404

                                                                                                                                               


def parse_js_value(v):
    """Helper to convert JS string values to Python types."""
    v = v.strip().strip(',').strip()

    # Handle Quoted Strings
    if (v.startswith("'") and v.endswith("'")) or (v.startswith('"') and v.endswith('"')):
        return v[1:-1]

    # Handle Booleans/Null
    if v.lower() == 'true': return True
    if v.lower() == 'false': return False
    if v.lower() == 'null': return None

    # Handle Hex (Colors)
    if v.lower().startswith('0x'):
        return v

    # Handle Numbers and Simple Math (e.g., 0.9 / 2)
    try:
        # If it's a pure number
        if re.match(r'^[-+]?\d*\.?\d+$', v):
            return float(v)
        # If it's a simple math expression, evaluate it safely
        if re.match(r'^[0-9\s\.\/\+\*\-\(\)]+$', v):
            return eval(v, {"__builtins__": None}, {})
    except:
        pass

    return v

@app.route('/api/deviceprops')
def get_device_props():
    room_file = request.args.get('room') or request.args.get('roomfile')
    device_name = request.args.get('device')

    if not room_file or not device_name:
        return jsonify({'success': False, 'error': 'Missing params'}), 400

    if not room_file.endswith('.js'): room_file += '.js'

    room_path = Path(__file__).parent / 'static' / 'js' / 'main_layout' / room_file
    if not room_path.exists():
        return jsonify({'success': False, 'error': f'File {room_file} not found'}), 404

    content = room_path.read_text(encoding='utf-8')

    # 1. Find the device block (Constructor + position.set)
    # This regex is flexible enough to catch the whole block even with comments
    pattern = rf'(const\s+{re.escape(device_name)}\s*=\s*\w+\s*\(masterGroup,\s*\{{)(.*?)(\}}\);?)'
    match = re.search(pattern, content, re.DOTALL)

    if not match:
        return jsonify({'success': False, 'error': f'Device {device_name} block not found'}), 404

    props_text = match.group(2)
    found_vars = {}

    # 2. Extract Nested Objects first (e.g., devicePosition: { x: 0, y: 0, z: 0 })
    # This captures the key and everything inside the curly braces
    obj_pattern = r'(\w+)\s*:\s*\{([^\}]+)\}'
    for obj_match in re.finditer(obj_pattern, props_text):
        obj_key = obj_match.group(1)
        obj_body = obj_match.group(2)

        inner_props = {}
        # Parse every key:value inside the nested object
        for inner_match in re.finditer(r'(\w+)\s*:\s*([^,\n\}]+)', obj_body):
            k, v = inner_match.groups()
            inner_props[k.strip()] = parse_js_value(v)

        found_vars[obj_key] = inner_props

    # 3. Extract Simple Properties (that aren't part of an object)
    for prop_match in re.finditer(r'(\w+)\s*:\s*([^,\{\n]+)', props_text):
        k, v = prop_match.groups()
        key = k.strip()
        if key not in found_vars:
            found_vars[key] = parse_js_value(v)

    # 4. Extract faceTextures specifically (it has its own nested structure)
    ft_match = re.search(r'faceTextures\s*:\s*\{([^}]+)\}', props_text, re.DOTALL)
    if ft_match:
        ft_body = ft_match.group(1)
        ft_dict = {}
        for side_match in re.finditer(r'(\w+)\s*:\s*[\'"]([^\'"]*)[\'"]', ft_body):
            ft_dict[side_match.group(1)] = side_match.group(2)
        found_vars['faceTextures'] = ft_dict

    # 5. Extract global position: device.position.set(x, y, z)
    pos_pattern = rf'{re.escape(device_name)}\.position\.set\s*\(\s*([^)]+)\)'
    pos_match = re.search(pos_pattern, content)
    if pos_match:
        coords = [parse_js_value(c) for c in pos_match.group(1).split(',')]
        if len(coords) >= 3:
            found_vars['position'] = {'x': coords[0], 'y': coords[1], 'z': coords[2]}

    return jsonify({'success': True, 'vars': found_vars})



                                                                                                                                                 

def format_js_val(val):
    """Formats Python values into valid JS syntax string."""
    if val is None or str(val).lower() == 'null':
        return 'null'
    if isinstance(val, bool):
        return str(val).lower()
    if isinstance(val, (int, float)):
        return str(val)

    s = str(val).strip()
    # If it's a hex color like 0xFFFFFF, don't wrap in quotes
    if s.lower().startswith('0x'):
        return s
    # Otherwise, it's a string, wrap in single quotes
    return f"'{s}'"


@app.route('/api/updatedeviceprops', methods=['POST'])
def update_device_props():
    try:
        data = request.json
        room_file = data.get('room')
        if not room_file.endswith('.js'): room_file += '.js'
        device_name = data.get('device')
        changes = data.get('changes')

        room_path = Path(__file__).parent / 'static' / 'js' / 'main_layout' / room_file
        content = room_path.read_text(encoding='utf-8')

        # --- STEP 1: Update the Properties Object Block ---
        # This handles the devicePosition: { x: ..., y: ..., z: ... } inside the create...() call
        block_pattern = rf'(const\s+{re.escape(device_name)}\s*=\s*\w+\s*\([^,]+,\s*\{{)(.*?)(\}}\);?)'
        match = re.search(block_pattern, content, re.DOTALL)

        if not match:
            return jsonify({'success': False, 'error': f'Device {device_name} not found'}), 404

        prefix, props_inner, suffix = match.groups()
        updated_props = props_inner

        for key, value in changes.items():
            formatted_val = format_js_val(value)
            if '.' in key:
                parent, child = key.split('.')
                # Specifically targets nested keys like devicePosition.x
                nested_regex = rf'({re.escape(parent)}\s*:\s*\{{[^}}]*?{re.escape(child)}\s*:\s*)([^,\s}}]+)'
                updated_props = re.sub(nested_regex, r'\g<1>' + formatted_val, updated_props, flags=re.DOTALL)
            else:
                simple_regex = rf'(\b{re.escape(key)}\s*:\s*)([^,\n\r}}]+)'
                updated_props = re.sub(simple_regex, r'\g<1>' + formatted_val, updated_props)

        new_block = prefix + updated_props + suffix
        content = content.replace(match.group(0), new_block)

        # --- STEP 2: Update the Functional .set() Call ---
        # Determine if we are moving a container (Master) or a specific device
        is_container = "container" in device_name.lower() or "containment" in device_name.lower()

        # Mapping: if container -> masterGroup, else -> deviceName
        target_name = "masterGroup" if is_container else device_name

        # Values to use for replacement
        pos_x = changes.get('devicePosition.x')
        pos_y = changes.get('devicePosition.y')
        pos_z = changes.get('devicePosition.z')

        if pos_x is not None or pos_y is not None or pos_z is not None:
            # We look for the .position.set line associated with our target
            set_pattern = rf'({re.escape(target_name)}\.position\.set\s*\()([^)]+)(\))'
            set_match = re.search(set_pattern, content)

            if set_match:
                current_vals = [v.strip() for v in set_match.group(2).split(',')]

                # Use new value if provided in changes, otherwise keep existing from file
                nx = format_js_val(pos_x) if pos_x is not None else current_vals[0]
                ny = format_js_val(pos_y) if pos_y is not None else current_vals[1]
                nz = format_js_val(pos_z) if pos_z is not None else current_vals[2]

                new_set_line = f"{target_name}.position.set({nx}, {ny}, {nz})"
                content = re.sub(set_pattern, rf'\g<1>{nx}, {ny}, {nz}\g<3>', content)

        room_path.write_text(content, encoding='utf-8')
        return jsonify({'success': True})

    except Exception as e:
        #print(f"Update error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


                                                                                                                                                 

@app.route('/api/uploadtexture', methods=['POST'])
def upload_texture():
    try:
        if 'texture' not in request.files:
            return jsonify({'success': False, 'error': 'No file part'}), 400

        file = request.files['texture']
        custom_filename = request.form.get('filename') # e.g., ups1_front.png
        room_file = request.form.get('room')
        device_name = request.form.get('device')
        side = request.form.get('side') # front, back, etc.

        if not room_file.endswith('.js'):
            room_file += '.js'

        # 1. Save the physical file
        textures_dir = Path(__file__).parent / 'static' / 'js' / 'device_library' / 'textures'
        textures_dir.mkdir(parents=True, exist_ok=True)

        save_path = textures_dir / custom_filename
        file.save(str(save_path))

        # The path to be written into the JS file
        web_path = f'/static/js/device_library/textures/{custom_filename}'

        # 2. Update the JS Room File immediately
        # We reuse the logic from updatedeviceprops but specifically for one texture side
        room_path = Path(__file__).parent / 'static' / 'js' / 'main_layout' / room_file
        if room_path.exists():
            content = room_path.read_text()

            # Find the device block
            pattern = rf'(const\s+{re.escape(device_name)}\s*=.*?{re.escape(device_name)}\.position\.set)'
            match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)

            if match:
                device_block = match.group(0)
                # Find faceTextures inside this block and update the specific side
                # Look for side: 'anything'
                side_pattern = rf"({side}\s*:\s*['\"])([^'\"]*)(['\"])"

                # Check if faceTextures exists, if not, you might need a more complex replacement,
                # but based on your code, it's usually pre-generated.
                new_device_block = re.sub(side_pattern, rf"\1{web_path}\3", device_block, flags=re.IGNORECASE)

                new_content = content.replace(device_block, new_device_block)
                room_path.write_text(new_content)

        return jsonify({
            'success': True,
            'path': web_path
        })

    except Exception as e:
        #print(f"Error in upload_texture: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

                                                                                                                                            

@app.route('/export_project')
def export_project():
    try:
        # 1. Automatically detect the folder where this script is located
        current_working_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 2. Folders to SKIP during export (these should not be included in backup)
        skip_folders = {
            'venv', 'env', '.venv', '__pycache__', '.git', '.idea', 
            'node_modules', '.pytest_cache', '.mypy_cache', 'dist', 'build'
        }
        
        # 3. File extensions to SKIP
        skip_extensions = {'.pyc', '.pyo', '.egg-info', '.so', '.dylib'}
        
        # 4. Create an in-memory byte stream (no files written to disk)
        memory_file = io.BytesIO()
        
        # 5. Create the ZIP
        with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zf:
            for root, dirs, files in os.walk(current_working_dir):
                # Modify dirs in-place to skip unwanted folders
                # This prevents os.walk from descending into these directories
                dirs[:] = [d for d in dirs if d not in skip_folders]
                
                for file in files:
                    # Skip the ZIP itself if it exists
                    if file == 'project_export.zip':
                        continue
                    
                    # Skip files with unwanted extensions
                    if any(file.endswith(ext) for ext in skip_extensions):
                        continue
                    
                    # Full path of the file
                    file_path = os.path.join(root, file)
                    
                    # Calculate the relative path for clean ZIP structure
                    arcname = os.path.relpath(file_path, current_working_dir)
                    
                    zf.write(file_path, arcname)
        
        # 6. Seek to the beginning so Flask can stream it
        memory_file.seek(0)
        
        # Generate filename with date and time: ProjectBackup_YYYYMMDD_HHMMSS.zip
        from datetime import datetime
        datetime_str = datetime.now().strftime('%Y%m%d_%H%M%S')
        zip_filename = f'ProjectBackup_{datetime_str}.zip'
        
        return send_file(
            memory_file,
            mimetype='application/zip',
            as_attachment=True,
            download_name=zip_filename
        )

    except Exception as e:
        # [Terminal Log] Export error
        # print(f"Export Error: {str(e)}")
        return f"Server Error during Export: {str(e)}", 500

# --- RESTORE PROJECT ---

@app.route('/restore_project', methods=['POST'])
def restore_project():
    try:
        if 'file' not in request.files:
            return jsonify({"status": "error", "message": "No file uploaded"}), 400
        
        file = request.files['file']
        pwd = os.path.dirname(os.path.abspath(__file__))
        
        # Folders to NEVER extract (safety check - these are environment/cache folders)
        skip_folders = {'venv', 'env', '.venv', '__pycache__', '.git', 'node_modules', 
                        '.pytest_cache', '.mypy_cache', 'dist', 'build', '.idea'}
        
        # File extensions to NEVER extract
        skip_extensions = {'.pyc', '.pyo', '.egg-info', '.so', '.dylib'}

        # Read uploaded zip in memory
        zip_data = io.BytesIO(file.read())
        
        with zipfile.ZipFile(zip_data, 'r') as zip_ref:
            file_list = zip_ref.namelist()
            updated_count = 0
            skipped_count = 0
            
            for member in file_list:
                # Skip directories (we only extract files, directories are created automatically)
                if member.endswith('/'):
                    continue
                
                # Skip if member path contains any forbidden folder
                member_parts = member.replace('\\', '/').split('/')
                if any(part in skip_folders for part in member_parts):
                    skipped_count += 1
                    continue
                
                # Skip files with forbidden extensions
                if any(member.endswith(ext) for ext in skip_extensions):
                    skipped_count += 1
                    continue
                
                # Extract ALL valid files (static/, templates/, .py, .service, etc.)
                # This restores the entire i3DLive folder structure
                zip_ref.extract(member, pwd)
                updated_count += 1
        
        return jsonify({
            "status": "success", 
            "message": f"Restore Complete! {updated_count} files restored. {skipped_count} files skipped (venv/__pycache__/compiled)."
        })

    except Exception as e:
        # [Terminal Log] Restore error
        # print(f"Restore Error: {str(e)}")
        return jsonify({"status": "error", "message": f"Server Error: {str(e)}"}), 500
# ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

def zabbix_api_call(url, method, params, token):
    """Standard Zabbix API Caller logic with proper error handling"""
    
    payload = {
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "auth": token,
        "id": 1
    }
    headers = {'Content-Type': 'application/json-rpc'}
    
    try:
        # We use verify=False because your curl used -k (ignore SSL)
        response = requests.post(url, headers=headers, data=json.dumps(payload), verify=False, timeout=10)
        
        # [Terminal Log] Zabbix API response status and headers
        # print(f"[DEBUG] Zabbix API Response Status: {response.status_code}")
        # print(f"[DEBUG] Zabbix API Response Headers: {response.headers.get('Content-Type', 'unknown')}")
        
        # Check if response is empty
        if not response.text:
            # [Terminal Log] Empty response error
            # print(f"[ERROR] Empty response from Zabbix API at {url}")
            return {"error": {"message": "Empty response from Zabbix server", "data": f"URL: {url}"}}
        
        # Check if response is HTML (error page) instead of JSON
        if response.text.strip().startswith('<'):
            # [Terminal Log] HTML error page received
            # print(f"[ERROR] Zabbix API returned HTML instead of JSON: {response.text[:200]}")
            return {"error": {"message": "Zabbix server returned HTML error page", "data": f"URL: {url}"}}
        
        return response.json()
        
    except requests.exceptions.ConnectionError as e:
        # [Terminal Log] Connection failure
        # print(f"[ERROR] Connection failed to {url}: {str(e)}")
        return {"error": {"message": "Connection failed to Zabbix server", "data": str(e)}}
    except requests.exceptions.Timeout as e:
        # [Terminal Log] Timeout error
        # print(f"[ERROR] Timeout connecting to {url}: {str(e)}")
        return {"error": {"message": "Timeout connecting to Zabbix server", "data": str(e)}}
    except json.JSONDecodeError as e:
        # [Terminal Log] JSON decode error
        # print(f"[ERROR] Invalid JSON from {url}: {str(e)}")
        # print(f"[ERROR] Response text: {response.text[:500]}")
        return {"error": {"message": "Invalid JSON response from Zabbix", "data": str(e)}}

@app.route('/api/zabbix')
def zabbix_api():
    # 1. Get values from the browser request
    host_name = request.args.get('host')
    api_token = request.args.get('api')
    srv_ip = request.args.get('srv_ip', '').strip()
    mode = request.args.get('mode', 'items')  # Default to items for hover
    
    # Validate required parameters
    if not srv_ip:
        return jsonify({"error": "Missing srv_ip parameter"}), 400
    
    # 2. Support full URL format: http://148.113.5.163:8080 or https://148.113.5.163
    # Remove trailing slash to avoid double slash
    srv_ip = srv_ip.rstrip('/')
    
    if srv_ip.startswith('http://') or srv_ip.startswith('https://'):
        zabbix_url = f"{srv_ip}/api_jsonrpc.php"
    else:
        zabbix_url = f"https://{srv_ip}/api_jsonrpc.php"
    
    try:
        # Handle trigger mode for LED activation and alerts
        if mode == 'triggers':
            params = {
                "output": ["triggerid", "description", "priority", "lastchange"],
                "selectHosts": ["host", "name"],
                "selectItems": ["itemid", "name", "lastvalue", "units"],
                "filter": {"value": 1},
                "min_priority": 2,
                "monitored": True,
                "sortfield": "priority",
                "sortorder": "DESC",
                "only_true": True,
                "expandDescription": True
            }
            if host_name:
                params["filter"]["host"] = host_name.split(',')

            data = zabbix_api_call(zabbix_url, "trigger.get", params, api_token)
            return jsonify({"result": data.get('result', [])})

        # Default: items mode for hover popup
        params = {
            "output": ["name", "lastvalue", "units", "key_", "valuemapid"],
            "selectValueMap": "extend",
            "selectHosts": ["host"],
            "filter": {
                "host": [host_name]
            },
            "sortfield": "name",
            "monitored": True
        }

        data = zabbix_api_call(zabbix_url, "item.get", params, api_token)
        if 'error' in data:
            return jsonify({"error": data['error'].get('data', 'Zabbix API Error')}), 400
        return jsonify({"items": data.get('result', [])})
        
    except Exception as e:
        return jsonify({"error": str(e), "result": []}), 500

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

def embed_svg_images(svg_content, netbox_url, token):
    # This pattern catches both relative (/media/...) and absolute (http://.../media/...) links
    url_pattern = r'(?:xlink:href|href|src)=["\'](https?://[^"\']+(?:/static/|/media/)[^"\']+|/(?:static|media/)[^"\']+)["\']'
    headers = {'Authorization': f'Token {token}', 'Accept': '*/*'}

    found_urls = re.findall(url_pattern, svg_content)
    #print(f"\n[DEBUG-BACKEND] Found {len(found_urls)} potential images in SVG.")

    def replacer(match):
        url_from_svg = match.group(1)
        
        # FIX: Check if the URL is already absolute (starts with http)
        if url_from_svg.startswith('http'):
            full_url = url_from_svg
        else:
            full_url = f"{netbox_url}{url_from_svg}"
            
        try:
            #print(f"  -> 📦 Attempting to fetch: {full_url}")
            # Fetch the actual image data
            resp = requests.get(full_url, headers=headers, timeout=5, verify=False)
            resp.raise_for_status()

            b64_data = base64.b64encode(resp.content).decode()
            # Detect mime type from response header or extension
            mime = resp.headers.get('content-type', 'image/jpeg')

            #print(f"  -> ✅ Success: Embedded image from {full_url}")
            return f'xlink:href="data:{mime};base64,{b64_data}"'
        except Exception as e:
            #print(f"  -> ❌ Fail: Could not embed {full_url} - {str(e)}")
            return match.group(0)

    fixed_svg = re.sub(url_pattern, replacer, svg_content)
    if 'xmlns:xlink' not in fixed_svg:
        fixed_svg = fixed_svg.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"')

    #print(f"[DEBUG-BACKEND] SVG processing complete.\n")
    return fixed_svg




@app.route("/api/netbox/proxy", methods=["GET", "OPTIONS"])
def netbox_proxy():
    if request.method == "OPTIONS":
        return Response(status=204, headers={"Access-Control-Allow-Origin": "*"})

    target_url = request.args.get("url")
    token = request.args.get("token")

    try:
        # Perform the request to NetBox
        resp = requests.get(target_url, headers={"Authorization": f"Token {token}"}, timeout=15, verify=False)
        
        # Check if the request was successful (e.g., not a 404 or 500 from NetBox)
        resp.raise_for_status()

        content_type = resp.headers.get('Content-Type', '')

        # Identify if we are dealing with a Rack Elevation SVG
        if "svg" in content_type or "render=svg" in target_url:
            from urllib.parse import urlparse
            parsed = urlparse(target_url)
            base_netbox_url = f"{parsed.scheme}://{parsed.netloc}"
            
            # Transform the SVG with your debug-enabled logic
            svg_data = embed_svg_images(resp.text, base_netbox_url, token)
            return Response(svg_data, mimetype="image/svg+xml", headers={"Access-Control-Allow-Origin": "*"})
        
        # Return successful JSON or binary data
        return Response(resp.content, mimetype=content_type, headers={"Access-Control-Allow-Origin": "*"})

    except requests.exceptions.RequestException as e:
        # Handle connection errors, timeouts, or 4xx/5xx responses from NetBox
        error_payload = {
            "success": False,
            "error": "NetBox Request Failed",
            "details": str(e),
            "target_url": target_url
        }
        return jsonify(error_payload), 500

    except Exception as e:
        # Handle unexpected Python/Logic errors
        error_payload = {
            "success": False,
            "error": "Internal Proxy Error",
            "details": str(e)
        }
        return jsonify(error_payload), 500


#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


#import json
#from flask import request, jsonify

@app.route('/api/zabbix/get_metrics', methods=['POST'])
def get_zabbix_metrics():
    try:
        # 1. Parse the incoming JSON from JS
        req_data = request.get_json()
        if not req_data:
            return jsonify({"error": "No JSON payload received"}), 400

        hostnames = req_data.get('hostnames', [])
        keys = req_data.get('keys', [])

        # 2. Get Zabbix credentials from request (device-specific)
        srv_ip = req_data.get('srv_ip', '').strip()
        api_token = req_data.get('api_token', '').strip()
        
        if not srv_ip:
            return jsonify({"error": "No Server IP provided"}), 400
        if not api_token:
            return jsonify({"error": "No API Token provided"}), 400
        
        # Support full URL format: http://148.113.5.163:8080 or https://148.113.5.163
        # Remove trailing slash to avoid double slash
        srv_ip = srv_ip.rstrip('/')
        
        if srv_ip.startswith('http://') or srv_ip.startswith('https://'):
            zabbix_url = f"{srv_ip}/api_jsonrpc.php"
        else:
            zabbix_url = f"https://{srv_ip}/api_jsonrpc.php"
        
        # [Terminal Log] get_metrics Zabbix URL
        # print(f"[DEBUG] editor.py get_metrics zabbix_url: {zabbix_url}")

        # 3. Build the Zabbix Params
        params = {
            "output": ["key_", "lastvalue"],
            "selectHosts": ["host"],
            "filter": {
                "host": hostnames,
                "key_": keys
            }
        }
        # params = {
        #     "output": ["name", "lastvalue", "units", "key_", "valuemapid"], # Added valuemapid
        #     "selectValueMap": "extend", # CRITICAL: This was missing
        #     "selectHosts": ["host"],
        #     "filter": {
        #         "host": [host_name]
        #     },
        #     "sortfield": "name",
        #     "monitored": True # Matches zbxpy.py to ensure we only get active items
        # }


        # 4. Call your existing helper function
        # Note: If your helper uses 'json.dumps', make sure 'import json' is at the top
        response_data = zabbix_api_call(zabbix_url, "item.get", params, api_token)

        if 'error' in response_data:
            return jsonify({"error": response_data['error']}), 400

        # 5. Map results: { "rack_1": { "rack1.temp": "25" } }
        metrics_map = {}
        for item in response_data.get('result', []):
            # Extract the host name from the nested Zabbix response
            host_name = item['hosts'][0]['host']
            if host_name not in metrics_map:
                metrics_map[host_name] = {}
            metrics_map[host_name][item['key_']] = item['lastvalue']

        return jsonify(metrics_map)

    except Exception as e:
        # [Terminal Log] Critical error in get_metrics
        # print(f"CRITICAL ERROR in get_zabbix_metrics: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # [Terminal Log] Editor startup message
    # print("Starting Editor on 0.0.0.0:5002")
    app.run(host='0.0.0.0', debug=True, port=5002)
    #app.run(host='127.0.0.1', debug=True, port=5002)

