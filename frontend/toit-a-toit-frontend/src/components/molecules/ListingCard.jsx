const housingLabels = { ROOM: 'Chambre', STUDIO: 'Studio', FLAT: 'Appartement', HOUSE: 'Maison', OTHER: 'Autre' };
const statusLabels = { DRAFT: 'Brouillon', PUBLISHED: 'Publié', PAUSED: 'En pause', CLOSED: 'Fermé' };

const ListingCard = ({ listing, photoUrl, actions, horizontal = false }) => {
  const coverPhoto = photoUrl || listing?.photo_url || null;
  const statusLabel = statusLabels[listing?.status] || listing?.status || 'Non renseigné';
  const housingLabel = housingLabels[listing?.housing_type] || listing?.housing_type || '';
  const locationLabel = listing?.city
    ? `${listing.city}${listing.postal_code ? ` (${listing.postal_code})` : ''}`
    : 'Localisation à définir';

  if (horizontal) {
    return (
      <article className="group flex flex-col md:flex-row bg-surface rounded-3xl overflow-hidden shadow-soft border-2 border-transparent hover:border-primary/15 transition-all duration-500">
        <div className="relative md:w-72 h-52 md:h-auto shrink-0 bg-background overflow-hidden">
          {coverPhoto ? (
            <img
              src={coverPhoto}
              alt={listing?.title || 'Annonce colocation'}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-body text-xs font-semibold uppercase tracking-widest text-muted">
              Photo à venir
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-ink/60 px-2.5 py-1 text-[10px] font-semibold text-inverse backdrop-blur-sm">
              {statusLabel}
            </span>
            {housingLabel ? (
              <span className="rounded-full bg-secondaryContainer/70 px-2.5 py-1 text-[10px] font-semibold text-ink backdrop-blur-sm">
                {housingLabel}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex-1 p-7 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start gap-4 mb-1">
              <h3 className="font-display text-xl font-bold text-ink group-hover:text-primary transition-colors truncate">
                {listing?.title || 'Annonce sans titre'}
              </h3>
              {listing?.rent_amount != null ? (
                <span className="shrink-0 font-display text-xl font-extrabold text-primary">
                  {listing.rent_amount}€
                  <span className="text-xs font-normal text-muted">/mois</span>
                </span>
              ) : null}
            </div>

            <p className="font-body text-sm text-muted mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
              {locationLabel}
            </p>

            {listing?.description ? (
              <p className="line-clamp-2 font-body text-sm text-muted mb-4">{listing.description}</p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {listing?.surface_m2 ? (
                <span className="rounded-full bg-surfaceContainer px-3 py-1 font-body text-xs font-semibold text-ink flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>bed</span>
                  {listing.surface_m2} m²
                </span>
              ) : null}
              {listing?.city ? (
                <span className="rounded-full bg-surfaceContainer px-3 py-1 font-body text-xs font-semibold text-ink">
                  {listing.city}
                </span>
              ) : null}
            </div>
          </div>

          {actions ? (
            <div className="mt-5 pt-5 border-t border-border flex justify-end">
              {actions}
            </div>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article className="group overflow-hidden rounded-3xl bg-surface shadow-soft transition duration-200 hover:scale-[1.015] hover:shadow-lift">
      <div className="relative aspect-[4/3] bg-background">
        {coverPhoto ? (
          <img src={coverPhoto} alt={listing?.title || 'Annonce colocation'} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-body text-xs font-semibold uppercase tracking-widest text-muted">
            Photo à venir
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-ink/60 px-3 py-1 text-xs font-semibold text-inverse backdrop-blur-sm">
            {statusLabel}
          </span>
          {housingLabel ? (
            <span className="rounded-full bg-secondaryContainer/70 px-3 py-1 text-xs font-semibold text-ink backdrop-blur-sm">
              {housingLabel}
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg text-ink">{listing?.title || 'Annonce sans titre'}</h3>
            <p className="mt-0.5 font-body text-sm text-muted">{locationLabel}</p>
          </div>
          {listing?.rent_amount != null ? (
            <span className="rounded-2xl bg-primaryContainer/20 px-3 py-1 font-body text-sm font-semibold text-primary">
              {listing.rent_amount} EUR
            </span>
          ) : null}
        </div>

        {listing?.description ? (
          <p className="line-clamp-2 font-body text-sm text-muted">{listing.description}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {listing?.surface_m2 ? (
            <span className="rounded-full bg-surfaceContainer px-3 py-1 font-body text-xs font-semibold text-ink">
              {listing.surface_m2} m²
            </span>
          ) : null}
          {listing?.city ? (
            <span className="rounded-full bg-surfaceContainer px-3 py-1 font-body text-xs font-semibold text-ink">
              {listing.city}
            </span>
          ) : null}
        </div>

        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </article>
  );
};

export default ListingCard;
