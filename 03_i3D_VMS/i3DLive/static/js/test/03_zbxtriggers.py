import requests
import json
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# --- Configuration ---
zbxSrvIP = "192.168.1.133"
zbxAPI = "029c7bd951bb20e6d212ab0dd92fd9a9e6873a2f15afb01c9bfaa289a418bb05"
zbxGroupName = "SNMP SIM"
url = f"https://{zbxSrvIP}/api_jsonrpc.php"

def get_group_triggers():
    headers = {'Content-Type': 'application/json-rpc'}

    payload = {
        "jsonrpc": "2.0",
        "method": "trigger.get",
        "params": {
            "group": zbxGroupName,
            "output": ["triggerid", "description", "priority", "value"],
            "selectHosts": ["name"],
            "filter": {
                "value": 1  # 1 = Active Problems
            },
            "monitored": True,
            "only_true": True,     # Ensure only triggers in 'problem' state are returned
            "expandDescription": True # Resolves macros in trigger names
        },
        "auth": zbxAPI,
        "id": 1
    }

    severity_map = {
        "0": "Not classified", "1": "Information", "2": "Warning",
        "3": "Average", "4": "High", "5": "Disaster"
    }

    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers, verify=False, timeout=10)
        response_data = response.json()

        if 'error' in response_data:
            print(f"Zabbix API Error: {response_data['error'].get('data')}")
            return

        triggers = response_data.get('result', [])

        print(f"\nACTIVE ALARMS FOR GROUP: {zbxGroupName} (Total Found: {len(triggers)})")
        print(f"{'HOST':<20} | {'SEVERITY':<15} | {'ALARM/TRIGGER DESCRIPTION'}")
        print("-" * 85)

        if not triggers:
            print("No active alarms found.")
            return

        for trigger in triggers:
            # Loop through hosts in case one trigger applies to multiple devices
            for host in trigger.get('hosts', []):
                host_name = host['name']
                severity = severity_map.get(trigger['priority'], "Unknown")
                description = trigger['description']
                print(f"{host_name:<20} | {severity:<15} | {description}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_group_triggers()
