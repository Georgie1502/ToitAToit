import FeatureCard from '../molecules/FeatureCard';

const FeatureGrid = () => {
  return (
    <section className="mt-16">
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/50">
            Nos essentiels
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink">Une experience simple et humaine.</h2>
        </div>
        <p className="max-w-md text-sm text-ink/70">
          Des outils clairs pour creer des colocations durables, du premier contact a
          l installation.
        </p>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <FeatureCard
          title="Profils detailles"
          text="Affiche tes habitudes, ton budget et tes envies pour mieux matcher."
          tone="rose"
        />
        <FeatureCard
          title="Messagerie fluide"
          text="Discute en temps reel, planifie les visites et garde tout au meme endroit."
          tone="blue"
        />
        <FeatureCard
          title="Recherche locale"
          text="Explore des quartiers compatibles avec ton style de vie."
          tone="teal"
        />
      </div>
    </section>
  );
};

export default FeatureGrid;
