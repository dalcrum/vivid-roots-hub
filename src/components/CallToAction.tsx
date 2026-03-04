export default function CallToAction() {
  return (
    <section className="mt-14 mb-0">
      <div className="bg-gradient-to-r from-brand-primary-dark to-brand-primary py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-white mb-4">
            Want to fund a project like this?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Every dollar goes directly to communities in Guatemala. Your donation
            funds clean water, education, health, and infrastructure projects that
            change lives.
          </p>
          <a
            href="https://givebutter.com/vividroots"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-brand-primary-dark font-semibold px-8 py-3 rounded-full text-lg hover:bg-brand-primary/10 transition-colors shadow-lg"
          >
            Donate Now
          </a>
        </div>
      </div>
    </section>
  );
}
