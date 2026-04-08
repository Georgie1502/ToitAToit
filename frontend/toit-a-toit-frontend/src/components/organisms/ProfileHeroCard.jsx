const ProfileHeroCard = ({ user, locationLabel, onEdit, onShare }) => {
  const initials = (user?.username || 'TT')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'TT';

  return (
    <div className="rounded-[1.5rem] bg-surfaceContainerLowest p-8 text-center shadow-[0_4px_40px_rgba(38,48,53,0.05)]">
      <div className="relative mx-auto mb-6 h-48 w-48">
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-primaryContainer via-secondaryContainer to-tertiaryContainer ring-8 ring-surfaceContainer text-4xl font-extrabold text-on-surface">
          <span className="font-headline">{initials}</span>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center justify-center rounded-full bg-secondaryFixed p-2 text-on-secondary-container shadow-lg">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        </div>
      </div>

      <h1 className="mb-2 font-headline text-3xl font-bold tracking-tight text-on-surface">{user?.username || 'Votre profil'}</h1>
      <p className="mb-6 flex items-center justify-center gap-2 font-headline font-semibold text-primary">
        <span className="material-symbols-outlined text-lg">location_on</span>
        {locationLabel}
      </p>

      <div className="flex w-full gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-full bg-primary py-3 font-headline text-sm font-bold text-on-primary shadow-md transition-all hover:shadow-xl active:scale-95"
        >
          Modifier le profil
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-surfaceContainer text-on-surface-variant transition-colors hover:bg-surfaceContainerHigh"
        >
          <span className="material-symbols-outlined">share</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileHeroCard;
