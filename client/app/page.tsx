import Hero from "@/components/Hero";
import BookingForm from "@/components/BookingForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#EFF6FF]">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-black/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="text-lg font-extrabold tracking-tight">
            <span className="text-text">Taxi</span>
            <span className="text-primary">Tera</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-text/70">
            <a href="#book" className="hover:text-text">Book</a>
            <a href="#learn" className="hover:text-text">How it works</a>
          </nav>
        </div>
      </header>

      <main className="py-6 sm:py-10">
        <Hero />
        <div className="mt-2">
          <BookingForm />
        </div>
      </main>

      <footer className="py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center text-sm text-text/60">
          © {new Date().getFullYear()} TaxiTera. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
