import { useEffect, useState } from 'react';
import { ProfileBadgesCard, ProfileHeroCard, ProfileStoryAndListings } from '../components/organisms';
import { PageShell } from '../components/templates';
import { getCurrentUser } from '../services/auth';
import { listMyListings } from '../services/colocations';
import { getMyProfile } from '../services/profile';
import { listMyApplications } from '../services/applications';
import { listConversations } from '../services/messages';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userListings, setUserListings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const cachedUser = getCurrentUser();

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const profileResponse = await getMyProfile();
        if (!isMounted) return;
        setProfileData(profileResponse);

        const role = profileResponse?.profile?.role;
        if (role === 'OWNER') {
          const listingsResponse = await listMyListings();
          if (isMounted) setUserListings(listingsResponse.slice(0, 2));
        } else if (role === 'ASSOCIATION') {
          const conversationsResponse = await listConversations();
          if (isMounted) setConversations(conversationsResponse.slice(0, 2));
        } else {
          const [applicationsResponse, conversationsResponse] = await Promise.all([
            listMyApplications(),
            listConversations(),
          ]);
          if (isMounted) {
            setApplications(applicationsResponse.slice(0, 2));
            setConversations(conversationsResponse.slice(0, 2));
          }
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

            </aside>

            <ProfileStoryAndListings
              listings={userListings}
              applications={applications}
              conversations={conversations}
              verificationText={verificationText}
              user={{ ...user, bio: profileData?.profile?.bio }}
              role={role}
            />
          </div>
        ) : null}
      </div>
    </PageShell>
  );
};

export default Profile;
