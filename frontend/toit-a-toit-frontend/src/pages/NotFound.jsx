import { Link } from 'react-router-dom';
import Button from '../components/atoms/Button';
import PageShell from '../components/templates/PageShell';

const NotFound = () => {
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl rounded-[32px] bg-white/90 p-8 text-center shadow-soft ring-1 ring-ink/5">
        <h2 className="font-display text-3xl text-ink">Page introuvable</h2>
        <p className="mt-3 text-sm text-ink/70">Cette page n'existe pas ou a été déplacée.</p>
        <Button as={Link} to="/" variant="ghost" className="mt-6">
          Retour à l'accueil
        </Button>
      </div>
    </PageShell>
  );
};

export default NotFound;
