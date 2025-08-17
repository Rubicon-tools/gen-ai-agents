import html
from datetime import datetime
from zoneinfo import ZoneInfo
from collections import defaultdict
import os
import requests
import urllib.parse
from dotenv import load_dotenv
import re
from weasyprint import HTML
import matplotlib.pyplot as plt
import io
import base64
import requests
import urllib.parse
from collections import defaultdict
import seaborn as sns
import pandas as pd

import sys
import os

# Add correct paths
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'report_file_generation', 'utils')))

# Import function and chart generators
#from crud_functions.search_issues import search_issues
from utils.Charts import (
    generate_heatmap_html,
    generate_distribution_charts_side_by_side
)

logo_url = "https://static.wixstatic.com/media/8232ac_e4eee40910dc46bc8c2b153bb71d7beb~mv2.png/v1/fill/w_163,h_42,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Quorium-logotype-fond%20transparent_edited.png"
load_dotenv()

EMAIL = os.getenv("JIRA_EMAIL")
TOKEN = os.getenv("JIRA_TOKEN")
DOMAIN = os.getenv("JIRA_DOMAIN")
AUTH = (EMAIL, TOKEN)


# May vary per Jira instance — adjust if needed
EPIC_LINK_FIELD = "customfield_10008"  # Epic Link (Jira Cloud)
PROJECT_KEY = "AI"

def get_board_id(project_key="AI"):
    """Get the board ID for the given project key."""
    url = f"https://{DOMAIN}/rest/agile/1.0/board?projectKeyOrId={project_key}"
    resp = requests.get(url, auth=AUTH)
    resp.raise_for_status()
    boards = resp.json().get("values", [])
    if not boards:
        raise ValueError(f"No boards found for project {project_key}")
    return boards[0]["id"]

def get_last_sprint(project_key):
    """Get the last sprint for the given project key."""
    board_id = get_board_id(project_key)

    url = f"https://{DOMAIN}/rest/agile/1.0/board/{board_id}/sprint?state=active,future,closed"
    resp = requests.get(url, auth=AUTH)
    resp.raise_for_status()
    sprints = resp.json().get("values", [])

    if not sprints:
        raise ValueError(f"No sprints found for board {board_id}")

    # Sort by startDate or id to get latest
    sprints_sorted = sorted(
        sprints,
        key=lambda s: s.get("startDate") or s.get("id"),
        reverse=True
    )
    return sprints_sorted[0]

def fetch_epic_summary(epic_key):
    url = f"https://{DOMAIN}/rest/api/3/issue/{epic_key}"
    headers = {"Accept": "application/json"}
    response = requests.get(url, headers=headers, auth=AUTH)
    if response.status_code == 200:
        return response.json().get("fields", {}).get("summary", "No Summary")
    return "Unknown Epic"

def search_issues(jql):
    jql_clean = re.sub(r'project\s*=\s*\"?AI\"?', '', jql, flags=re.IGNORECASE).strip()
    jql_clean = re.sub(r'^(and|or)\s+', '', jql_clean, flags=re.IGNORECASE)
    full_jql = f'project = "{PROJECT_KEY}" AND ({jql_clean})' if jql_clean else f'project = "{PROJECT_KEY}"'

    encoded_jql = urllib.parse.quote(full_jql)
    url = f"https://{DOMAIN}/rest/api/3/search?jql={encoded_jql}&maxResults=100"
    headers = {"Accept": "application/json"}
    response = requests.get(url, headers=headers, auth=AUTH)

    if response.status_code != 200:
        return f"<p style='color:red;'>❌ Jira API error: {response.status_code} → {response.text}</p>", []

    issues = response.json().get("issues", [])
    if not issues:
        return "<p>No issues found.</p>", []

    epic_groups = defaultdict(list)
    epic_keys_to_fetch = set()

    for issue in issues:
        fields = issue["fields"]
        key = issue["key"]
        summary = html.escape(fields.get("summary", "No summary"))
        status = html.escape(fields.get("status", {}).get("name", "Unknown Status"))
        assignee_obj = fields.get("assignee")
        assignee = html.escape(assignee_obj.get("displayName")) if assignee_obj else "Unassigned"
        labels = fields.get("labels", [])
        created = fields.get("created", "")[:10]        

        changelog_url = f"https://{DOMAIN}/rest/api/3/issue/{key}?expand=changelog"
        changelog_resp = requests.get(changelog_url, headers=headers, auth=AUTH)
        start_date = ""
        if changelog_resp.status_code == 200:
            history = changelog_resp.json().get("changelog", {}).get("histories", [])
            for entry in history:
                for item in entry.get("items", []):
                    if item.get("field") == "status" and item.get("toString") == "In Progress":
                        start_date = entry.get("created", "")[:10]
                        break
                if start_date:
                    break
        issue["start_date"] = start_date
        epic_key = None
        if fields.get("parent"):
            epic_key = fields["parent"]["key"]
        elif EPIC_LINK_FIELD in fields and fields[EPIC_LINK_FIELD]:
            epic_key = fields[EPIC_LINK_FIELD]

        epic_key = epic_key or "No Epic"
        if epic_key != "No Epic":
            epic_keys_to_fetch.add(epic_key)

        epic_groups[epic_key].append({
            "key": key,
            "summary": summary,
            "status": status,
            "assignee": assignee,
            "labels": labels,
            "created": created,
            "start_date": start_date,
            "due_date": issue['fields'].get('duedate')
        })

    epic_summaries = {key: fetch_epic_summary(key) for key in epic_keys_to_fetch}
    epic_summaries["No Epic"] = "Unlinked Issues"

    today = datetime.today().strftime("%Y-%m-%d")
    sprint_name = None
    sprint_end = None
    for issue in issues:
        sprint_field = issue["fields"].get("customfield_10020")
        if sprint_field and isinstance(sprint_field, list) and len(sprint_field) > 0:
            sprint_obj = sprint_field[0]
            sprint_name = sprint_obj.get("name", "N/A")
            sprint_end = sprint_obj.get("endDate", None)
            if sprint_end:
                try:
                    sprint_end = datetime.strptime(sprint_end, "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%Y-%m-%d")
                except ValueError:
                    sprint_end = "Invalid Date"
            break
    html_content = f"""
    <html>
    <head>
    <meta charset='UTF-8'>
    <style>
       @page {{
            margin: 0;
        }}

        body {{
            font-family: 'Segoe UI', sans-serif;
            margin: 0;
            padding: 5px;
            background: #fdfdfd;
        }}

        .container {{
            max-width: 100%;
            margin: 0;
            padding: 20px 25px;
        }}

        h1, .date, .sprint {{
            text-align: center;
        }}

        .epic-section {{
            width: 100%;
            margin-top: 40px;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }}

        th, td {{
            padding: 8px 10px;
            border: 1px solid #ccc;
            vertical-align: top;
            word-break: break-word;
            overflow-wrap: anywhere;
            white-space: normal;
        }}

        th {{
            background: #f4f4f4;
            font-weight: bold;
        }}

        th.key-col,   td.key-col         {{ width: 8%; }}
        th.summary-col, td.summary-col   {{ width: 30%; }}
        th.status-col, td.status-col     {{ width: 10%; }}
        th.assignee-col, td.assignee-col {{ width: 10%; }}
        th.tags-col, td.tags-col         {{ width: 22%; }}
        th.created-col, td.created-col   {{ width: 10%; }}
        th.start-col, td.start-col       {{ width: 10%; }}

        a {{
            color: #0073e6;
            text-decoration: none;
        }}

        .tag-badge {{
            display: inline-block;
            background: #e8eaf6; /* soft indigo-gray */
            color: #3f51b5;       /* indigo text */
            padding: 2px 5px;
            margin: 2px 2px 2px 0;
            font-size: 10px;
            border-radius: 3px;
        }}
    </style>
    </head>
    <body>
    <div class="container">
        <!-- Row 1: Logo only -->
        <div style="padding: 10px 25px 0 25px;">
            <img src="{logo_url}" alt="Company Logo" style="height: 45px;" />
        </div>

        <!-- Row 2: Report title and metadata -->
        <div style="text-align:center; margin-top: 5px;">
            <h1 style="margin: 4px 0; font-size: 22px;">🧾 AI GEN FACTORY</h1>
            <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: normal;">Weekly Report</h2>
            <div class="date" style="font-size: 14px;">Generated on: {today}</div>
            <div class="sprint" style="font-size: 14px;">
                Sprint: {sprint_name or 'N/A'} {f'(ends on {sprint_end})' if sprint_end else ''}
            </div>
        </div>
    """


    for epic_key, issue_list in epic_groups.items():
        epic_title = html.escape(epic_summaries.get(epic_key, "Unknown Epic"))
        statuses = [i["status"] for i in issue_list]
        if "In Progress" in statuses:
            epic_status = "In Progress"
        elif all(s == "Done" for s in statuses):
            epic_status = "Done"
        elif all(s == "Ready For Review" for s in statuses):
            epic_status = "Ready For Review"
        elif all(s == "To Do" for s in statuses):
            epic_status = "To Do"
        else:
            epic_status = "To Do"

        html_content += f"""
        <div class='epic-section'>
            <h3>📘 Epic: {epic_key} – {epic_title} [{epic_status}]</h3>
            <table>
                <tr>
                    <th>Key</th>
                    <th class="summary-col">Summary</th>
                    <th>Status</th>
                    <th>Assignee</th>
                    <th class="tags-col">Tags</th>
                    <th>Created</th>
                    <th>Due Date</th>
                </tr>
        """
        for issue in issue_list:
            tags_html = " ".join([f"<span class='tag-badge'>{html.escape(tag)}</span>" for tag in issue["labels"]]) or "-"
            issue_url = f"https://{DOMAIN}/browse/{issue['key']}"
            html_content += f"""
                <tr>
                    <td><a href='{issue_url}' target='_blank'>{issue['key']}</a></td>
                    <td class="summary-col">{issue['summary']}</td>
                    <td class="status-col">{issue['status']}</td>
                    <td class="assignee-col">{issue['assignee']}</td>
                    <td class="tags-col">{tags_html}</td>
                    <td>{issue['created']}</td>
                    <td>{issue.get('due_date', '')}</td>
                </tr>
            """
        html_content += "</table></div>"

    html_content += "</div></body></html>"
    return html_content, issues



sprint = get_last_sprint("AI")

query = f'project = {"AI"} AND Sprint = "{sprint["name"]}"'

html_content, issues = search_issues(query)

html_content += generate_heatmap_html(issues)
html_content += generate_distribution_charts_side_by_side(issues)

morocco_time = datetime.now(ZoneInfo("Africa/Casablanca"))
timestamp = morocco_time.strftime("%d-%m-%Y-%H:%M")
filename = f"jira_report_{timestamp}.pdf"

output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'reports', filename)
HTML(string=html_content).write_pdf(output_path)
print(f"✅ Report saved to: ./reports/{filename}")

