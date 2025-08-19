# app/db.py

import psycopg2
from psycopg2.extras import RealDictCursor
from app.config import POSTGRES

TABLE_NAME = "articles"

def get_connection():
    return psycopg2.connect(
        host=POSTGRES["host"],
        port=POSTGRES["port"],
        user=POSTGRES["user"],
        password=POSTGRES["password"],
        dbname=POSTGRES["database"]
    )

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(f"""
        CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
            id TEXT PRIMARY KEY,
            title TEXT,
            authors TEXT,
            abstract TEXT,
            submission_date TEXT,
            pdf_url TEXT
        );
    """)
    conn.commit()
    cur.close()
    conn.close()
    print(f"✅ PostgreSQL table '{TABLE_NAME}' is ready.")

def insert_article(article):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(f"""
            INSERT INTO {TABLE_NAME} (id, title, authors, abstract, submission_date, pdf_url)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING;
        """, (
            article["id"],
            article["title"],
            article["authors"],
            article["abstract"],
            article["submission_date"],
            article["pdf_url"]
        ))
        conn.commit()
        print(f"📝 Saved: {article['id']}")
    except Exception as e:
        print(f"❌ Failed to insert {article['id']}: {e}")
    finally:
        cur.close()
        conn.close()
