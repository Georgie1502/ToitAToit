import { Button } from '../atoms';

const ListingDetailsStickyCard = ({
  rentLabel,
  chargesIncluded,
  isSubmitting,
  isFavorite,
  detailRows,
  onContact,
  onToggleFavorite,
}) => {
  return (
    <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-[1.5rem] bg-white p-8 shadow-[0_20px_60px_rgba(38,48,53,0.08)] border border-outline-variant/10">
        <div className="mb-6">
          <span className="text-4xl font-extrabold text-on-surface">{rentLabel ? `${rentLabel}€` : '—'}</span>
          <span className="text-on-surface-variant">/mois</span>
          <p className="mt-1 text-sm text-on-surface-variant">
            {chargesIncluded ? 'Charges comprises (eau, électricité, wifi selon annonce)' : 'Charges non comprises'}
          </p>
        </div>

        <div className="space-y-4">
          <Button type="button" variant="primary" size="lg" className="w-full" onClick={onContact} disabled={isSubmitting}>
            <span className="material-symbols-outlined text-[18px]">mail</span>
            {isSubmitting ? 'Envoi en cours...' : 'Contacter l’hôte'}
          </Button>
          <Button
            type="button"
            variant={isFavorite ? 'secondary' : 'ghost'}
            size="lg"
            className={`w-full ${isFavorite ? 'border-primary/25 bg-primaryContainer/20 text-primary' : 'border-2 border-primary/20'}`}
            onClick={onToggleFavorite}
          >
            <span className="material-symbols-outlined text-[18px]">favorite</span>
            {isFavorite ? 'Ajoutée aux favoris' : 'Ajouter aux favoris'}
          </Button>
        </div>

        <div className="mt-8 space-y-4 border-t border-surfaceContainer pt-8">
          {detailRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-on-surface-variant">{row.label}</span>
              <span className="text-right font-semibold text-on-surface">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-tertiaryContainer/30 p-6">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-3xl text-tertiary">verified_user</span>
          <div>
            <h4 className="font-bold text-on-tertiary-container">Annonce en avant</h4>
            <p className="mt-1 text-xs text-on-tertiary-container/80">
              Les informations essentielles sont regroupées pour simplifier la lecture et la comparaison.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ListingDetailsStickyCard;
