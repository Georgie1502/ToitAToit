const toneClasses = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/20 text-primary',
  accent: 'bg-accentSoft text-ink',
};

const FeatureCard = ({ title, text, tone = 'primary' }) => {
  return (
    <article className="rounded-2xl bg-surface p-6 shadow-soft ring-1 ring-border/70 transition duration-150 ease-subtle hover:-translate-y-1 hover:shadow-lift">
      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
        <div className="h-2 w-2 rounded-full bg-current" />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{text}</p>
    </article>
  );
};

export default FeatureCard;
