import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import {
  about,
  heroSlides,
  highlights,
  listings,
  partyDeal,
  process,
  services,
  showreelUrl,
  site,
  whyChooseUs,
  img,
} from "@/lib/site-data";
import { Reveal, SectionHeading } from "@/components/ui-bits";
import { AutoScroller } from "@/components/AutoScroller";
import { VideoPlayer } from "@/components/VideoPlayer";
import { TestimonialsRail } from "@/components/Testimonials";
import { PostsRail } from "@/components/PostsRail";
import { CtaBand } from "@/components/PageBits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zain Real Estate — Property Consultant & Marketing, Sukkur" },
      {
        name: "description",
        content:
          "Zain Real Estate deals in all kinds of property in Sukkur — new projects booking, sale, purchase and rent. Call Hizb Ullah Abro at 0313-5974923.",
      },
      { property: "og:title", content: "Zain Real Estate — Consultant & Marketing, Sukkur" },
      {
        property: "og:description",
        content: "New projects booking, sale, purchase and rent of all kinds of property in Sukkur.",
      },
    ],
  }),
  component: HomePage,
});

function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(id);
  }, []);

  const slide = heroSlides[index];

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {heroSlides.map((s, i) => (
        <img
          key={s.image}
          src={s.image}
          alt={s.title}
          width={1920}
          height={1280}
          fetchPriority={i === 0 ? "high" : "low"}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          className={`absolute inset-0 size-full object-cover transition-opacity duration-[1400ms] ${
            i === index ? "animate-slow-drift opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-black/60" />

      <div className="relative mx-auto w-full max-w-5xl px-5 pb-16 pt-32 text-center lg:px-8">
        <img
          src={site.logo}
          alt="Zain Real Estate logo"
          className="mx-auto h-24 w-auto rounded-xl bg-white/95 p-3 object-contain sm:h-32"
        />
        <h1 className="hero-rise mt-6 text-3xl font-extrabold uppercase leading-[1.05] tracking-[0.06em] sm:text-5xl lg:text-6xl">
          Zain Real Estate
        </h1>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.42em] text-primary sm:text-sm">
          {site.tagline}
        </p>

        <p
          key={slide.title}
          className="animate-wipe-in mx-auto mt-8 max-w-2xl text-lg font-bold leading-snug sm:text-2xl"
        >
          {slide.title}
        </p>
        <p
          key={slide.highlight}
          className="animate-rise-in mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base"
        >
          {slide.highlight}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`tel:${site.phoneTel}`}
            className="btn-shake sheen-on-hover inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-accent"
          >
            <Phone className="size-4" /> Call Now: {site.phone}
          </a>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-primary/60 px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View Properties <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mx-auto mt-12 flex max-w-lg justify-center gap-2">
          {heroSlides.map((s, i) => (
            <button
              key={s.image}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? "w-10 bg-primary" : "w-4 bg-foreground/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const featured = listings.find((l) => l.slug === "bungalow-mehran-society");

  return (
    <>
      <Hero />

      {/* Highlight bar */}
      <section className="border-y border-border bg-card/40 py-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 lg:px-8">
          {highlights.map((h) => (
            <span
              key={h.label}
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] sm:text-xs"
            >
              <span aria-hidden className="text-lg">
                {h.icon}
              </span>
              {h.label}
            </span>
          ))}
        </div>
      </section>

      {/* Main video */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Showreel"
            title="Property in Sukkur, on film"
            intro="A short look at the projects and locations we deal in."
            align="center"
          />
          <Reveal className="mt-10">
            <VideoPlayer src={showreelUrl} poster={img.luxuryVilla} />
          </Reveal>
        </div>
      </section>

      {/* About */}
      <section className="border-y border-border bg-card/30 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary sm:text-xs">About us</p>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight sm:text-4xl">{about.heading}</h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{site.address}</span>
            </p>
          </Reveal>
          <Reveal delay={120}>
            <img
              src={img.classicMansion}
              alt="Residential property in Sukkur"
              loading="lazy"
              className="lit-panel aspect-4/3 w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Party-to-party deal */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary sm:text-xs">
              {partyDeal.eyebrow}
            </p>
            <h2 dir="rtl" className="mt-4 text-2xl font-extrabold leading-snug sm:text-3xl">
              {partyDeal.titleUrdu}
            </h2>
            <p className="mt-3 text-sm font-semibold text-muted-foreground sm:text-base">{partyDeal.title}</p>
            <p dir="rtl" className="mt-5 text-sm leading-loose text-muted-foreground sm:text-base">
              {partyDeal.introUrdu}
            </p>
            <ul className="mt-8 space-y-4">
              {partyDeal.points.map((p) => (
                <li key={p.en} className="flex items-start gap-3">
                  <span aria-hidden className="text-lg leading-none">
                    {p.icon}
                  </span>
                  <span>
                    <span dir="rtl" className="block text-sm font-semibold sm:text-base">
                      {p.urdu}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground sm:text-sm">{p.en}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p dir="rtl" className="mt-8 text-lg font-extrabold text-primary sm:text-xl">
              {partyDeal.closingUrdu}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Property Buy · Sell · Investment — {partyDeal.dealingUrdu}
            </p>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shake sheen-on-hover mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-accent"
            >
              WhatsApp {site.phone}
            </a>
          </Reveal>

          {/* Featured bungalow */}
          {featured ? (
            <Reveal delay={120}>
              <Link
                to="/projects/$slug"
                params={{ slug: featured.slug }}
                className="lit-panel group block overflow-hidden bg-card"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-primary px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground">
                    House For Sale
                  </span>
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="text-lg font-bold sm:text-xl">{featured.title}</h3>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0 text-primary" />
                    {featured.location} · {featured.area}
                  </p>
                  <p className="mt-4 text-base font-extrabold text-primary">{featured.price}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    9 bedrooms · 1 drawing room · 2 TV lounges · 2 kitchens · car parking. Ideal for a large family.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                    View full details <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* New party-to-party deal promotion section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="rounded-3xl border border-primary/20 bg-card/80 p-8 shadow-lg">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary sm:text-xs">
                Party-to-Party Deal
              </p>
              <div className="mt-6 rounded-2xl border border-primary/25 bg-background/40 p-5">
                <p className="text-lg font-black leading-relaxed text-foreground sm:text-xl">
                  🏡 CRYSTAL MODEL TOWN-1 — BUNGALOWS FOR SALE 🏡
                </p>
                <p className="mt-4 text-sm font-semibold leading-relaxed text-primary sm:text-base">
                  ✨ Apna khubsurat ghar ab sirf khwab nahi!
                </p>
                <p className="mt-4 text-sm font-bold leading-relaxed text-foreground sm:text-base">
                  💰 Easy Installments par Bungalows Available
                </p>
                <p className="mt-2 text-sm font-bold leading-relaxed text-foreground sm:text-base">
                  📍 Prime Location – Crystal Model Town-1, Sukkur
                </p>
                <p className="mt-2 text-sm font-bold leading-relaxed text-foreground sm:text-base">
                  🏠 Family living ke liye behtareen mauqa
                </p>
                <p className="mt-4 text-sm font-black leading-relaxed text-primary sm:text-base">
                  🔥 Limited Opportunity — Aaj hi booking / details ke liye rabta karein!
                </p>
                <p className="mt-4 text-sm font-black leading-relaxed text-foreground sm:text-base">
                  ZAIN REAL ESTATE
                </p>
                <p className="mt-2 text-sm font-black leading-relaxed text-primary sm:text-base">
                  📞 0313-5974923
                </p>
                <p className="mt-4 text-sm font-bold leading-relaxed text-muted-foreground sm:text-base">
                  Bharose ke saath property deal — Zain Real Estate
                </p>
              </div>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shake sheen-on-hover mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-accent"
              >
                WhatsApp {site.phone}
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <VideoPlayer src="/homes/homeVideo1.mp4" poster={img.luxuryVilla} className="rounded-3xl" />
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Our services"
            title="Booking, buying, selling and renting"
            intro="All kinds of residential and commercial property in Sukkur."
          />
          <div className="mt-12">
            <AutoScroller speed={180}>
              {services.map((s, i) => (
                <Reveal key={s.slug} delay={i * 80} className="h-full">
                  <article className="lit-panel flex h-full w-[280px] shrink-0 flex-col overflow-hidden bg-card sm:w-[360px]">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className="aspect-16/10 w-full shrink-0 object-cover"
                    />
                    <div className="flex flex-col p-5 sm:p-6">
                      <h3 className="text-base font-bold sm:text-lg">{s.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{s.short}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </AutoScroller>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-y border-border bg-card/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Why choose us" title="Local, trusted and complete" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((w, i) => (
              <Reveal key={w.title} delay={i * 90}>
                <div className="lit-panel h-full bg-card p-7">
                  <h3 className="text-lg font-bold text-primary">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-border bg-card/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="How it works" title="Four clear stages" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 90}>
                <div className="lit-panel h-full bg-card p-7">
                  <div className="text-4xl font-extrabold text-primary/25">{p.step}</div>
                  <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="border-t border-border bg-card/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Latest updates"
            title="Fresh from Zain Real Estate"
            intro="New listings, project launches and deals — straight from our page."
          />
        </div>
        <div className="mt-12">
          <PostsRail />
        </div>
      </section>

      {/* Testimonials */}
      <section className="overflow-hidden py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Testimonials"
            title="What our clients say"
            intro="Buyers, tenants and investors across Sukkur."
          />
        </div>
        <div className="mt-12">
          <TestimonialsRail />
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-border bg-card/40 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary sm:text-xs">Contact us</p>
            <h2 className="mt-4 text-2xl font-extrabold sm:text-4xl">Let's Find Your Dream Property Today</h2>
            <p className="mt-5 text-sm text-muted-foreground sm:text-base">
              {site.owner} · Phone / WhatsApp {site.phone}
            </p>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{site.address}</p>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Office Hours: Monday to Saturday | 10:00 AM to 7:00 PM
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shake sheen-on-hover inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-accent"
              >
                WhatsApp Now
              </a>
              <a
                href={site.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary/60 px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <MapPin className="size-4" /> Get Directions
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Looking to buy, sell or rent in Sukkur?"
        body="Share your requirement and budget — we will shortlist the right options for you."
      />
    </>
  );
}
