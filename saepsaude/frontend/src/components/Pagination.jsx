export default function Pagination({ pagina, totalPaginas, onChange }) {
  const pages = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <nav className="pagination">
      <button disabled={pagina === 1} onClick={() => onChange(pagina - 1)}>
        Anterior
      </button>

      {pages.map(page => (
        <button
          key={page}
          className={pagina === page ? "active" : ""}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}

      <button disabled={pagina === totalPaginas} onClick={() => onChange(pagina + 1)}>
        Próximo
      </button>
    </nav>
  );
}
