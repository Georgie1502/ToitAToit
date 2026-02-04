import FeatureCard from '../molecules/FeatureCard';

const FeatureGrid = () => {
  return (
    <section className="mt-16">
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/50">
            Nos essentiels
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink">Une expérience simple et humaine.</h2>
        </div>
        <p className="max-w-md text-sm text-ink/70">
          Des outils clairs pour créer des colocations durables, du premier contact à
          l'installation.
        </p>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <FeatureCard
          title="Profils détaillés"
          text="Affiche tes habitudes, ton budget et tes envies pour mieux matcher."
          tone="rose"
        />
        <FeatureCard
          title="Messagerie fluide"
          text="Discute en temps réel, planifie les visites et garde tout au même endroit."
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
