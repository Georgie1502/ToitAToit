import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { listMyApplications, updateApplicationStatus } from '../services/applications';

const statusConfig = {
  SENT: { label: 'En attente', className: 'bg-secondaryContainer/50 text-ink' },
  ACCEPTED: { label: 'Acceptée', className: 'bg-accentSoft text-ink' },
  REJECTED: { label: 'Refusée', className: 'bg-danger/10 text-danger' },
  WITHDRAWN: { label: 'Retirée', className: 'bg-surfaceContainer text-muted' },
};

const MesDemandes = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await listMyApplications();
        if (isMounted) setApplications(data);
      } catch {
        if (isMounted) setError('Impossible de charger vos demandes.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Retirer cette candidature ?')) return;
    setWithdrawing(applicationId);
    try {
      const updated = await updateApplicationStatus(applicationId, 'WITHDRAWN');
      setApplications((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status: updated.status } : a)));
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de retirer cette candidature.');
    } finally {
      setWithdrawing(null);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Mes demandes</p>
          <h2 className="font-display text-4xl text-ink">Vos candidatures.</h2>
          <p className="font-body text-base text-muted">Candidatures que vous avez envoyées aux propriétaires.</p>
        </div>

        {error ? (
          <div role="alert" aria-live="assertive" className="rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">{error}</div>
        ) : null}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-3xl bg-surface shadow-soft" />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-3xl bg-surface p-12 text-center shadow-soft">
            <p className="font-display text-xl text-ink">Aucune candidature envoyée</p>
            <p className="mt-2 font-body text-sm text-muted">Parcourez les annonces pour trouver votre future colocation.</p>
            <div className="mt-6">
              <Button as={Link} to="/recherche" size="md" variant="primary">Rechercher une colocation</Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-4">
            {applications.map((app) => {
              const status = statusConfig[app.status] || { label: app.status, className: 'bg-surfaceContainer text-muted' };
              return (
                <li key={app.id} className="rounded-3xl bg-surface p-6 shadow-soft transition duration-200 hover:shadow-lift">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg text-ink">{app.title || 'Annonce'}</h3>
                        <span className={`rounded-full px-3 py-0.5 font-body text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      {app.city ? (
                        <p className="font-body text-sm text-muted">
                          {app.city}{app.postal_code ? ` (${app.postal_code})` : ''}
                          {app.rent_amount ? ` — ${app.rent_amount} EUR/mois` : ''}
                        </p>
                      ) : null}
                      {app.message ? (
                        <p className="font-serif text-sm italic text-muted">"{app.message}"</p>
                      ) : null}
                      <p className="font-body text-xs text-muted">
                        Envoyée le {new Date(app.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button as={Link} to={`/annonces/${app.listing_id}`} size="sm" variant="ghost">
                        Voir l'annonce
                      </Button>
                      {app.status === 'SENT' ? (
                        <Button type="button" size="sm" variant="ghost" onClick={() => handleWithdraw(app.id)} disabled={withdrawing === app.id}>
                          {withdrawing === app.id ? 'Retrait...' : 'Retirer'}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageShell>
  );
};

export default MesDemandes;
