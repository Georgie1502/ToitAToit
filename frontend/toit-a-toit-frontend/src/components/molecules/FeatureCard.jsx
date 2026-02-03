const toneClasses = {
  rose: 'bg-rose/15 text-rose',
  blue: 'bg-blue/15 text-blue',
  teal: 'bg-teal/20 text-teal',
  violet: 'bg-violet/15 text-violet',
};

const FeatureCard = ({ title, text, tone = 'blue' }) => {
  return (
    <article className="rounded-3xl bg-white/85 p-6 shadow-soft ring-1 ring-ink/5">
      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl ${toneClasses[tone]}`}>
        <div className="h-2 w-2 rounded-full bg-current" />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink/70">{text}</p>
    </article>
  );
};

export default FeatureCard;
