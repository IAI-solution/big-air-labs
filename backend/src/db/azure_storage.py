import os
import uuid
from fastapi import UploadFile, HTTPException
from azure.storage.blob import BlobServiceClient, ContentSettings
from dotenv import load_dotenv
load_dotenv()

BLOB_CONN_STR = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
BLOB_CONTAINER = os.getenv("AZURE_BLOB_CONTAINER", "blog-assets")

blob_service = BlobServiceClient.from_connection_string(BLOB_CONN_STR)
container = blob_service.get_container_client(BLOB_CONTAINER)

async def upload_to_azure(file: UploadFile) -> str:
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files allowed")

    ext = os.path.splitext(file.filename)[1] or ".bin"
    blob_name = f"{uuid.uuid4().hex}{ext.lower()}"
    blob = container.get_blob_client(blob_name)

    blob.upload_blob(
        file.file,
        overwrite=False,
        content_settings=ContentSettings(content_type=file.content_type),
    )
    return blob.url