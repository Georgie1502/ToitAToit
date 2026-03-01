const toneClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
};

const StatCard = ({ label, value, note, tone = 'primary' }) => {
  return (
    <div className="rounded-2xl bg-surface p-5 shadow-soft ring-1 ring-border/70">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${toneClasses[tone] || toneClasses.primary}`}>{value}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>
    </div>
  );
};

export default StatCard;
