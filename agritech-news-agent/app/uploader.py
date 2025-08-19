import os
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from dotenv import load_dotenv

load_dotenv()

SPACES_KEY = os.getenv("SPACES_KEY")
SPACES_SECRET = os.getenv("SPACES_SECRET")
SPACES_REGION = os.getenv("SPACES_REGION")
SPACES_BUCKET = os.getenv("SPACES_BUCKET")
SPACES_ENDPOINT = os.getenv("SPACES_ENDPOINT")

PDF_FOLDER = "agritech-news-agent-pdfs"

session = boto3.session.Session()
s3 = session.client(
    service_name="s3",
    region_name=SPACES_REGION,
    endpoint_url=SPACES_ENDPOINT,
    aws_access_key_id=SPACES_KEY,
    aws_secret_access_key=SPACES_SECRET,
)

def upload_pdf_to_spaces(file_path, object_name=None):
    if object_name is None:
        object_name = os.path.basename(file_path)

    # Prefix with folder path
    object_key = f"{PDF_FOLDER}/{object_name}"

    try:
        s3.upload_file(file_path, SPACES_BUCKET, object_key, ExtraArgs={"ACL": "public-read"})
        url = f"{SPACES_ENDPOINT}/{SPACES_BUCKET}/{object_key}"
        print(f"✅ Uploaded to {url}")
        return url
    except (NoCredentialsError, ClientError) as e:
        print(f"❌ Upload failed: {e}")
        return None
