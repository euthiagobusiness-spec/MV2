export function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  if (!images.length) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-12 lg:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">
            Galeria
          </p>
          <h2 className="mt-1 text-3xl font-black text-slate-950">{title}</h2>
        </div>
        <p className="hidden text-sm font-semibold text-slate-500 sm:block">
          Fotos reais da unidade
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((image, index) => (
          <img
            alt={`${title} ${index + 1}`}
            className="aspect-[4/3] w-full rounded-xl object-cover"
            key={image}
            src={image}
          />
        ))}
      </div>
    </section>
  );
}
