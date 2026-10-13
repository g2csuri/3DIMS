#!/bin/bash
# deactivate is the command to deactivate the venv
pid=$(sudo ss -tulnup | grep :5001 | grep -oP 'pid=\K[0-9]+')
sudo kill $pid
echo "KILLED PID $pid of 5001"

pid=$(sudo ss -tulnup | grep :5002 | grep -oP 'pid=\K[0-9]+')
sudo kill $pid
echo "KILLED PID $pid of 5002"

pid=$(sudo ss -tulnup | grep :5003 | grep -oP 'pid=\K[0-9]+')
sudo kill $pid
echo "KILLED PID $pid of 5003"

pid=$(sudo ss -tulnup | grep :5004 | grep -oP 'pid=\K[0-9]+')
sudo kill $pid
echo "KILLED PID $pid of 5004"

pid=$(sudo ss -tulnup | grep :5005 | grep -oP 'pid=\K[0-9]+')
sudo kill $pid
echo "KILLED PID $pid of 5005"


