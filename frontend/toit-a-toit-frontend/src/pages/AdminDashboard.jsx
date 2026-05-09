import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { listPendingListings, listPublishedListings } from '../services/admin';

const housingLabels = { ROOM: 'Chambre', STUDIO: 'Studio', FLAT: 'Appartement', HOUSE: 'Maison', OTHER: 'Autre' };

const formatDate = (value) =>
  new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const ListingRow = ({ listing, action }) => (
  <li className="rounded-3xl bg-surface p-6 shadow-soft">
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
          {formatDate(listing.created_at)}
          {listing.pending_count !== undefined
            ? ` · ${Number(listing.pending_count)} candidature${Number(listing.pending_count) !== 1 ? 's' : ''} en attente`
            : listing.application_count !== undefined
              ? ` · ${Number(listing.application_count)} candidature${Number(listing.application_count) !== 1 ? 's' : ''}`
              : ''}
        </p>
      </div>
      {action}
    </div>
  </li>
);

const AdminDashboard = () => {
  const [pending, setPending] = useState([]);
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [pendingData, publishedData] = await Promise.all([
          listPendingListings(),
          listPublishedListings(),
        ]);
        if (isMounted) {
          setPending(pendingData);
          setPublished(publishedData);
        }
      } catch {
        if (isMounted) setError('Impossible de charger le tableau de bord.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="space-y-2">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Administration</p>
          <h2 className="font-display text-4xl text-ink">Tableau de bord.</h2>
        </div>

        {error ? (
          <div role="alert" aria-live="assertive" className="rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
            {error}
          </div>
        ) : null}

        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-body text-sm font-semibold uppercase tracking-widest text-muted">
              Annonces en attente de validation
            </h3>
            <p className="font-body text-sm text-muted">Examinez et validez les annonces soumises par les hébergeurs.</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-3xl bg-surface shadow-soft" />)}
            </div>
          ) : pending.length === 0 ? (
            <div className="rounded-3xl bg-surface p-8 text-center shadow-soft">
              <p className="font-body text-sm text-muted">Aucune annonce en attente.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {pending.map((listing) => (
                <ListingRow
                  key={listing.id}
                  listing={listing}
                  action={
                    <Button as={Link} to={`/admin/annonces/${listing.id}`} size="sm" variant="primary">
                      Examiner
                    </Button>
                  }
                />
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-body text-sm font-semibold uppercase tracking-widest text-muted">
              Candidatures à traiter
            </h3>
            <p className="font-body text-sm text-muted">Annonces publiées ayant des candidatures en attente de décision.</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-3xl bg-surface shadow-soft" />)}
            </div>
          ) : published.length === 0 ? (
            <div className="rounded-3xl bg-surface p-8 text-center shadow-soft">
              <p className="font-body text-sm text-muted">Aucune candidature en attente.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {published.map((listing) => (
                <ListingRow
                  key={listing.id}
                  listing={listing}
                  action={
                    <Button as={Link} to={`/admin/annonces/${listing.id}/candidatures`} size="sm" variant="primary">
                      Voir les candidatures
                    </Button>
                  }
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageShell>
  );
};

export default AdminDashboard;
