const badgeItems = [
  { label: 'Aide Sociale', icon: 'volunteer_activism', className: 'bg-[#B5E8C8]' },
  { label: 'Eco-hôte', icon: 'eco', className: 'bg-tertiaryContainer' },
  { label: 'Inclusivité', icon: 'diversity_1', className: 'bg-primaryContainer' },
  { label: 'Mentorat', icon: 'school', className: 'bg-secondaryFixed' },
  { label: 'Partage', icon: 'favorite', className: 'bg-surfaceVariant' },
];

const ProfileBadgesCard = () => {
  return (
    <div className="rounded-[1.5rem] bg-secondaryContainer/40 p-8 shadow-sm">
      <h3 className="mb-6 font-headline text-lg font-bold text-on-secondary-container">Badges de solidarité</h3>
      <div className="grid grid-cols-3 gap-4">
        {badgeItems.map((badge) => (
          <div key={badge.label} className="flex flex-col items-center gap-2">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${badge.className} text-on-surface-variant shadow-sm`}>
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{badge.icon}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant text-center">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileBadgesCard;
