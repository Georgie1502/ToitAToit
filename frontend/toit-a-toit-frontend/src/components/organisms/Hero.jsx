import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import Pill from '../atoms/Pill';
import StatCard from '../molecules/StatCard';

const Hero = () => {
  return (
    <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <Pill>Toit à toit</Pill>
        <h1 className="mt-6 font-display text-4xl leading-tight text-ink md:text-5xl">
          Confiance, sécurité, et colocations humaines.
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted md:text-lg">
          Une plateforme semi-premium pour matcher des profils compatibles, visiter sereinement et
          construire des foyers stables.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to="/signup" size="lg" variant="primary">
            Démarrer
          </Button>
          <Button as={Link} to="/login" size="lg" variant="secondary">
            Se connecter
          </Button>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard label="Matchs utiles" value="95%" note="pertinence moyenne" tone="primary" />
          <StatCard label="Réponses rapides" value="12h" note="temps moyen" tone="accent" />
          <StatCard label="Villes actives" value="28" note="communauté engagée" tone="secondary" />
        </div>
      </div>
      <div className="relative">
        <div className="rounded-[32px] bg-hero-gradient p-6 shadow-lift ring-1 ring-border/70">
          <div className="relative overflow-hidden rounded-3xl bg-card">
            <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-primary/15" />
            <div className="absolute right-8 top-8 h-12 w-12 rounded-full bg-secondary/20" />
            <div className="absolute bottom-8 left-10 h-14 w-14 rounded-full bg-accent/15" />
            <div className="absolute bottom-6 right-12 h-10 w-10 rounded-full bg-primary/10" />
            <div className="flex min-h-[280px] items-end justify-center px-6 pb-6 text-center">
              <div className="rounded-2xl bg-surface px-6 py-5 text-sm text-muted shadow-soft">
                Ajoute ton illustration dans public/hero-people.png
              </div>
            </div>
          </div>
          <img
            src="/hero-people.png"
            alt="Communauté Toit à toit"
            className="pointer-events-none absolute -bottom-2 left-1/2 w-[85%] -translate-x-1/2 drop-shadow-xl"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
