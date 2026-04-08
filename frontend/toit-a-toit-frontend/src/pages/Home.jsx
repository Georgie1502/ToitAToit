import { Link } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';

const reassurance = [
  { title: 'Profils complets', text: 'Mode de vie, rythme, règles: tout est cadré avant de se rencontrer.' },
  { title: 'Règles clarifiées', text: 'Cadre clair: invités, bruit, ménage, budget partagé.' },
  { title: 'Messagerie intégrée', text: 'Échanges sécurisés, centralisés sur la plateforme.' },
];

const solidarityCards = [
  { title: 'Gagner en stabilité', text: 'Un logement pérenne, un cadre défini pour vivre sereinement.', tag: 'Stabilité' },
  { title: 'Partager au quotidien', text: 'Présence, entraide et échanges qui facilitent le quotidien.', tag: 'Lien social' },
  { title: 'Respect & compatibilité', text: 'Habitudes, rythmes et règles visibles pour éviter les mauvaises surprises.', tag: 'Compatibilité' },
];

const journeys = {
  seeker: {
    title: 'Je cherche',
    steps: ['Je complète mon profil', 'Je filtre et je compare', "J'envoie une demande"],
    cta: 'Trouver une colocation',
    to: '/recherche',
  },
  owner: {
    title: 'Je propose',
    steps: ['Je décris mon logement et mes règles', 'Je reçois des demandes', "Je choisis et j'échange"],
    cta: 'Publier une colocation',
    to: '/publier',
  },
};

const sampleListings = [
  { id: '1', title: 'Grande chambre lumineuse', location: 'Lyon 3e', price: '580 €/mois', tags: ['10m²', 'Tram T3', 'Calme'], image: '/annonces/chambre.jpg' },
  { id: '2', title: 'Coloc conviviale près du parc', location: 'Bordeaux Chartrons', price: '640 €/mois', tags: ['20m²', 'Jardin', 'Mixte'], image: '/annonces/salon.jpg' },
  { id: '3', title: 'Duplex moderne à partager', location: 'Montreuil', price: '720 €/mois', tags: ['Duplex', 'Metro', 'Fibre'], image: '/annonces/appartement.jpg' },
];

const testimonials = [
  { name: 'Sarah, infirmière', problem: 'Horaires décalés, peur de déranger.', change: 'Un foyer qui respecte mon rythme, moins de stress.' },
  { name: 'Yanis, étudiant', problem: 'Première coloc, besoin d\'un cadre.', change: 'J\'ai trouvé une chambre et des colocs présents pour s\'entraider.' },
  { name: 'Lucie & Eva', problem: 'Ouvrir leur maison sans sacrifier l\'intimité.', change: 'Des demandes filtrées, des profils détaillés avant de dire oui.' },
];

const trustItems = [
  { title: 'Profils et informations structurées', text: 'Identité, préférences et habitudes présentées clairement.' },
  { title: 'Règles de vie visibles avant contact', text: 'Ce qui compte pour toi est visible dès la recherche.' },
  { title: 'Signalement & modération', text: 'Process clair si un comportement dérape.' },
  { title: 'Protection des informations sensibles', text: 'Adresse et données privées protégées par défaut.' },
];

const Home = () => {
  return (
    <div className="space-y-28 pb-20">

      {/* ── Hero ── */}
      <section>
        <PageShell>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-7">
              <span className="inline-flex items-center rounded-full bg-accentSoft px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink">
                Colocation solidaire
              </span>
              <h1 className="font-display text-5xl leading-tight text-ink md:text-6xl">
                Trouve un toit,<br />crée du lien.
              </h1>
              <p className="max-w-lg font-body text-lg text-muted">
                Mise en relation basée sur le mode de vie, les besoins et la compatibilité.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button as={Link} to="/recherche" size="lg" variant="primary">Trouver une colocation</Button>
                <Button as={Link} to="/publier" size="lg" variant="secondary">Publier une annonce</Button>
              </div>
              <div className="grid gap-4 rounded-3xl bg-surface p-5 shadow-soft md:grid-cols-3">
                {reassurance.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="text-xs text-muted">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating card preview */}
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-40 w-40 rounded-full bg-primaryContainer/20 blur-3xl" />
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-accentSoft/50 blur-2xl" />
              <div className="relative rounded-3xl bg-surface p-6 shadow-lift">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-lg text-ink">Coloc conviviale près du parc</p>
                      <p className="text-sm text-muted">Bordeaux Chartrons</p>
                    </div>
                    <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-ink">Nouveau</span>
                  </div>
                  <div className="rounded-2xl bg-background p-4 text-sm">
                    <p className="font-semibold text-ink">Profil d'Amine</p>
                    <p className="mt-1 text-muted">Rythme bureau · Non fumeur · Conviviale calme</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Rythme bureau', 'Non fumeur', '650 €', 'Invités ok'].map((tag) => (
                      <span key={tag} className="rounded-full bg-secondaryContainer/50 px-3 py-1 text-xs font-semibold text-ink">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button size="md" variant="primary">Voir l'annonce</Button>
                </div>
              </div>
            </div>
          </div>
        </PageShell>
      </section>

      {/* ── Solidaire, concrètement ── */}
      <section>
        <PageShell>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Solidaire, concrètement</p>
              <h2 className="mt-2 font-display text-4xl text-ink">Un cadre clair,<br />des bénéfices tangibles.</h2>
            </div>
            <p className="max-w-sm font-body text-sm text-muted">
              Pas d'effet vitrine: on parle règles, compatibilité et stabilité.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {solidarityCards.map((card) => (
              <article key={card.title} className="rounded-3xl bg-surface p-8 shadow-soft">
                <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-ink">
                  {card.tag}
                </span>
                <h3 className="mt-4 font-display text-xl text-ink">{card.title}</h3>
                <p className="mt-2 font-body text-sm text-muted">{card.text}</p>
              </article>
            ))}
          </div>
        </PageShell>
      </section>

      {/* ── Parcours ── */}
      <section style={{ background: 'linear-gradient(135deg, #DDEAF2 0%, #EEF8FF 100%)' }} className="py-20">
        <PageShell>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Parcours simplifiés</p>
              <h2 className="mt-2 font-display text-4xl text-ink">Deux parcours,<br />trois étapes chacun.</h2>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[journeys.seeker, journeys.owner].map((journey, i) => (
              <article key={journey.title} className="rounded-3xl bg-surface p-8 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl text-ink">{journey.title}</h3>
                  <span className="rounded-full bg-primaryContainer/20 px-3 py-1 text-xs font-semibold text-primary">Guidé</span>
                </div>
                <ol className="mt-6 space-y-3">
                  {journey.steps.map((step, idx) => (
                    <li key={step} className="flex items-start gap-3 font-body text-sm text-ink">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cta-gradient text-[10px] font-bold text-inverse">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="mt-7">
                  <Button as={Link} to={journey.to} variant={i === 0 ? 'primary' : 'secondary'} size="md" className="w-full">
                    {journey.cta}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </PageShell>
      </section>

      {/* ── Aperçu annonces ── */}
      <section>
        <PageShell>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Aperçu colocations</p>
              <h2 className="mt-2 font-display text-4xl text-ink">Qualité avant quantité.</h2>
            </div>
            <Button as={Link} to="/recherche" size="md" variant="secondary">Voir toutes les annonces</Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {sampleListings.map((listing) => (
              <article key={listing.id} className="overflow-hidden rounded-3xl bg-surface shadow-soft">
                <div className="relative h-44 bg-background">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-inverse backdrop-blur-sm">
                    Nouveau
                  </span>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-lg text-ink">{listing.title}</h3>
                      <p className="text-sm text-muted">{listing.location}</p>
                    </div>
                    <span className="rounded-2xl bg-primaryContainer/20 px-3 py-1 text-sm font-semibold text-primary">
                      {listing.price}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-surfaceContainer px-3 py-1 text-xs font-semibold text-ink">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button as={Link} to={`/annonces/${listing.id}`} size="sm" variant="primary" className="w-full">
                    Voir l'annonce
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </PageShell>
      </section>

      {/* ── Témoignages ── */}
      <section>
        <PageShell>
          <div className="mb-10">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Témoignages</p>
            <h2 className="mt-2 font-display text-4xl text-ink">Impact humain,<br />sans chiffres creux.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="rounded-3xl bg-surface p-8 shadow-soft">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-ink">{item.name}</span>
                </div>
                <p className="mt-5 font-serif text-sm italic text-muted">"{item.problem}"</p>
                <p className="mt-4 font-body text-sm text-ink">{item.change}</p>
              </article>
            ))}
          </div>
        </PageShell>
      </section>

      {/* ── Confiance ── */}
      <section style={{ background: 'linear-gradient(135deg, #DDEAF2 0%, #EEF8FF 100%)' }} className="py-20">
        <PageShell>
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Confiance & sécurité</p>
              <h2 className="mt-2 font-display text-4xl text-ink">Un cadre pour<br />réduire les risques.</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {trustItems.map((item) => (
              <article key={item.title} className="rounded-3xl bg-surface p-7 shadow-soft">
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-2 font-body text-sm text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </PageShell>
      </section>

      {/* ── CTA final ── */}
      <section>
        <PageShell>
          <div className="overflow-hidden rounded-3xl shadow-lift" style={{ background: 'linear-gradient(135deg, #A8275A 0%, #FF709F 100%)' }}>
            <div className="relative px-8 py-12 md:px-14">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl space-y-3">
                  <span className="font-body text-xs font-semibold uppercase tracking-widest text-white/80">Prêt à agir</span>
                  <h2 className="font-display text-3xl text-white">Prêt·e à trouver une colocation qui te correspond ?</h2>
                  <p className="font-body text-sm text-white/80">Deux parcours, un cadre clair. Tu choisis, on guide.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button as={Link} to="/recherche" size="lg" variant="secondary">Trouver</Button>
                  <Button as={Link} to="/publier" size="lg" className="bg-white text-primary hover:bg-white/90">Publier</Button>
                </div>
              </div>
            </div>
          </div>
        </PageShell>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-ink text-inverse">
        <PageShell>
          <div className="grid gap-8 py-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <div className="space-y-3">
              <p className="font-display text-lg">Toit à Toit</p>
              <p className="font-body text-sm text-inverse/70">Plateforme utile et fiable pour la colocation solidaire.</p>
            </div>
            <div className="space-y-3 font-body text-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-inverse/50">Produit</p>
              <Link className="block text-inverse/70 transition hover:text-inverse" to="/recherche">Trouver</Link>
              <Link className="block text-inverse/70 transition hover:text-inverse" to="/publier">Publier</Link>
              <Link className="block text-inverse/70 transition hover:text-inverse" to="/onboarding">Comment ça marche</Link>
            </div>
            <div className="space-y-3 font-body text-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-inverse/50">Confiance</p>
              <Link className="block text-inverse/70 transition hover:text-inverse" to="/securite">Sécurité</Link>
            </div>
            <div className="space-y-3 font-body text-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-inverse/50">Légal</p>
              <Link className="block text-inverse/70 transition hover:text-inverse" to="/login">Connexion</Link>
              <Link className="block text-inverse/70 transition hover:text-inverse" to="/signup">Créer un compte</Link>
            </div>
          </div>
        </PageShell>
      </footer>
    </div>
  );
};

export default Home;
