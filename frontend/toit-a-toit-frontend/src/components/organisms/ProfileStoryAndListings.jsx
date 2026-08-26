import { Link } from 'react-router-dom';
import { ListingCard } from '../molecules';

const applicationStatusLabels = {
  SENT: 'En attente',
  ACCEPTED: 'Acceptée',
  REJECTED: 'Refusée',
  WITHDRAWN: 'Retirée',
};

const roleTaglines = {
  OWNER: 'hôte solidaire',
  ASSOCIATION: 'association solidaire',
};

const ProfileStoryAndListings = ({ listings = [], applications = [], conversations = [], verificationText, user, role }) => {
  const isOwner = role === 'OWNER';
  const isAssociation = role === 'ASSOCIATION';

  return (
    <section className="lg:col-span-8 space-y-12">
      <div className="overflow-hidden rounded-[1.5rem] bg-surfaceContainerLowest p-10 shadow-[0_4px_40px_rgba(38,48,53,0.05)] relative">
        <div className="absolute right-0 top-0 p-8 opacity-10">
          <span className="material-symbols-outlined text-9xl">format_quote</span>
        </div>
        <h2 className="mb-6 font-headline text-2xl font-bold text-primary">Ma petite histoire</h2>
        <blockquote className="font-label text-2xl leading-relaxed italic text-on-surface-variant md:text-3xl">
          {user?.bio
            ? user.bio
            : 'Je crois fermement que le logement ne devrait pas seulement être un toit, mais un espace de solidarité. Partager son quotidien, c’est créer un cadre plus humain et plus utile.'}
        </blockquote>
        <p className="mt-4 font-body text-sm italic text-on-surface/60">
          — {user?.username || 'Votre profil'}, {roleTaglines[role] || 'chercheur(euse) de colocation'}
        </p>
      </div>

      {isOwner ? (
        <div className="space-y-8">
          <div className="flex items-end justify-between">
            <h2 className="font-headline text-2xl font-bold text-on-surface">Mes annonces actives</h2>
            <Link className="font-headline text-sm font-bold text-primary underline-offset-8 transition-all hover:underline" to="/mes-annonces">
              Tout voir
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  actions={(
                    <Link className="font-headline text-sm font-bold text-primary underline-offset-4 hover:underline" to={`/annonces/${listing.id}`}>
                      Voir l’annonce
                    </Link>
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] bg-surface p-10 text-center shadow-soft">
              <p className="font-headline text-xl font-bold text-on-surface">Aucune annonce active</p>
              <p className="mt-2 font-body text-sm text-on-surface-variant">Publiez une annonce pour l’afficher ici.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {!isAssociation ? (
            <div className="space-y-8">
              <div className="flex items-end justify-between">
                <h2 className="font-headline text-2xl font-bold text-on-surface">Mes candidatures</h2>
                <Link className="font-headline text-sm font-bold text-primary underline-offset-8 transition-all hover:underline" to="/mes-demandes">
                  Tout voir
                </Link>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <Link
                      key={app.id}
                      to={`/annonces/${app.listing_id}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-surface p-6 shadow-soft transition hover:shadow-lift"
                    >
                      <div>
                        <p className="font-headline font-bold text-on-surface">{app.title || 'Annonce'}</p>
                        {app.city ? <p className="font-body text-sm text-on-surface-variant">{app.city}</p> : null}
                      </div>
                      <span className="rounded-full bg-surfaceContainer px-3 py-1 font-body text-xs font-semibold text-on-surface-variant">
                        {applicationStatusLabels[app.status] || app.status}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.5rem] bg-surface p-10 text-center shadow-soft">
                  <p className="font-headline text-xl font-bold text-on-surface">Aucune candidature envoyée</p>
                  <p className="mt-2 font-body text-sm text-on-surface-variant">Postulez à une annonce pour la retrouver ici.</p>
                </div>
              )}
            </div>
          ) : null}

          <div className="space-y-8">
            <div className="flex items-end justify-between">
              <h2 className="font-headline text-2xl font-bold text-on-surface">Mes messages</h2>
              <Link className="font-headline text-sm font-bold text-primary underline-offset-8 transition-all hover:underline" to="/messages">
                Tout voir
              </Link>
            </div>

            {conversations.length > 0 ? (
              <div className="space-y-4">
                {conversations.map((conv) => (
                  <Link
                    key={conv.id}
                    to={`/messages/${conv.id}`}
                    className="block rounded-[1.5rem] bg-surface p-6 shadow-soft transition hover:shadow-lift"
                  >
                    <p className="font-headline font-bold text-on-surface">Échange #{conv.id.slice(0, 8)}</p>
                    {conv.last_message_body ? (
                      <p className="mt-1 truncate font-body text-sm text-on-surface-variant">{conv.last_message_body}</p>
                    ) : null}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-surface p-10 text-center shadow-soft">
                <p className="font-headline text-xl font-bold text-on-surface">Aucun message</p>
                <p className="mt-2 font-body text-sm text-on-surface-variant">Vos échanges avec les hôtes apparaîtront ici.</p>
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex items-center gap-6 rounded-[1.5rem] bg-tertiaryContainer/20 p-8">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-tertiaryContainer">
          <span className="material-symbols-outlined text-3xl text-tertiary">verified_user</span>
        </div>
        <div className="flex-1">
          <h4 className="font-headline font-bold text-on-tertiary-container">Vérification de confiance</h4>
          <p className="font-body text-sm text-on-tertiary-fixed-variant">
            {verificationText || 'Le profil a été vérifié par notre équipe via plusieurs éléments de confiance.'}
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-tertiary/20 bg-surfaceContainerLowest px-6 py-2 text-xs font-headline font-bold uppercase tracking-widest text-tertiary transition-all hover:bg-tertiary hover:text-white"
        >
          Consulter
        </button>
      </div>
    </section>
  );
};

export default ProfileStoryAndListings;
