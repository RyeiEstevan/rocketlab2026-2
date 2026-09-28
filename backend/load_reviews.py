import csv
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import engine
from app.movies.models import MovieReview

async def load_reviews():
    async with AsyncSession(engine) as session:
        # Garante que o nome do ficheiro corresponde ao que descarregaste
        with open("movies_reviews.csv", mode="r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                review = MovieReview(
                    sk_movie_review_id=row["sk_movie_review_id"],
                    sk_movie_id=row["sk_movie_id"],
                    nome=row["nome"],
                    # A nota vem como string do CSV, precisamos de a converter para float
                    nota=float(row["nota"]),
                    comentario=row["comentario"]
                )
                session.add(review)
            
            # Guardamos todas as avaliações na base de dados de uma só vez
            await session.commit()
            print("Avaliações carregadas com sucesso na base de dados!")

if __name__ == "__main__":
    asyncio.run(load_reviews())