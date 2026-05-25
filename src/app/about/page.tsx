export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16">
      <section className="rounded-2xl bg-navy-950 text-gold-50 shadow-lg ring-1 ring-navy-900/40 p-12">
        <div className="mx-auto max-w-5xl flex flex-col gap-8 md:flex-row md:items-center">
          <div className="md:w-2/3">
            <h1 className="text-4xl font-serif font-semibold leading-tight sm:text-5xl">
              More than introductions. A service built around people.
            </h1>

            <p className="mt-4 text-lg text-gold-200 max-w-3xl">
              Grace & Goodwill was created from real experience and a belief
              that support should feel reassuring from the very beginning.
            </p>

            <p className="mt-4 text-base text-gold-200 max-w-3xl leading-relaxed">
              We understand families are not simply searching for availability —
              they are searching for somebody they can trust and a process that
              feels calm, personal, and dependable. Our role is to help connect
              people with carefully selected support while helping maintain
              continuity, communication, and meaningful human connection.
            </p>
          </div>

          <div className="md:w-1/3">
            <div className="rounded-xl bg-navy-900/60 border border-navy-800 p-6">
              <div className="flex items-center gap-4">
                <img
                  src="/logo.svg"
                  alt="Grace & Goodwill logo"
                  className="h-12 w-12 rounded-md border border-gold-400 p-1 bg-navy-900"
                />
                <div>
                  <p className="text-sm uppercase tracking-widest text-gold-200">
                    Grace & Goodwill
                  </p>
                  <p className="text-lg font-medium text-gold-50">
                    A human-centred approach to live in support
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gold-200">
                Whether you&apos;re exploring live in options for the first time
                or navigating a change in care, our team is here to guide you
                with warmth and expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <h2 className="mt-8 mb-6 text-2xl font-semibold text-navy-950">
          Our values
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm border-l-4 border-gold-400">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-md bg-gold-50/10 flex items-center justify-center text-gold-400">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-navy-950">Integrity</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Doing things properly, keeping our word, and treating every
                  family and carer with honesty and respect.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border-l-4 border-gold-400">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-md bg-gold-50/10 flex items-center justify-center text-gold-400">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M12 21s-6-4.35-9-7.2C1.5 11.3 3 6 7.5 6 9 6 12 8 12 8s3-2 4.5-2C21 6 22.5 11.3 21 13.8 18 16.65 12 21 12 21z"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-navy-950">Compassion</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Taking time to listen, understand, and remember that behind
                  every enquiry there is a real person and a real story.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border-l-4 border-gold-400">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-md bg-gold-50/10 flex items-center justify-center text-gold-400">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M12 2a7 7 0 017 7v4l3 3v1H2v-1l3-3V9a7 7 0 017-7z"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-navy-950">Trust</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Creating relationships people feel comfortable relying on,
                  especially when life feels uncertain.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border-l-4 border-gold-400">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-md bg-gold-50/10 flex items-center justify-center text-gold-400">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M12 2v20M2 12h20"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-navy-950">Purpose</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Helping people feel supported, connected, and able to remain
                  where they feel most themselves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
