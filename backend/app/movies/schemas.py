from pydantic import BaseModel
from typing import Optional

#Defines what data will be send to the frontend for the catalog list
class MovieResponse(BaseModel):
    sk_movie_id: str
    titulo: str
    ano_lancamento: Optional[int]
    url_poster: Optional[str]

    #Tells to Pydantic where to read the data
    class config:
        from_attributes = True

#get more details about the movie chosen
class MovieDetailresponse(MovieResponse):
    duracao_minutos: Optional[int]
    sinopse: Optional[str]
    status_filme: Optional[str]
