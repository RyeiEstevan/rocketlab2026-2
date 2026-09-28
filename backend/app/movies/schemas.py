from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

#Define what data will be send to the frontend for the catalog list
class MovieResponse(BaseModel):
    sk_movie_id: str
    titulo: str
    ano_lancamento: Optional[int]
    url_poster: Optional[str]

    #Tells to Pydantic where to read the data
    class Config:
        from_attributes = True

#Define the content of a review to show
class ReviewResponse(BaseModel):
    sk_movie_review_id: str
    nome: str
    nota: float
    comentario: str
    created_at: datetime

    class Config:
        from_attributes = True

#get more details about the movie chosen
class MovieDetailresponse(MovieResponse):
    duracao_minutos: Optional[int]
    sinopse: Optional[str]
    status_filme: Optional[str]
    reviews: List[ReviewResponse] = []
    media_avaliacoes: Optional[float] = None

#define the format to create a review
class ReviewCreate(BaseModel):
    nome: str
    #insure the right format of nota
    nota: float = Field(..., ge=0, le=10, description="Noda de 0 a 10")
    comentario: str


class MovieUpdate(BaseModel):
    titulo: Optional[str] = None
    sinopse: Optional[str] = None
    status_filme: Optional[str] = None
    ano_lancamento: Optional[int] = None
    duracao_minutos: Optional[int] = None

class MovieCreate(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=255)
    sinopse: Optional[str] = None
    status_filme: Optional[str] = None
    ano_lancamento: Optional[int] = Field(None, ge=1888, le=2100)
    duracao_minutos: Optional[int] = Field(None, gt=0)
    url_poster: Optional[str] = None