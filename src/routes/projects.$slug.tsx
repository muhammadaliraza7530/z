import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/lib/site-data";
import { CtaBand } from "@/components/PageBits";
import { Reveal } from "@/components/ui-bits";
import { getProjectBySlugFn } from "./-projects.server";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const listing = await getProjectBySlugFn(params.slug);
    if (!listing) throw notFound();
    return listing;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} | Zain Real Estate, Sukkur` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.description },
        ]
      : [{ title: "Property not found — Zain Real Estate" }, { name: "robots", content: "noindex" }],
  }),
  component: ProjectDetail,
  notFoundComponent: NotFound,
});

function ProjectDetail() {
  const l = Route.useLoaderData();

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" /> All properties
          </Link>

          <Reveal className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground">
                For {l.purpose}
              </span>
              <span className="rounded-full border border-border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                {l.type}
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{l.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
              <MapPin className="size-4 text-primary" /> {l.location} · {l.area} · {l.price}
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10">
            <img
              src={l.image}
              alt={l.title}
              className="aspect-[16/9] w-full rounded-3xl border border-border object-cover"
            />
          </Reveal>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {l.gallery.map((g) => (
              <img
                key={g}
                src={g}
                alt={`${l.title} photo`}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-2xl border border-border object-cover"
              />
            ))}
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-extrabold sm:text-2xl">About this property</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{l.description}</p>
              <h3 className="mt-10 text-lg font-bold">Key features</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {l.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              {l.featuresUrdu ? (
                <div dir="rtl" className="mt-10 rounded-3xl border border-primary/30 bg-primary/5 p-7">
                  <h3 className="text-lg font-bold text-primary">تفصیل اردو میں</h3>
                  {l.descriptionUrdu ? (
                    <p className="mt-3 text-sm leading-loose text-muted-foreground sm:text-base">
                      {l.descriptionUrdu}
                    </p>
                  ) : null}
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {l.featuresUrdu.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm font-semibold sm:text-base">
                        <Check className="mt-1 size-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm font-bold text-primary sm:text-base">
                    📞 رابطہ کریں: Zain Real Estate — {site.phone}
                  </p>
                </div>
              ) : null}
            </div>
            <div>
              <div className="sticky top-28 rounded-3xl border border-primary/30 bg-card/60 p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Interested?</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Contact {site.owner} for price, visit and full documents.
                </p>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-accent"
                >
                  <MessageCircle className="size-4" /> WhatsApp
                </a>
                <a
                  href={`tel:${site.phoneTel}`}
                  className="mt-3 flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Phone className="size-4" /> {site.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Want more options like this?"
        body="Tell us your budget and area — we will send matching verified properties in Sukkur."
      />
    </>
  );
}

function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-5 pt-24 text-center">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Property not found</h1>
      <p className="mt-4 text-sm text-muted-foreground">This listing may have been sold or removed.</p>
      <Link
        to="/projects"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground"
      >
        View all properties
      </Link>
    </section>
  );
}
