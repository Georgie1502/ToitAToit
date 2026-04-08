import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { listApplicationsForListing, updateApplicationStatus } from '../services/applications';
import { getListingById } from '../services/colocations';

const statusConfig = {
  SENT: { label: 'En attente', className: 'bg-secondaryContainer/50 text-ink' },
  ACCEPTED: { label: 'Acceptée', className: 'bg-accentSoft text-ink' },
  REJECTED: { label: 'Refusée', className: 'bg-danger/10 text-danger' },
  WITHDRAWN: { label: 'Retirée', className: 'bg-surfaceContainer text-muted' },
};

const ApplicationRow = ({ application, onAction, actionLoading }) => {
  const status = statusConfig[application.status] || { label: application.status, className: 'bg-surfaceContainer text-muted' };
  return (
    <li className="rounded-3xl bg-surface p-6 shadow-soft transition duration-200 hover:shadow-lift">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-body text-sm font-semibold text-ink">
              Candidat · {application.applicant_user_id.slice(0, 8)}…
            </p>
            <span className={`rounded-full px-3 py-0.5 font-body text-xs font-semibold ${status.className}`}>
              {status.label}
            </span>
          </div>
          {application.message ? (
            <p className="font-serif text-sm italic text-muted">"{application.message}"</p>
          ) : (
            <p className="font-body text-sm italic text-muted">Aucun message</p>
          )}
          <p className="font-body text-xs text-muted">
            Reçue le {new Date(application.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {application.status === 'SENT' ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="primary" onClick={() => onAction(application.id, 'ACCEPTED')} disabled={actionLoading !== null}>
              {actionLoading === application.id + 'ACCEPTED' ? 'En cours...' : 'Accepter'}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => onAction(application.id, 'REJECTED')} disabled={actionLoading !== null}>
              {actionLoading === application.id + 'REJECTED' ? 'En cours...' : 'Refuser'}
            </Button>
          </div>
        ) : null}
      </div>
    </li>
  );
};

const DemandesAnnonce = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [listingData, appsData] = await Promise.all([getListingById(id), listApplicationsForListing(id)]);
        if (isMounted) { setListing(listingData?.listing || null); setApplications(appsData); }
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Impossible de charger les candidatures.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [id]);

  const handleAction = async (applicationId, status) => {
    setActionLoading(applicationId + status);
    setError('');
    try {
      const updated = await updateApplicationStatus(applicationId, status);
      setApplications((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status: updated.status } : a)));
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de mettre à jour cette candidature.');
    } finally {
      setActionLoading(null);
    }
  };

  const sent = applications.filter((a) => a.status === 'SENT');
  const others = applications.filter((a) => a.status !== 'SENT');

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button as={Link} to="/mes-annonces" size="sm" variant="ghost">← Mes annonces</Button>
          {listing ? <Button as={Link} to={`/annonces/${id}`} size="sm" variant="ghost">Voir l'annonce</Button> : null}
        </div>

        <div className="space-y-2">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Candidatures reçues</p>
          <h2 className="font-display text-4xl text-ink">{listing?.title || '…'}</h2>
          {!loading ? (
            <p className="font-body text-sm text-muted">
              <span className="font-semibold text-ink">{sent.length}</span> en attente · {applications.length} au total
            </p>
          ) : null}
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
            <p className="font-display text-xl text-ink">Aucune candidature pour l'instant</p>
            <p className="mt-2 font-body text-sm text-muted">Les chercheurs pourront postuler depuis la page de l'annonce.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sent.length > 0 ? (
              <section className="space-y-4">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">En attente ({sent.length})</p>
                <ul className="space-y-4">
                  {sent.map((app) => <ApplicationRow key={app.id} application={app} onAction={handleAction} actionLoading={actionLoading} />)}
                </ul>
              </section>
            ) : null}
            {others.length > 0 ? (
              <section className="space-y-4">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted">Traitées ({others.length})</p>
                <ul className="space-y-4">
                  {others.map((app) => <ApplicationRow key={app.id} application={app} onAction={handleAction} actionLoading={actionLoading} />)}
                </ul>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default DemandesAnnonce;
