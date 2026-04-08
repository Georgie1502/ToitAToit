import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Input } from '../components/atoms';
import { ListingCard } from '../components/molecules';
import { PageShell } from '../components/templates';
import { listListings } from '../services/colocations';

const HOUSING_TAGS = [
  { label: 'Tous', value: '' },
  { label: 'Chambre', value: 'ROOM' },
  { label: 'Studio', value: 'STUDIO' },
  { label: 'Appartement', value: 'FLAT' },
  { label: 'Maison', value: 'HOUSE' },
];

const ITEMS_PER_PAGE = 5;

const Recherche = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);

  const [draftFiltres, setDraftFiltres] = useState({
    city: searchParams.get('city') || '',
    max_rent: searchParams.get('max_rent') || '',
    housing_type: searchParams.get('housing_type') || '',
  });

  const fetchListings = async (params) => {
    setLoading(true);
    setError('');
    try {
      const query = { status: 'PUBLISHED', limit: 100 };
      if (params.city) query.city = params.city;
      if (params.max_rent) query.max_rent = params.max_rent;
      const data = await listListings(query);
      const filtered = params.housing_type
        ? data.filter((l) => l.housing_type === params.housing_type)
        : data;
      setAllListings(filtered);
      setPage(1);
    } catch {
      setError('Impossible de charger les annonces. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings({
      city: searchParams.get('city') || '',
      max_rent: searchParams.get('max_rent') || '',
      housing_type: searchParams.get('housing_type') || '',
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (draftFiltres.city) params.city = draftFiltres.city;
    if (draftFiltres.max_rent) params.max_rent = draftFiltres.max_rent;
    if (draftFiltres.housing_type) params.housing_type = draftFiltres.housing_type;
    setSearchParams(params);
    fetchListings(draftFiltres);
  };

  const handleReset = () => {
    const vides = { city: '', max_rent: '', housing_type: '' };
    setDraftFiltres(vides);
    setSearchParams({});
    fetchListings(vides);
  };

  const sortedListings = [...allListings].sort((a, b) => {
    if (sortBy === 'price_asc') return (a.rent_amount || 0) - (b.rent_amount || 0);
    if (sortBy === 'price_desc') return (b.rent_amount || 0) - (a.rent_amount || 0);
    return (b.id || 0) - (a.id || 0);
  });

  const totalPages = Math.ceil(sortedListings.length / ITEMS_PER_PAGE);
  const paginatedListings = sortedListings.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <PageShell>
      {/* Hero */}
      <header className="mb-10">
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          Annonces
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-ink leading-tight">
          Trouvez votre{' '}
          <span className="text-primary">Colocation Solidaire</span> idéale
        </h1>
        <p className="mt-3 font-body text-base text-muted max-w-xl">
          Explorez des logements partagés basés sur l'entraide et la bienveillance.{' '}
          <span className="font-serif italic text-primary">
            Un toit, un projet, une rencontre.
          </span>
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-start">
        {/* ── Sidebar Filtres ── */}
        <aside>
          <form
            onSubmit={handleSubmit}
            className="sticky top-24 bg-surface rounded-3xl p-7 shadow-soft space-y-7"
          >
            <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
           
              Filtres
            </h3>

            {/* City */}
            <div>
              <label htmlFor="filter-city" className="block font-body text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                Ville ou quartier
              </label>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                  style={{ fontSize: '18px' }}
                >
        
                </span>
                <Input
                  id="filter-city"
                  type="text"
                  value={draftFiltres.city}
                  onChange={(e) =>
                    setDraftFiltres((p) => ({ ...p, city: e.target.value }))
                  }
                  placeholder="Ex: Toulouse"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Housing type tags */}
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                Type de logement
              </p>
              <div className="flex flex-wrap gap-2">
                {HOUSING_TAGS.map((tag) => (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() =>
                      setDraftFiltres((p) => ({ ...p, housing_type: tag.value }))
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      draftFiltres.housing_type === tag.value
                        ? 'bg-primary text-inverse shadow-soft'
                        : 'bg-surfaceContainer text-muted border border-transparent hover:border-primary/30 hover:text-ink'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget max */}
            <div>
              <label htmlFor="filter-max-rent" className="block font-body text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                Budget max (€/mois)
              </label>
              <Input
                id="filter-max-rent"
                type="number"
                value={draftFiltres.max_rent}
                onChange={(e) =>
                  setDraftFiltres((p) => ({ ...p, max_rent: e.target.value }))
                }
                min="0"
                placeholder="800"
              />
            </div>

            <div className="space-y-2 pt-1">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Recherche…' : 'Appliquer les filtres'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                className="w-full"
                onClick={handleReset}
                disabled={loading}
              >
                Réinitialiser
              </Button>
            </div>
          </form>
        </aside>

        {/* ── Main Listings ── */}
        <section>
          {/* Toolbar */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-7">
            <p className="font-display text-lg font-bold text-ink">
              {loading ? (
                <span className="text-muted">Chargement…</span>
              ) : (
                <>
                  {allListings.length}{' '}
                  <span className="font-body font-normal text-base text-muted">
                    colocation{allListings.length !== 1 ? 's' : ''} disponible
                    {allListings.length !== 1 ? 's' : ''}
                  </span>
                </>
              )}
            </p>
            <div className="flex items-center gap-2 font-body text-sm text-muted">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                sort
              </span>
              <span>Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent border-none focus:ring-0 font-semibold text-primary cursor-pointer"
              >
                <option value="recent">Plus récentes</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error ? (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger mb-6"
            >
              {error}
            </div>
          ) : null}

          {/* Loading skeletons */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-3xl bg-surface shadow-soft"
                />
              ))}
            </div>
          ) : paginatedListings.length === 0 ? (
            /* Empty state */
            <div className="rounded-3xl bg-surface p-12 text-center shadow-soft">
              <span className="material-symbols-outlined text-muted mb-4 block" style={{ fontSize: '48px' }}>
                search_off
              </span>
              <p className="font-display text-xl text-ink">Aucune annonce trouvée</p>
              <p className="mt-2 font-body text-sm text-muted">
                Essayez une autre ville ou élargissez votre budget.
              </p>
              <div className="mt-6">
                <Button type="button" variant="ghost" size="md" onClick={handleReset}>
                  Voir toutes les annonces
                </Button>
              </div>
            </div>
          ) : (
            /* Listings */
            <div className="space-y-6">
              {paginatedListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  horizontal
                  actions={
                    <Button as={Link} to={`/annonces/${listing.id}`} size="sm" variant="secondary">
                      Voir l'annonce
                    </Button>
                  }
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 ? (
            <div className="mt-12 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-30"
                aria-label="Page précédente"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  chevron_left
                </span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-11 h-11 rounded-full font-body font-bold text-sm transition-all ${
                    p === page
                      ? 'bg-primary text-inverse shadow-soft'
                      : 'border border-border hover:bg-surface text-ink'
                  }`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-30"
                aria-label="Page suivante"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  chevron_right
                </span>
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </PageShell>
  );
};

export default Recherche;
