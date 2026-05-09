import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { listPendingListings, updateListingStatus } from '../services/admin';

const housingLabels = { ROOM: 'Chambre', STUDIO: 'Studio', FLAT: 'Appartement', HOUSE: 'Maison', OTHER: 'Autre' };

const AdminDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await listPendingListings();
        if (isMounted) setListings(data);
      } catch {
        if (isMounted) setError('Impossible de charger les annonces en attente.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const handleStatus = async (listingId, status) => {
    setUpdating(listingId);
    try {
      await updateListingStatus(listingId, status);
      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch {
      setError('Impossible de mettre à jour le statut.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Administration</p>
          <h2 className="font-display text-4xl text-ink">Annonces en attente.</h2>
          <p className="font-body text-base text-muted">Validez ou rejetez les annonces soumises par les hébergeurs.</p>
        </div>

        {error ? (
          <div role="alert" aria-live="assertive" className="rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-3xl bg-surface shadow-soft" />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-3xl bg-surface p-12 text-center shadow-soft">
            <p className="font-display text-xl text-ink">Aucune annonce en attente</p>
            <p className="mt-2 font-body text-sm text-muted">Toutes les annonces ont été traitées.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {listings.map((listing) => (
              <li key={listing.id} className="rounded-3xl bg-surface p-6 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-display text-lg text-ink">{listing.title}</h3>
                    <p className="font-body text-sm text-muted">
                      {listing.city}{listing.postal_code ? ` (${listing.postal_code})` : ''}
                      {' — '}
                      {housingLabels[listing.housing_type] || listing.housing_type}
                      {listing.rent_amount ? ` — ${listing.rent_amount} €/mois` : ''}
                    </p>
                    <p className="font-body text-xs text-muted">
                      Soumise le {new Date(listing.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}
                      {listing.application_count} candidature{listing.application_count !== '1' ? 's' : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      as={Link}
                      to={`/admin/annonces/${listing.id}/candidatures`}
                      size="sm"
                      variant="ghost"
                    >
                      Candidatures
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatus(listing.id, 'CLOSED')}
                      disabled={updating === listing.id}
                    >
                      Rejeter
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={() => handleStatus(listing.id, 'PUBLISHED')}
                      disabled={updating === listing.id}
                    >
                      {updating === listing.id ? '...' : 'Valider'}
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
};

export default AdminDashboard;
