from fastapi import APIRouter
from app.api.v1 import movies
api_router = APIRouter()

#all the routes will be displayed here

api_router.include_router(movies.router)