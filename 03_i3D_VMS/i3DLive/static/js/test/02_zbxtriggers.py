import requests
import json
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# --- Configuration ---
zbxSrvIP = "192.168.1.133"
zbxAPI = "029c7bd951bb20e6d212ab0dd92fd9a9e6873a2f15afb01c9bfaa289a418bb05"
zbxGroupName = "SNMP SIM"  # Replace with your actual Host Group name
url = f"https://{zbxSrvIP}/api_jsonrpc.php"

def get_group_triggers():
    headers = {'Content-Type': 'application/json-rpc'}

    # 1. Fetch Triggers for all hosts in a specific Host Group
    payload = {
        "jsonrpc": "2.0",
        "method": "trigger.get",
        "params": {
            "group": zbxGroupName,        # Filter by the specific group name
            "output": ["triggerid", "description", "priority", "value", "lastchange"],
            "selectHosts": ["name"],      # Include the host name for each trigger
            "filter": {
                "value": 1                # 1 = "Problem" status (Active alarms)
            },
            "monitored": True,            # Only monitored items
            "sortfield": "priority",
            "sortorder": "DESC"
        },
        "auth": zbxAPI,
        "id": 1
    }

    # Severity mapping for human-readable output
    severity_map = {
        "0": "Not classified",
        "1": "Information",
        "2": "Warning",
        "3": "Average",
        "4": "High",
        "5": "Disaster"
    }

    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers, verify=False)
        triggers = response.json().get('result', [])

        print(f"\nACTIVE ALARMS FOR GROUP: {zbxGroupName}")
        print(f"{'HOST':<20} | {'SEVERITY':<15} | {'ALARM/TRIGGER DESCRIPTION'}")
        print("-" * 85)

        if not triggers:
            print("No active alarms found for this group.")
            return

        for trigger in triggers:
            # Extract host name (triggers can be linked to multiple hosts, usually one)
            host_name = trigger['hosts'][0]['name'] if trigger.get('hosts') else "N/A"
            severity = severity_map.get(trigger['priority'], "Unknown")
            description = trigger['description']

            print(f"{host_name:<20} | {severity:<15} | {description}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_group_triggers()
