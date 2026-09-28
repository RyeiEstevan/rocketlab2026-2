import { useEffect, useState } from 'react';
import api from './services/api';
import type { Movie, MovieDetail } from './types/movie';
import './App.css';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  
  // Estados de Edição e Criação
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<MovieDetail>>({});
  
  const [isCreatingMovie, setIsCreatingMovie] = useState(false);
  const [newMovieForm, setNewMovieForm] = useState({ titulo: '', ano_lancamento: '', duracao_minutos: '', status_filme: '', sinopse: '' });

  const [newReviewForm, setNewReviewForm] = useState({ nome: '', nota: 5, comentario: '' });
  
  const limit = 10;

  useEffect(() => {
    fetchMovies();
  }, [skip, search]);

  const fetchMovies = async () => {
    try {
      const response = await api.get('/movies/', {
        params: { skip, limit, titulo: search || undefined },
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
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
    }
  };

  const handleDeleteMovie = async (id: string) => {
    if (!window.confirm("Tem a certeza que deseja eliminar este filme?")) return;
    try {
      await api.delete(`/movies/${id}`);
      setMovies(movies.filter((movie) => movie.sk_movie_id !== id));
      setSelectedMovie(null);
      alert("Filme removido com sucesso!");
    } catch (error) {
      console.error('Erro ao eliminar o filme:', error);
    }
  };

  const handleUpdateMovie = async () => {
    if (!selectedMovie) return;
    try {
      const response = await api.patch(`/movies/${selectedMovie.sk_movie_id}`, editForm);
      const updatedMovie = { ...selectedMovie, ...response.data };
      setSelectedMovie(updatedMovie);
      setMovies(movies.map(m => m.sk_movie_id === updatedMovie.sk_movie_id ? updatedMovie : m));
      setIsEditing(false);
      alert("Filme atualizado com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar o filme:', error);
    }
  };

  // 1. Função para Criar Filme
  const handleCreateMovie = async () => {
    try {
      const payload = {
        ...newMovieForm,
        ano_lancamento: Number(newMovieForm.ano_lancamento),
        duracao_minutos: Number(newMovieForm.duracao_minutos)
      };
      await api.post('/movies/', payload);
      alert("Filme criado com sucesso!");
      setIsCreatingMovie(false);
      setNewMovieForm({ titulo: '', ano_lancamento: '', duracao_minutos: '', status_filme: '', sinopse: '' });
      fetchMovies(); // Recarrega a lista para mostrar o novo filme
    } catch (error) {
      console.error('Erro ao criar filme:', error);
      alert("Erro ao criar filme.");
    }
  };

  // 2. Função para Criar Avaliação
  const handleCreateReview = async () => {
    if (!selectedMovie) return;
    try {
      const payload = {
        sk_movie_id: selectedMovie.sk_movie_id, // Assumindo que a API precisa saber qual é o filme
        nome: newReviewForm.nome,
        nota: Number(newReviewForm.nota),
        comentario: newReviewForm.comentario
      };
      
      
      await api.post(`/movies/${selectedMovie.sk_movie_id}/reviews`, {
        nome: newReviewForm.nome,
        nota: Number(newReviewForm.nota),
        comentario: newReviewForm.comentario
      }); 
      alert("Avaliação adicionada com sucesso!");
      setNewReviewForm({ nome: '', nota: 5, comentario: '' });
      
      // Recarrega os detalhes do filme para exibir a nova avaliação
      handleMovieClick(selectedMovie.sk_movie_id); 
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      alert("Erro ao adicionar avaliação.");
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <h1>Catálogo de Filmes 🎬</h1>
        <div style={{ display: 'flex', gap: '1rem', width: '50%' }}>
          <input
            type="text"
            placeholder="Pesquisar por título..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
            style={{ padding: '0.5rem 1rem', flex: 1, fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button onClick={() => setIsCreatingMovie(true)} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Novo Filme
          </button>
        </div>
      </header>

      {/* Grelha de Filmes (Mantida igual) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {movies.map((movie) => (
          <div
            key={movie.sk_movie_id}
            onClick={() => handleMovieClick(movie.sk_movie_id)}
            style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', textAlign: 'center', background: '#f9f9f9', cursor: 'pointer' }}
          >
            {movie.url_poster ? (
              <img src={movie.url_poster} alt={movie.titulo} style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '4px' }} />
            ) : (
              <div style={{ width: '100%', height: '280px', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sem Poster</div>
            )}
            <h3 style={{ fontSize: '1rem', margin: '0.5rem 0', color: '#333' }}>{movie.titulo}</h3>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>{movie.ano_lancamento || 'N/D'}</p>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button onClick={() => setSkip(Math.max(0, skip - limit))} disabled={skip === 0} style={{ padding: '0.5rem 1rem' }}>Anterior</button>
        <span style={{ alignSelf: 'center' }}>Página {Math.floor(skip / limit) + 1}</span>
        <button onClick={() => setSkip(skip + limit)} disabled={movies.length < limit} style={{ padding: '0.5rem 1rem' }}>Seguinte</button>
      </div>

      {/* Modal de Criação de Filme */}
      {isCreatingMovie && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '600px', width: '90%', color: '#333' }}>
            <h2>Adicionar Novo Filme</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Título: <input type="text" value={newMovieForm.titulo} onChange={e => setNewMovieForm({...newMovieForm, titulo: e.target.value})} style={{ width: '100%' }} /></label>
              <label>Ano: <input type="number" value={newMovieForm.ano_lancamento} onChange={e => setNewMovieForm({...newMovieForm, ano_lancamento: e.target.value})} style={{ width: '100%' }} /></label>
              <label>Duração (min): <input type="number" value={newMovieForm.duracao_minutos} onChange={e => setNewMovieForm({...newMovieForm, duracao_minutos: e.target.value})} style={{ width: '100%' }} /></label>
              <label>Estado: <input type="text" value={newMovieForm.status_filme} onChange={e => setNewMovieForm({...newMovieForm, status_filme: e.target.value})} style={{ width: '100%' }} /></label>
              <label>Sinopse: <textarea value={newMovieForm.sinopse} onChange={e => setNewMovieForm({...newMovieForm, sinopse: e.target.value})} style={{ width: '100%', minHeight: '80px' }} /></label>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handleCreateMovie} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', flex: 1 }}>Criar Filme</button>
                <button onClick={() => setIsCreatingMovie(false)} style={{ background: '#f44336', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', flex: 1 }}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes / Edição / Avaliações */}
      {selectedMovie && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto', color: '#333' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2>{isEditing ? 'Editar Filme' : `${selectedMovie.titulo} (${selectedMovie.ano_lancamento})`}</h2>
              <button onClick={() => setSelectedMovie(null)} style={{ background: '#ccc', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Fechar</button>
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Título: <input type="text" value={editForm.titulo || ''} onChange={e => setEditForm({...editForm, titulo: e.target.value})} style={{ width: '100%' }} /></label>
                <label>Ano: <input type="number" value={editForm.ano_lancamento || ''} onChange={e => setEditForm({...editForm, ano_lancamento: Number(e.target.value)})} style={{ width: '100%' }} /></label>
                <label>Duração (min): <input type="number" value={editForm.duracao_minutos || ''} onChange={e => setEditForm({...editForm, duracao_minutos: Number(e.target.value)})} style={{ width: '100%' }} /></label>
                <label>Estado: <input type="text" value={editForm.status_filme || ''} onChange={e => setEditForm({...editForm, status_filme: e.target.value})} style={{ width: '100%' }} /></label>
                <label>Sinopse: <textarea value={editForm.sinopse || ''} onChange={e => setEditForm({...editForm, sinopse: e.target.value})} style={{ width: '100%', minHeight: '80px' }} /></label>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={handleUpdateMovie} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', flex: 1 }}>Guardar</button>
                  <button onClick={() => setIsEditing(false)} style={{ background: '#f44336', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', flex: 1 }}>Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <p><strong>Duração:</strong> {selectedMovie.duracao_minutos ? `${selectedMovie.duracao_minutos} minutos` : 'N/D'}</p>
                <p><strong>Estado:</strong> {selectedMovie.status_filme || 'N/D'}</p>
                <p><strong>Média de Avaliações:</strong> ⭐ {selectedMovie.media_avaliacoes ?? 'Sem avaliações'}</p>
                <p><strong>Sinopse:</strong> {selectedMovie.sinopse || 'Sem sinopse disponível.'}</p>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={() => { setEditForm(selectedMovie); setIsEditing(true); }} style={{ background: '#2196F3', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', flex: 1 }}>✏️ Editar</button>
                  <button onClick={() => handleDeleteMovie(selectedMovie.sk_movie_id)} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', flex: 1 }}>🗑️ Eliminar</button>
                </div>

                <hr style={{ margin: '1.5rem 0' }} />
                <h3>Avaliações</h3>
                
                {/* Lista de Avaliações */}
                {selectedMovie.reviews?.length ? (
                  selectedMovie.reviews.map((review) => (
                    <div key={review.sk_movie_review_id} style={{ background: '#f1f1f1', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.75rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{review.nome} - ⭐ {review.nota}</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>{review.comentario}</p>
                    </div>
                  ))
                ) : <p>Ainda não existem avaliações.</p>}

                {/* Formulário de Nova Avaliação */}
                <div style={{ marginTop: '1.5rem', background: '#fafafa', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <h4 style={{ margin: '0 0 1rem 0' }}>Adicionar Avaliação</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input type="text" placeholder="O seu nome" value={newReviewForm.nome} onChange={e => setNewReviewForm({...newReviewForm, nome: e.target.value})} style={{ padding: '0.5rem' }} />
                    <label>Nota (0 a 10): 
                      <input type="number" min="0" max="10" value={newReviewForm.nota} onChange={e => setNewReviewForm({...newReviewForm, nota: Number(e.target.value)})} style={{ padding: '0.5rem', marginLeft: '0.5rem', width: '60px' }} />
                    </label>
                    <textarea placeholder="Escreva a sua resenha..." value={newReviewForm.comentario} onChange={e => setNewReviewForm({...newReviewForm, comentario: e.target.value})} style={{ padding: '0.5rem', minHeight: '60px' }} />
                    <button onClick={handleCreateReview} style={{ background: '#2196F3', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Enviar Avaliação</button>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;