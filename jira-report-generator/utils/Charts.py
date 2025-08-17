from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import matplotlib.pyplot as plt
import io
import base64
from collections import defaultdict

def generate_start_delay_chart_with_table(issues):
    data = []
    table_data = []

    for issue in issues:
        fields = issue.get("fields", {})
        start_date_str = issue.get("start_date")
        issue_type = fields.get("issuetype", {}).get("name", "")
        status = fields.get("status", {}).get("name", "")
        if not start_date_str or status != "In Progress" or issue_type == "Epic":
            continue

        try:
            start_date = datetime.strptime(start_date_str[:10], "%Y-%m-%d")
            today = datetime.today()
            delay_days = (today - start_date).days
            issue_key = issue.get("key", "Unknown")
            assignee = fields.get("assignee", {}).get("displayName", "Unassigned")
            summary = fields.get("summary", "No summary")
            data.append({"Issue": issue_key, "Days in Progress": delay_days})
            table_data.append((issue_key, summary, assignee))
        except Exception as e:
            print(f"Error for issue {issue.get('key')}: {e}")
            continue

    if not data:
        return "<p>No start delay data available.</p>"

    df = pd.DataFrame(data)

    # Plot
    plt.figure(figsize=(8, 5))
    sns.barplot(x="Issue", y="Days in Progress", data=df, color="steelblue")
    plt.title("Time Spent in Progress (Ongoing Issues)", fontsize=12)
    plt.xticks(rotation=45, ha='right', fontsize=8)
    plt.yticks(fontsize=8)
    plt.xlabel("Issue Key", fontsize=10)
    plt.ylabel("Days in progress", fontsize=10)
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight", dpi=200)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close()

    # Build HTML with image and table
    html = f"""
    <div style="text-align:center; margin-top:60px;">
        <h3 style="font-size:16px;">⏱️ Time Spent in Progress (Ongoing Issues)</h3>
        <img src="data:image/png;base64,{image_base64}" style="max-width:100%;"/>
        <table style="margin: 20px auto; border-collapse: collapse; font-family: Arial; font-size: 12px;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ccc; padding: 6px;">Issue Key</th>
                    <th style="border: 1px solid #ccc; padding: 6px;">Summary</th>
                    <th style="border: 1px solid #ccc; padding: 6px;">Assignee</th>
                </tr>
            </thead>
            <tbody>
    """
    for key, summary, assignee in table_data:
        html += f"""
            <tr>
                <td style="border: 1px solid #ccc; padding: 6px;">{key}</td>
                <td style="border: 1px solid #ccc; padding: 6px;">{summary}</td>
                <td style="border: 1px solid #ccc; padding: 6px;">{assignee}</td>
            </tr>
        """

    html += """
            </tbody>
        </table>
    </div>
    """
    return html


def generate_heatmap_html(issues):
    # Prepare data
    heatmap_data = defaultdict(lambda: defaultdict(int))
    for issue in issues:
        fields = issue["fields"]
        status = fields.get("status", {}).get("name", "Unknown Status")
        assignee_obj = fields.get("assignee")
        assignee = assignee_obj.get("displayName") if assignee_obj else "Unassigned"
        heatmap_data[assignee][status] += 1

    df = pd.DataFrame(heatmap_data).fillna(0).astype(int).T  # Transpose: rows=assignees

    # Generate heatmap figure
    fig, ax = plt.subplots(figsize=(min(11, 1 + len(df.columns)*2), max(4, 0.6*len(df))))
    sns.heatmap(df, annot=True, fmt='d', cmap="YlGnBu", cbar=False,
                linewidths=0.5, linecolor='#ccc', ax=ax)
    ax.set_title("")  # Remove embedded title
    ax.set_xlabel("Status", fontsize=9)
    ax.set_ylabel("Assignee", fontsize=9)
    plt.xticks(rotation=30, ha='right', fontsize=9)
    plt.yticks(fontsize=9)

    # Convert to image
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png', bbox_inches='tight', dpi=200)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)

    # HTML embed with clean title
    html = f"""
    <div style="text-align:center; margin-top:60px;">
        <h3>📊 Issue Distribution by Assignee and Status</h3>
        <img src="data:image/png;base64,{image_base64}" style="max-width:80%; border:1px solid #ddd; border-radius:8px;"/>
    </div>
    """
    return html

    # Prepare data
    heatmap_data = defaultdict(lambda: defaultdict(int))
    for issue in issues:
        fields = issue["fields"]
        status = fields.get("status", {}).get("name", "Unknown Status")
        assignee_obj = fields.get("assignee")
        assignee = assignee_obj.get("displayName") if assignee_obj else "Unassigned"
        heatmap_data[assignee][status] += 1

    df = pd.DataFrame(heatmap_data).fillna(0).astype(int).T  # Transpose: rows=assignee

    # Create heatmap
    fig, ax = plt.subplots(figsize=(min(12, 1 + len(df.columns)*2), max(4, 0.6*len(df))))
    sns.heatmap(df, annot=True, fmt='d', cmap="YlGnBu", cbar=False,
                linewidths=0.5, linecolor='#ccc', ax=ax)
    ax.set_title("")  # remove inner title
    ax.set_xlabel("Status", fontsize=11)
    ax.set_ylabel("Assignee", fontsize=11)

    # Improve label spacing
    plt.xticks(rotation=30, ha='right', fontsize=9)
    plt.yticks(fontsize=9)

    # Render as base64 image
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png', bbox_inches='tight', dpi=200)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)

    # Embed in HTML (title outside the image)
    html = f"""
    <div style="text-align:center; margin-top:40px;">
        <h3>Issue Heatmap – Assignee × Status</h3>
        <img src="data:image/png;base64,{image_base64}" style="max-width:100%; border:1px solid #ddd; border-radius:8px;"/>
    </div>
    """
    return html

    # Prepare data for heatmap
    heatmap_data = defaultdict(lambda: defaultdict(int))
    for issue in issues:
        fields = issue["fields"]
        status = fields.get("status", {}).get("name", "Unknown Status")
        assignee_obj = fields.get("assignee")
        assignee = assignee_obj.get("displayName") if assignee_obj else "Unassigned"
        heatmap_data[assignee][status] += 1

    # Convert to DataFrame
    df = pd.DataFrame(heatmap_data).fillna(0).astype(int).T  # Transpose for assignee rows

    # Plot heatmap
    fig, ax = plt.subplots(figsize=(10, max(4, len(df) * 0.5)))
    sns.heatmap(df, annot=True, fmt='d', cmap="YlGnBu", linewidths=0.5, ax=ax)
    plt.title("🧊 Issue Count by Assignee and Status", fontsize=14)
    plt.ylabel("Assignee")
    plt.xlabel("Status")

    # Convert to base64 image
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)

    # Build HTML
    html = f"""
    <div style="text-align:center; margin-top:60px;">
        <h3>🧊 Issue Heatmap (Assignee × Status)</h3>
        <img src="data:image/png;base64,{image_base64}" style="max-width:800px;"/>
    </div>
    """
    return html

def generate_distribution_charts_side_by_side(issues):
    # Count issues per assignee
    assignee_counts = defaultdict(int)
    for issue in issues:
        assignee_obj = issue["fields"].get("assignee")
        assignee = assignee_obj.get("displayName") if assignee_obj else "Unassigned"
        assignee_counts[assignee] += 1

    # Count issues per status
    status_counts = defaultdict(int)
    for issue in issues:
        status = issue["fields"].get("status", {}).get("name", "Unknown Status")
        status_counts[status] += 1

    # Generate assignee chart image
    assignee_labels = list(assignee_counts.keys())
    assignee_sizes = list(assignee_counts.values())

    fig1, ax1 = plt.subplots()
    ax1.pie(assignee_sizes, labels=assignee_labels, autopct='%1.1f%%', startangle=140)
    ax1.axis('equal')
    plt.title("Issue Distribution by Assignee")

    buf1 = io.BytesIO()
    plt.savefig(buf1, format='png', bbox_inches='tight')
    buf1.seek(0)
    assignee_base64 = base64.b64encode(buf1.read()).decode('utf-8')
    plt.close(fig1)

    # Generate status chart image
    status_labels = list(status_counts.keys())
    status_sizes = list(status_counts.values())

    fig2, ax2 = plt.subplots()
    ax2.pie(status_sizes, labels=status_labels, autopct='%1.1f%%', startangle=140)
    ax2.axis('equal')
    plt.title("Issue Distribution by Status")

    buf2 = io.BytesIO()
    plt.savefig(buf2, format='png', bbox_inches='tight')
    buf2.seek(0)
    status_base64 = base64.b64encode(buf2.read()).decode('utf-8')
    plt.close(fig2)

    # Combine both into side-by-side HTML
    html = f"""
    <div style="display: flex; justify-content: space-between; gap: 30px; margin-top: 40px;">
      <div style="flex: 1; text-align: center;">
        <h3>📊 Issue Distribution by Assignee</h3>
        <img src="data:image/png;base64,{assignee_base64}" style="max-width:100%; height:auto;" />
      </div>
      <div style="flex: 1; text-align: center;">
        <h3>📊 Issue Distribution by Status</h3>
        <img src="data:image/png;base64,{status_base64}" style="max-width:100%; height:auto;" />
      </div>
    </div>
    """
    return html