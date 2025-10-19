export default function FAQ() {
  const faqs = [
    { q: 'Can I cancel a booking?', a: 'Yes, go to Dashboard and click Cancel.' },
    { q: 'Do I need an account?', a: 'You can browse without, but booking requires login.' },
    { q: 'Which routes are supported?', a: 'Popular stations like Piassa, Megenagna, Bole, and more.' },
  ];
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:3xl font-bold text-text text-center">FAQ</h2>
        <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <dt className="font-semibold text-text">{f.q}</dt>
              <dd className="mt-2 text-sm text-text/70">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}


