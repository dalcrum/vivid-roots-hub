import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-lg font-bold text-gray-900">
              Vivid Roots Collective
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Projects
            </Link>
            <a
              href="#"
              className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors"
            >
              Donate
            </a>
          </div>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <p className="text-lg font-bold text-white mb-2">
            🌱 Vivid Roots Collective
          </p>
          <p className="text-sm">
            Transforming communities in Guatemala through clean water, education,
            health, and infrastructure.
          </p>
          <p className="text-xs mt-4">Built with purpose.</p>
        </div>
      </footer>
    </>
  );
}
