import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import Pill from '../atoms/Pill';
import StatCard from '../molecules/StatCard';

const Hero = () => {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <Pill>Toit à toit</Pill>
        <h1 className="mt-6 font-display text-4xl text-ink md:text-5xl">
          Trouve ton toit, crée du lien.
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink/70 md:text-lg">
          Une plateforme douce et dynamique pour connecter les colocataires, partager les envies et
          construire une vie commune sereine.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to="/signup" size="lg" variant="primary">
            Démarrer
          </Button>
          <Button as={Link} to="/login" size="lg" variant="ghost">
            Se connecter
          </Button>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard label="Matchs utiles" value="95%" note="pertinence moyenne" tone="blue" />
          <StatCard label="Réponses rapides" value="12h" note="temps moyen" tone="rose" />
          <StatCard label="Villes actives" value="28" note="communauté engagée" tone="teal" />
        </div>
      </div>
      <div className="relative">
        <div className="rounded-[32px] bg-hero-gradient p-6 shadow-lift ring-1 ring-ink/5">
          <div className="relative overflow-hidden rounded-3xl bg-sky/60">
            <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-sun/90" />
            <div className="absolute right-8 top-8 h-12 w-12 rounded-full bg-rose/60" />
            <div className="absolute bottom-8 left-10 h-14 w-14 rounded-full bg-teal/70" />
            <div className="absolute bottom-6 right-12 h-10 w-10 rounded-full bg-violet/60" />
            <div className="flex min-h-[280px] items-end justify-center px-6 pb-6 text-center">
              <div className="rounded-3xl bg-white/90 px-6 py-5 text-sm text-ink/70 shadow-soft">
                Ajoute ton illustration dans public/hero-people.png
              </div>
            </div>
          </div>
          <img
            src="/hero-people.png"
            alt="Communauté Toit à toit"
            className="pointer-events-none absolute -bottom-2 left-1/2 w-[85%] -translate-x-1/2"
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
