export default function CreateIncubation() {
    return (
        <div className="mx-auto mt-24 flex flex-col items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 px-6 py-10 text-center">
        <h3 className="text-2xl font-bold md:text-3xl">
          Want to create your own Investment Program?
        </h3>
        <p className="text-muted-foreground max-w-lg text-sm md:text-base">
          Get in touch with us and we&apos;ll help you set up a custom
          investment program tailored to your needs.
        </p>
        <a
          href="mailto:info@pitchdesk.in"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 inline-flex items-center rounded-lg px-8 py-3 text-sm font-medium transition-colors"
        >
          Contact Us
        </a>
      </div>
    );
}