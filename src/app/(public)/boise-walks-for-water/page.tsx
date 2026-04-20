"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import GivebutterButton from "@/components/GivebutterButton";
import s from "./page.module.css";

const LOGO_WHITE = "/images/logo-wordmark-white.png";
const PROMO_VIDEO_MP4 = "/videos/vivid-roots-promo.mp4";
const PROMO_VIDEO_MOV = "/videos/vivid-roots-promo.mov";
const PROMO_VIDEO_POSTER = "/images/vivid-roots-promo-poster.jpg";

/**
 * Givebutter campaign for this event. Configured as a "button" widget
 * in the Givebutter dashboard and loaded by the <Script> tag in
 * src/app/layout.tsx. Every CTA on this page renders its own
 * <GivebutterButton id={GB_WIDGET_ID} /> — the loader hydrates each
 * into a branded Register/Donate button.
 */
const GB_WIDGET_ID = "g8MMdJ";

/* TODO when assets are ready:
 *   - Replace hero videoPlaceholder with a real <video> element
 *   - Replace Guatemala/story/why image placeholders with real <img>/<Image>
 *   - Replace route-map placeholder with embedded map
 */

const rotatingLines = [
  "Join us. Carry hope.",
  "One walk. 1,500 lives.",
  "Live vividly.",
];

type FaqCategory = { title: string; items: { q: string; a: string }[] };

const faqs: FaqCategory[] = [
  {
    title: "The Basics",
    items: [
      {
        q: "What is Boise Walks for Water?",
        a: "A 3-mile charity walk on the Boise Greenbelt where participants carry 5-gallon water jugs — the same weight women and children in San Jacinto, Guatemala carry every single day. The goal is to raise $20,000+ to bring clean water infrastructure to 1,500 people for life. It's organized by Vivid Roots Collective, a 501(c)(3) nonprofit that's been on the ground in Guatemala and Ecuador since 2014.",
      },
      {
        q: "When and where is the event?",
        a: "Saturday, June 27, 2026. Teams gather at high noon at Veterans Memorial Park in Boise, Idaho. The 3-mile route follows the Boise Greenbelt, and the celebration happens at the same location after the walk.",
      },
      {
        q: "What's the route?",
        a: "A 3-mile loop on the Boise Greenbelt, starting and ending at Veterans Memorial Park. The route is flat, paved, and accessible. A detailed route map will be shared closer to the event.",
      },
      {
        q: "What happens after the walk?",
        a: "We celebrate together. Music, food, drinks, and the kind of summer afternoon you'll remember. It's a party — you earned it. Top fundraising teams will be recognized during the celebration.",
      },
    ],
  },
  {
    title: "Registration",
    items: [
      {
        q: "How do I register my team?",
        a: "You're the captain. Just pick a team size (solo, 2, 3, or 4), pay online, and you're in. The whole process takes under 2 minutes. You'll recruit your teammates after — you don't need their info at checkout.",
      },
      {
        q: "Do I need my teammates' names when I register?",
        a: "Nope. Register now, add your crew later. We'll send you a simple form to fill in names, shirt sizes, and waivers before the event. Just get registered — the rest can wait.",
      },
      {
        q: "Can I walk solo?",
        a: "Absolutely. Solo registration is $60 and includes a 5-gallon jug and a t-shirt. You'll carry the full weight yourself — the same weight families carry every day. It's a powerful experience.",
      },
      {
        q: "What's included in my registration?",
        a: "Every registration includes a Walk for Water t-shirt for each team member and one 5-gallon water jug per team. You'll also get a personalized GiveButter fundraising page to share with your network.",
      },
      {
        q: "What's the deadline to add team members?",
        a: "June 13, 2026. That gives us two weeks to finalize shirts and logistics. Register now, lock in your team later.",
      },
    ],
  },
  {
    title: "The Walk",
    items: [
      {
        q: "Do I really carry a 5-gallon jug the whole time?",
        a: "That's the idea — it's what makes this more than a walk. A full 5-gallon jug weighs about 40 lbs. If you're on a team, you'll pass it between you. That's the whole point: share the weight. If you register as a Supporter ($40), you walk without a jug.",
      },
      {
        q: "Can kids participate?",
        a: "Yes! Kids 12 and under can register for $20. They don't carry a jug but they walk alongside the team, get a t-shirt, and are part of the whole experience. It's a great way to teach kids that their actions can change someone's life.",
      },
      {
        q: "What if it rains?",
        a: "We walk. The families in San Jacinto walk for water rain or shine — so do we. In the event of truly dangerous weather (lightning, extreme heat), we'll communicate changes via email and social media.",
      },
    ],
  },
  {
    title: "Impact",
    items: [
      {
        q: "Where does the money go?",
        a: "100% of net proceeds go directly to building clean water infrastructure in San Jacinto, Guatemala. Vivid Roots Collective works alongside local community leaders to design, build, and maintain water systems that last. We've been doing this since 2014.",
      },
      {
        q: "What is Vivid Roots Collective?",
        a: "A 501(c)(3) nonprofit (EIN: 84-3705172) that builds clean water systems, strong schools, and healthy communities in Guatemala and Ecuador. 100% community-led. Over 51,000 lives changed since 2014. Boise Walks for Water is our flagship fundraising event.",
      },
      {
        q: "How does my entry give someone clean water?",
        a: "Every person who registers gives one person in San Jacinto clean water for life. Your registration funds the materials, labor, and community partnerships needed to build water infrastructure that serves families permanently — not temporarily.",
      },
    ],
  },
  {
    title: "Fundraising",
    items: [
      {
        q: "How does the fundraising page work?",
        a: "When you register, you'll automatically get a personalized GiveButter fundraising page. Share the link with friends, family, coworkers, social media — anyone who wants to be part of the ripple. Donors can give any amount, and it all goes toward the $20,000 goal.",
      },
      {
        q: "Do I have to fundraise?",
        a: "It's not required — your registration alone gives someone clean water for life. But fundraising is where the ripple grows. Even sharing your page once can make a difference. Top fundraising teams will be recognized at the celebration.",
      },
    ],
  },
];

/**
 * Boise Walks for Water — event landing page.
 *
 * Client component because of the rotating hero headline, the video
 * modal, the registration modal, and the FAQ accordion. No server
 * data is fetched on this page.
 */
export default function BoiseWalksForWaterPage() {
  const [lineIndex, setLineIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Rotating hero tagline
  useEffect(() => {
    const id = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % rotatingLines.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // Esc closes the video modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeVideo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the modal opens, autoplay from the beginning; when it closes,
  // pause + reset. Also lock body scroll while open so on mobile the
  // page behind doesn't scroll if a touch goes past the modal edges.
  useEffect(() => {
    const v = videoRef.current;
    if (videoOpen) {
      document.body.style.overflow = "hidden";
      if (v) {
        v.currentTime = 0;
        // autoplay may be blocked by browser policy. If the promise
        // rejects we just let the user hit the play control — the
        // native <video controls> UI is still there.
        v.play().catch(() => {});
      }
    } else {
      document.body.style.overflow = "";
      if (v) {
        v.pause();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [videoOpen]);

  const openVideo = useCallback(() => setVideoOpen(true), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  return (
    <div className={s.page}>
      {/* ===== NAV ===== */}
      <nav className={s.nav}>
        <Link href="/" className={s.navLogo} aria-label="Vivid Roots home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_WHITE}
            alt="Vivid Roots — Live Vividly"
            className={s.navLogoImg}
          />
        </Link>
        <div className={s.navLinks}>
          <a href="#how">How It Works</a>
          <a href="#register">Register</a>
          <GivebutterButton id={GB_WIDGET_ID} />
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className={s.hero}>
        <div className={s.heroVideoBg}>
          <div className={s.videoPlaceholder} />
        </div>
        <div className={s.heroOverlay} />

        <div className={s.heroContent}>
          <div className={s.heroBadge}>
            June 27, 2026 · Veterans Memorial Park
          </div>
          <h1 className={s.heroH1}>Boise Walks for Water</h1>
          <div className={s.headlineRotator}>
            {rotatingLines.map((line, i) => (
              <div
                key={line}
                className={`${s.headlineLine} ${
                  i === lineIndex ? s.active : ""
                }`}
              >
                <em>{line}</em>
              </div>
            ))}
          </div>
          <p className={s.heroSub}>
            Women and children in San Jacinto, Guatemala walk 3 miles every
            day for water that isn&apos;t clean and isn&apos;t safe. On June
            27, we carry that weight — a 5-gallon jug, 3 miles on the Boise
            Greenbelt — so 1,500 people never have to again.
          </p>
          <div className={s.heroCtas}>
            <GivebutterButton id={GB_WIDGET_ID} />
            <a href="#how" className={s.btnGhost}>
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* ===== STAT BAND ===== */}
      <div className={s.statBand}>
        <div className={`${s.statBandInner} ${s.container}`}>
          <div className={s.stat}>
            <div className={s.statNum}>1,500</div>
            <div className={s.statLabel}>People get clean water</div>
          </div>
          <div className={s.stat}>
            <div className={s.statNum}>$20,000+</div>
            <div className={s.statLabel}>Fundraising goal</div>
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <section className={`${s.section} ${s.howSection}`} id="how">
        <div className={s.container}>
          <div
            style={{
              textAlign: "center",
              maxWidth: "600px",
              margin: "0 auto 1rem",
            }}
          >
            <div className={s.sectionEyebrow}>How it works</div>
            <div
              className={s.sectionHeadline}
              style={{ maxWidth: "none", margin: "0 auto" }}
            >
              Four steps. Two minutes. You&apos;re in.
            </div>
          </div>

          <div
            className={s.videoInline}
            onClick={openVideo}
            role="button"
            tabIndex={0}
            aria-label="Play the Vivid Roots promo video"
            onKeyDown={(e) =>
              e.key === "Enter" || e.key === " " ? openVideo() : null
            }
          >
            <div className={s.videoInlineFrame}>
              {/* Poster frame so the card shows the first frame of the
                  video instead of a gradient. Decoded lazily. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PROMO_VIDEO_POSTER}
                alt=""
                aria-hidden="true"
                className={s.videoInlinePoster}
                loading="lazy"
                decoding="async"
              />
              <div className={s.videoPlayCircle}>
                <svg viewBox="0 0 24 24">
                  <polygon points="8,5 20,12 8,19" />
                </svg>
              </div>
            </div>
            <div className={s.videoInlineContent}>
              <h3>See exactly how it works</h3>
              <p>
                Everything you need to know — the route, the jugs, the teams,
                the celebration. Two minutes and you&apos;ll have the full
                picture.
              </p>
              <div className={s.videoInlineLabel}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Watch the video
              </div>
            </div>
          </div>

          <div className={s.howSteps}>
            {[
              {
                n: 1,
                title: "Rally your crew",
                body:
                  "Solo or team — every person who walks gives someone clean water for life. Grab your friends and be the captain.",
              },
              {
                n: 2,
                title: "Register + pay",
                body:
                  "Quick checkout. You don't need your teammates' info yet — just pick a size and go.",
              },
              {
                n: 3,
                title: "Share your fundraising page",
                body:
                  "You'll get a GiveButter page. Share it with everyone you know — every dollar raised puts clean water within reach.",
              },
              {
                n: 4,
                title: "Show up June 27",
                body:
                  "High noon at Veteran Memorial Park. Carry the jug. Earn the celebration.",
              },
            ].map((step) => (
              <div key={step.n} className={s.howStep}>
                <div className={s.howStepNum}>{step.n}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== THE WHY ===== */}
      <section className={`${s.section} ${s.whySection}`}>
        <div className={s.container}>
          <div className={s.whyGrid}>
            <div className={s.whyImage}>
              <div className={s.whyImagePlaceholder}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                Guatemala community photo
              </div>
            </div>
            <div>
              <div className={s.sectionEyebrow}>The why</div>
              <div className={s.whyQuote}>
                Clean water isn&apos;t just health. It&apos;s hope.
              </div>
              <p className={s.whyBody}>
                Dirty water is the 3rd leading cause of death in children —
                and kills more people every year than all forms of violence
                combined. 220 million women and children spend hours every
                day walking for water. Walking keeps children out of school
                and takes time parents could use to earn money.
              </p>
              <p className={s.whyBody}>
                The good news?{" "}
                <strong>
                  Every person who registers gives one person clean water for
                  life.
                </strong>{" "}
                Health returns. Time returns. Hope returns. Your walk on
                June 27 makes that real for 1,500 people in San Jacinto.
              </p>
              <div className={s.whyCallout}>
                <div className={s.whyCalloutNum}>1 entry</div>
                <div className={s.whyCalloutText}>
                  = one person in San Jacinto with clean water for life.
                  Every registration, every team member, every walker.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE EVENT ===== */}
      <section className={`${s.section} ${s.eventSection}`}>
        <div className={s.container}>
          <div className={s.sectionEyebrow}>The event</div>
          <div className={s.sectionHeadline}>
            Saturday, June 27. High noon.
            <br />
            Boise walks for water.
          </div>
          <div className={s.eventGrid}>
            <div className={s.eventDetails}>
              {[
                {
                  title: "Start at Veteran Memorial Park",
                  body:
                    "Teams gather at high noon. Jugs are filled. The walk begins together.",
                  icon: (
                    <svg viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                },
                {
                  title: "3-mile loop on the Boise Greenbelt",
                  body:
                    "Carry a 5-gallon jug as a team — or solo if you want the challenge. Share the weight, share the experience.",
                  icon: (
                    <svg viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  ),
                },
                {
                  title: "Celebrate together",
                  body:
                    "After the walk, we come together — music, food, drinks, and the kind of summer afternoon you'll remember.",
                  icon: (
                    <svg viewBox="0 0 24 24">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  ),
                },
                {
                  title: "Every team gets a jug + shirts",
                  body:
                    "Your registration includes a 5-gallon water jug for your team and a Walk for Water t-shirt for every member.",
                  icon: (
                    <svg viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.title} className={s.eventDetail}>
                  <div className={s.eventIcon}>{item.icon}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={s.routeMapPlaceholder}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                <path d="M8 2v16M16 6v16" />
              </svg>
              Route map coming soon
            </div>
          </div>
        </div>
      </section>

      {/* ===== TEAM TIERS ===== */}
      <section
        className={`${s.section} ${s.tiersSection}`}
        id="register"
      >
        <div className={s.container}>
          <div className={s.tiersHeadlineWrap}>
            <div className={s.sectionEyebrow}>Walk together</div>
            <div className={s.sectionHeadline}>
              They carry the weight alone.
              <br />
              You don&apos;t have to.
            </div>
            <p className={s.sectionBody}>
              Grab your friends, your family, your coworkers. Every person
              who walks gives one person in San Jacinto clean water for life.
              You&apos;re the captain — rally your crew.
            </p>
          </div>
          <div className={s.tiersGrid}>
            {/* Solo */}
            <div className={s.tierCard}>
              <div className={s.tierCardPrice}>
                $60<span>/person</span>
              </div>
              <div className={s.tierCardName}>Solo</div>
              <div className={s.tierCardPpp}>You + 1 jug</div>
              <div className={s.tierCardDesc}>
                Carry a 5-gallon jug on your own — the same weight families
                carry every day. T-shirt included.
              </div>
              <GivebutterButton id={GB_WIDGET_ID} variant="block" />
            </div>
            {/* Team of 4 */}
            <div className={`${s.tierCard} ${s.featured}`}>
              <div className={s.tierBadge}>Bring the crew</div>
              <div className={s.tierCardPrice}>
                $40<span>/person</span>
              </div>
              <div className={s.tierCardName}>Team of 4</div>
              <div className={s.tierCardPpp}>
                $160 total · 1 jug, 4 shirts
              </div>
              <div className={s.tierCardSavings}>
                4 people walk. 4 people get clean water.
              </div>
              <div className={s.tierCardDesc}>
                Four friends, one jug, passing it between you for 3 miles.
                The way it&apos;s meant to be done.
              </div>
              <GivebutterButton id={GB_WIDGET_ID} variant="block" />
            </div>
            {/* Team of 3 */}
            <div className={s.tierCard}>
              <div className={s.tierCardPrice}>
                $45<span>/person</span>
              </div>
              <div className={s.tierCardName}>Team of 3</div>
              <div className={s.tierCardPpp}>
                $135 total · 1 jug, 3 shirts
              </div>
              <div className={s.tierCardSavings}>
                3 people walk. 3 people get clean water.
              </div>
              <div className={s.tierCardDesc}>
                Three people, one jug, sharing the load — and the story
                you&apos;ll tell after.
              </div>
              <GivebutterButton id={GB_WIDGET_ID} variant="block" />
            </div>
          </div>
          <div className={s.tiersMore}>
            <div className={s.tiersMoreItem}>
              <div className="price" style={{ fontFamily: "var(--font-newsreader)" }}>
                $50
                <span
                  style={{
                    fontSize: "0.6em",
                    fontFamily: "var(--font-inter)",
                    opacity: 0.6,
                  }}
                >
                  /person
                </span>
              </div>
              <div className="label" style={{ fontSize: "0.8rem", color: "var(--muted, rgba(26,46,53,0.65))" }}>
                Team of 2 · $100 total
              </div>
            </div>
            <div className={s.tiersMoreItem}>
              <div className="price" style={{ fontFamily: "var(--font-newsreader)" }}>
                $40
              </div>
              <div className="label" style={{ fontSize: "0.8rem", color: "var(--muted, rgba(26,46,53,0.65))" }}>
                Supporter · No jug, all heart
              </div>
            </div>
            <div className={s.tiersMoreItem}>
              <div className="price" style={{ fontFamily: "var(--font-newsreader)" }}>
                $20
              </div>
              <div className="label" style={{ fontSize: "0.8rem", color: "var(--muted, rgba(26,46,53,0.65))" }}>
                Kid (12 &amp; under)
              </div>
            </div>
          </div>
          <div className={s.tiersReassure}>
            Don&apos;t know your full team yet? No stress. As the captain,
            you just pick a team size and pay — add or change members anytime
            before June 13.
          </div>
        </div>
      </section>

      {/* ===== FUNDRAISING ===== */}
      <section className={`${s.section} ${s.fundraisingSection}`}>
        <div className={s.container}>
          <div className={s.fundraisingGrid}>
            <div>
              <div className={s.sectionEyebrow}>The ripple</div>
              <div className={s.sectionHeadline}>
                You walk. Then your ripple keeps going.
              </div>
              <p className={s.sectionBody}>
                Every team gets a GiveButter fundraising page the moment
                they register. Share it with friends, family, coworkers —
                anyone who wants to be part of the ripple without walking
                the miles.
              </p>
              <p className={s.sectionBody}>
                Top fundraising teams will be recognized at the celebration.
                Because hope deserves a standing ovation.
              </p>
            </div>
            <div className={s.fundraisingCard}>
              <h3>How far does your ripple reach?</h3>
              <div className={s.fundraisingTiers}>
                {[
                  [
                    "Your registration",
                    "Clean water for 1 person, for life",
                  ],
                  ["Team of 4", "4 people walk, 4 lives changed"],
                  [
                    "Team + fundraising",
                    "The ripple reaches further than you can see",
                  ],
                  ["Top fundraiser", "Leaderboard legend status"],
                ].map(([name, impact]) => (
                  <div key={name} className={s.fundraisingTier}>
                    <span className={s.fundraisingTierName}>{name}</span>
                    <span className={s.fundraisingTierImpact}>{impact}</span>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(26,46,53,0.65)",
                  marginTop: "1rem",
                  fontStyle: "italic",
                }}
              >
                Share your page — the ripple does the rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className={s.faqSection} id="faq">
        <div className={s.container}>
          <div style={{ textAlign: "center" }}>
            <div className={s.sectionEyebrow}>Questions?</div>
            <div className={s.sectionHeadline} style={{ margin: "0 auto" }}>
              Everything you need to know.
            </div>
          </div>
          <div className={s.faqGrid}>
            {faqs.map((cat) => (
              <div key={cat.title} className={s.faqCategory}>
                <div className={s.faqCategoryTitle}>{cat.title}</div>
                {cat.items.map((item) => {
                  const key = `${cat.title}::${item.q}`;
                  const isOpen = openFaq === key;
                  return (
                    <div
                      key={item.q}
                      className={`${s.faqItem} ${isOpen ? s.open : ""}`}
                    >
                      <button
                        type="button"
                        className={s.faqQ}
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? null : key)}
                      >
                        <span>{item.q}</span>
                      </button>
                      <div className={s.faqA}>
                        <div className={s.faqAInner}>{item.a}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className={s.finalCtaSection}>
        <div className={s.container}>
          <div
            className={s.sectionEyebrow}
            style={{ color: "var(--brand-sky-light)" }}
          >
            June 27, 2026 · Boise, Idaho
          </div>
          <div
            className={s.sectionHeadline}
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Take the first step.
            <br />
            <span
              style={{ color: "var(--brand-sky-light)", fontStyle: "italic" }}
            >
              Register now.
            </span>
          </div>
          <p className={s.sectionBody}>
            Every person who registers gives someone clean water for life.
            Grab your people, pick a team size, and show up June 27. The jug
            is waiting.
          </p>
          <div className={s.finalCtaButtons}>
            <GivebutterButton id={GB_WIDGET_ID} />
          </div>
          <div className={s.finalCtaMeta}>
            100% of net proceeds fund clean water infrastructure in San
            Jacinto, Guatemala · Vivid Roots Collective · 501(c)(3)
            Nonprofit · EIN: 84-3705172
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={s.footer}>
        <div className={s.container}>
          <div className={s.footerGrid}>
            <div>
              <div className={s.footerBrand}>Vivid Roots Collective</div>
              <p className={s.footerAbout}>
                501(c)(3) nonprofit building clean water systems, strong
                schools, and healthy communities in Guatemala and Ecuador
                since 2014.
              </p>
            </div>
            <div className={s.footerCol}>
              <h4>Explore</h4>
              <Link href="/">Home</Link>
              <Link href="/impact">Impact</Link>
              <a href="#how">How it works</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className={s.footerCol}>
              <h4>Connect</h4>
              <a href="mailto:dylan@vividrootscollective.org">
                dylan@vividrootscollective.org
              </a>
              <a
                href="https://instagram.com/vividrootscollective"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a href="#register" style={{ color: "var(--brand-gold-bright)" }}>
                Register →
              </a>
            </div>
          </div>
          <div className={s.footerBottom}>
            <span>
              © 2026 Vivid Roots Collective · EIN: 84-3705172
            </span>
            <span>Boise, Idaho · Guatemala &amp; Ecuador since 2014</span>
          </div>
        </div>
      </footer>

      {/* ===== VIDEO MODAL ===== */}
      <div
        className={`${s.videoModal} ${videoOpen ? s.open : ""}`}
        onClick={(e) => {
          // Clicking outside the video closes it (but not clicks on
          // the <video> itself or the close button).
          if (e.target === e.currentTarget) closeVideo();
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Vivid Roots promo video"
      >
        <div className={s.videoModalInner}>
          <button
            type="button"
            className={s.videoModalClose}
            onClick={closeVideo}
            aria-label="Close video"
          >
            ×
          </button>
          {/* Only mount the <video> while the modal is open so we don't
              eagerly fetch the file on page load. The poster + preload
              "metadata" keeps the experience snappy when reopened. */}
          {videoOpen && (
            <video
              ref={videoRef}
              className={s.videoModalPlayer}
              controls
              playsInline
              preload="metadata"
              poster={PROMO_VIDEO_POSTER}
              onEnded={closeVideo}
            >
              {/* H.264 MP4 first — universal support. HEVC .mov as a
                  secondary source: Safari will prefer it (smaller file,
                  better battery), other browsers skip it. */}
              <source src={PROMO_VIDEO_MP4} type="video/mp4" />
              <source src={PROMO_VIDEO_MOV} type="video/quicktime" />
              Your browser doesn&apos;t support HTML5 video.
            </video>
          )}
        </div>
      </div>

    </div>
  );
}
