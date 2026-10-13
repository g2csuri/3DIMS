
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


# This silences only the InsecureRequestWarning
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# This silences the default Flask/Werkzeug logger
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)


def get_js_files(subdirectory):
    """Helper to list all .js files in a specific static/js subdirectory."""
    js_dir = os.path.join(app.static_folder, 'js', subdirectory)
    if not os.path.exists(js_dir):
        return []
    # Returns a list like ['box.js', 'container.js']
    files = [f for f in os.listdir(js_dir) if f.endswith('.js')]
    files = sorted(files, reverse=True)
    #return sorted(files)
    #print(f"\n--- Loading JS files from: static/js/{subdirectory} ---")
    #for f in files:
    #    print(f"  > {f}")
    return files

@app.route('/')
def editor():
    # Gather lists for each folder
    # Note: Pass '' for the root static/js folder
    lib_files = get_js_files('device_library')
    layout_files = get_js_files('main_layout')
    root_js_files = get_js_files('')

    return render_template('index.html',
                           lib_files=lib_files,
                           layout_files=layout_files,
                           root_js_files=root_js_files)


@app.route('/log_functions', methods=['POST'])
def log_functions():
    data = request.json
    functions = data.get('functions', [])
    
    #print("\n" + "="*40)
    #print("JS FUNCTIONS EXECUTED IN BROWSER:")
    #print("="*40)
    #for func in functions:
        #print(f" -> [OK] {func}()")
    #print("="*40 + "\n")
    
    return jsonify({"status": "success"})

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
        
        # [Terminal Log] Zabbix API response status and content-type
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

"""
@app.route('/api/zabbix')
def zabbix_api():
    # 1. Get values from the browser request
    host_name = request.args.get('host')
    api_token = request.args.get('api')
    #srv_ip = request.args.get('srv_ip', '192.168.1.133').strip()
    srv_ip = request.args.get('srv_ip').strip()
    #print(f"server IP : {srv_ip}")
    # 2. Construct the URL (matching your curl)
    zabbix_url = f"https://{srv_ip}/api_jsonrpc.php"
    try:
        # 3. Use the exact params from your successful curl command
        params = {
            "output": ["name", "lastvalue", "units", "key_"],
            "selectHosts": ["host"],
            "filter": {
                "host": [host_name]
            },
            "sortfield": "name"
        }
        # 4. Execute the call
        data = zabbix_api_call(zabbix_url, "item.get", params, api_token)
        #print(f"######################## API Data : {data}")
        # 5. Handle Zabbix internal errors (e.g., auth failure)
        if 'error' in data:
            return jsonify({"error": data['error'].get('data', 'Zabbix API Error')}), 400
        # 6. Return the "result" array to the frontend
        return jsonify({"items": data.get('result', [])})

 #   print(f"API Data : {data}")
    except Exception as e:
        # Catching the NameError or ConnectionErrors properly now
        return jsonify({"error": str(e)}), 500
"""

"""
###################################################################################################################################
@app.route('/api/zabbix')
def zabbix_api():
    host_name = request.args.get('host')
    api_token = request.args.get('api')
    srv_ip = request.args.get('srv_ip').strip()
    
    zabbix_url = f"https://{srv_ip}/api_jsonrpc.php"
    
    try:
        # UPDATED PARAMS: Matching zbxpy.py exactly
        params = {
            "output": ["name", "lastvalue", "units", "key_", "valuemapid"], # Added valuemapid
            "selectValueMap": "extend", # CRITICAL: This was missing
            "selectHosts": ["host"],
            "filter": {
                "host": [host_name]
            },
            "sortfield": "name",
            "monitored": True # Matches zbxpy.py to ensure we only get active items
        }

        # Execute the call using your existing caller function
        data = zabbix_api_call(zabbix_url, "item.get", params, api_token)
        
        if 'error' in data:
            return jsonify({"error": data['error'].get('data', 'Zabbix API Error')}), 400
            
        # Return the items array to the frontend
        return jsonify({"items": data.get('result', [])})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

##############################################################################################################################################
"""

@app.route('/api/zabbix')
def zabbix_api():
    host_name = request.args.get('host')
    api_token = request.args.get('api')
    srv_ip = request.args.get('srv_ip', '').strip()  # Full URL format: http://IP:PORT or https://IP:PORT
    mode = request.args.get('mode', 'items') # Default to items for hover

    # Validate required parameters
    if not srv_ip:
        return jsonify({"error": "Missing srv_ip parameter"}), 400

    # [Terminal Log] Zabbix API request parameters
    # print(f'################################ host_name : {host_name}')
    # print(f'################################ api_token : {api_token}')
    # print(f'################################ srv_ip : {srv_ip}')

    # Support full URL format: http://148.113.5.163:8080 or https://148.113.5.163
    # If no protocol provided, default to http://
    # Remove trailing slash if present to avoid double slash
    srv_ip = srv_ip.rstrip('/')
    
    if srv_ip.startswith('http://') or srv_ip.startswith('https://'):
        zabbix_url = f"{srv_ip}/api_jsonrpc.php"
    else:
        zabbix_url = f"http://{srv_ip}/api_jsonrpc.php"
    
    # [Terminal Log] Constructed Zabbix API URL
    # print(f'################################ zabbix url : {zabbix_url}')
    try:
        if mode == 'triggers':
            params = {
                "output": ["triggerid", "description", "priority", "lastchange"],
                "selectHosts": ["host", "name"],
                "selectItems": ["itemid", "name", "lastvalue", "units"],  # Include items with values
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

            # Ensure we return a dictionary with a 'result' key even if empty
            return jsonify({"result": data.get('result', [])})

    #try:
        # UPDATED PARAMS: Matching zbxpy.py exactly
        params = {
            "output": ["name", "lastvalue", "units", "key_", "valuemapid"], # Added valuemapid
            "selectValueMap": "extend", # CRITICAL: This was missing
            "selectHosts": ["host"],
            "filter": {
                "host": [host_name]
            },
            "sortfield": "name",
            "monitored": True # Matches zbxpy.py to ensure we only get active items
        }

        # Execute the call using your existing caller function
        data = zabbix_api_call(zabbix_url, "item.get", params, api_token)
        # [Terminal Log] Item API response data
        # print(f'############################## data : {data}')
        if 'error' in data:
            return jsonify({"error": data['error'].get('data', 'Zabbix API Error')}), 400
            
        # Return the items array to the frontend
        return jsonify({"items": data.get('result', [])})

    #except Exception as e:
    #    return jsonify({"error": str(e)}), 500

    except Exception as e:
        # [Terminal Log] Backend exception
        # print(f"BACKEND ERROR: {str(e)}")
        return jsonify({"error": str(e), "result": []}), 500


# //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


def embed_svg_images(svg_content, netbox_url, token):
    # This pattern catches both relative (/media/...) and absolute (http://.../media/...) links
    url_pattern = r'(?:xlink:href|href|src)=["\'](https?://[^"\']+(?:/static/|/media/)[^"\']+|/(?:static|media/)[^"\']+)["\']'
    headers = {'Authorization': f'Token {token}', 'Accept': '*/*'}

    found_urls = re.findall(url_pattern, svg_content)
    # [Terminal Log] SVG image embedding debug
    # print(f"\n[DEBUG-BACKEND] Found {len(found_urls)} potential images in SVG.")

    def replacer(match):
        url_from_svg = match.group(1)

        # FIX: Check if the URL is already absolute (starts with http)
        if url_from_svg.startswith('http'):
            full_url = url_from_svg
        else:
            full_url = f"{netbox_url}{url_from_svg}"

        try:
            # [Terminal Log] Image fetch attempt
            # print(f"  -> Attempting to fetch: {full_url}")
            # Fetch the actual image data
            resp = requests.get(full_url, headers=headers, timeout=5, verify=False)
            resp.raise_for_status()

            b64_data = base64.b64encode(resp.content).decode()
            # Detect mime type from response header or extension
            mime = resp.headers.get('content-type', 'image/jpeg')

            # [Terminal Log] Image embed success
            # print(f"  -> Success: Embedded image from {full_url}")
            return f'xlink:href="data:{mime};base64,{b64_data}"'
        except Exception as e:
            # [Terminal Log] Image embed failure
            # print(f"  -> Fail: Could not embed {full_url} - {str(e)}")
            return match.group(0)

    fixed_svg = re.sub(url_pattern, replacer, svg_content)
    if 'xmlns:xlink' not in fixed_svg:
        fixed_svg = fixed_svg.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"')

    # [Terminal Log] SVG processing complete
    # print(f"[DEBUG-BACKEND] SVG processing complete.\n")
    return fixed_svg


@app.route("/api/netbox/proxy", methods=["GET", "OPTIONS"])
def netbox_proxy():
    if request.method == "OPTIONS":
        return Response(status=204, headers={"Access-Control-Allow-Origin": "*"})

    target_url = request.args.get("url")
    token = request.args.get("token")

    try:
        resp = requests.get(target_url, headers={"Authorization": f"Token {token}"}, timeout=15, verify=False)
        content_type = resp.headers.get('Content-Type', '')

        # Identify if we are dealing with a Rack Elevation SVG
        if "svg" in content_type or "render=svg" in target_url:
            from urllib.parse import urlparse
            parsed = urlparse(target_url)
            base_netbox_url = f"{parsed.scheme}://{parsed.netloc}"

            # Transform the SVG with our debug-enabled logic
            svg_data = embed_svg_images(resp.text, base_netbox_url, token)
            return Response(svg_data, mimetype="image/svg+xml", headers={"Access-Control-Allow-Origin": "*"})

        return Response(resp.content, mimetype=content_type, headers={"Access-Control-Allow-Origin": "*"})
    except Exception as e:
        # [Terminal Log] Critical proxy error
        # print(f"[DEBUG-BACKEND] Critical Proxy Error: {str(e)}")
        return str(e), 500


#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

"""
@app.route('/api/zabbix/get_metrics', methods=['POST'])
def get_zabbix_metrics():
    try:
        # 1. Parse the incoming JSON from JS
        req_data = request.get_json()
        if not req_data:
            return jsonify({"error": "No JSON payload received"}), 400

        hostnames = req_data.get('hostnames', [])
        keys = req_data.get('keys', [])

        # 2. Your Zabbix Credentials (verify these!)
        #srv_ip = "192.168.1.133"
        srv_ip = "148.113.5.163"
        api_token = "bdd9ba3655d1fcf073eb23a8ed06fab1d05ea4be9804c937bed24226f1a4b6be"
#        zabbix_url = f"https://{srv_ip}/api_jsonrpc.php"
        zabbix_url = f"http://{srv_ip}/api_jsonrpc.php"

        # 3. Build the Zabbix Params
        params = {
            "output": ["key_", "lastvalue"],
            "selectHosts": ["host"],
            "filter": {
                "host": hostnames,
                "key_": keys
            }
        }

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
        # This will print the EXACT error in your terminal/command prompt
        print(f"CRITICAL ERROR in get_zabbix_metrics: {str(e)}")
        return jsonify({"error": str(e)}), 500
"""

@app.route('/api/zabbix/get_metrics', methods=['POST'])
def get_zabbix_metrics():
    try:
        req_data = request.get_json()
        if not req_data:
            return jsonify({"error": "No JSON payload received"}), 400

        # Extract dynamic values from the frontend request
        hostnames = req_data.get('hostnames', [])
        keys = req_data.get('keys', [])
        
        # FIX: Get srv_ip and api_token from the request body (device-specific)
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
            zabbix_url = f"http://{srv_ip}/api_jsonrpc.php"
        
        # [Terminal Log] get_metrics Zabbix URL
        # print(f"[DEBUG] get_metrics zabbix_url: {zabbix_url}")

        params = {
            "output": ["key_", "lastvalue"],
            "selectHosts": ["host"],
            "filter": {
                "host": hostnames,
                "key_": keys
            }
        }

        response_data = zabbix_api_call(zabbix_url, "item.get", params, api_token)

        if 'error' in response_data:
            return jsonify({"error": response_data['error']}), 400

        metrics_map = {}
        for item in response_data.get('result', []):
            host_name = item['hosts'][0]['host']
            if host_name not in metrics_map:
                metrics_map[host_name] = {}
            metrics_map[host_name][item['key_']] = item['lastvalue']

        return jsonify(metrics_map)

    except Exception as e:
        # [Terminal Log] Critical error in get_metrics
        # print(f"CRITICAL ERROR in get_zabbix_metrics: {str(e)}")
        return jsonify({"error": str(e)}), 500




if __name__ == "__main__":
    #app.run(host="127.0.0.1", port=5001, debug=True)
    app.run(host="0.0.0.0", port=5001, debug=True)
