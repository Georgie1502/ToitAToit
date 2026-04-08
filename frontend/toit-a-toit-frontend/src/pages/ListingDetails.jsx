import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/atoms';
import {
  ListingDetailsGallery,
  ListingDetailsMainSections,
  ListingDetailsQuickFacts,
  ListingDetailsStickyCard,
} from '../components/organisms';
import { PageShell } from '../components/templates';
import { getListingById } from '../services/colocations';
import { applyToListing } from '../services/applications';

const housingLabels = { ROOM: 'Chambre', STUDIO: 'Studio', FLAT: 'Appartement', HOUSE: 'Maison', OTHER: 'Autre' };
const statusLabels = { DRAFT: 'Brouillon', PUBLISHED: 'Publié', PAUSED: 'En pause', CLOSED: 'Fermé' };

const formatNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString('fr-FR') : null;
};

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      setFeedback('');

      try {
        const data = await getListingById(id);
        if (!isMounted) return;

        setListing(data.listing);
        setPhotos(data.photos || []);
        setActiveIndex(0);
      } catch {
        if (isMounted) setError('Impossible de charger cette annonce.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const photoUrls = useMemo(() => {
    const urls = [
      ...(photos || []).map((photo) => photo?.url),
      listing?.photo_url,
    ].filter((url) => typeof url === 'string' && url.trim().length > 0);

    return [...new Set(urls)];
  }, [photos, listing?.photo_url]);

  const hasPhotos = photoUrls.length > 0;
  const safeIndex = hasPhotos ? activeIndex % photoUrls.length : 0;
  const mainPhoto = hasPhotos ? photoUrls[safeIndex] : null;
  const secondaryPhoto = hasPhotos ? photoUrls[(safeIndex + 1) % photoUrls.length] : null;
  const tertiaryPhoto = hasPhotos ? photoUrls[(safeIndex + 2) % photoUrls.length] : null;

  const handlePrev = () => {
    if (!hasPhotos) return;
    setActiveIndex((current) => (current - 1 + photoUrls.length) % photoUrls.length);
  };

  const handleNext = () => {
    if (!hasPhotos) return;
    setActiveIndex((current) => (current + 1) % photoUrls.length);
  };

  const handleShare = async () => {
    if (!listing) return;

    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: listing.description,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setFeedback('Lien copié dans le presse-papiers.');
      }
    } catch {
      setFeedback('Partage annulé ou indisponible.');
    }
  };

  const handleFavorite = () => {
    setIsFavorite((current) => !current);
    setFeedback(isFavorite ? 'Retirée des favoris.' : 'Ajoutée aux favoris.');
  };

  const handleContact = async () => {
    if (!listing) return;

    const message = window.prompt('Écrivez un court message pour le propriétaire avant d’envoyer votre demande :', 'Bonjour, cette annonce m’intéresse.');
    if (message === null) return;

    setIsSubmitting(true);
    setError('');
    setFeedback('');

    try {
      await applyToListing(id, message.trim());
      setFeedback('Votre demande a bien été envoyée.');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Impossible d’envoyer votre demande pour le moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!hasPhotos || !isAutoPlay || isHovered) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % photoUrls.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [hasPhotos, isAutoPlay, isHovered, photoUrls.length]);

  useEffect(() => {
    if (!isLightboxOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsLightboxOpen(false);
      if (event.key === 'ArrowLeft') handlePrev();
      if (event.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLightboxOpen, photoUrls.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const title = listing?.title || '…';
  const locationLabel = listing?.city
    ? `${listing.city}${listing.postal_code ? `, ${listing.postal_code}` : ''}`
    : 'Localisation à préciser';
  const housingLabel = housingLabels[listing?.housing_type] || listing?.housing_type || 'Logement';
  const statusLabel = statusLabels[listing?.status] || listing?.status || 'Non renseigné';
  const rentLabel = formatNumber(listing?.rent_amount);
  const surfaceLabel = formatNumber(listing?.surface_m2);
  const availableFromLabel = formatDate(listing?.available_from);
  const availableToLabel = formatDate(listing?.available_to);
  const minimumDurationLabel = listing?.min_duration_months ? `${listing.min_duration_months} mois` : 'Non précisée';

  const quickFacts = [
    { label: 'Prix', value: rentLabel ? `${rentLabel}€ / mois` : 'Non renseigné' },
    { label: 'Espace', value: surfaceLabel ? `${surfaceLabel} m²` : 'Non renseigné' },
    { label: 'Type', value: housingLabel },
    { label: 'Dispo', value: availableFromLabel ? `Dès le ${availableFromLabel}` : 'À préciser' },
  ];

  const detailRows = [
    { label: 'Loyer', value: rentLabel ? `${rentLabel}€` : 'Non renseigné' },
    { label: 'Charges', value: listing?.charges_included ? 'Incluses' : 'Non incluses' },
    { label: 'Surface', value: surfaceLabel ? `${surfaceLabel} m²` : 'Non renseignée' },
    { label: 'Type de logement', value: housingLabel },
    { label: 'Disponible à partir de', value: availableFromLabel || 'Non renseignée' },
    { label: 'Disponible jusqu’au', value: availableToLabel || 'Ouvert' },
    { label: 'Durée minimale', value: minimumDurationLabel },
    { label: 'Statut', value: statusLabel },
  ];

  return (
    <PageShell>
      <div className="relative mx-auto max-w-7xl space-y-10">
        <div className="absolute inset-x-0 top-0 -z-10 h-[24rem] bg-gradient-to-b from-secondaryContainer/45 via-background to-background" />

        <section className="space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4 pt-2">
            <div className="space-y-4">
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-[0.28em] text-primary">Annonce</p>
                <h1 className="mt-2 max-w-4xl font-display text-4xl font-extrabold leading-tight text-ink md:text-5xl">
                  {title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  <span className="font-body text-sm font-semibold">{locationLabel}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-ink/5 px-4 py-2 font-body text-xs font-semibold uppercase tracking-widest text-ink">{statusLabel}</span>
                <span className="rounded-full bg-secondaryContainer px-4 py-2 font-body text-xs font-semibold text-ink">{housingLabel}</span>
                {surfaceLabel ? (
                  <span className="rounded-full bg-surfaceContainer px-4 py-2 font-body text-xs font-semibold text-ink">{surfaceLabel} m²</span>
                ) : null}
                {listing?.charges_included ? (
                  <span className="rounded-full bg-accentSoft px-4 py-2 font-body text-xs font-semibold text-ink">Charges comprises</span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-3 self-start">
              <Button as={Link} to="/recherche" variant="ghost" size="sm">
                Retour
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleShare}>
                <span className="material-symbols-outlined text-[18px]">share</span>
              </Button>
              <Button
                type="button"
                variant={isFavorite ? 'secondary' : 'ghost'}
                size="sm"
                onClick={handleFavorite}
                className={isFavorite ? 'border-primary/25 bg-primaryContainer/20 text-primary' : ''}
              >
                <span className="material-symbols-outlined text-[18px]">favorite</span>
              </Button>
            </div>
          </div>

          {error ? (
            <div role="alert" aria-live="assertive" className="rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
              {error}
            </div>
          ) : null}
          {feedback ? (
            <div className="rounded-3xl bg-secondaryContainer/30 px-5 py-4 font-body text-sm text-ink">
              {feedback}
            </div>
          ) : null}
          {loading ? <p className="font-body text-sm text-muted">Chargement de l'annonce...</p> : null}

          {!loading && listing ? (
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
              <div className="space-y-10">
                <ListingDetailsGallery
                  hasPhotos={hasPhotos}
                  mainPhoto={mainPhoto}
                  secondaryPhoto={secondaryPhoto}
                  tertiaryPhoto={tertiaryPhoto}
                  listingTitle={listing.title}
                  photoUrls={photoUrls}
                  safeIndex={safeIndex}
                  isAutoPlay={isAutoPlay}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onOpenLightbox={() => setIsLightboxOpen(true)}
                  onSetActiveIndex={setActiveIndex}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onToggleAutoPlay={() => setIsAutoPlay((current) => !current)}
                />

                <ListingDetailsQuickFacts quickFacts={quickFacts} />

                <ListingDetailsMainSections
                  listing={listing}
                  housingLabel={housingLabel}
                  minimumDurationLabel={minimumDurationLabel}
                  rentLabel={rentLabel}
                  availableFromLabel={availableFromLabel}
                />
              </div>

              <ListingDetailsStickyCard
                rentLabel={rentLabel}
                chargesIncluded={listing?.charges_included}
                isSubmitting={isSubmitting}
                isFavorite={isFavorite}
                detailRows={detailRows}
                onContact={handleContact}
                onToggleFavorite={handleFavorite}
              />
            </div>
          ) : null}
        </section>

        {isLightboxOpen && hasPhotos ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-4 py-8 backdrop-blur-sm">
            <div role="dialog" aria-modal="true" className="relative w-full max-w-5xl rounded-[1.75rem] bg-surface p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute right-5 top-5 rounded-full bg-ink px-4 py-2 font-body text-xs font-semibold text-inverse"
              >
                Fermer
              </button>
              <div className="flex min-h-[60vh] items-center justify-center">
                <img src={mainPhoto} alt={listing?.title || 'Annonce'} className="max-h-[70vh] w-full rounded-3xl object-contain" />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <Button type="button" size="sm" variant="ghost" onClick={handlePrev}>
                  ← Précédente
                </Button>
                <p className="font-body text-xs text-muted">
                  {safeIndex + 1} / {photoUrls.length}
                </p>
                <Button type="button" size="sm" variant="primary" onClick={handleNext}>
                  Suivante →
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
