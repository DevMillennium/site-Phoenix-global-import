export default function ProdutosLoading() {
  return (
    <div className="container py-6 sm:py-8 md:py-12" role="status" aria-label="Carregando produtos">
      <div className="mb-8 sm:mb-10">
        <div className="h-9 bg-phoenix-card rounded-lg w-48 animate-pulse" />
        <div className="mt-2 h-4 bg-phoenix-card rounded w-96 max-w-full animate-pulse" />
      </div>
      <div className="mb-8 sm:mb-10 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-20 bg-phoenix-card rounded-lg animate-pulse" />
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i} className="rounded-xl bg-phoenix-card border border-phoenix-border overflow-hidden">
            <div className="aspect-square bg-phoenix-surface animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-phoenix-surface rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-phoenix-surface rounded w-1/2 animate-pulse" />
              <div className="h-5 bg-phoenix-surface rounded w-1/3 animate-pulse" />
            </div>
          </li>
        ))}
      </ul>
      <span className="sr-only">Carregando lista de produtos</span>
    </div>
  );
}
