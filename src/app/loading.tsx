export default function Loading() {
  return (
    <div className="container mx-auto flex min-h-[40vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-phoenix-primary border-t-transparent"
          aria-hidden
        />
        <p className="text-sm text-phoenix-text-muted">Carregando...</p>
      </div>
    </div>
  );
}
