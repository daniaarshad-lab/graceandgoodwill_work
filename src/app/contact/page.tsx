export default function ContactPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 text-slate-900">
      <section className="rounded-[2rem] bg-white/95 p-10 shadow-soft ring-1 ring-slate-200">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Questions? Our team is ready to help. Reach out and we’ll connect you
          with the right care operations specialist.
        </p>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-[1.75rem] bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-semibold text-slate-950">
            Get in touch
          </h2>
          <p className="mt-4 text-slate-600 leading-7">
            Email us at{" "}
            <a
              href="mailto:support@care-platform.example"
              className="text-sky-600 hover:underline"
            >
              support@care-platform.example
            </a>{" "}
            or call +1 (555) 123-4567.
          </p>
        </div>

        <div className="rounded-[1.75rem] bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-semibold text-slate-950">
            Office hours
          </h2>
          <p className="mt-4 text-slate-600 leading-7">
            Monday–Friday, 8am–6pm PT.
          </p>
        </div>
      </section>
    </main>
  );
}
