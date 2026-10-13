#!/bin/bash

pid=$(sudo ss -tulnup | grep :5000 | grep -oP 'pid=\K[0-9]+')
sudo kill $pid
echo "KILLED PID $pid of 5000"

pid=$(sudo ss -tulnup | grep :5001 | grep -oP 'pid=\K[0-9]+')
sudo kill $pid
echo "KILLED PID $pid of 5001"

# Stay in current directory, use full paths
echo "🚀 Starting Editor APP (port 5001)..."

python3 -m venv venv

source venv/bin/activate

python3 i3DLive/editor.py &
EDITOR_PID=$!

echo " ########################################################## "
echo "✅ Both servers running!"
echo "Main: http://localhost:5000"
echo "PIDs: EDITOR=$EDITOR_PID"
echo "Stop: Ctrl+C"
echo " ########################################################## "

wait
