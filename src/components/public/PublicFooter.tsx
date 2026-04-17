import Link from "next/link";

/**
 * Public site footer used on non-homepage routes. Matches the
 * homepage's two-tier layout (navy top with links + cream bottom
 * with legal), updated for the 2026 brand refresh.
 */

const GIVEBUTTER_URL = "https://givebutter.com/vividroots";
const LOGO_LIGHT = "/images/logo-wordmark-white.png";
const LOGO_CREAM = "/images/logo-wordmark-teal.png";

export default function PublicFooter() {
  return (
    <footer>
      {/* Top — navy band with wordmark + quick links */}
      <div className="bg-[var(--brand-navy)] px-[5vw] py-6">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_LIGHT}
            alt="Vivid Roots — Live Vividly"
            className="h-10 w-auto"
          />
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/55">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <Link href="/impact" className="transition-colors hover:text-white">
              Impact
            </Link>
            <a
              href={`mailto:dylan@vividrootscollective.org`}
              className="transition-colors hover:text-white"
            >
              Contact
            </a>
            <a
              href="https://instagram.com/vividrootscollective"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Instagram
            </a>
            <a
              href={GIVEBUTTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--brand-gold-bright)] transition-opacity hover:opacity-80"
            >
              Give Hope →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom — cream strip with teal wordmark + legal */}
      <div className="border-t border-[rgba(26,46,53,0.1)] bg-[var(--brand-cream-warm)] px-[5vw] py-3.5">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_CREAM}
            alt="Vivid Roots — Live Vividly"
            className="h-7 w-auto"
          />
          <span className="text-xs text-[rgba(26,46,53,0.4)]">
            © 2026 Vivid Roots Collective &nbsp;·&nbsp; 501(c)(3) Nonprofit
            &nbsp;·&nbsp; EIN: 84-3705172 &nbsp;·&nbsp; Guatemala &amp;
            Ecuador since 2014
          </span>
        </div>
      </div>
    </footer>
  );
}
