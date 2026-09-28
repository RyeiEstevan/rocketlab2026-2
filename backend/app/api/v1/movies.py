from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.movies.models import DimMovie
from app.movies.schemas import MovieResponse
from app.db.session import get_db

router = APIRouter(prefix="/movies", tags=["Movies"])

@router.get("/", response_model=List[MovieResponse])
async def get_movies(db: AsyncSession = Depends(get_db)):
    #define the query
    query =select(DimMovie).limit(50)

    #Await the execution of the query
    result = await db.scalars(query)
    movies = result.all()

    #return the results
    return movies