import Image from "next/image";
import Link from "next/link";
import HeroCycler from "@/components/public/HeroCycler";
import s from "./page.module.css";

const GIVEBUTTER_URL = "https://givebutter.com/vividroots";
// Horizontal wordmark logos with transparent backgrounds.
// logo-wordmark-white.png for dark surfaces (nav, footer-navy);
// logo-wordmark-teal.png (brand teal) for the cream footer strip.
const LOGO_LIGHT = "/images/logo-wordmark-white.png";
const LOGO_CREAM = "/images/logo-wordmark-teal.png";

/**
 * Homepage — 2026 brand refresh.
 *
 * This page inlines its own nav + footer (part of the new design). The
 * surrounding (public) layout has been updated to render {children} only,
 * so /projects and /impact each bring their own PublicNav + PublicFooter.
 */
export default function Home() {
  return (
    <main className={s.page}>
      {/* ═══ HERO ═══ */}
      <section className={s.hero}>
        <div className={s.heroBg} />
        <div className={s.heroOverlay} />
        <nav className={s.nav}>
          <Link href="/" aria-label="Vivid Roots Collective home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_LIGHT}
              className={s.logoImg}
              alt="Vivid Roots — Live Vividly"
            />
          </Link>
          <div className={s.navLinks}>
            <a href="#foundations">Our Work</a>
            <a href="#the-well">The Well</a>
            <Link href="/impact">Impact</Link>
          </div>
        </nav>
        <div className={s.heroContent}>
          <div className={s.badge}>
            On the ground in Guatemala &amp; Ecuador since 2014
          </div>
          <h1 className={`${s.h1} ${s.serif}`}>
            <span style={{ display: "block" }}>Some people feel forgotten.</span>
            <span style={{ display: "block" }}>We go back for them.</span>
            <HeroCycler />
          </h1>
          <p className={s.heroSub}>
            The world keeps moving. Some people get left behind. Your $30 starts
            a ripple that doesn&apos;t stop &mdash; clean water, a girl back in
            school, a family that finally has room to breathe. Join us.
          </p>
          <div className={s.btns}>
            <a
              href={GIVEBUTTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={s.btnGold}
            >
              Give Hope → Start a Ripple <span className={s.amt}>$30</span>
            </a>
            <a href="#foundations" className={s.btnGhost}>
              See the Ripple
            </a>
          </div>
        </div>
      </section>

      {/* ═══ STAT BAND ═══ */}
      <div className={s.statBand}>
        <div className={s.statGrid}>
          <div className={s.statItem}>
            <div className={`${s.statNum} ${s.serif}`}>100%</div>
            <div className={s.statLbl}>Community-Led Implementation</div>
          </div>
          <div className={s.statItem}>
            <div className={`${s.statNum} ${s.serif}`}>51,000+</div>
            <div className={s.statLbl}>Lives Changed</div>
          </div>
          <div className={s.statItem}>
            <div className={`${s.statNum} ${s.serif}`}>12</div>
            <div className={s.statLbl}>Years on the Ground</div>
          </div>
        </div>
      </div>

      {/* ═══ THREE FOUNDATIONS ═══ */}
      <section className={s.foundations} id="foundations">
        <div className={s.sectionInner}>
          <span className={s.eyebrow}>What we build</span>
          <h2 className={`${s.secH2} ${s.serif}`}>
            Three things. Built together.
            <br />
            Because none of them work alone.
          </h2>
          <p className={s.secSub}>
            Poverty isn&apos;t one problem &mdash; it&apos;s a cycle. We break
            it by building all three foundations at once, alongside the
            communities who lead the way.
          </p>

          <div className={s.ledgerWrap}>
            {/* Water */}
            <div className={s.ledgerRow}>
              <div>
                <div className={`${s.tag} ${s.serif}`}>
                  Foundation<sup>01</sup>
                </div>
                <div className={s.lMeta}>Infrastructure</div>
              </div>
              <div>
                <h3 className={`${s.lH3} ${s.serif}`}>Clean Water</h3>
                <p className={s.lLead}>
                  Dirty water is the 3rd leading cause of death in children
                  &mdash; and kills more people every year than all forms of
                  violence combined, including war.
                </p>
                <p className={s.lBody}>
                  220 million women and children spend hours every day walking
                  to collect water for their family. Walking for water keeps
                  children out of school and takes time parents could use to
                  earn money. And when they get there, the water they carry
                  home often makes everyone sick.
                </p>
                <p className={s.lBody}>
                  The good news?{" "}
                  <strong>
                    Just $30 gives one person clean water for life.
                  </strong>{" "}
                  Health returns. Time returns. Hope returns.
                </p>
              </div>
              <div className={s.lStatCol}>
                <div className={`${s.lStatNum} ${s.serif}`}>$30</div>
                <div className={s.lStatSub}>
                  clean water for
                  <br />
                  one person, for life
                </div>
              </div>
            </div>

            <div className={s.lDivider} />

            {/* Education */}
            <div className={s.ledgerRow}>
              <div>
                <div className={`${s.tag} ${s.serif}`}>
                  Empowerment<sup>02</sup>
                </div>
                <div className={s.lMeta}>Knowledge</div>
              </div>
              <div>
                <h3 className={`${s.lH3} ${s.serif}`}>Education</h3>
                <p className={s.lLead}>
                  If all students in low-income countries left school with
                  basic reading skills, 171 million people could be lifted out
                  of poverty.
                </p>
                <p className={s.lBody}>
                  Education is the most powerful tool we have to change the
                  world. It reduces poverty, empowers women, helps prevent
                  disease, and builds long-term economic stability for
                  families.
                </p>
                <p className={s.lBody}>
                  We work closely with teachers, school directors, and local
                  community leaders to ensure every project gives kids the best
                  possible opportunity at a better education. We also partner
                  with Days For Girls &mdash; because{" "}
                  <strong>
                    a school without bathrooms is a school that fails its
                    girls.
                  </strong>
                </p>
              </div>
              <div className={s.lStatCol}>
                <div className={`${s.lStatNum} ${s.serif}`}>171M</div>
                <div className={s.lStatSub}>
                  people lifted from
                  <br />
                  poverty through
                  <br />
                  basic literacy
                </div>
              </div>
            </div>

            <div className={s.lDivider} />

            {/* Health */}
            <div className={s.ledgerRow}>
              <div>
                <div className={`${s.tag} ${s.serif}`}>
                  Vitality<sup>03</sup>
                </div>
                <div className={s.lMeta}>Care</div>
              </div>
              <div>
                <h3 className={`${s.lH3} ${s.serif}`}>Health</h3>
                <p className={s.lLead}>
                  23% of rural Guatemala lives more than an hour from any basic
                  healthcare facility.
                </p>
                <p className={s.lBody}>
                  We renovate health centers and train community health workers
                  so that a mother can walk to a checkup &mdash; instead of
                  choosing between her family&apos;s care and a full day&apos;s
                  wages she can&apos;t afford to lose.
                </p>
                <p className={s.lBody}>
                  When families can access preventive care, they stop spending
                  scarce money on emergencies. They can plan. They can invest.{" "}
                  <strong>
                    Health gives communities room to breathe &mdash; and hope
                    room to grow.
                  </strong>
                </p>
              </div>
              <div className={s.lStatCol}>
                <div className={`${s.lStatNum} ${s.serif}`}>23%</div>
                <div className={s.lStatSub}>
                  of rural Guatemala
                  <br />
                  lives 1+ hr from
                  <br />
                  any basic care
                </div>
              </div>
            </div>
          </div>

          <div className={s.foundCtaStrip}>
            <p>
              Each foundation strengthens the others. That&apos;s why we
              don&apos;t choose one &mdash; we build all three.
            </p>
            <a
              href={GIVEBUTTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${s.btnGold} ${s.btnGoldSm}`}
            >
              Give Hope → Start a Ripple <span className={s.amt}>$30</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ RIPPLE STARTERS ═══ */}
      <section className={s.rippleSec}>
        <div className={s.rippleGrid}>
          <div className={s.photoCol}>
            <div className={s.photoFrame}>
              <Image
                src="/images/mockup-health-center.jpg"
                alt="Community gathered at the renovated Puesto de Salud health center in San Jacinto, Guatemala"
                width={900}
                height={601}
                sizes="(max-width: 900px) 100vw, 45vw"
                priority
              />
            </div>
            <p className={s.photoCaption}>
              Renovated Health Center San Jacinto, Guatemala. Hundreds of women
              and children who now have access to safe health care.
            </p>
          </div>
          <div className={s.contentCol}>
            <span className={s.eyebrow}>Ripple starters</span>
            <h2 className={`${s.rsH2} ${s.serif}`}>
              The world needs people
              <br />
              who go back
              <br />
              <em>for the forgotten.</em>
              <br />
              Are you one of them?
            </h2>
            <p className={s.rsBody}>
              Not everyone feels it &mdash; that quiet pull toward people the
              world has moved on from. But some people do. And those are the
              people who change things. Not because they&apos;re wealthy or
              powerful. Because they understood that{" "}
              <em>
                hope doesn&apos;t cost much to give &mdash; but it means
                everything to receive.
              </em>
            </p>
            <p className={s.rsBody}>
              We call them Ripple Starters. They&apos;re teachers, parents,
              entrepreneurs, and retirees. What they share is simple: they
              believe hope is worth starting, even when they can&apos;t see
              where it ends. Every health center, every school, every water
              filter &mdash; a Ripple Starter made it possible.
            </p>
            <div className={s.quoteCard}>
              <p className={`${s.quoteQ} ${s.serif}`}>
                &ldquo;God remembered us.&rdquo;
              </p>
              <p className={s.quoteSub}>
                What communities say when a project is complete. A Ripple
                Starter made them say it.
              </p>
            </div>
            <div className={s.rsActions}>
              <a
                href={GIVEBUTTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={s.btnGold}
              >
                Become a Ripple Starter <span className={s.amt}>$30</span>
              </a>
              <span className={s.rsMonthly}>or join The Well monthly</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ THE WELL ═══ */}
      <div className={s.wellTop} id="the-well">
        <span className={s.eyebrow}>The Well — Monthly Giving</span>
        <h2 className={s.serif}>Hope, every month.</h2>
        <p>
          The steady source behind every water system, school, and health
          center we build. Join the community of monthly givers making it
          possible.
        </p>
      </div>
      <div className={s.wellBottom}>
        <div className={s.gbWrap}>
          <div className={s.gbTabs}>
            <div className={`${s.gbTab} ${s.gbTabOn}`}>Monthly</div>
            <div className={`${s.gbTab} ${s.gbTabOff}`}>One-Time</div>
          </div>
          <div className={s.gbTiers}>
            <div className={`${s.gbTier} ${s.gbTierOff}`}>
              <div className={`${s.gbAmt} ${s.serif}`}>$15</div>
              <div className={s.gbDesc}>
                Keeps one girl in school, every year you give.
              </div>
            </div>
            <div className={`${s.gbTier} ${s.gbTierOn} ${s.gbTierPop}`}>
              <div className={`${s.gbAmt} ${s.serif}`}>$30</div>
              <div className={`${s.gbDesc} ${s.gbDescOn}`}>
                Clean water for 12 people a year. A village in a decade.
              </div>
            </div>
            <div className={`${s.gbTier} ${s.gbTierOff}`}>
              <div className={`${s.gbAmt} ${s.serif}`}>$60</div>
              <div className={s.gbDesc}>
                Funds a family&apos;s full foundation &mdash; water, school,
                health.
              </div>
            </div>
            <div className={`${s.gbTier} ${s.gbTierOff}`}>
              <div className={`${s.gbAmt} ${s.serif}`}>$125</div>
              <div className={s.gbDesc}>
                Builds an entire school bathroom block this year.
              </div>
            </div>
          </div>
          <input className={s.gbOther} placeholder="Other amount" type="text" readOnly />
          <div className={s.gbFields}>
            <div className={s.gbField}>First name</div>
            <div className={s.gbField}>Last name</div>
          </div>
          <div className={s.gbEmail}>Email address</div>
          <a
            href={GIVEBUTTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={s.gbCta}
          >
            Join The Well
          </a>
          <div className={s.gbSecure}>
            <svg width="10" height="12" viewBox="0 0 12 14" fill="none" aria-hidden="true">
              <rect
                x="1"
                y="6"
                width="10"
                height="7"
                rx="2"
                stroke="rgba(26,46,53,.3)"
                strokeWidth="1.2"
              />
              <path
                d="M3 6V4a3 3 0 016 0v2"
                stroke="rgba(26,46,53,.3)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            Secure donation via Givebutter
          </div>
        </div>
        <div className={s.trustRow}>
          <div className={s.trustItem}>
            <div className={s.trustDot} />
            <span>100% funds the work</span>
          </div>
          <div className={s.trustItem}>
            <div className={s.trustDot} />
            <span>On the ground since 2014</span>
          </div>
          <div className={s.trustItem}>
            <div className={s.trustDot} />
            <span>EIN 84-3705172</span>
          </div>
          <div className={s.trustItem}>
            <div className={s.trustDot} />
            <span>127 people joined this year</span>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <div className={s.footNavy}>
          <div className={s.footNavyInner}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_LIGHT}
              style={{ height: "48px", width: "auto" }}
              alt="Vivid Roots — Live Vividly"
            />
            <div className={s.footLinks}>
              <a href="#foundations">Our Work</a>
              <a href="#the-well">The Well</a>
              <Link href="/impact">Impact</Link>
              <a href="#">Our Financials</a>
              <a href="#">Contact</a>
              <a
                href={GIVEBUTTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={s.footGold}
              >
                Give Hope →
              </a>
            </div>
          </div>
        </div>
        <div className={s.footCream}>
          <div className={s.footCreamInner}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_CREAM}
              style={{ height: "28px", width: "auto" }}
              alt="Vivid Roots — Live Vividly"
            />
            <span className={s.footLegal}>
              © 2026 Vivid Roots Collective &nbsp;·&nbsp; 501(c)(3) Nonprofit
              &nbsp;·&nbsp; EIN: 84-3705172 &nbsp;·&nbsp; Guatemala &amp;
              Ecuador since 2014
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
