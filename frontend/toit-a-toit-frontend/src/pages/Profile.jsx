import { useEffect, useState } from 'react';
import PageShell from '../components/templates/PageShell';
import { getCurrentUser } from '../services/auth';
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

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl rounded-[32px] bg-white/90 p-8 shadow-lift ring-1 ring-ink/5">
        <h2 className="font-display text-3xl text-ink">Votre profil</h2>
        <p className="mt-3 text-sm text-ink/70">
          {user ? 'Voici les informations disponibles dans votre compte.' : 'Reconnectez-vous pour acceder a vos informations.'}
        </p>
        {error ? (
          <div role="alert" aria-live="assertive" className="mt-6 rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
            {error}
          </div>
        ) : null}
        {loading ? (
          <p className="mt-6 text-sm text-ink/60">Chargement...</p>
        ) : null}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-ink/10 bg-sky/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Identifiant</p>
            <p className="mt-2 text-sm text-ink">{user?.id || 'Non renseigne'}</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-sky/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Pseudo</p>
            <p className="mt-2 text-sm text-ink">{user?.username || 'Non renseigne'}</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-sky/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Email</p>
            <p className="mt-2 text-sm text-ink">{user?.email || 'Non renseigne'}</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-amber/20 p-4 md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Role</p>
            <p className="mt-2 text-sm text-ink">{role || 'A definir'}</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Profile;
