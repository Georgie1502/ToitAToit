import { Link } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';

const reassurance = [
  { title: 'Profils complets', text: 'Mode de vie, rythme, règles: tout est cadré avant de se rencontrer.' },
  { title: 'Règles de vie clarifiées', text: 'Cadre clair: invités, bruit, ménage, budget partagé.' },
  { title: 'Messagerie intégrée', text: 'Échanges sécurisés, centralisés sur la plateforme.' },
];

const solidarityCards = [
  { title: 'Gagner en stabilité', text: 'Un logement pérenne, un cadre défini pour vivre sereinement.' },
  { title: 'Partager au quotidien', text: 'Présence, entraide et échanges qui facilitent le quotidien.' },
  { title: 'Respect & compatibilité', text: 'Habitudes, rythmes et règles visibles pour éviter les mauvaises surprises.' },
];

const journeys = {
  seeker: {
    title: 'Je cherche',
    steps: ['Je complète mon profil', 'Je filtre et je compare', "J'envoie une demande"],
    cta: 'Trouver une colocation',
  },
  owner: {
    title: 'Je propose',
    steps: ['Je décris mon logement et mes règles', 'Je reçois des demandes', "Je choisis et j’échange"],
    cta: 'Publier une colocation',
  },
};

const compatibilityTags = ['Rythme de vie', 'Habitudes (fumeur/animaux…)', 'Budget & durée', 'Ambiance & règles'];

const sampleListings = [
  {
    id: '1',
    title: 'Grande chambre lumineuse',
    location: 'Lyon 3e',
    price: '580 € / mois',
    badge: 'Nouveau',
    tags: ['10m²', 'Tram T3', 'Calme'],
    image: '/annonces/chambre.jpg',
  },
  {
    id: '2',
    title: 'Coloc conviviale près du parc',
    location: 'Bordeaux Chartrons',
    price: '640 € / mois',
    badge: 'Nouveau',
    tags: ['20m²', 'Jardin', 'Mixte'],
    image: '/annonces/salon.jpg',
  },
  {
    id: '3',
    title: 'Duplex moderne à partager',
    location: 'Montreuil Croix de Chavaux',
    price: '720 € / mois',
    badge: 'Nouveau',
    tags: ['Duplex', 'Metro', 'Fibre'],
    image: '/annonces/appartement.jpg',
  },
  {
    id: '4',
    title: 'Coloc calme proche fac',
    location: 'Lille Vauban',
    price: '550 € / mois',
    badge: 'Nouveau',
    tags: ['12m²', 'Tram', 'Non fumeur'],
    image: '/annonces/chambre2.jpg',
  },
  {
    id: '5',
    title: 'Maison partagée avec jardin',
    location: 'Rennes Thabor',
    price: '680 € / mois',
    badge: 'Nouveau',
    tags: ['Jardin', 'Travail hybride', 'Calme'],
    image: '/annonces/jardin.jpg',
  },
  {
    id: '6',
    title: 'Loft lumineux',
    location: 'Marseille Cours Julien',
    price: '750 € / mois',
    badge: 'Nouveau',
    tags: ['Loft', 'Terrasse', 'Mixte'],
    image: '/annonces/loft.jpg',
  },
];

const testimonials = [
  {
    name: 'Sarah, infirmière',
    problem: 'Horaires décalés, peur de déranger.',
    change: 'Un foyer qui respecte mon rythme, moins de stress.',
    ambience: 'Règles sur le bruit et les invités claires dès le départ.',
  },
  {
    name: 'Yanis, étudiant',
    problem: 'Première coloc, besoin d’un cadre pour m’organiser.',
    change: 'J’ai trouvé une chambre et des colocs présents pour s’entraider.',
    ambience: 'Planning ménage partagé, budget transparent.',
  },
  {
    name: 'Lucie & Eva, co-hébergeantes',
    problem: 'Envie d’ouvrir leur maison sans sacrifier l’intimité.',
    change: 'Des demandes filtrées, des profils détaillés avant de dire oui.',
    ambience: 'Règles d’invités et d’espaces privés affichées.',
  },
];

const trustItems = [
  { title: 'Profils et informations structurées', text: 'Identité, préférences et habitudes présentées clairement.' },
  { title: 'Règles de vie visibles avant contact', text: 'Ce qui compte pour toi est visible dès la recherche.' },
  { title: 'Signalement & modération', text: 'Process clair si un comportement dérape.' },
  { title: 'Protection des informations sensibles', text: 'Adresse et données privées protégées par défaut.' },
];

const Home = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero */}
      <section className="bg-background/70">
        <PageShell>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-accentSoft px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
                Colocation solidaire
              </span>
              <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
                Trouve un toit, crée du lien.
              </h1>
              <p className="max-w-xl text-lg text-muted">
                Colocation solidaire: mise en relation basée sur le mode de vie, les besoins et la compatibilité.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" variant="primary">Trouver une colocation</Button>
                <Button size="lg" variant="secondary">Publier une colocation</Button>
              </div>
              <div className="grid gap-3 rounded-2xl bg-surface p-4 shadow-soft ring-1 ring-border md:grid-cols-3">
                {reassurance.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="text-xs text-muted">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[28px] bg-surface p-6 shadow-lift ring-1 ring-border">
                <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background/50 text-muted">
                  Aperçu annonce + profil + tags
                </div>
              </div>
            </div>
          </div>
        </PageShell>
      </section>

      {/* La colocation solidaire, concrètement */}
      <section>
        <PageShell>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Solidaire, concrètement</p>
              <h2 className="mt-2 font-display text-3xl text-ink">Un cadre clair, des bénéfices tangibles.</h2>
            </div>
            <p className="max-w-md text-sm text-muted">Pas d’effet vitrine: on parle règles, compatibilité et stabilité pour rassurer tout le monde.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {solidarityCards.map((card) => (
              <article key={card.title} className="rounded-2xl bg-surface p-6 shadow-soft ring-1 ring-border">
                <h3 className="text-lg font-semibold text-ink">{card.title}</h3>
                <p className="mt-2 text-sm text-muted">{card.text}</p>
              </article>
            ))}
          </div>
        </PageShell>
      </section>

      {/* Parcours 2 colonnes */}
      <section className="bg-secondary/15 py-16">
        <PageShell>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Parcours simplifiés</p>
              <h2 className="mt-2 font-display text-3xl text-ink">Deux parcours, trois étapes chacun.</h2>
            </div>
            <p className="max-w-md text-sm text-muted">Choisis ton intention: chercher ou proposer, le reste est guidé.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[journeys.seeker, journeys.owner].map((journey) => (
              <article key={journey.title} className="rounded-[20px] bg-surface p-6 shadow-soft ring-1 ring-border">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-ink">{journey.title}</h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Guidé</span>
                </div>
                <ol className="mt-4 space-y-3 text-sm text-ink">
                  {journey.steps.map((step) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex">
                  <Button variant={journey.title === 'Je cherche' ? 'primary' : 'secondary'} className="w-full" size="md">
                    {journey.cta}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </PageShell>
      </section>

      {/* Compatibilité */}
      <section>
        <PageShell>
          <div className="grid gap-8 rounded-[24px] bg-surface p-6 shadow-soft ring-1 ring-border lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Compatibilité</p>
              <h2 className="font-display text-3xl text-ink">Mieux que des annonces: des profils compatibles.</h2>
              <p className="text-sm text-muted">Les critères qui comptent pour vivre ensemble sont visibles dès la recherche.</p>
              <div className="flex flex-wrap gap-2">
                {compatibilityTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-support/30 px-3 py-1 text-xs font-semibold text-ink">{tag}</span>
                ))}
              </div>
            </div>
            <div className="rounded-[18px] bg-background/80 p-4 ring-1 ring-border/70">
              <div className="grid gap-3 rounded-xl bg-surface p-4 shadow-soft ring-1 ring-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Annonce</p>
                    <p className="text-sm font-semibold text-ink">Coloc conviviale près du parc</p>
                  </div>
                  <span className="rounded-full bg-accent px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-inverse">Nouveau</span>
                </div>
                <div className="rounded-lg bg-background/80 p-3 text-sm text-ink">
                  <p className="font-semibold">Profil d’Amine</p>
                  <p className="mt-1 text-muted">Rythme: horaires bureau • Habitudes: non fumeur, pas d’animaux • Ambiance: conviviale calme</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Rythme bureau', 'Non fumeur', 'Budget 650€', 'Invités ok 1x/semaine'].map((tag) => (
                    <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PageShell>
      </section>

      {/* Aperçu des colocations */}
      <PageShell>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Aperçu colocations</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Qualité avant quantité.</h2>
          </div>
          <p className="max-w-md text-sm text-muted">6 annonces récentes, filtrables par ville, budget et dates.</p>
        </div>
        <div className="mt-6 grid gap-4 rounded-2xl bg-surface p-6 shadow-soft ring-1 ring-border">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Ville, quartier, code postal"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 md:w-auto md:flex-1"
            />
            <input
              type="text"
              placeholder="Budget max"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 md:w-40"
            />
            <input
              type="text"
              placeholder="Dates"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 md:w-40"
            />
            <Button size="md" variant="primary">Rechercher</Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {sampleListings.map((listing) => (
              <article key={listing.id} className="overflow-hidden rounded-2xl bg-surface shadow-soft ring-1 ring-border">
                <div className="relative h-40 bg-background">
                  <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-inverse">
                    {listing.badge}
                  </span>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{listing.title}</h3>
                      <p className="text-sm text-muted">{listing.location}</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{listing.price}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-support/30 px-3 py-1 text-xs font-semibold text-ink">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" className="flex-1">Voir l'annonce</Button>
                    <Button size="sm" variant="ghost" className="flex-1">Favoris</Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="flex justify-center">
            <Button size="md" variant="secondary">Voir toutes les colocations</Button>
          </div>
        </div>
      </PageShell>

      {/* Témoignages */}
      <section>
        <PageShell>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Témoignages</p>
              <h2 className="mt-2 font-display text-3xl text-ink">Impact humain, sans chiffres creux.</h2>
            </div>
            <p className="max-w-md text-sm text-muted">Des histoires concrètes: problème initial, ce qui a changé, et le cadre qui a aidé.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="rounded-2xl bg-surface p-6 shadow-soft ring-1 ring-border">
                <p className="text-sm font-semibold text-ink">{item.name}</p>
                <div className="mt-3 space-y-2 text-sm text-ink">
                  <p className="font-semibold text-muted">Problème</p>
                  <p>{item.problem}</p>
                  <p className="font-semibold text-muted">Ce que la colocation solidaire a changé</p>
                  <p>{item.change}</p>
                  <p className="font-semibold text-muted">Ambiance / règles</p>
                  <p>{item.ambience}</p>
                </div>
              </article>
            ))}
          </div>
        </PageShell>
      </section>

      {/* Confiance & sécurité */}
      <section className="bg-secondary/15 py-16">
        <PageShell>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Confiance & sécurité</p>
              <h2 className="mt-2 font-display text-3xl text-ink">Un cadre pour réduire les risques.</h2>
            </div>
            <p className="max-w-md text-sm text-muted">Transparence sur les infos clés, signalement et données sensibles protégées.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {trustItems.map((item) => (
              <article key={item.title} className="rounded-2xl bg-surface p-5 shadow-soft ring-1 ring-border">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </PageShell>
      </section>

      {/* CTA final */}
      <section>
        <PageShell>
          <div className="rounded-[28px] bg-ink px-8 py-10 text-inverse shadow-lift">
            <div className="space-y-4 md:flex md:items-center md:justify-between md:space-y-0">
              <div className="max-w-xl space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accentSoft">Prêt à agir</p>
                <h2 className="font-display text-3xl">Prêt·e à trouver une colocation qui te correspond ?</h2>
                <p className="text-sm text-inverse/80">Deux parcours, un cadre clair. Tu choisis, on guide.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="md" variant="secondary">Trouver une colocation</Button>
                <Button size="md" variant="primary">Publier une colocation</Button>
              </div>
            </div>
          </div>
        </PageShell>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-inverse">
        <PageShell>
          <div className="grid gap-8 py-10 md:grid-cols-[1.1fr_1fr_1fr_1fr]">
            <div className="space-y-3">
              <p className="text-lg font-semibold">Toit à Toit</p>
              <p className="text-sm text-inverse/80">Plateforme utile et fiable pour la colocation solidaire.</p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-inverse/70">Produit</p>
              <Link className="block transition hover:text-accentSoft" to="/search">Trouver</Link>
              <Link className="block transition hover:text-accentSoft" to="/publish">Publier</Link>
              <Link className="block transition hover:text-accentSoft" to="/comment-ca-marche">Comment ça marche</Link>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-inverse/70">Confiance</p>
              <Link className="block transition hover:text-accentSoft" to="/securite">Sécurité</Link>
              <Link className="block transition hover:text-accentSoft" to="/signalement">Signalement</Link>
              <Link className="block transition hover:text-accentSoft" to="/charte">Charte</Link>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-inverse/70">Légal & contact</p>
              <Link className="block transition hover:text-accentSoft" to="/cgu">CGU</Link>
              <Link className="block transition hover:text-accentSoft" to="/privacy">Confidentialité</Link>
              <Link className="block transition hover:text-accentSoft" to="/contact">Contact</Link>
            </div>
          </div>
        </PageShell>
      </footer>
    </div>
  );
};

export default Home;
