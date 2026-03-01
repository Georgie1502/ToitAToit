import { PageShell } from '../components/templates';

const trustItems = [
  { title: 'Profils et informations structurées', text: 'Identité, préférences et habitudes présentées clairement avant tout échange.' },
  { title: 'Règles de vie visibles avant contact', text: 'Bruit, invités, animaux : le cadre est affiché pour éviter les surprises.' },
  { title: 'Signalement & modération', text: 'Un process clair en cas de comportement inapproprié.' },
  { title: 'Protection des informations sensibles', text: 'Adresse et données privées masquées par défaut.' },
];

const Securite = () => {
  return (
    <div className="space-y-12 pb-16">
      <section className="bg-background/70 py-10">
        <PageShell>
          <div className="rounded-[28px] bg-surface p-8 shadow-lift ring-1 ring-border">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Confiance & sécurité</p>
            <h1 className="mt-3 font-display text-3xl text-ink">Un cadre clair pour réduire les risques.</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              Profils structurés, règles de vie visibles avant contact, signalement et protection des informations sensibles.
            </p>
          </div>
        </PageShell>
      </section>

      <PageShell>
        <div className="grid gap-4 md:grid-cols-2">
          {trustItems.map((item) => (
            <article key={item.title} className="rounded-2xl bg-surface p-6 shadow-soft ring-1 ring-border">
              <p className="text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </PageShell>
    </div>
  );
};

export default Securite;
