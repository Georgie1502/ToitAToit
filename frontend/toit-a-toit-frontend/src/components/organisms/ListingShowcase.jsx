import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import ListingCard from '../molecules/ListingCard';
import { listListings } from '../../services/colocations';

const ListingShowcase = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadListings = async () => {
      try {
        const data = await listListings({ limit: 6, status: 'PUBLISHED' });
        if (isMounted) {
          setListings(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Impossible de charger les annonces pour le moment.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadListings();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mt-16">
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/50">Les annonces</p>
          <h2 className="mt-3 font-display text-3xl text-ink">Des colocations qui donnent envie.</h2>
        </div>
        <p className="max-w-md text-sm text-muted">
          Connectez-vous pour consulter chaque annonce et lancer une discussion.
        </p>
      </div>
      {error ? (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-6 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      ) : null}
      {loading ? (
        <p className="mt-6 text-sm text-muted">Chargement des annonces...</p>
      ) : null}
      {!loading && listings.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Aucune annonce publiee pour le moment.</p>
      ) : null}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            actions={
              <Button as={Link} to={`/annonces/${listing.id}`} size="sm" variant="primary">
                Voir l'annonce
              </Button>
            }
          />
        ))}
      </div>
    </section>
  );
};

export default ListingShowcase;
