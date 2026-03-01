const housingLabels = {
  ROOM: 'Chambre',
  STUDIO: 'Studio',
  FLAT: 'Appartement',
  HOUSE: 'Maison',
  OTHER: 'Autre',
};

const statusLabels = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publie',
  PAUSED: 'En pause',
  CLOSED: 'Ferme',
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Non renseigne';
  }
  return `${value} EUR`;
};

const ListingCard = ({ listing, photoUrl, actions }) => {
  const statusLabel = statusLabels[listing?.status] || listing?.status || 'Non renseigne';
  const housingLabel = housingLabels[listing?.housing_type] || listing?.housing_type || 'Non renseigne';
  const locationLabel = listing?.city
    ? `${listing.city}${listing.postal_code ? ` (${listing.postal_code})` : ''}`
    : 'Localisation a definir';

  return (
    <article className="group overflow-hidden rounded-2xl bg-surface shadow-soft ring-1 ring-border transition duration-150 ease-subtle hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] bg-background">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={listing?.title || 'Annonce colocation'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Photo a venir
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-inverse">
            {statusLabel}
          </span>
          <span className="rounded-full bg-secondary/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            {housingLabel}
          </span>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-ink">{listing?.title || 'Annonce sans titre'}</h3>
            <p className="mt-1 text-sm text-muted">{locationLabel}</p>
          </div>
          <div className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {formatMoney(listing?.rent_amount)}
          </div>
        </div>

        <p className="text-sm text-ink/80">{listing?.description || 'Aucune description pour le moment.'}</p>

        <div className="grid grid-cols-1 gap-3 text-sm text-muted sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-2 w-2 rounded-full bg-support" />
            <span>{housingLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-2 w-2 rounded-full bg-secondary" />
            <span>{listing?.surface_m2 ? `${listing.surface_m2} m2` : 'Surface a definir'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-2 w-2 rounded-full bg-primary" />
            <span>{locationLabel}</span>
          </div>
        </div>

        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </article>
  );
};

export default ListingCard;
