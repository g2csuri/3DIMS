#!/bin/bash

# Define a cleanup function to kill python apps when service stops
cleanup() {
    echo "Stopping background servers..."
    kill $i3DLive_PID $EDITOR_PID 2>/dev/null
    exit 0
}
# Trap SIGTERM and SIGINT signals from systemd
trap cleanup SIGTERM SIGINT

sudo systemctl restart netbox.service
sudo systemctl restart nginx.service

# Clean up any lingering processes on ports 5001, 5002, 5003
for port in 5001 5002 5003 5004 5005; do
    pid=$(sudo ss -tulnup | grep ":$port " | grep -oP 'pid=\K[0-9]+' | head -n 1)
    if [ ! -z "$pid" ]; then
        sudo kill -9 $pid
        echo "KILLED PID $pid on port $port"
    fi
done

echo "🚀 Starting MAIN APP (port 5001)..."
# Use absolute paths since systemd runs from root by default
# cd /home/g2cimsrpi4/i3DLive_8/i3D_VMS_8_5
cd /home/surya/Downloads/i3D_VMS_10_2_06_May_2026_UnderProgress
source venv/bin/activate

python3 i3DLive/i3DLiveDev.py &
i3DLive_PID=$!

echo "🚀 Starting EDITOR (port 5002)..."
python3 i3DLive/editor.py &
EDITOR_PID=$!

echo "✅ Both servers running under systemd tracking!"
echo "PIDs: i3DLive=$i3DLive_PID, EDITOR=$EDITOR_PID"

# Keep script alive so systemd can track it and catch the stop signal
wait
