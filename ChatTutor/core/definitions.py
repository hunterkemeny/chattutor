from pydoc import doc
from typing import Any, Optional
from pydantic import BaseModel
import json

from nice_functions import pprint 

DocKey = Any


class Doc(BaseModel):
    """Doc class that characterizes a paper. It is used
    as an identificator for texts inside the document.

    Attributes:
        docname (str): name of the document
        ciration (str): citation
        dockey (DocKey - Any): dockey

    Args:
        BaseModel
    """

    docname: str
    citation: str
    dockey: DocKey
    title: Optional[str]
    authors: Optional[str]
    published: Optional[str]
    links: Optional[str]
    summary: Optional[str]

class Text(BaseModel):
    """Texts from a document that can be added to databases
    or used for embeddings

    Attributes:
        text (str): text
        doc (Doc): document

    Args:
        BaseModel
    """

    text: str
    doc: Doc
    name: str
    section: Optional[str]
    page: Optional[int]
    chunk: Optional[int]

    def get_metadata(self):
        metadata = self.doc.dict()
        metadata.update( self.dict() )
        metadata.pop("text")
        for k,v in metadata.copy().items():
            if not v: metadata.pop(k)
        metadata["doc"] = self.doc.docname
        # pprint("metadata", metadata)
        return metadata

    def get_text(self):
        return self.text


    def __repr__(self) -> str:
        return super().dict().__repr__()

    def __str__(self) -> str:
        return json.dumps(super().dict(), indent=2, ensure_ascii=False)
