export default function Hero() {
  return (
    <section className="w-full py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-black/5">
          <span className="h-2 w-2 rounded-full bg-primary"></span>
          <span className="text-xs font-medium text-text/70">Urban rides, made simple</span>
        </div>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text">
          <span className="text-text">Taxi</span>
          <span className="text-primary">Tera</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-text/70">
          Book your ride instantly.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#book"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white shadow-lg shadow-primary/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Book Now
          </a>
          <a
            href="#learn"
            className="inline-flex items-center justify-center rounded-full bg-accent/10 px-6 py-3 text-text shadow-sm ring-1 ring-accent/40 transition hover:bg-accent/20"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}


