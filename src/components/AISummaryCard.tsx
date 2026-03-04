export default function AISummaryCard({
  title,
  content,
  badge,
}: {
  title: string;
  content: string;
  badge?: string;
}) {
  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
      <div className="bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 rounded-xl shadow-md p-8 relative">
        {badge && (
          <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-medium bg-white/80 text-brand-primary-dark border border-brand-primary/30">
            ✨ {badge}
          </span>
        )}
        <h2 className="text-xl font-bold font-heading text-gray-900 mb-4">{title}</h2>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </section>
  );
}
