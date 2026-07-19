export default function CreateIncubation() {
    return (
        <div className="mx-auto mt-24 max-w-7xl px-6">
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-yellow px-6 py-16 text-center">
            <h3 className="text-2xl font-display font-bold text-yellow-foreground md:text-3xl">
              Want to create your own Investment Program?
            </h3>
            <p className="text-yellow-foreground/70 max-w-lg text-base">
              Get in touch with us and we&apos;ll help you set up a custom
              investment program tailored to your needs.
            </p>
            <a
              href="mailto:info@pitchdesk.in"
              className="bg-ink text-cream hover:bg-ink/90 mt-2 inline-flex items-center rounded-full px-8 py-3 text-sm font-medium transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
    );
}