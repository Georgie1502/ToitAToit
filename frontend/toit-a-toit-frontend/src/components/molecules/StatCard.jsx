const toneClasses = {
  blue: 'text-blue',
  coral: 'text-coral',
  teal: 'text-teal',
  rose: 'text-rose',
  violet: 'text-violet',
};

const StatCard = ({ label, value, note, tone = 'blue' }) => {
  return (
    <div className="rounded-3xl bg-white/80 p-5 shadow-soft ring-1 ring-ink/5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${toneClasses[tone] || toneClasses.blue}`}>{value}</p>
      <p className="mt-1 text-xs text-ink/60">{note}</p>
    </div>
  );
};

export default StatCard;
