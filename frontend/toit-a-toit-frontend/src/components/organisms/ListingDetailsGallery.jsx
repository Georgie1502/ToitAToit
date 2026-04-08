import { Button } from '../atoms';

const ListingDetailsGallery = ({
  hasPhotos,
  mainPhoto,
  secondaryPhoto,
  tertiaryPhoto,
  listingTitle,
  photoUrls,
  safeIndex,
  isAutoPlay,
  onMouseEnter,
  onMouseLeave,
  onOpenLightbox,
  onSetActiveIndex,
  onPrev,
  onNext,
  onToggleAutoPlay,
}) => {
  return (
    <>
      <div
        className="grid h-[420px] gap-4 md:h-[600px] md:grid-cols-12"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <button
          type="button"
          onClick={() => hasPhotos && onOpenLightbox()}
          className="group relative col-span-12 overflow-hidden rounded-[1.5rem] bg-surfaceContainer shadow-[0_20px_60px_rgba(38,48,53,0.12)] md:col-span-8"
        >
          {mainPhoto ? (
            <img
              src={mainPhoto}
              alt={listingTitle || 'Photo principale de l’annonce'}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondaryContainer/45 via-surfaceContainer to-primaryContainer/20 font-body text-sm font-semibold text-muted">
              Aucune photo disponible
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-ink backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px]">photo_library</span>
            Voir toutes les photos
          </div>
        </button>

        <div className="hidden h-full flex-col gap-4 md:col-span-4 md:flex">
          <button
            type="button"
            onClick={() => hasPhotos && onOpenLightbox()}
            className="group relative h-1/2 overflow-hidden rounded-[1.5rem] bg-surfaceContainer shadow-[0_20px_60px_rgba(38,48,53,0.08)]"
          >
            {secondaryPhoto ? (
              <img
                src={secondaryPhoto}
                alt="Aperçu de la galerie"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondaryContainer/20 font-body text-sm font-semibold text-muted">
                Deuxième photo
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={() => hasPhotos && onOpenLightbox()}
            className="group relative h-1/2 overflow-hidden rounded-[1.5rem] bg-surfaceContainer shadow-[0_20px_60px_rgba(38,48,53,0.08)]"
          >
            {tertiaryPhoto ? (
              <img
                src={tertiaryPhoto}
                alt="Aperçu de la galerie"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-primaryContainer/20 font-body text-sm font-semibold text-muted">
                Troisième photo
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        </div>
      </div>

      {hasPhotos ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {photoUrls.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => onSetActiveIndex(index)}
              className={`h-20 w-28 flex-shrink-0 overflow-hidden rounded-2xl transition duration-150 ${index === safeIndex ? 'ring-2 ring-primary' : 'opacity-65 hover:opacity-100'}`}
            >
              <img src={url} alt={`Aperçu ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={onPrev} disabled={!hasPhotos}>
          ←
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onNext} disabled={!hasPhotos}>
          →
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onToggleAutoPlay} disabled={!hasPhotos}>
          {isAutoPlay ? 'Pause' : 'Lecture auto'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => hasPhotos && onOpenLightbox()} disabled={!hasPhotos}>
          Plein écran
        </Button>
      </div>
    </>
  );
};

export default ListingDetailsGallery;
