const ListingDetailsMainSections = ({
  listing,
  housingLabel,
  minimumDurationLabel,
  rentLabel,
  availableFromLabel,
}) => {
  return (
    <>
      <section>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primaryContainer/20 text-primary shadow-soft">
            <span className="material-symbols-outlined text-4xl">home</span>
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.28em] text-primary">À propos</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink">Présentation du logement</h2>
          </div>
        </div>
        <div className="space-y-4 text-on-surface-variant leading-relaxed">
          <p>{listing.description}</p>
          <p>
            L’annonce rassemble les informations utiles pour se projeter rapidement : loyer, surface, disponibilité et localisation.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-tertiaryContainer px-4 py-2 text-sm font-medium text-on-tertiary-container">
            {housingLabel}
          </span>
          <span className="rounded-full bg-secondaryContainer px-4 py-2 text-sm font-medium text-on-secondary-container">
            {listing?.charges_included ? 'Charges comprises' : 'Charges séparées'}
          </span>
          <span className="rounded-full bg-surfaceContainerHighest px-4 py-2 text-sm font-medium text-on-surface">
            {minimumDurationLabel}
          </span>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-outline-variant/10 bg-white p-8 shadow-[0_-4px_40px_rgba(38,48,53,0.05)]">
        <h2 className="mb-8 font-display text-3xl font-bold text-ink">L'esprit de la coloc</h2>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">volunteer_activism</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Cadre stable</h4>
                <p className="text-sm text-on-surface-variant">
                  Une annonce pensée pour rendre la colocation lisible, rassurante et facile à comparer.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">mood</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Vie quotidienne</h4>
                <p className="text-sm text-on-surface-variant">
                  Le logement met en avant des critères concrets plutôt qu’un discours trop vague.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-on-surface">Repères pratiques</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary-dim text-sm">circle</span>
                <span>Loyer de {rentLabel ? `${rentLabel}€` : 'à définir'} par mois</span>
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary-dim text-sm">circle</span>
                <span>{listing?.charges_included ? 'Charges incluses dans le montant annoncé' : 'Charges à prévoir en plus'}</span>
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary-dim text-sm">circle</span>
                <span>{availableFromLabel ? `Disponible dès le ${availableFromLabel}` : 'Disponibilité à confirmer'}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] bg-secondaryContainer/20 p-8">
        <h2 className="mb-4 font-display text-3xl font-bold text-ink">Ouverture solidaire</h2>
        <p className="mb-8 leading-relaxed text-on-surface-variant">
          Cette fiche d’annonce met l’accent sur un cadre clair et bienveillant pour aider chacun à se projeter rapidement.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-[1.25rem] bg-white p-6">
            <span className="material-symbols-outlined text-3xl text-primary">school</span>
            <div>
              <span className="block font-bold text-on-surface">Lecture rapide</span>
              <span className="text-xs text-on-surface-variant">Les informations essentielles sont visibles immédiatement.</span>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-[1.25rem] bg-white p-6">
            <span className="material-symbols-outlined text-3xl text-primary">moving</span>
            <div>
              <span className="block font-bold text-on-surface">Décision facilitée</span>
              <span className="text-xs text-on-surface-variant">Photos, prix et disponibilité sont regroupés au même endroit.</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-display text-3xl font-bold text-ink">Localisation</h2>
        <div className="relative mb-4 h-80 overflow-hidden rounded-[1.5rem] bg-surfaceContainer shadow-[0_20px_60px_rgba(38,48,53,0.08)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,112,159,0.15),transparent_25%),radial-gradient(circle_at_80%_30%,rgba(87,210,250,0.18),transparent_24%),linear-gradient(135deg,#eef8ff_0%,#d7e4ed_100%)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-primary/20 p-12 rounded-full animate-pulse" />
            <div className="absolute rounded-full bg-primary p-4 shadow-lg">
              <span className="material-symbols-outlined text-white">home</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-ink backdrop-blur-sm">
            {listing?.city || 'Ville'}
          </div>
        </div>
        <p className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined">directions_walk</span>
          {listing?.address || 'Adresse précise à confirmer'}{listing?.postal_code ? `, ${listing.postal_code}` : ''}
        </p>
      </section>
    </>
  );
};

export default ListingDetailsMainSections;
