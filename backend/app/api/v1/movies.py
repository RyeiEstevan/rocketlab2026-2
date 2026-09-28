from fastapi import APIRouter, Depends
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List

from app.movies.models import DimMovie, MovieReview
from app.movies.schemas import MovieResponse, MovieDetailresponse, ReviewCreate, ReviewResponse

from app.db.session import get_db

router = APIRouter(prefix="/movies", tags=["Movies"])

@router.get("/", response_model=List[MovieResponse])
async def get_movies(skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db)):
    #define the query, having offset and limit to handle pagination
    query =select(DimMovie).offset(skip).limit(limit)

    #Await the execution of the query
    result = await db.scalars(query)
    movies = result.all()

    #return the results
    return movies

@router.get("/{movie_id}", response_model=MovieDetailresponse)
async def get_movie_detail(movie_id: str, db: AsyncSession = Depends(get_db)):
    #create for the movie with the url id = sk_movie_id and also get the reviews
    query = (
        select(DimMovie)
        .options(selectinload(DimMovie.reviews))
        .where(DimMovie.sk_movie_id == movie_id)
    )
    
    result = await db.scalars(query)
    movie = result.first()
    #if the movie doesnt exists, return an error 404(Not Found)
    if not movie:
        raise HTTPException(status_code=404, detail="Filme não encontrado")
    
    #return the movie
    return movie

@router.post("/{movie_id}/reviews", response_model=ReviewResponse)
async def create_movie_review(movie_id: str, review: ReviewCreate, db: AsyncSession = Depends(get_db)):
    #First, check if the movie exists
    query = select(DimMovie).where(DimMovie.sk_movie_id == movie_id)
    result = await db.scalars(query)
    movie = result.first()

    if not movie:
        raise HTTPException(status_code=404, detail="Filme não encontrado")
    
    #create the new review object
    new_review = MovieReview(
        sk_movie_id=movie_id,
        nome=review.nome,
        nota=review.nota,
        comentario=review.comentario
    )

    #load it to the db
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)

    return new_review