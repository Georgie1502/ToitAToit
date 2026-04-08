import { Link } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';

const NotFound = () => {
  return (
    <PageShell>
      <div className="mx-auto max-w-lg rounded-3xl bg-surface p-12 text-center shadow-soft">
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">404</p>
        <h2 className="mt-3 font-display text-4xl text-ink">Page introuvable</h2>
        <p className="mt-3 font-body text-base text-muted">Cette page n'existe pas ou a été déplacée.</p>
        <Button as={Link} to="/" variant="primary" size="md" className="mt-8">
          Retour à l'accueil
        </Button>
      </div>
    </PageShell>
  );
};

export default NotFound;
