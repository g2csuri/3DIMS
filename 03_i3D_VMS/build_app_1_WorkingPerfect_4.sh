#!/bin/bash
# ==============================================================================
# SCRIPT: 3DLive Binary Conversion & Obfuscation Pipeline
# DESCRIPTION: 
#   1. Handles Node.js/NPM dependency conflicts automatically.
#   2. Obfuscates Frontend JavaScript.
#   3. Vaults JS assets into Python Base64 strings.
#   4. Cythonizes the Backend Python logic into C-extensions.
#   5. Bundles everything into a single standalone binary using PyInstaller.
# ==============================================================================

set -e

# --- Configuration ---
DEFAULT_PORT=5050
APP_BASE_NAME="3DLive"
SOURCE_DIR="i3DLive"
BUILD_WORKSPACE="i3DLive_Binary"
ENTRY_POINT="$BUILD_WORKSPACE/i3DLiveDev.py"
TEMP_BACKUP="../temp_build_backup"
USER_PORT=""
FINAL_PORT=""

# --- 1. Generate Timestamp ---
TIMESTAMP=$(date +"%Y%m%d_%H%M")

# --- 2. User Input for Port ---
echo -e "\a" 
echo -e "\033[1;5m⚠️  ATTENTION REQUIRED ⚠️\033[0m"
read -p "Enter the Port number for the Binary (Press Enter for default $DEFAULT_PORT): " USER_PORT

FINAL_PORT=${USER_PORT:-$DEFAULT_PORT}
FINAL_APP_NAME="${APP_BASE_NAME}_${TIMESTAMP}_${FINAL_PORT}"

echo -e "--- 🚀 Configured Port: \033[1m$FINAL_PORT\033[0m ---"
echo -e "--- 📦 Output Filename: \033[1m$FINAL_APP_NAME\033[0m ---"

# --- 3. Dependency Management ---
install_dependencies() {
    echo "--- 📦 Step 1: Installations & Environment Check ---"
    
    # [FIX] Automated Node.js Conflict Resolution
    # If nodejs and npm conflict (common in Ubuntu 24.04/NodeSource), we purge and reinstall nodejs only.
    if ! sudo apt-get install -y python3-pip python3-dev binutils python3-venv nodejs 2>/dev/null; then
        echo "⚠️  Node.js conflict detected. Initiating automated repair..."
        sudo apt-get remove --purge npm nodejs -y
        sudo apt-get autoremove -y
        sudo apt-get clean
        sudo apt-get update
        sudo apt-get install -y nodejs
    fi

    # Ensure javascript-obfuscator is installed globally
    if ! command -v javascript-obfuscator &> /dev/null; then
        echo "Installing javascript-obfuscator..."
        sudo npm install -g javascript-obfuscator
    fi

    # Virtual Environment Setup
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi

    ./venv/bin/python3 -m pip install --upgrade pip
    ./venv/bin/python3 -m pip install flask flask-cors requests cython pyinstaller
}

# --- 4. Workspace Preparation ---
prepare_workspace() {
    echo "--- 📂 Step 2: Creating Workspace ($BUILD_WORKSPACE) ---"
    # Clean previous builds
    rm -rf "$BUILD_WORKSPACE"
    rm -rf build dist

    # Clone source into workspace
    cp -r "$SOURCE_DIR" "$BUILD_WORKSPACE"

    # Patch the Python Entry Point with the chosen port
    echo "--- 🔄 Patching Port: 5001 -> $FINAL_PORT in $ENTRY_POINT ---"
    if [ -f "$ENTRY_POINT" ]; then
        sed -i "s/port=5001/port=$FINAL_PORT/g" "$ENTRY_POINT"
    else
        echo "⚠️ Warning: $ENTRY_POINT not found to patch port."
    fi

    mkdir -p "$BUILD_WORKSPACE/dist"
    mkdir -p "$BUILD_WORKSPACE/build"
    rm -rf "$BUILD_WORKSPACE/venv"
    rm -rf "$BUILD_WORKSPACE/node_modules"
}

# --- 5. Security: JS Obfuscation & Vaulting ---
obfuscate_and_vault() {
    echo "--- 🔒 Step 3: JS Obfuscation & Vault Generation ---"
    
    # Obfuscate all JS files in the static directory
    javascript-obfuscator "./$BUILD_WORKSPACE/static/js" \
        --output "./$BUILD_WORKSPACE/static/js" \
        --compact true \
        --self-defending true

    # Create vault.py: Converts JS files to Base64 strings inside a Python dictionary
    ./venv/bin/python3 -c "
import os, base64
vault = 'assets = {\\n'
static_base = '$BUILD_WORKSPACE/static/js'
for root, dirs, files in os.walk(static_base):
    for f in files:
        if f.endswith('.js'):
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, static_base)
            key = rel_path.replace('/', '_').replace('.', '_')
            with open(full_path, 'rb') as fd:
                encoded = base64.b64encode(fd.read()).decode('utf-8')
                vault += f\"    '{key}': '{encoded}',\\n\"
vault += '}'
with open('$BUILD_WORKSPACE/vault.py', 'w') as f: f.write(vault)
"
}

# --- 6. Security: Cythonizing Backend ---
compile_backend() {
    echo "--- ⚙️ Step 4: Cythonizing Backend Logic ---"
    # Converts .py files to .so (C-extensions) so the source code is not readable
    ./venv/bin/python3 -m Cython.Build.Cythonize -i "$ENTRY_POINT" "$BUILD_WORKSPACE/vault.py"
}

# --- 7. Isolation & Launcher Creation ---
prepare_build_filesystem() {
    echo "--- 📂 Step 5: Isolation & Launcher Prep ---"
    mkdir -p "$TEMP_BACKUP"
    
    # Move sensitive source files out of the build path to ensure PyInstaller uses the Cythonized versions
    mv "$BUILD_WORKSPACE/editor.py" "$TEMP_BACKUP/" 2>/dev/null || true
    mv "$BUILD_WORKSPACE/static/js/editor" "$TEMP_BACKUP/" 2>/dev/null || true
    mv "$BUILD_WORKSPACE/templates/editor.html" "$TEMP_BACKUP/" 2>/dev/null || true
    mv "$ENTRY_POINT" "$TEMP_BACKUP/i3DLiveDev_source.py"
    mv "$BUILD_WORKSPACE/vault.py" "$TEMP_BACKUP/"

    # Create the bootloader script
    cat <<EOF > launcher.py
import sys
import os
sys.path.append(os.path.join(sys._MEIPASS))
try:
    from $BUILD_WORKSPACE.i3DLiveDev import app
    print("🚀 $APP_BASE_NAME successfully started on port $FINAL_PORT")
    app.run(host='0.0.0.0', port=$FINAL_PORT, debug=False)
except Exception as e:
    import traceback
    traceback.print_exc()
    sys.exit(1)
EOF
}

# --- 8. Final Bundling ---
run_pyinstaller() {
    echo "--- 🚀 Step 6: Final Build (PyInstaller) ---"
    ./venv/bin/python3 -m PyInstaller --onefile \
        --strip \
        --distpath "./$BUILD_WORKSPACE/dist" \
        --workpath "./$BUILD_WORKSPACE/build" \
        --add-data "$BUILD_WORKSPACE/static:$BUILD_WORKSPACE/static" \
        --add-data "$BUILD_WORKSPACE/templates:$BUILD_WORKSPACE/templates" \
        --hidden-import="requests" \
        --hidden-import="flask" \
        --hidden-import="flask_cors" \
        --hidden-import="urllib3" \
        --hidden-import="hashlib" \
        --hidden-import="base64" \
        --hidden-import="json" \
        --hidden-import="re" \
        --hidden-import="time" \
        --hidden-import="shutil" \
        --hidden-import="zipfile" \
        --hidden-import="uuid" \
        --hidden-import="pathlib" \
        --hidden-import="logging" \
        --hidden-import="$BUILD_WORKSPACE.i3DLiveDev" \
        --hidden-import="$BUILD_WORKSPACE.vault" \
        --name "$FINAL_APP_NAME" \
        launcher.py
}

# --- 9. Post-Build Cleanup ---
cleanup_workspace() {
    rm -f launcher.py
    rm -f "$FINAL_APP_NAME.spec"
    rm -rf "$TEMP_BACKUP"
}

# --- Main Execution Flow ---
main() {
    install_dependencies
    prepare_workspace
    obfuscate_and_vault
    compile_backend
    prepare_build_filesystem
    run_pyinstaller
    cleanup_workspace
    
    echo "------------------------------------------------"
    echo -e "✅ DONE! Your binary is located at:"
    echo -e "📂 \033[1m./$BUILD_WORKSPACE/dist/$FINAL_APP_NAME\033[0m"
    echo -e "🚀 Binary configured for Port: $FINAL_PORT"
    echo "------------------------------------------------"
}

main "$@"
