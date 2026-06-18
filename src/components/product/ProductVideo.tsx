"use client";

interface ProductVideoProps {
  src: string;
  poster?: string;
  title: string;
}

/** Player de vídeo do produto (MP4 hospedado no site). */
export function ProductVideo({ src, poster, title }: ProductVideoProps) {
  return (
    <section className="mt-4" aria-label={`Vídeo de ${title}`}>
      <p className="mb-2 text-sm font-medium text-phoenix-text-muted">Vídeo do produto</p>
      <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-phoenix-border bg-black">
        <video
          className="aspect-video w-full"
          controls
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={`Reproduzir vídeo: ${title}`}
        >
          <source src={src} type="video/mp4" />
          Seu navegador não suporta reprodução de vídeo.
        </video>
      </div>
    </section>
  );
}
