import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { updateListingStatus } from '../services/admin';
import { getListingById } from '../services/colocations';
import { getUserById } from '../services/users';

const housingLabels = { ROOM: 'Chambre', STUDIO: 'Studio', FLAT: 'Appartement', HOUSE: 'Maison', OTHER: 'Autre' };

const formatDate = (value) =>
  new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const AdminListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [owner, setOwner] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getListingById(id);
        if (!isMounted) return;
        setListing(data.listing);
        setPhotos(data.photos || []);
        if (data.listing?.owner_user_id) {
          try {
            const user = await getUserById(data.listing.owner_user_id);
            if (isMounted) setOwner(user);
          } catch {
            // non-blocking: hébergeur info unavailable
          }
        }
      } catch {
        if (isMounted) setError("Impossible de charger l'annonce.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [id]);

  const handleStatus = async (status) => {
    setUpdating(status);
    setError('');
    try {
      await updateListingStatus(id, status);
      setDecided(true);
    } catch {
      setError('Impossible de mettre à jour le statut.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Administration</p>
            <h2 className="font-display text-4xl text-ink">
              {loading ? 'Chargement…' : (listing?.title || 'Annonce')}
            </h2>
            {listing && !decided ? (
              <p className="font-body text-sm text-muted">
                Soumise le {formatDate(listing.created_at)}
              </p>
            ) : null}
          </div>
          <Button as={Link} to="/admin" size="sm" variant="ghost">
            Retour
          </Button>
        </div>

        {error ? (
          <div role="alert" aria-live="assertive" className="rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
            {error}
          </div>
        ) : null}

        {decided ? (
          <div className="rounded-3xl bg-accentSoft p-10 text-center shadow-soft space-y-4">
            <p className="font-display text-2xl text-ink">Décision enregistrée.</p>
            <Button as={Link} to="/admin" size="sm" variant="primary">
              Retour au tableau de bord
            </Button>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <div className="h-64 animate-pulse rounded-3xl bg-surface shadow-soft" />
            <div className="h-40 animate-pulse rounded-3xl bg-surface shadow-soft" />
          </div>
        ) : listing ? (
          <div className="space-y-6">
            {photos.length > 0 ? (
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-3xl bg-surfaceContainer shadow-soft" style={{ height: '22rem' }}>
                  <img
                    src={photos[photoIndex].url}
                    alt={`Vue ${photoIndex + 1} sur ${photos.length}`}
                    className="h-full w-full object-cover"
                  />
                  {photos.length > 1 ? (
                    <>
                      <button
                        type="button"
                        aria-label="Photo précédente"
                        onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow backdrop-blur hover:bg-background"
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      <button
                        type="button"
                        aria-label="Photo suivante"
                        onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow backdrop-blur hover:bg-background"
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                      <span className="absolute bottom-3 right-4 rounded-full bg-background/70 px-3 py-0.5 font-body text-xs text-muted backdrop-blur">
                        {photoIndex + 1} / {photos.length}
                      </span>
                    </>
                  ) : null}
                </div>
                {photos.length > 1 ? (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {photos.map((p, i) => (
                      <button
                        key={p.id}
                        type="button"
                        aria-label={`Photo ${i + 1}`}
                        onClick={() => setPhotoIndex(i)}
                        className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${i === photoIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-90'}`}
                      >
                        <img src={p.url} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-3xl bg-surfaceContainer shadow-soft">
                <p className="font-body text-sm text-muted">Aucune photo fournie.</p>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-3xl bg-surface p-6 shadow-soft space-y-4">
                  <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Description</h3>
                  <p className="font-body text-sm leading-relaxed text-ink">{listing.description || '—'}</p>
                </div>

                <div className="rounded-3xl bg-surface p-6 shadow-soft">
                  <h3 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-primary">Détails</h3>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 font-body text-sm">
                    <dt className="text-muted">Type</dt>
                    <dd className="text-ink">{housingLabels[listing.housing_type] || listing.housing_type}</dd>
                    <dt className="text-muted">Loyer</dt>
                    <dd className="text-ink">{listing.rent_amount} €/mois{listing.charges_included ? ' (charges incluses)' : ''}</dd>
                    {listing.surface_m2 ? (
                      <>
                        <dt className="text-muted">Surface</dt>
                        <dd className="text-ink">{listing.surface_m2} m²</dd>
                      </>
                    ) : null}
                    <dt className="text-muted">Disponible à partir du</dt>
                    <dd className="text-ink">{formatDate(listing.available_from)}</dd>
                    {listing.available_to ? (
                      <>
                        <dt className="text-muted">Disponible jusqu'au</dt>
                        <dd className="text-ink">{formatDate(listing.available_to)}</dd>
                      </>
                    ) : null}
                    {listing.min_duration_months ? (
                      <>
                        <dt className="text-muted">Durée minimale</dt>
                        <dd className="text-ink">{listing.min_duration_months} mois</dd>
                      </>
                    ) : null}
                    <dt className="text-muted">Ville</dt>
                    <dd className="text-ink">{listing.city}{listing.postal_code ? ` (${listing.postal_code})` : ''}</dd>
                    {listing.address ? (
                      <>
                        <dt className="text-muted">Adresse</dt>
                        <dd className="text-ink">{listing.address}</dd>
                      </>
                    ) : null}
                  </dl>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl bg-surface p-6 shadow-soft space-y-3">
                  <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Hébergeur</h3>
                  {owner ? (
                    <dl className="font-body text-sm space-y-2">
                      <dt className="text-muted">Nom</dt>
                      <dd className="text-ink font-semibold">{owner.username}</dd>
                      <dt className="text-muted">Email</dt>
                      <dd className="text-ink break-all">{owner.email}</dd>
                      <dt className="text-muted">Membre depuis</dt>
                      <dd className="text-ink">{formatDate(owner.created_at)}</dd>
                    </dl>
                  ) : (
                    <p className="font-body text-sm text-muted">Informations indisponibles.</p>
                  )}
                </div>

                <div className="rounded-3xl bg-surface p-6 shadow-soft space-y-3">
                  <h3 className="mb-2 font-body text-xs font-semibold uppercase tracking-widest text-primary">Décision</h3>
                  <p className="font-body text-xs text-muted">
                    Validez l'annonce pour la rendre visible aux bénéficiaires, ou rejetez-la pour notifier l'hébergeur.
                  </p>
                  <div className="flex flex-col gap-3 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatus('CLOSED')}
                      disabled={!!updating}
                    >
                      Rejeter
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={() => handleStatus('PUBLISHED')}
                      disabled={!!updating}
                    >
                      {updating === 'PUBLISHED' ? '…' : 'Valider'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
};

export default AdminListingDetail;
