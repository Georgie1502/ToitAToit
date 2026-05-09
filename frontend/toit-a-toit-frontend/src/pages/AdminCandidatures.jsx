import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { listApplicationsForListing, rejectApplication, selectCandidate } from '../services/admin';

const statusConfig = {
  SENT: { label: 'En attente', className: 'bg-secondaryContainer/50 text-ink' },
  ACCEPTED: { label: 'Sélectionné', className: 'bg-accentSoft text-ink' },
  REJECTED: { label: 'Refusé', className: 'bg-danger/10 text-danger' },
  WITHDRAWN: { label: 'Retiré', className: 'bg-surfaceContainer text-muted' },
};

const AdminCandidatures = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await listApplicationsForListing(id);
        if (isMounted) setApplications(data);
      } catch {
        if (isMounted) setError('Impossible de charger les candidatures.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [id]);

  const handleAction = async (applicationId, action) => {
    setUpdating(applicationId);
    try {
      const updated = action === 'select'
        ? await selectCandidate(applicationId)
        : await rejectApplication(applicationId);
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: updated.status } : a)),
      );
    } catch {
      setError('Impossible de mettre à jour cette candidature.');
    } finally {
      setUpdating(null);
    }
  };

  const pending = applications.filter((a) => a.status === 'SENT');
  const processed = applications.filter((a) => a.status !== 'SENT');

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Administration</p>
            <h2 className="font-display text-4xl text-ink">Candidatures.</h2>
            <p className="font-body text-base text-muted">
              {applications.length} candidature{applications.length !== 1 ? 's' : ''} reçue{applications.length !== 1 ? 's' : ''}.
            </p>
          </div>
          <Button as={Link} to="/admin" size="sm" variant="ghost">
            Retour
          </Button>
        </div>

        {error ? (
          <div role="alert" aria-live="assertive" className="rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-3xl bg-surface shadow-soft" />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-3xl bg-surface p-12 text-center shadow-soft">
            <p className="font-display text-xl text-ink">Aucune candidature</p>
            <p className="mt-2 font-body text-sm text-muted">Aucun bénéficiaire n'a encore candidaté à cette annonce.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pending.length > 0 ? (
              <section className="space-y-4">
                <h3 className="font-body text-sm font-semibold uppercase tracking-widest text-muted">
                  En attente ({pending.length})
                </h3>
                <ul className="space-y-4">
                  {pending.map((app) => (
                    <li key={app.id} className="rounded-3xl bg-surface p-6 shadow-soft">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-2">
                          <p className="font-body text-xs text-muted">
                            Candidature reçue le {new Date(app.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          {app.message ? (
                            <p className="font-serif text-sm italic text-ink">"{app.message}"</p>
                          ) : (
                            <p className="font-body text-sm text-muted">Aucun message.</p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(app.id, 'reject')}
                            disabled={updating === app.id}
                          >
                            Refuser
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            onClick={() => handleAction(app.id, 'select')}
                            disabled={updating === app.id}
                          >
                            {updating === app.id ? '...' : 'Sélectionner'}
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {processed.length > 0 ? (
              <section className="space-y-4">
                <h3 className="font-body text-sm font-semibold uppercase tracking-widest text-muted">
                  Traitées ({processed.length})
                </h3>
                <ul className="space-y-3">
                  {processed.map((app) => {
                    const status = statusConfig[app.status] || { label: app.status, className: 'bg-surfaceContainer text-muted' };
                    return (
                      <li key={app.id} className="flex items-center justify-between rounded-3xl bg-surface px-6 py-4 shadow-soft">
                        <p className="font-body text-sm text-muted">
                          {new Date(app.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {app.message ? ` — "${app.message.slice(0, 60)}${app.message.length > 60 ? '…' : ''}"` : ''}
                        </p>
                        <span className={`rounded-full px-3 py-0.5 font-body text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default AdminCandidatures;
