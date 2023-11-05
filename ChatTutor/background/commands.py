from core.openai_tools import load_api_keys
from core.extensions import (
    db
)

def add_texts_to_collection(collection_name, texts):
    load_api_keys()
    db.init_db()    
    db.load_datasource(collection_name)
    db.add_texts(texts)