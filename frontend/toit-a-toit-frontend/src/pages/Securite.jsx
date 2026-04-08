import { PageShell } from '../components/templates';

const trustItems = [
  { title: 'Profils et informations structurées', text: 'Identité, préférences et habitudes présentées clairement avant tout échange.', tag: 'Transparence' },
  { title: 'Règles de vie visibles avant contact', text: 'Bruit, invités, animaux : le cadre est affiché pour éviter les surprises.', tag: 'Clarté' },
  { title: 'Signalement & modération', text: 'Un process clair en cas de comportement inapproprié.', tag: 'Sécurité' },
  { title: 'Protection des informations sensibles', text: 'Adresse et données privées masquées par défaut.', tag: 'Confidentialité' },
];

const Securite = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #DDEAF2 0%, #EEF8FF 100%)' }} className="py-16">
        <PageShell>
          <div className="max-w-2xl space-y-4">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Confiance & sécurité</p>
            <h1 className="font-display text-5xl text-ink">Un cadre clair pour<br />réduire les risques.</h1>
            <p className="font-body text-lg text-muted">
              Profils structurés, règles de vie visibles avant contact, signalement et protection des informations sensibles.
            </p>
          </div>
        </PageShell>
      </section>

      {/* Grille */}
      <PageShell>
        <div className="grid gap-6 md:grid-cols-2">
          {trustItems.map((item) => (
            <article key={item.title} className="rounded-3xl bg-surface p-8 shadow-soft transition duration-200 hover:shadow-lift">
              <span className="rounded-full bg-accentSoft px-3 py-1 font-body text-xs font-semibold text-ink">
                {item.tag}
              </span>
              <h2 className="mt-4 font-display text-xl text-ink">{item.title}</h2>
              <p className="mt-2 font-body text-sm text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </PageShell>

      {/* CTA */}
      <PageShell>
        <div className="overflow-hidden rounded-3xl shadow-lift" style={{ background: 'linear-gradient(135deg, #A8275A 0%, #FF709F 100%)' }}>
          <div className="p-10 md:p-14">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-white/70">Prêt·e à commencer ?</p>
            <h2 className="mt-3 font-display text-3xl text-white">Rejoindre une communauté<br />qui prend soin l'un de l'autre.</h2>
          </div>
        </div>
      </PageShell>
    </div>
  );
};

export default Securite;
