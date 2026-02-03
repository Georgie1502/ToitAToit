import { useMemo } from 'react';
import PageShell from '../components/templates/PageShell';
import { getCurrentUser } from '../services/auth';

const Profile = () => {
  const user = useMemo(() => getCurrentUser(), []);

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl rounded-[32px] bg-white/90 p-8 shadow-lift ring-1 ring-ink/5">
        <h2 className="font-display text-3xl text-ink">Votre profil</h2>
        <p className="mt-3 text-sm text-ink/70">
          {user ? 'Voici les informations disponibles dans votre session.' : 'Reconnectez-vous pour acceder a vos informations.'}
        </p>
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
        </div>
      </div>
    </PageShell>
  );
};

export default Profile;
