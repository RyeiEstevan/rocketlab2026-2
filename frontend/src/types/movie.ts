export interface Review {
    sk_movie_review_id: string;
    nome: string;
    nota: number;
    comentario: string;
    created_at: string;
  }
  
  export interface Movie {
    sk_movie_id: string;
    titulo: string;
    ano_lancamento?: number;
    url_poster?: string;
  }
  
  export interface MovieDetail extends Movie {
    duracao_minutos?: number;
    sinopse?: string;
    status_filme?: string;
    reviews: Review[];
    media_avaliacoes?: number;
  }