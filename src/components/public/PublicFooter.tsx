import Link from "next/link";
import LogoMark from "./LogoMark";

const GIVEBUTTER_URL = "https://givebutter.com/vividroots";

export default function PublicFooter() {
  return (
    <footer className="bg-[var(--brand-primary-deep)] pt-14 pb-8">
      <div className="max-w-[960px] mx-auto px-6 md:px-8">
        {/* Top section */}
        <div className="flex flex-wrap gap-10 justify-between mb-10">
          {/* Brand column */}
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-2.5 mb-3.5">
              <LogoMark size={28} color="#FAF6F0" />
              <span className="font-heading text-lg text-white">
                Vivid Roots Collective
              </span>
            </div>
            <p className="text-[14px] text-white/55 leading-[1.7]">
              Clean water. Strong schools. Healthy communities.
              <br />
              Based in Boise, Idaho. Building in Guatemala &amp; Ecuador.
            </p>
          </div>

          {/* Navigate column */}
          <div className="min-w-[140px]">
            <div className="text-[11px] font-semibold tracking-[1.2px] text-brand-accent uppercase mb-4">
              Navigate
            </div>
            {[
              { href: "/our-work", label: "Our Work" },
              { href: "/impact", label: "Impact" },
              { href: "/the-well", label: "The Well" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-[14px] text-white/55 hover:text-white transition-colors mb-2.5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Connect column */}
          <div className="min-w-[220px]">
            <div className="text-[11px] font-semibold tracking-[1.2px] text-brand-accent uppercase mb-4">
              Connect
            </div>
            <p className="text-[14px] text-white/55 leading-[1.7] mb-4">
              dylan@vividrootscollective.org
            </p>
            <div className="flex gap-2">
              {[
                {
                  label: "Instagram",
                  href: "https://instagram.com/vividrootscollective",
                },
                {
                  label: "Facebook",
                  href: "https://facebook.com/Vivid-Roots-Collective-113677173420314/",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-white/40 px-3 py-1.5 rounded-md border border-white/10 hover:border-white/25 transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
            <a
              href={GIVEBUTTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-brand-secondary text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-secondary-light transition-colors"
            >
              Donate Now
            </a>
          </div>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap gap-3 justify-center mb-7">
          {[
            "501(c)(3) Registered",
            "EIN: 84-3705172",
            "On the Ground Since 2014",
            "Community-Led Projects",
          ].map((item) => (
            <div
              key={item}
              className="text-[12px] font-medium text-white/40 px-4 py-2 rounded-lg bg-white/5 border border-white/8"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/7 pt-5 flex flex-wrap justify-between gap-2 text-[12px] text-white/25">
          <span>
            &copy; 2026 Vivid Roots Collective. 501(c)(3) nonprofit. EIN:
            84-3705172
          </span>
          <span>Privacy Policy &middot; Terms</span>
        </div>
      </div>
    </footer>
  );
}
