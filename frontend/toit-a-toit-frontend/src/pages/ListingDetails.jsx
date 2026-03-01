import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/atoms';
import { InfoTile } from '../components/molecules';
import { PageShell } from '../components/templates';
import { getListingById } from '../services/colocations';

const housingLabels = {
  ROOM: 'Chambre',
  STUDIO: 'Studio',
  FLAT: 'Appartement',
  HOUSE: 'Maison',
  OTHER: 'Autre',
};

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadListing = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getListingById(id);
        if (isMounted) {
          setListing(data.listing);
          setPhotos(data.photos || []);
        }
      } catch (err) {
        if (isMounted) {
          setError("Impossible de charger cette annonce.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadListing();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const photoUrls = useMemo(() => {
    return (photos || []).map((photo) => photo?.url).filter((url) => typeof url === 'string' && url.length > 0);
  }, [photos]);

  const hasPhotos = photoUrls.length > 0;
  const safeIndex = hasPhotos ? activeIndex % photoUrls.length : 0;
  const mainPhoto = hasPhotos ? photoUrls[safeIndex] : null;

  const handlePrev = () => {
    if (!hasPhotos) return;
    setActiveIndex((prev) => (prev - 1 + photoUrls.length) % photoUrls.length);
  };

  const handleNext = () => {
    if (!hasPhotos) return;
    setActiveIndex((prev) => (prev + 1) % photoUrls.length);
  };

  useEffect(() => {
    if (!hasPhotos || !isAutoPlay || isHovered) return undefined;
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photoUrls.length);
    }, 5000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasPhotos, isAutoPlay, isHovered, photoUrls.length]);

  useEffect(() => {
    if (!isLightboxOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false);
      }
      if (event.key === 'ArrowLeft') {
        handlePrev();
      }
      if (event.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, handleNext, handlePrev]);

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-3xl text-ink">Annonce</h2>
          <Button as={Link} to="/" size="sm" variant="ghost">
            Retour
          </Button>
        </div>

        {error ? (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            {error}
          </div>
        ) : null}

        {loading ? <p className="text-sm text-muted">Chargement de l'annonce...</p> : null}

        {!loading && listing ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-6">
              <div className="overflow-hidden rounded-[36px] bg-surface shadow-lift ring-1 ring-border">
                <div
                  className="relative min-h-[320px] bg-hero-gradient"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {mainPhoto ? (
                    <button type="button" className="h-full w-full" onClick={() => setIsLightboxOpen(true)}>
                      <img src={mainPhoto} alt={listing.title} className="h-full w-full object-cover" />
                    </button>
                  ) : (
                    <div className="flex min-h-[320px] items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
                      Photo a venir
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/0" />
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                    <div className="rounded-3xl bg-card/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                      {listing.status}
                    </div>
                    <div className="rounded-3xl bg-card/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                      {safeIndex + 1} / {hasPhotos ? photoUrls.length : 1}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-3xl font-semibold text-ink">{listing.title}</h3>
                  <p className="mt-3 text-sm text-muted">{listing.description}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Button type="button" size="sm" variant="ghost" onClick={handlePrev} disabled={!hasPhotos}>
                      Photo precedente
                    </Button>
                    <Button type="button" size="sm" variant="primary" onClick={handleNext} disabled={!hasPhotos}>
                      Photo suivante
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsAutoPlay((prev) => !prev)}
                      disabled={!hasPhotos}
                    >
                      {isAutoPlay ? 'Pause' : 'Lecture auto'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsLightboxOpen(true)}
                      disabled={!hasPhotos}
                    >
                      Plein ecran
                    </Button>
                  </div>
                </div>
              </div>

              {hasPhotos ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {photoUrls.map((url, index) => (
                    <button
                      key={`${url}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`h-24 w-32 flex-shrink-0 overflow-hidden rounded-2xl ring-2 transition ${
                        index === safeIndex ? 'ring-primary' : 'ring-transparent'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`${listing.title || 'Annonce'} - apercu ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="rounded-[32px] bg-ink p-6 text-white shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Colocation solidaire</p>
                <h4 className="mt-2 text-lg font-semibold">Un toit partage, un lien qui se cree</h4>
                <p className="mt-3 text-sm text-white/80">
                  Cette annonce met en avant une vie commune respectueuse, chaleureuse et inclusive. Chaque colocataire
                  trouve sa place et ses repaires.
                </p>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[32px] bg-card p-6 shadow-soft ring-1 ring-border">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Details</p>
                <div className="mt-4 grid gap-4">
                  <InfoTile
                    label="Type"
                    value={housingLabels[listing.housing_type] || listing.housing_type}
                    tone="surface"
                  />
                  <InfoTile label="Loyer" value={`${listing.rent_amount} EUR`} tone="surface" />
                  <InfoTile
                    label="Charges"
                    value={listing.charges_included ? 'Incluses' : 'Non incluses'}
                    tone="surface"
                  />
                  <InfoTile
                    label="Surface"
                    value={listing.surface_m2 ? `${listing.surface_m2} m2` : 'Non renseigne'}
                    tone="surface"
                  />
                  <InfoTile
                    label="Disponible"
                    value={listing.available_from ? listing.available_from.slice(0, 10) : 'Non renseigne'}
                    tone="surface"
                  />
                  <InfoTile
                    label="Jusqu'au"
                    value={listing.available_to ? listing.available_to.slice(0, 10) : 'Ouvert'}
                    tone="surface"
                  />
                </div>
              </div>

              <div className="rounded-[32px] bg-card p-6 shadow-soft ring-1 ring-border">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Localisation</p>
                <h4 className="mt-2 text-lg font-semibold text-ink">{listing.city}</h4>
                <p className="mt-2 text-sm text-muted">
                  {listing.address || 'Adresse precise sur demande'}
                </p>
                <p className="mt-2 text-sm text-muted">{listing.postal_code}</p>
              </div>
            </aside>
          </div>
        ) : null}
        {isLightboxOpen && hasPhotos ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-4 py-8 backdrop-blur">
            <div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-5xl rounded-[32px] bg-card p-4 shadow-lift"
            >
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute right-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white"
              >
                Fermer
              </button>
              <div className="flex min-h-[60vh] items-center justify-center">
                <img src={mainPhoto} alt={listing?.title || 'Annonce'} className="max-h-[70vh] w-full rounded-3xl object-contain" />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <Button type="button" size="sm" variant="ghost" onClick={handlePrev}>
                  Photo precedente
                </Button>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  {safeIndex + 1} / {photoUrls.length}
                </p>
                <Button type="button" size="sm" variant="primary" onClick={handleNext}>
                  Photo suivante
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
};

export default ListingDetails;
