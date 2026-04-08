import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/atoms';
import { ProfileBadgesCard, ProfileHeroCard, ProfileStoryAndListings } from '../components/organisms';
import { PageShell } from '../components/templates';
import { getCurrentUser } from '../services/auth';
import { listListings } from '../services/colocations';
import { getMyProfile } from '../services/profile';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const cachedUser = getCurrentUser();

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [profileResponse, listingsResponse] = await Promise.all([
          getMyProfile(),
          listListings({ status: 'PUBLISHED', limit: 200 }),
        ]);

        if (isMounted) {
          setProfileData(profileResponse);
          setListings(listingsResponse);
        }
      } catch {
        if (isMounted) setError('Impossible de charger le profil.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const user = profileData?.user || cachedUser;
  const role = profileData?.profile?.role || null;
  const isOwner = role === 'OWNER';
  const userListings = useMemo(() => {
    if (!user) return [];
    return listings.filter((listing) => listing.owner_user_id === user.id).slice(0, 2);
  }, [listings, user]);
  const locationLabel = profileData?.preferences?.location || user?.city || 'Lyon, France';
  const verificationText = isOwner
    ? 'Le profil a été vérifié par notre équipe via plusieurs éléments de confiance.'
    : 'Votre profil est en cours de constitution. Ajoutez vos informations pour renforcer la confiance.';

  return (
    <PageShell>
      <div className="space-y-6">
        {error ? (
          <div role="alert" aria-live="assertive" className="mx-auto max-w-3xl rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
            {error}
          </div>
        ) : null}

        {loading ? <p className="mx-auto max-w-3xl font-body text-sm text-muted">Chargement...</p> : null}

        {!loading ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            <aside className="lg:col-span-4 space-y-8">
              <ProfileHeroCard
                user={user}
                locationLabel={locationLabel}
                onEdit={() => window.location.assign('/onboarding-role')}
                onShare={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                  } catch {
                    window.alert('Impossible de copier le lien pour le moment.');
                  }
                }}
              />
              <ProfileBadgesCard />

              <div className="rounded-[1.5rem] bg-surfaceContainerLowest p-8 shadow-[0_4px_40px_rgba(38,48,53,0.05)]">
                <p className="font-headline text-xs font-semibold uppercase tracking-[0.28em] text-primary">Compte</p>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-3xl bg-surfaceContainer px-5 py-3">
                    <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted">Identifiant</p>
                    <p className="mt-1 font-body text-sm font-semibold text-ink">{user?.id || 'Non renseigné'}</p>
                  </div>
                  <div className="rounded-3xl bg-surfaceContainer px-5 py-3">
                    <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted">Email</p>
                    <p className="mt-1 font-body text-sm font-semibold text-ink">{user?.email || 'Non renseigné'}</p>
                  </div>
                  <div className="rounded-3xl bg-surfaceContainer px-5 py-3">
                    <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted">Rôle</p>
                    <p className="mt-1 font-body text-sm font-semibold text-ink">{role || 'À définir — complétez votre onboarding'}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button as={Link} to="/onboarding-role" variant="secondary" size="sm" className="flex-1">
                    Compléter
                  </Button>
                  <Button as={Link} to="/mes-annonces" variant="ghost" size="sm" className="flex-1">
                    Mes annonces
                  </Button>
                </div>
              </div>
            </aside>

            <ProfileStoryAndListings
              listings={userListings}
              verificationText={verificationText}
              user={{ ...user, bio: profileData?.profile?.bio }}
            />
          </div>
        ) : null}
      </div>
    </PageShell>
  );
};

export default Profile;
