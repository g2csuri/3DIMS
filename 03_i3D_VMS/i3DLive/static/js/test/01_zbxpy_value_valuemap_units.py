import requests
import json
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# --- Configuration ---
zbxSrvIP = "192.168.1.133"
zbxAPI = "029c7bd951bb20e6d212ab0dd92fd9a9e6873a2f15afb01c9bfaa289a418bb05"

#zbxHost = "Energy_Meter_1"
#zbxHost = "IN-ROW-1"
zbxHost = "FAS Panel"
url = f"https://{zbxSrvIP}/api_jsonrpc.php"

def test_zabbix():
    headers = {'Content-Type': 'application/json-rpc'}

    # 1. Fetch Items with selectValueMap and units
    payload = {
        "jsonrpc": "2.0",
        "method": "item.get",
        "params": {
            "filter": {"host": [zbxHost]},
            "output": ["name", "lastvalue", "units", "valuemapid"], # Added units to output
            "selectValueMap": "extend",
            "monitored": True
        },
        "auth": zbxAPI,
        "id": 1
    }

    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers, verify=False)
        items = response.json().get('result', [])

        # Updated Header to include Units
        print(f"\n{'ITEM':<35} | {'RAW':<10} | {'MAPPED STRING':<18} | {'UNITS'}")
        print("-" * 85)

        for item in items:
            raw_val = item.get('lastvalue', 'N/A')
            units = item.get('units', '') # Get units from Zabbix metadata
            mapped_val = "---" 

            # Value Mapping Lookup Logic
            if item.get('valuemap') and 'mappings' in item['valuemap']:
                mappings = item['valuemap']['mappings']
                for m in mappings:
                    if m['value'] == raw_val:
                        mapped_val = m['newvalue']
                        break

            # Print the formatted row with units
            print(f"{item['name'][:35]:<35} | {raw_val:<10} | {mapped_val:<18} | {units}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_zabbix()
