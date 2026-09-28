import { useState } from 'react';
import api from '../services/api';
import type { Movie, MovieDetail } from '../types/movie';
import { toMoviePayload, type MovieFormValues } from '../components/MovieForm';

export interface ReviewFormValues {
  nome: string;
  nota: number;
  comentario: string;
}

interface Options {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export function useMovieDetail({ setMovies }: Options) {
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);

  const openMovie = async (id: string) => {
    try {
      const response = await api.get(`/movies/${id}`);
      setSelectedMovie(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
    }
  };

  const closeMovie = () => setSelectedMovie(null);

  const deleteMovie = async (id: string) => {
    if (!window.confirm('Tem a certeza que deseja eliminar este filme?')) return;
    try {
      await api.delete(`/movies/${id}`);
      setMovies((prev) => prev.filter((m) => m.sk_movie_id !== id));
      setSelectedMovie(null);
      alert('Filme removido com sucesso!');
    } catch (error) {
      console.error('Erro ao eliminar o filme:', error);
    }
  };

  /** Devolve true se a atualização correu bem (para o modal sair do modo edição). */
  const updateMovie = async (form: MovieFormValues): Promise<boolean> => {
    if (!selectedMovie) return false;
    try {
      const response = await api.patch(
        `/movies/${selectedMovie.sk_movie_id}`,
        toMoviePayload(form)
      );
      const updated = { ...selectedMovie, ...response.data };
      setSelectedMovie(updated);
      setMovies((prev) =>
        prev.map((m) => (m.sk_movie_id === updated.sk_movie_id ? updated : m))
      );
      alert('Filme atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar o filme:', error);
      return false;
    }
  };

  /** Devolve true se a avaliação foi criada (para o formulário limpar). */
  const createReview = async (form: ReviewFormValues): Promise<boolean> => {
    if (!selectedMovie) return false;
    try {
      await api.post(`/movies/${selectedMovie.sk_movie_id}/reviews`, {
        nome: form.nome,
        nota: Number(form.nota),
        comentario: form.comentario,
      });
      alert('Avaliação adicionada com sucesso!');
      await openMovie(selectedMovie.sk_movie_id); // recarrega para mostrar a nova avaliação
      return true;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      alert('Erro ao adicionar avaliação.');
      return false;
    }
  };

  return { selectedMovie, openMovie, closeMovie, deleteMovie, updateMovie, createReview };
}