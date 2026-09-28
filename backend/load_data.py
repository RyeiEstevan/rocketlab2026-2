import csv
import asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import engine
from app.movies.models import DimMovie

async def load_movies():
    # Open an asynchronous session with the database
    async with AsyncSession(engine) as session:

        # Open the CSV file
        with open("dim_movies.csv", mode="r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                
                # Handle dates: convert string to date object if it exists
                data_lanc = row["data_lancamento"]
                parsed_date = datetime.strptime(data_lanc, "%Y-%m-%d").date() if data_lanc else None
                
                # Handle numbers: convert string to int if it exists
                ano = int(row["ano_lancamento"]) if row["ano_lancamento"] else None
                duracao = int(row["duracao_minutos"]) if row["duracao_minutos"] else None

                # Create a DimMovie object using the SQLAlchemy model
                movie = DimMovie(
                    sk_movie_id=row["sk_movie_id"],
                    id_filme=row["id_filme"],
                    titulo=row["titulo"],
                    data_lancamento=parsed_date,
                    ano_lancamento=ano,
                    duracao_minutos=duracao,
                    status_filme=row["status_filme"],
                    sinopse=row["sinopse"],
                    url_poster=row["url_poster"],
                    url_backdrop=row["url_backdrop"]
                )
                
                # Add the movie to the session
                session.add(movie)
            
            # Commit all the new movies to the database at once
            await session.commit()
            print("Movies successfully loaded into the database!")

if __name__ == "__main__":
    asyncio.run(load_movies())