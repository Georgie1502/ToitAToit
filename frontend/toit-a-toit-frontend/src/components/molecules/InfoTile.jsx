const toneClasses = {
  surface: 'bg-surface',
  accent: 'bg-accentSoft/80',
  secondary: 'bg-secondary/20',
  primary: 'bg-primary/10',
  support: 'bg-support/30',
};

const InfoTile = ({ label, value, helper, tone = 'card', className = '' }) => {
  return (
    <div className={`rounded-2xl border border-border px-4 py-3 ${toneClasses[tone] || toneClasses.surface} ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 text-sm text-ink">{value}</p>
      {helper ? <p className="mt-1 text-xs text-muted">{helper}</p> : null}
    </div>
  );
};

export default InfoTile;
