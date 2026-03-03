import Image from "next/image";
import Link from "next/link";

const GIVEBUTTER_URL = "https://givebutter.com/vividroots";

export default function Home() {
  return (
    <main className="bg-brand-cream overflow-x-hidden">
      {/* ============ HERO ============ */}
      <section
        className="min-h-[90vh] flex items-center justify-center px-6 md:px-8 py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(165deg, var(--brand-primary-deep) 0%, var(--brand-primary-dark) 35%, var(--brand-primary) 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-[8%] right-[4%] opacity-[0.04]">
          <Image
            src="/images/logo-white.png"
            alt=""
            width={520}
            height={520}
            className="object-contain"
            aria-hidden="true"
          />
        </div>
        <div className="absolute bottom-[-12%] left-[-6%] w-[420px] h-[420px] rounded-full bg-brand-secondary/5" />

        <div className="max-w-[820px] text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/12 border border-brand-accent/25 text-brand-accent text-[13px] font-medium tracking-[0.3px] mb-8">
            On the ground in Guatemala &amp; Ecuador since 2014
          </div>

          <h1 className="font-heading text-[clamp(36px,5.5vw,62px)] text-white leading-[1.12] mb-6">
            Clean water.
            <br />
            Strong schools.
            <br />
            Healthy communities.
          </h1>

          <p className="text-[17px] text-white/70 leading-[1.75] max-w-[560px] mx-auto mb-10">
            Poverty isn&apos;t one problem — it&apos;s a cycle. We break it by
            building all three foundations together, in partnership with the
            communities who lead the way.
          </p>

          <div className="flex gap-3.5 justify-center flex-wrap">
            <a
              href={GIVEBUTTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold bg-brand-secondary text-white border-none rounded-xl px-8 py-4 shadow-[0_4px_20px_rgba(196,102,58,0.35)] transition-all duration-300 hover:bg-brand-secondary-light hover:-translate-y-0.5"
            >
              Give $30 &rarr; Clean Water for Life
            </a>
            <Link
              href="/impact"
              className="text-base font-medium bg-transparent text-white border border-white/25 rounded-xl px-7 py-4 transition-all duration-300 hover:border-white/50 hover:bg-white/5"
            >
              See the Chain Reaction
            </Link>
          </div>

          <div className="mt-14 px-8 py-5 bg-white/6 rounded-[14px] border border-white/8 inline-flex items-center gap-4">
            <span className="font-stats text-[38px] font-bold text-brand-accent">
              $30
            </span>
            <span className="text-[15px] text-white/65 text-left leading-[1.55]">
              starts the chain reaction —
              <br />
              clean water for one person,{" "}
              <strong className="text-white">for life</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ============ IMPACT STATS ============ */}
      <section className="bg-white py-14 px-6 md:px-8 border-b border-brand-light-gray">
        <div className="max-w-[900px] mx-auto flex justify-around flex-wrap gap-2">
          {[
            { value: "5,100+", label: "Lives Impacted" },
            { value: "16", label: "Communities Partnered" },
            { value: "14", label: "Schools Transformed" },
            { value: "10+", label: "Years on the Ground" },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-5 py-5">
              <div className="font-stats text-[44px] font-bold text-brand-accent leading-none">
                {stat.value}
              </div>
              <div className="text-[14px] text-brand-gray mt-2 tracking-[0.3px]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CHAIN REACTION ============ */}
      <section
        className="py-24 px-6 md:px-8"
        style={{
          background:
            "linear-gradient(170deg, var(--brand-dark) 0%, #3A3530 100%)",
        }}
      >
        <div className="max-w-[880px] mx-auto flex flex-wrap gap-14 items-center">
          <div className="flex-[1_1_400px]">
            <div className="text-[12px] font-semibold tracking-[2px] text-brand-accent uppercase mb-3.5">
              The Chain Reaction
            </div>
            <h2 className="font-heading text-[36px] text-white leading-[1.25] mb-5">
              Water, education, and health aren&apos;t three separate problems.
            </h2>
            <p className="text-base text-white/60 leading-[1.75] mb-9">
              They&apos;re three threads in the same knot. Pull one, the others
              loosen. Build all three, and the whole cycle starts to reverse.
            </p>

            {/* Chain links */}
            {[
              {
                num: "1",
                text: "A family gets a water filter. Waterborne illness drops almost immediately. Children stop missing school.",
              },
              {
                num: "2",
                text: "A renovated school with real bathrooms means girls stay enrolled instead of dropping out. Teachers can finally teach.",
              },
              {
                num: "3",
                text: "A functioning health center brings prenatal care, hygiene education, and trained workers. Families can plan ahead instead of just surviving.",
              },
              {
                num: "4",
                text: "The cycle reverses. Healthier children stay in school. Educated mothers invest 90% of their income back into their families. Communities build their own future.",
                isLast: true,
              },
            ].map((step) => (
              <div
                key={step.num}
                className={`flex items-start gap-4 ${step.isLast ? "" : "mb-1"}`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-brand-accent flex items-center justify-center font-stats text-[14px] font-bold text-brand-dark shrink-0">
                    {step.num}
                  </div>
                  {!step.isLast && (
                    <div className="w-0.5 h-8 bg-brand-accent/30 my-1" />
                  )}
                </div>
                <p
                  className={`text-[15px] text-white/85 leading-[1.6] mt-1.5 ${step.isLast ? "" : "pb-3"}`}
                >
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex-[0_1_280px] flex flex-col gap-4 items-center">
            <div className="w-[240px] h-[240px] rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 border border-brand-primary/15 flex items-center justify-center">
              <Image
                src="/images/logo-white.png"
                alt=""
                width={140}
                height={140}
                className="object-contain opacity-60"
                aria-hidden="true"
              />
            </div>
            <p className="font-heading text-lg text-white/50 text-center italic leading-[1.5]">
              &ldquo;Roots run deep.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ============ THREE PILLARS ============ */}
      <section className="py-24 px-6 md:px-8 bg-brand-cream">
        <div className="max-w-[1020px] mx-auto">
          <div className="text-center mb-14">
            <div className="text-[12px] font-semibold tracking-[2px] text-brand-secondary uppercase mb-3">
              Three Foundations
            </div>
            <h2 className="font-heading text-[38px] text-brand-dark mb-3">
              One system. Built together.
            </h2>
            <p className="text-base text-brand-gray max-w-[520px] mx-auto leading-[1.7]">
              Each pillar strengthens the others. That&apos;s why we don&apos;t
              choose one — we build all three.
            </p>
          </div>

          <div className="flex gap-6 flex-wrap justify-center">
            {[
              {
                icon: "💧",
                title: "Clean Water",
                subtitle: "Where Everything Starts",
                description:
                  "Families drink from the same rivers they wash in. Children contract parasites from water that looks clear. A $30 filtration system changes that \u2014 and returns time, health, and money to families who had none to spare.",
                ripple:
                  "When waterborne illness drops, children attend school. Parents stop spending scarce income on preventable medicine. The chain reaction begins.",
                color: "var(--brand-primary)",
              },
              {
                icon: "\uD83D\uDCDA",
                title: "Education",
                subtitle: "The Lever That Lifts Everything",
                description:
                  "Schools where roofs leak, classrooms sit empty, and there are no bathrooms \u2014 so adolescent girls simply stop coming. We renovate alongside local teachers and directors to create spaces where learning actually happens.",
                ripple:
                  "Every year of schooling increases earning potential by 10%. Educated women invest 90% of income back into their families. A school isn\u2019t a building \u2014 it\u2019s a multiplier.",
                color: "var(--brand-secondary)",
              },
              {
                icon: "\uD83C\uDFE5",
                title: "Health Access",
                subtitle: "The Multiplier",
                description:
                  "The nearest health center might be a two-hour walk \u2014 if it exists. Girls miss school monthly without hygiene products. We renovate health centers and partner with Days For Girls to bring reproductive health education.",
                ripple:
                  "When families access preventive care, they spend less on emergencies. When girls have hygiene kits, they stay in school. Health gives communities stability to plan, invest, and grow.",
                color: "var(--brand-accent)",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="flex-[1_1_300px] bg-white rounded-2xl px-7 py-10 transition-all duration-[350ms] shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(61,122,138,0.14)] cursor-pointer"
                style={{ borderTop: `4px solid ${pillar.color}` }}
              >
                <div className="text-4xl mb-3">{pillar.icon}</div>
                <div
                  className="text-[11px] font-semibold tracking-[1.5px] uppercase mb-1.5"
                  style={{ color: pillar.color }}
                >
                  {pillar.subtitle}
                </div>
                <h3 className="font-heading text-[22px] text-brand-dark mb-3.5">
                  {pillar.title}
                </h3>
                <p className="text-[15px] text-brand-gray leading-[1.75] mb-4">
                  {pillar.description}
                </p>
                <div
                  className="p-3 px-4 rounded-[10px]"
                  style={{
                    backgroundColor: `${pillar.color}0A`,
                    borderLeft: `3px solid ${pillar.color}`,
                  }}
                >
                  <p className="text-[13px] text-brand-dark leading-[1.65] italic">
                    {pillar.ripple}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STORY SPOTLIGHT ============ */}
      <section className="py-24 px-6 md:px-8 bg-white">
        <div className="max-w-[900px] mx-auto flex flex-wrap gap-12 items-center">
          <div className="flex-[1_1_340px] h-[420px] rounded-[20px] bg-gradient-to-br from-brand-primary-dark to-brand-primary flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 p-3.5 px-4 bg-black/35 backdrop-blur-[10px] rounded-xl">
              <div className="text-[12px] text-white/80">
                📷 Community photos coming soon
              </div>
            </div>
            <div className="opacity-[0.12]">
              <Image
                src="/images/logo-white.png"
                alt=""
                width={160}
                height={160}
                className="object-contain"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="flex-[1_1_340px]">
            <div className="text-[12px] font-semibold tracking-[2px] text-brand-secondary uppercase mb-4">
              From the Field
            </div>
            <h2 className="font-heading text-[30px] text-brand-dark leading-[1.3] mb-5">
              &ldquo;The girls came back.&rdquo;
            </h2>
            <p className="text-[15px] text-brand-gray leading-[1.8] mb-4">
              When we built bathrooms at a school in Solol&aacute;, the director
              told us something we&apos;ll never forget. 47 adolescent girls who
              had been missing school every month — some permanently — returned.
            </p>
            <p className="text-[15px] text-brand-gray leading-[1.8] mb-6">
              A bathroom. That&apos;s all it took to change the equation.
              Because when girls stay in school, they earn more, marry later, and
              invest back into their communities. One renovation. Generations of
              impact.
            </p>
            <Link
              href="/impact"
              className="text-[15px] font-semibold text-brand-secondary inline-flex items-center gap-2 hover:gap-3 transition-all"
            >
              Read more stories <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ PARTNERSHIP MODEL ============ */}
      <section className="py-20 px-6 md:px-8 bg-brand-cream border-t border-brand-light-gray">
        <div className="max-w-[700px] mx-auto text-center">
          <div className="text-[12px] font-semibold tracking-[2px] text-brand-primary uppercase mb-3.5">
            How We Work
          </div>
          <h2 className="font-heading text-[34px] text-brand-dark mb-5">
            With communities, not for them.
          </h2>
          <p className="text-base text-brand-gray leading-[1.8] mb-9">
            We don&apos;t arrive with a plan. We arrive with a question:{" "}
            <em>what do you need?</em> Every project is led by municipal
            governments, school directors, and community leaders. We provide
            resources, funding, and labor. They provide vision, ownership, and
            sustainability. That&apos;s why our projects last.
          </p>
          <div className="flex gap-5 justify-center flex-wrap">
            {[
              { num: "16", label: "Community partnerships" },
              { num: "10+", label: "Years of relationships" },
              { num: "2", label: "Countries" },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="px-7 py-5 bg-white rounded-xl border border-brand-light-gray"
              >
                <div className="font-stats text-[28px] font-bold text-brand-primary">
                  {num}
                </div>
                <div className="text-[13px] text-brand-gray mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ THE WELL ============ */}
      <section
        className="py-24 px-6 md:px-8"
        style={{
          background:
            "linear-gradient(165deg, var(--brand-primary-deep) 0%, var(--brand-primary-dark) 100%)",
        }}
      >
        <div className="max-w-[960px] mx-auto text-center">
          <div className="text-[12px] font-semibold tracking-[2px] text-brand-accent uppercase mb-3">
            Monthly Giving
          </div>
          <h2 className="font-heading text-[40px] text-white mb-3">
            Join The Well
          </h2>
          <p className="text-base text-white/60 max-w-[520px] mx-auto mb-12 leading-[1.75]">
            A community of monthly givers building all three foundations —
            water, schools, and health — together. Choose your level. See your
            impact. Stay connected.
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            {[
              {
                name: "Seed",
                amount: 15,
                impact:
                  "Supplies for one student for a month — the basics that make learning possible.",
                icon: "🌱",
                featured: false,
              },
              {
                name: "Spring",
                amount: 30,
                impact:
                  "Clean water for one person, for life. Fewer sick days. More school days. The chain reaction starts here.",
                icon: "💧",
                featured: true,
              },
              {
                name: "Roots",
                amount: 75,
                impact:
                  "Health supplies for a family — including hygiene kits that keep girls in school.",
                icon: "🌿",
                featured: false,
              },
              {
                name: "Canopy",
                amount: 150,
                impact:
                  "Sponsor a classroom renovation. A safe space where futures take shape.",
                icon: "🌳",
                featured: false,
              },
            ].map((tier) => (
              <a
                key={tier.name}
                href={GIVEBUTTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-[1_1_200px] rounded-2xl px-5 text-center transition-all duration-300 cursor-pointer relative group ${
                  tier.featured
                    ? "bg-brand-primary-dark py-8 border-2 border-brand-accent shadow-[0_12px_32px_rgba(44,95,110,0.25)] -translate-y-1"
                    : "bg-white py-7 border border-brand-light-gray hover:bg-brand-primary-dark hover:border-brand-primary-dark hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(44,95,110,0.25)]"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-accent text-brand-dark text-[10px] font-bold tracking-[1px] uppercase px-3.5 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="text-[32px] mb-2">{tier.icon}</div>
                <div
                  className={`text-[11px] font-semibold tracking-[1.5px] uppercase mb-1 ${
                    tier.featured
                      ? "text-brand-accent"
                      : "text-brand-gray group-hover:text-brand-accent"
                  }`}
                >
                  {tier.name}
                </div>
                <div
                  className={`font-stats text-[34px] font-bold ${
                    tier.featured
                      ? "text-white"
                      : "text-brand-dark group-hover:text-white"
                  }`}
                >
                  ${tier.amount}
                </div>
                <div
                  className={`text-[12px] mb-3.5 ${
                    tier.featured
                      ? "text-white/60"
                      : "text-brand-gray group-hover:text-white/60"
                  }`}
                >
                  per month
                </div>
                <p
                  className={`text-[13px] leading-[1.6] ${
                    tier.featured
                      ? "text-white/85"
                      : "text-brand-gray group-hover:text-white/85"
                  }`}
                >
                  {tier.impact}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRUST SIGNALS ============ */}
      <section className="py-16 px-6 md:px-8 bg-brand-cream text-center">
        <div className="max-w-[700px] mx-auto">
          <div className="flex flex-wrap justify-center gap-3.5 mb-7">
            {[
              "501(c)(3) Registered",
              "EIN: 84-3705172",
              "On the Ground Since 2014",
              "Community-Led Projects",
            ].map((item) => (
              <div
                key={item}
                className="text-[12px] font-medium text-brand-gray px-4 py-2 rounded-lg bg-white border border-brand-light-gray"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="text-[14px] text-brand-gray leading-[1.7]">
            We partner with municipal governments, local school directors, Days
            For Girls SE Boise, and community leaders across Guatemala and
            Ecuador.
          </p>
        </div>
      </section>
    </main>
  );
}
