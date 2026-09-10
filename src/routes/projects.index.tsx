import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { img, site } from "@/lib/site-data";
import { CtaBand, PageHero } from "@/components/PageBits";
import { Reveal } from "@/components/ui-bits";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProjects } from "./-projects.server";
import { Suspense } from "react";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Properties in Sukkur — Plots, Houses & Shops | Zain Real Estate" },
      {
        name: "description",
        content:
          "Plots, houses, flats, shops and commercial property for sale, rent and new project booking in Sukkur by Zain Real Estate.",
      },
      { property: "og:title", content: "Properties — Zain Real Estate" },
      { property: "og:description", content: "Verified property listings across Sukkur — sale, rent and booking." },
    ],
  }),
  component: ProjectsPage,
});

const purposeStyle: Record<string, string> = {
  Sale: "bg-primary text-primary-foreground",
  Rent: "bg-accent text-accent-foreground",
  Booking: "bg-emerald-600 text-white",
};

function ProjectsPageContent() {
  const { data: listings } = useSuspenseQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const result = await fetchProjects();
      return Array.isArray(result) ? result : [];
    },
  });

  const safeListings = Array.isArray(listings) ? listings : [];

  return (
    <>
      <PageHero
        eyebrow="Properties"
        title="Featured Properties in Sukkur"
        intro="Verified plots, houses, shops and commercial buildings — for sale, rent and new project booking."
        image={img.spanishVilla}
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {safeListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No properties available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {safeListings.map((l, i) => (
                <Reveal key={l.slug} delay={(i % 3) * 90}>
                  <Link
                    to="/projects/$slug"
                    params={{ slug: l.slug }}
                    className="group block overflow-hidden rounded-3xl border border-border bg-card/60 transition-colors hover:border-primary/50"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={l.image}
                        alt={l.title}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        className={`absolute left-4 top-4 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] ${purposeStyle[l.purpose]}`}
                      >
                        For {l.purpose}
                      </span>
                    </div>
                    <div className="p-6">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{l.type}</p>
                      <h2 className="mt-2 text-lg font-bold leading-snug">{l.title}</h2>
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0 text-primary/70" />
                        {l.location}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-sm font-semibold">{l.area}</span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary">
                          Details <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              Looking for something specific?{" "}
              <a href={site.whatsapp} target="_blank" rel="noreferrer" className="font-bold text-primary underline underline-offset-4">
                WhatsApp your requirement
              </a>{" "}
              — we have many more options not listed here.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Can't find what you're looking for?"
        body="Tell us the area, property type and budget — we will shortlist verified options in Sukkur."
      />
    </>
  );
}

function ProjectsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading properties...</div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}
