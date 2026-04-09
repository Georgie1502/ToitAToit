import { Link } from 'react-router-dom';
import { Button, Pill } from '../components/atoms';
import { PageShell } from '../components/templates';

const conceptSteps = [
  {
    icon: 'volunteer_activism',
    bgClass: 'bg-secondaryContainer text-ink',
    cardClass: 'bg-surfaceContainer hover:bg-surfaceContainer/70',
    title: 'Créez votre profil',
    text: "Parlez-nous de vous, de vos habitudes et de ce que vous attendez d'une cohabitation intergénérationnelle.",
  },
  {
    icon: 'diversity_3',
    bgClass: 'bg-primaryContainer text-ink',
    cardClass: 'bg-primaryContainer/15 hover:bg-primaryContainer/25',
    title: 'Rencontrez votre binôme',
    text: 'Nous rapprochons les profils complémentaires pour tisser une harmonie durable entre hôte et colocataire.',
  },
  {
    icon: 'home_pin',
    bgClass: 'bg-accentSoft text-ink',
    cardClass: 'bg-accentSoft/25 hover:bg-accentSoft/40',
    title: 'Vivez ensemble',
    text: 'Installez-vous et laissez naître une aventure riche en échanges, en entraide et en liens authentiques.',
  },
];

const featuredListing = {
  tag: 'Toulouse, Capitole',
  badge: 'Coup de cœur',
  title: 'Grande chambre chez Mme Bertrand',
  description:
    "Un appartement calme et lumineux en plein cœur de Toulouse pour un étudiant sérieux en quête d'un cadre de vie chaleureux et paisible.",
  price: '250 €/mois',
  commitment: '4h/semaine de présence',
  image: '/annonces/salon1.jpg',
};

const sideListings = [
  {
    tag: 'Toulouse, Saint-Cyprien',
    tagClass: 'bg-secondary/90 text-white',
    title: 'Chambre chez M. Garnier',
    description: "Partagez des instants autour d'une passion commune : le jardinage.",
    image: '/annonces/chambre1.jpg',
  },
  {
    tag: 'Toulouse, Minimes',
    tagClass: 'bg-primaryContainer/90 text-ink',
    title: 'Chambre avec patio',
    description: 'Présence le soir pour partager les repas et la conversation.',
    image: '/annonces/patio1.jpg',
  },
];

const bottomListing = {
  tag: 'Toulouse, Rangueil',
  title: 'Chambre chez une ancienne enseignante',
  image: '/annonces/chambre2.jpg',
};

const Home = () => {
  return (
    <div >

      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.png"
            alt="Design toit à toit"
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(238,248,255,0.93) 0%, rgba(238,248,255,0.55) 55%, rgba(238,248,255,0.02) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-screen-xl flex-col justify-center px-8 md:px-20">
          <div className="max-w-2xl space-y-8">
            <h1 className="font-display text-6xl font-extrabold leading-[1.08] tracking-tight text-ink md:text-7xl">
              Plus qu'un toit,<br />
              <span className="text-primary">une rencontre.</span>
            </h1>
            <p className="max-w-lg font-body text-xl leading-relaxed text-muted">
              Vivez une expérience humaine unique où le partage et la solidarité tissent des liens durables entre générations.
            </p>

            {/* Search bar */}
            <div className="flex max-w-xl items-center rounded-full border border-white/30 bg-white/80 p-2 shadow-lift backdrop-blur-xl">
              <div className="flex flex-1 items-center px-5">
                <span className="material-symbols-outlined mr-3 text-primary">location_on</span>
                <input
                  type="text"
                  placeholder="Où souhaitez-vous habiter ?"
                  className="w-full border-none bg-transparent font-body text-ink placeholder:text-muted focus:outline-none focus:ring-0"
                />
              </div>
              <Button as={Link} to="/recherche" size="lg" variant="primary" className="flex items-center gap-2">
                <span>Rechercher</span>
                <span className="material-symbols-outlined text-base">search</span>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {["/profil/ph1.jpg", "/profil/pm2.jpg", "/profil/pm4.jpg"].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`utilisateur ${i + 1}`}
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <p className="font-body text-sm italic text-muted">
                Déjà <span className="font-bold not-italic text-primary">2 400+</span> duos formés en France
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Notre Concept ── */}
      <section className="py-28">
        <PageShell>
          <div className="mb-20 text-center">
            <Pill>Comment ça marche</Pill>
            <h2 className="mt-5 font-display text-4xl font-bold text-ink md:text-5xl">
              Une approche humaine de l'habitat
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {conceptSteps.map((step) => (
              <article
                key={step.title}
                className={`group rounded-2xl p-10 text-center transition-colors duration-500 ${step.cardClass}`}
              >
                <div
                  className={`mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-110 ${step.bgClass}`}
                >
                  <span className="material-symbols-outlined text-4xl">{step.icon}</span>
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold text-ink">{step.title}</h3>
                <p className="font-body leading-relaxed text-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </PageShell>
      </section>

      {/* ── Dernières annonces (Bento Grid) ── */}
      <section className="rounded-t-[4rem] bg-white py-28 shadow-soft">
        <div className="mx-auto max-w-screen-xl px-8">
          <div className="mb-14 flex items-end justify-between">
            <div className="space-y-3">
              <Pill>Opportunités</Pill>
              <h2 className="font-display text-4xl font-bold text-ink md:text-5xl">
                Dernières annonces
              </h2>
            </div>
            <Button
              as={Link}
              to="/recherche"
              variant="ghost"
              size="md"
              className="flex items-center gap-2 transition-all hover:gap-4"
            >
              Voir tout
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Button>
          </div>

          {/* Bento grid — 2 rows × 12 cols */}
          <div className="grid grid-cols-1 gap-6 md:h-[680px] md:grid-cols-12">

            {/* Large featured card — spans full height on the left */}
            <article className="group relative overflow-hidden rounded-2xl bg-surfaceContainer shadow-soft transition-all duration-500 hover:shadow-lift md:col-span-8 md:row-span-2 h-64 md:h-auto">
              <img
                src={featuredListing.image}
                alt={featuredListing.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-10 text-white">
                <div className="mb-4 flex gap-2">
                  <span className="rounded-full bg-primary/90 px-4 py-1 text-sm font-semibold text-white">
                    {featuredListing.tag}
                  </span>
                  <span className="rounded-full bg-white/20 px-4 py-1 font-serif text-sm italic backdrop-blur-sm">
                    {featuredListing.badge}
                  </span>
                </div>
                <h3 className="mb-3 font-display text-3xl font-bold md:text-4xl">
                  {featuredListing.title}
                </h3>
                <p className="mb-5 max-w-lg font-body text-white/80">{featuredListing.description}</p>
                <div className="flex flex-wrap items-center gap-6 font-body text-sm">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">euro</span>
                    <span className="font-bold">{featuredListing.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    <span className="text-white/80">{featuredListing.commitment}</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Two stacked side cards */}
            {sideListings.map((listing) => (
              <article
                key={listing.title}
                className="group relative h-52 overflow-hidden rounded-2xl bg-surfaceContainer shadow-soft transition-all duration-500 hover:shadow-lift md:col-span-4 md:h-auto"
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-7 text-white">
                  <span
                    className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${listing.tagClass}`}
                  >
                    {listing.tag}
                  </span>
                  <h4 className="mb-1 font-display text-xl font-bold">{listing.title}</h4>
                  <p className="font-body text-sm text-white/70">{listing.description}</p>
                </div>
              </article>
            ))}

            {/* Bottom wide card */}
            <article className="group relative h-52 overflow-hidden rounded-2xl bg-surfaceContainer shadow-soft transition-all duration-500 hover:shadow-lift md:col-span-8 md:h-auto">
              <img
                src={bottomListing.image}
                alt={bottomListing.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 flex w-full items-end justify-between p-9 text-white">
                <div>
                  <span className="mb-2 inline-block rounded-full bg-accentSoft/80 px-3 py-1 text-xs font-semibold text-ink">
                    {bottomListing.tag}
                  </span>
                  <h4 className="font-display text-2xl font-bold">{bottomListing.title}</h4>
                </div>
                <Button
                  as={Link}
                  to="/recherche"
                  size="sm"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-0 text-ink hover:bg-primary hover:text-white"
                >
                  <span className="material-symbols-outlined">add</span>
                </Button>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* ── Témoignage ── */}
      <section className="overflow-hidden py-28">
        <PageShell>
          <div className="relative mx-auto max-w-3xl text-center">
          
            <blockquote className="font-serif text-3xl italic leading-snug text-ink md:text-[2.6rem]">
              "Toit à Toit a changé ma vie d'étudiant. Au-delà du loyer abordable, j'ai trouvé une deuxième
              famille. Nos soirées jeux du mardi sont devenues mon moment préféré de la semaine."
            </blockquote>
            <div className="mt-12 flex flex-col items-center">
              <img
                src="/profil/ph2.jpg"
                alt="Lucas"
                className="mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-primaryContainer object-cover shadow-lift"
              />
              <p className="font-display text-lg font-bold text-ink">Lucas, 21 ans</p>
              <p className="font-serif text-sm italic text-primary">
                Étudiant en architecture &amp; colocataire solidaire
              </p>
            </div>
          </div>
        </PageShell>
      </section>

      {/* ── CTA final ── */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-screen-xl">
          <div className="relative overflow-hidden rounded-[3rem] bg-cta-gradient p-16 text-center shadow-lift md:p-20">
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondaryContainer/20 blur-[80px]" />
            <div className="relative z-10 mx-auto max-w-3xl space-y-8">
              <h2 className="font-display text-4xl font-extrabold leading-tight text-white md:text-5xl">
                Prêt à commencer une nouvelle histoire ?
              </h2>
              <p className="font-body text-xl text-white/90">
                Que vous ayez une chambre à proposer ou que vous en cherchiez une, l'aventure commence ici.
              </p>
              <div className="flex flex-col items-center justify-center gap-5 pt-3 md:flex-row">
                <Button
                  as={Link}
                  to="/signup"
                  variant="secondary"
                  size="lg"
                  className="px-14 py-5 text-lg font-bold shadow-lift"
                >
                  Rejoindre l'aventure
                </Button>
                <Button
                  as={Link}
                  to="/recherche"
                  size="lg"
                  className="border border-white/30 bg-white/10 px-14 py-5 text-lg font-bold text-white backdrop-blur-md hover:bg-white/20"
                >
                  Explorer les annonces
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-12 rounded-t-[2.5rem] bg-surfaceContainer shadow-[0_-4px_40px_0_rgba(38,48,53,0.05)]">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-8 px-14 py-10 md:flex-row">
          <div>
            <p className="font-display text-lg font-bold text-primary">Toit à Toit</p>
            <p className="mt-1 font-serif text-sm italic text-muted">
              © 2024 Toit à Toit. Pour un habitat plus humain.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-7">
            {[
              { label: 'Mentions légales', to: '/mentions-legales' },
              { label: 'Confidentialité', to: '/confidentialite' },
              { label: 'Contact', to: '/contact' },
              { label: 'Presse', to: '/presse' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="font-serif text-sm italic text-muted transition-colors hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex gap-3">
            {['share', 'public'].map((icon) => (
              <button
                key={icon}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary transition-all hover:bg-primary hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">{icon}</span>
              </button>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
