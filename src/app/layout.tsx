import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter, DM_Sans, Newsreader } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Vivid Roots Collective — Clean Water. Strong Schools. Healthy Communities.",
  description:
    "We partner with rural communities in Guatemala and Ecuador to build clean water systems, renovate schools, and expand health access. $30 provides one person clean water for life. 501(c)(3) nonprofit, on the ground since 2014.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Givebutter widgets loader. Uses the Vivid Roots account and
            serves all <givebutter-widget id="..."> elements on the site.
            Primary campaign button: g8MMdJ. */}
        <Script
          src="https://widgets.givebutter.com/latest.umd.cjs?acct=hjnfyglNQMCk5oir&p=other"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${dmSerifDisplay.variable} ${inter.variable} ${dmSans.variable} ${newsreader.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
