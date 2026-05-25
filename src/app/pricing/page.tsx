const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Basic coordination tools for small teams.",
  },
  {
    name: "Growth",
    price: "$79",
    description: "Advanced workflows and reporting for growing organizations.",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored care operations for large or complex programs.",
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 text-slate-900">
      <section className="rounded-[2rem] bg-white/95 p-10 shadow-soft ring-1 ring-slate-200">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Pricing & Membership
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Choose the plan that fits your organization. Every plan includes
          secure case management, team workflows, and live support.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8"
          >
            <h2 className="text-2xl font-semibold text-slate-950">
              {plan.name}
            </h2>
            <p className="mt-4 text-4xl font-semibold text-slate-950">
              {plan.price}
            </p>
            <p className="mt-4 text-slate-600 leading-7">{plan.description}</p>
            <button className="mt-8 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
              Choose {plan.name}
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}
