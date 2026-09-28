import { useEffect, useState } from 'react';
import api from './services/api';
import type { Movie, MovieDetail } from './types/movie';
import './App.css';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const limit = 10;

  useEffect(() => {
    fetchMovies();
  }, [skip, search]);

  const fetchMovies = async () => {
    try {
      const response = await api.get('/movies/', {
        params: {
          skip: skip,
          limit: limit,
          titulo: search || undefined,
        },
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    }
  };

  const handleMovieClick = async (id: string) => {
    try {
      const response = await api.get(`/movies/${id}`);
      setSelectedMovie(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Catálogo de Filmes 🎬</h1>
        <input
          type="text"
          placeholder="Pesquisar por título..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSkip(0);
          }}
          style={{ padding: '0.5rem 1rem', width: '50%', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {movies.map((movie) => (
          <div
            key={movie.sk_movie_id}
            onClick={() => handleMovieClick(movie.sk_movie_id)}
            style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', textAlign: 'center', background: '#f9f9f9', cursor: 'pointer', transition: 'transform 0.2s' }}
          >
            {movie.url_poster ? (
              <img src={movie.url_poster} alt={movie.titulo} style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '4px' }} />
            ) : (
              <div style={{ width: '100%', height: '280px', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sem Poster</div>
            )}
            <h3 style={{ fontSize: '1rem', margin: '0.5rem 0', color: '#333' }}>{movie.titulo}</h3>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>{movie.ano_lancamento || 'Ano desconhecido'}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          onClick={() => setSkip(Math.max(0, skip - limit))}
          disabled={skip === 0}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Anterior
        </button>
        <span style={{ alignSelf: 'center' }}>Página {Math.floor(skip / limit) + 1}</span>
        <button
          onClick={() => setSkip(skip + limit)}
          disabled={movies.length < limit}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Seguinte
        </button>
      </div>

      {selectedMovie && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto', position: 'relative', color: '#333' }}>
            <button
              onClick={() => setSelectedMovie(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ff4d4d', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              Fechar
            </button>
            <h2>{selectedMovie.titulo} ({selectedMovie.ano_lancamento})</h2>
            <p><strong>Duração:</strong> {selectedMovie.duracao_minutos ? `${selectedMovie.duracao_minutos} minutos` : 'N/D'}</p>
            <p><strong>Estado:</strong> {selectedMovie.status_filme || 'N/D'}</p>
            <p><strong>Média de Avaliações:</strong> ⭐ {selectedMovie.media_avaliacoes !== null && selectedMovie.media_avaliacoes !== undefined ? selectedMovie.media_avaliacoes : 'Sem avaliações'}</p>
            <p><strong>Sinopse:</strong> {selectedMovie.sinopse || 'Sem sinopse disponível.'}</p>

            <hr style={{ margin: '1.5rem 0' }} />
            <h3>Avaliações</h3>
            {selectedMovie.reviews && selectedMovie.reviews.length > 0 ? (
              selectedMovie.reviews.map((review) => (
                <div key={review.sk_movie_review_id} style={{ background: '#f1f1f1', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.75rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{review.nome} - ⭐ {review.nota}</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>{review.comentario}</p>
                </div>
              ))
            ) : (
              <p>Ainda não existem avaliações para este filme.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;