interface PaginationProps {
    skip: number;
    limit: number;
    isNextDisabled: boolean;
    onPrev: () => void;
    onNext: () => void;
  }
  
  export function Pagination({ skip, limit, isNextDisabled, onPrev, onNext }: PaginationProps) {
    const currentPage = Math.floor(skip / limit) + 1;
  
    return (
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button 
          onClick={onPrev} 
          disabled={skip === 0} 
          style={{ padding: '0.5rem 1rem', cursor: skip === 0 ? 'not-allowed' : 'pointer' }}
        >
          Anterior
        </button>
        <span style={{ alignSelf: 'center' }}>Página {currentPage}</span>
        <button 
          onClick={onNext} 
          disabled={isNextDisabled} 
          style={{ padding: '0.5rem 1rem', cursor: isNextDisabled ? 'not-allowed' : 'pointer' }}
        >
          Seguinte
        </button>
      </div>
    );
  }