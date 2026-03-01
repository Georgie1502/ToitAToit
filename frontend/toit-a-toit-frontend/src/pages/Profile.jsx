import { useEffect, useState } from 'react';
import { PageShell } from '../components/templates';
import { getCurrentUser } from '../services/auth';
import { OwnerProfileOverview } from '../components/organisms';
import { getMyProfile } from '../services/profile';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const cachedUser = getCurrentUser();

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        if (isMounted) {
          setProfileData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Impossible de charger le profil.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const user = profileData?.user || cachedUser;
  const role = profileData?.profile?.role || null;
  const isOwner = role === 'OWNER';

  return (
    <PageShell>
      <div className="space-y-6">
        {error ? (
          <div
            role="alert"
            aria-live="assertive"
            className="mx-auto max-w-3xl rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            {error}
          </div>
        ) : null}
        {loading ? (
          <p className="mx-auto max-w-3xl text-sm text-muted">Chargement...</p>
        ) : null}
        {!loading && isOwner ? (
          <OwnerProfileOverview
            user={user}
            profile={profileData?.profile}
            preferences={profileData?.preferences}
          />
        ) : null}
        {!loading && !isOwner ? (
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="rounded-[28px] bg-surface p-8 shadow-lift ring-1 ring-border">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Profil</p>
              <h2 className="mt-2 font-display text-3xl text-ink">Votre profil</h2>
              <p className="mt-3 text-sm text-muted">
                {user ? 'Informations clés de votre compte.' : 'Reconnectez-vous pour accéder à vos informations.'}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-surface p-5 shadow-soft ring-1 ring-border">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Identifiant</p>
                <p className="mt-2 text-sm text-ink">{user?.id || 'Non renseigné'}</p>
              </div>
              <div className="rounded-2xl bg-surface p-5 shadow-soft ring-1 ring-border">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Pseudo</p>
                <p className="mt-2 text-sm text-ink">{user?.username || 'Non renseigné'}</p>
              </div>
              <div className="rounded-2xl bg-surface p-5 shadow-soft ring-1 ring-border">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Email</p>
                <p className="mt-2 text-sm text-ink">{user?.email || 'Non renseigné'}</p>
              </div>
              <div className="rounded-2xl bg-primary/8 p-5 shadow-soft ring-1 ring-border/80 md:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Rôle</p>
                <p className="mt-2 text-sm text-ink">{role || 'À définir'}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
};

export default Profile;
