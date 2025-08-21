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
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute(f"""
        CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
            id SERIAL PRIMARY KEY UNIQUE,
            article_id TEXT UNIQUE,
            title TEXT,
            authors TEXT,
            abstract TEXT,
            submission_date TEXT,
            originally_announced TEXT,
            pdf_url TEXT,
            uploaded_file_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    cur.close()
    conn.close()
    print(f"✅ PostgreSQL table '{TABLE_NAME}' is ready.")

def insert_article(article):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cur.execute("""
            INSERT INTO articles (
                article_id, title, authors, abstract,
                submission_date, originally_announced,
                pdf_url, uploaded_file_url
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (article_id) DO NOTHING;
        """, (
            article["article_id"],
            article["title"],
            article["authors"],
            article["abstract"],
            article["submission_date"],
            article["originally_announced"],
            article["pdf_url"],
            article["uploaded_file_url"]
        ))
        conn.commit()
        print(f"📝 Saved: {article['article_id']}")
    except Exception as e:
        print(f"❌ Failed to insert {article['article_id']}: {e}")
    finally:
        cur.close()
        conn.close()

def get_all_article_ids() -> set:
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT article_id FROM articles")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return set(row["article_id"] for row in rows)
