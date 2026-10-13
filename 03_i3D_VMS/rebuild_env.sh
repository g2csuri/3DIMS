#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Dynamically capture the Present Working Directory
CURRENT_DIR=$(pwd)

echo "===================================================="
echo "🔄 Rebuilding Virtual Environment in:"
echo "📍 $CURRENT_DIR"
echo "===================================================="

# 1. Stop active services using your cleanup script
if [ -f "./stop_all.sh" ]; then
    echo "🛑 Step 1: Running stop_all.sh..."
    sudo ./stop_all.sh
else
    echo "⚠️ Warning: ./stop_all.sh not found in this directory. Skipping..."
fi

# 2. Deactivate any currently active virtual environment in this terminal session
if [ -n "$VIRTUAL_ENV" ]; then
    echo "🔌 Step 2: Deactivating existing virtual environment session..."
    deactivate || true
fi

# 3. Safely remove the old venv folder
if [ -d "venv" ]; then
    echo "🗑️ Step 3: Removing old venv directory..."
    rm -rf venv
else
    echo "ℹ️ Step 3: No existing venv folder found. Skipping removal."
fi

# 4. Create a fresh virtual environment
echo "📦 Step 4: Creating a brand new venv..."
python3 -m venv venv

# 5. Activate the newly created venv
echo "🔌 Step 5: Activating the new venv..."
# Note: We use 'source' or '.' inside the script to apply to the running subshell
source venv/bin/activate

# 6. Upgrade pip and install your specific dependencies
echo "🚀 Step 6: Installing required Python packages..."
pip install --upgrade pip
pip install urllib3 requests flask flask_cors

echo "===================================================="
echo "✅ Environment successfully rebuilt!"
echo "👉 To activate it in your current terminal pane, run:"
echo "   source venv/bin/activate"
echo "===================================================="
