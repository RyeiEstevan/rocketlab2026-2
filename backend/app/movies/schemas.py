from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

#Define what data will be send to the frontend for the catalog list
class MovieResponse(BaseModel):
    sk_movie_id: str
    titulo: str
    ano_lancamento: Optional[int]
    url_poster: Optional[str]

    #Tells to Pydantic where to read the data
    class config:
        from_attributes = True

#Define the content of a review
class ReviewResponse(BaseModel):
    sk_movie_review_id: str
    nome: str
    nota: float
    comentario: str
    created_at: datetime

    class config:
        from_attributes = True

#get more details about the movie chosen
class MovieDetailresponse(MovieResponse):
    duracao_minutos: Optional[int]
    sinopse: Optional[str]
    status_filme: Optional[str]
    reviews: List[ReviewResponse] = []
