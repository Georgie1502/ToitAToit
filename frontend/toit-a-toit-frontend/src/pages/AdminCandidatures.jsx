import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { rejectApplication, selectCandidate } from '../services/admin';
import { listApplicationsForListing } from '../services/applications';
import { getApplicantProfile } from '../services/users';

const statusConfig = {
  SENT: { label: 'En attente', className: 'bg-secondaryContainer/50 text-ink' },
  ACCEPTED: { label: 'Sélectionné', className: 'bg-accentSoft text-ink' },
  REJECTED: { label: 'Refusé', className: 'bg-danger/10 text-danger' },
  WITHDRAWN: { label: 'Retiré', className: 'bg-surfaceContainer text-muted' },
};

const occupationLabels = { STUDENT: 'Étudiant·e', PRO: 'En activité', OTHER: 'Autre' };
const genderLabels = { F: 'Femme', M: 'Homme', NON_BINARY: 'Non-binaire', OTHER: 'Autre' };

const formatDate = (value) =>
  new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const ProfileModal = ({ userId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    getApplicantProfile(userId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') closeRef.current(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Profil du candidat"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-background shadow-[0_32px_64px_rgba(38,48,53,0.18)]">
        <div className="flex items-center justify-between border-b border-ink/5 px-6 py-5">
          <h3 className="font-display text-xl text-ink">Profil du candidat</h3>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted transition hover:bg-surfaceContainer hover:text-ink"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-10 animate-pulse rounded-2xl bg-surfaceContainer" />)}
            </div>
          ) : !data ? (
            <p className="font-body text-sm text-muted">Impossible de charger le profil.</p>
          ) : (
            <>
              <section className="space-y-3">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Identité</p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 font-body text-sm">
                  <dt className="text-muted">Nom</dt>
                  <dd className="font-semibold text-ink">{data.user.username}</dd>
                  <dt className="text-muted">Email</dt>
                  <dd className="text-ink break-all">{data.user.email}</dd>
                  {data.profile?.phone ? (
                    <>
                      <dt className="text-muted">Téléphone</dt>
                      <dd className="text-ink">
                        <a href={`tel:${data.profile.phone}`} className="font-semibold text-primary hover:underline">
                          {data.profile.phone}
                        </a>
                      </dd>
                    </>
                  ) : null}
                  {data.profile?.birth_date ? (
                    <>
                      <dt className="text-muted">Date de naissance</dt>
                      <dd className="text-ink">{formatDate(data.profile.birth_date)}</dd>
                    </>
                  ) : null}
                  {data.profile?.gender ? (
                    <>
                      <dt className="text-muted">Genre</dt>
                      <dd className="text-ink">{genderLabels[data.profile.gender] || data.profile.gender}</dd>
                    </>
                  ) : null}
                  {data.profile?.occupation_status ? (
                    <>
                      <dt className="text-muted">Statut</dt>
                      <dd className="text-ink">{occupationLabels[data.profile.occupation_status] || data.profile.occupation_status}</dd>
                    </>
                  ) : null}
                </dl>
                {data.profile?.bio ? (
                  <p className="rounded-2xl bg-surfaceContainer px-4 py-3 font-body text-sm italic text-ink">
                    "{data.profile.bio}"
                  </p>
                ) : null}
              </section>

              {data.preferences && Object.values(data.preferences).some(Boolean) ? (
                <section className="space-y-3">
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Préférences</p>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-2 font-body text-sm">
                    {data.preferences.budget_min || data.preferences.budget_max ? (
                      <>
                        <dt className="text-muted">Budget</dt>
                        <dd className="text-ink">
                          {data.preferences.budget_min ? `${data.preferences.budget_min} €` : '—'}
                          {' → '}
                          {data.preferences.budget_max ? `${data.preferences.budget_max} €` : '—'}
                        </dd>
                      </>
                    ) : null}
                    {data.preferences.location ? (
                      <>
                        <dt className="text-muted">Localisation</dt>
                        <dd className="text-ink">{data.preferences.location}</dd>
                      </>
                    ) : null}
                    {data.preferences.smoking ? (
                      <>
                        <dt className="text-muted">Tabac</dt>
                        <dd className="text-ink">{{ NO: 'Non-fumeur·se', YES: 'Fumeur·se', OUTSIDE_ONLY: 'Extérieur seulement' }[data.preferences.smoking] || data.preferences.smoking}</dd>
                      </>
                    ) : null}
                    {data.preferences.pets ? (
                      <>
                        <dt className="text-muted">Animaux</dt>
                        <dd className="text-ink">{{ NO: 'Pas d\'animaux', YES: 'En a', OK_WITH_PETS: 'Ok avec animaux' }[data.preferences.pets] || data.preferences.pets}</dd>
                      </>
                    ) : null}
                    {data.preferences.noise_level ? (
                      <>
                        <dt className="text-muted">Ambiance</dt>
                        <dd className="text-ink">{{ CALM: 'Calme', NORMAL: 'Normal', FESTIVE: 'Festif' }[data.preferences.noise_level] || data.preferences.noise_level}</dd>
                      </>
                    ) : null}
                    {data.preferences.guests_policy ? (
                      <>
                        <dt className="text-muted">Invités</dt>
                        <dd className="text-ink">{{ NO: 'Pas d\'invités', OCCASIONAL: 'Occasionnels', OK: 'Bienvenus' }[data.preferences.guests_policy] || data.preferences.guests_policy}</dd>
                      </>
                    ) : null}
                  </dl>
                </section>
              ) : null}

              <div className="pt-2 text-center">
                <p className="font-body text-xs text-muted">Membre depuis {formatDate(data.user.created_at)}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminCandidatures = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);
  const [profileUserId, setProfileUserId] = useState(null);

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

  const handleAction = async (applicationId, apiFn) => {
    setUpdating(applicationId);
    setError('');
    try {
      const updated = await apiFn(applicationId);
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

  const count = applications.length;
  const countLabel = loading ? null : `${count} candidature${count !== 1 ? 's' : ''} reçue${count !== 1 ? 's' : ''}.`;

  return (
    <PageShell>
      {profileUserId ? (
        <ProfileModal userId={profileUserId} onClose={() => setProfileUserId(null)} />
      ) : null}

      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Administration</p>
            <h2 className="font-display text-4xl text-ink">Candidatures.</h2>
            {countLabel ? <p className="font-body text-base text-muted">{countLabel}</p> : null}
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
                            Reçue le {formatDate(app.created_at)}
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
                            onClick={() => setProfileUserId(app.applicant_user_id)}
                          >
                            Voir le profil
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(app.id, rejectApplication)}
                            disabled={updating === app.id}
                          >
                            Refuser
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            onClick={() => handleAction(app.id, selectCandidate)}
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
                        <div className="space-y-0.5">
                          <p className="font-body text-sm text-muted">
                            {formatDate(app.created_at)}
                            {app.message ? ` — "${app.message.slice(0, 60)}${app.message.length > 60 ? '…' : ''}"` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setProfileUserId(app.applicant_user_id)}
                            className="font-body text-xs text-muted underline-offset-2 hover:text-ink hover:underline"
                          >
                            Profil
                          </button>
                          <span className={`rounded-full px-3 py-0.5 font-body text-xs font-semibold ${status.className}`}>
                            {status.label}
                          </span>
                        </div>
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
