import sys
import os
import psycopg2
import csv

DB_HOST = os.getenv("POSTGRES_HOST", "your_host")
DB_PORT = os.getenv("POSTGRES_PORT", "your_port")
DB_NAME = os.getenv("POSTGRES_DB", "your_db")
DB_USER = os.getenv("POSTGRES_USER", "your_user")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "your_pass")

def export_table(table_name, out_path):
    conn = psycopg2.connect(
        host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASS
    )
    cur = conn.cursor()
    with open(out_path, "w", encoding="utf-8") as f:
        cur.copy_expert(f"COPY {table_name} TO STDOUT WITH CSV HEADER", f)
    print(f"✅ Exported table '{table_name}' to {out_path}")
    cur.close()
    conn.close()

def import_table(csv_path, table_name):
    conn = psycopg2.connect(
        host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASS
    )
    cur = conn.cursor()

    # Step 1: Read the header row from CSV to get column names
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        headers = next(reader)  # first row
    # Sanitize column names (wrap in quotes to preserve case/special chars)
    columns = ', '.join(f'"{col}" TEXT' for col in headers)

    # Step 2: Create table if not exists
    create_sql = f'CREATE TABLE IF NOT EXISTS "{table_name}" ({columns});'
    cur.execute(create_sql)

    # Step 3: Import data
    with open(csv_path, "r", encoding="utf-8") as f:
        cur.copy_expert(f'COPY "{table_name}" FROM STDIN WITH CSV HEADER', f)

    conn.commit()
    print(f"✅ Imported data from '{csv_path}' into table '{table_name}'")

    cur.close()
    conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python table_csv_tool.py export <table_name>")
        print("       python table_csv_tool.py import <csv_file>")
        sys.exit(1)
    action = sys.argv[1]
    param = sys.argv[2]
    if action == "export":
        export_table(param, f"{param}.csv")
    elif action == "import":
        table_name = os.path.splitext(os.path.basename(param))[0]
        import_table(param, table_name)
    else:
        print("Unknown action.")
        sys.exit(1)
