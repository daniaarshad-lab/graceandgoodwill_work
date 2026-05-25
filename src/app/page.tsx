export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-navy-950 px-6 py-16 text-gold-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-gold-200">
            Grace & Goodwill
          </p>
          <h1 className="text-5xl font-semibold leading-tight text-gold-50 sm:text-6xl">
            Because the right support changes everything.
          </h1>
          <p className="text-lg text-gold-200 max-w-3xl">
            Helping families find trusted live in support with confidence,
            continuity, and an experience that feels personal from the very
            beginning.
          </p>

          <div className="prose max-w-xl text-gold-200">
            <p>
              At Grace & Goodwill, we believe welcoming somebody into your home
              is one of the most important decisions a family can make.
            </p>
            <p>
              People are not simply choosing support. They are placing trust in
              somebody to become part of everyday life. That experience should
              feel calm, considered, and supported.
            </p>
            <p>
              Grace & Goodwill was created to help families find carefully
              matched live in support while creating an experience built around
              trust, continuity, and genuine human connection.
            </p>
            <p>
              Our role goes beyond introductions. We help families feel
              supported throughout the journey and provide continuity if
              circumstances change or support needs evolve.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-navy-950 shadow-elegant transition hover:bg-gold-400"
            >
              Find Support
            </a>
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-gold-300 px-8 py-4 text-sm font-semibold text-gold-100 transition hover:bg-navy-900/80"
            >
              Join As A Carer
            </a>
          </div>
        </div>

        <div className="rounded-[32px] border border-gold-300/20 bg-navy-900/80 p-8 shadow-elegant backdrop-blur-lg lg:max-w-md">
          <div className="flex items-center gap-4 rounded-3xl border border-gold-300/20 bg-navy-950/80 p-5">
            <img
              src="/logo.svg"
              alt="Grace & Goodwill logo"
              className="h-16 w-16 rounded-xl border border-gold-300/30 bg-navy-900 p-2"
            />
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-gold-200">
                Grace & Goodwill
              </p>
              <p className="text-2xl font-semibold text-gold-50">
                Care defined by integrity
              </p>
            </div>
          </div>
          <div className="mt-6 text-gold-200 space-y-3">
            <p>
              Designed to feel premium and personal, our platform brings harmony
              to care teams and families while supporting every touchpoint with
              clarity.
            </p>
            <p>
              Whether you&apos;re exploring live in options for the first time
              or navigating a change in care, our team is here to guide you
              every step of the way.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
