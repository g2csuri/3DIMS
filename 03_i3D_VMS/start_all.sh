#!/bin/bash

sudo systemctl restart netbox.service
sudo systemctl restart nginx.service

pid=$(sudo ss -tulnup | grep :5001 | grep -oP 'pid=\K[0-9]+')
sudo kill $pid
echo "KILLED PID $pid of 5001"

pid=$(sudo ss -tulnup | grep :5002 | grep -oP 'pid=\K[0-9]+')
sudo kill $pid
echo "KILLED PID $pid of 5002"

pid=$(sudo ss -tulnup | grep :5003 | grep -oP 'pid=\K[0-9]+')
sudo kill $pid
echo "KILLED PID $pid of 5003"

#############################################################################################################
#############################################################################################################
################# UnInstall and Install venv again
################# Do this if python venv is not working, if working comment all the lines
#source venv/bin/activate
#deactivate 
#rm -rf venv
#python3 -m venv venv
#source venv/bin/activate
#pip install Flask, send_file, render_template, request, jsonify, make_response, send_from_directory, Response
#pip install urllib3 requests flask flask_cors
#############################################################################################################
#############################################################################################################

# Stay in current directory, use full paths
echo "🚀 Starting MAIN APP (port 5001)..."
python3 -m venv venv
source venv/bin/activate

python3 i3DLive/i3DLiveDev.py &
i3DLive_PID=$!

echo "🚀 Starting EDITOR (port 5002)..."
python3 i3DLive/editor.py &
EDITOR_PID=$!

echo " ########################################################## "
echo "✅ Both servers running!"
echo "i3DLive: http://localhost:5001"
echo "Editor: http://localhost:5002"
echo "PIDs: i3DLive=$i3DLive_PID, EDITOR=$EDITOR_PID"
echo "Stop: Ctrl+C"
echo " ########################################################## "

wait
