
sudo ./stop_all.sh

source venv/bin/activate

deactivate 

rm -rf venv

python3 -m venv venv

source venv/bin/activate

pip install urllib3 requests flask flask_cors


