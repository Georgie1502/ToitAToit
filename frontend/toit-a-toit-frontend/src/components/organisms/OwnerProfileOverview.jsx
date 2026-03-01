import InfoTile from '../molecules/InfoTile';

const genderMap = {
  F: 'Femme',
  M: 'Homme',
  NON_BINARY: 'Non binaire',
  OTHER: 'Autre',
};

const occupationMap = {
  STUDENT: 'Etudiant',
  PRO: 'Actif',
  OTHER: 'Autre',
};

const smokingMap = {
  NO: 'Non fumeur',
  YES: 'Fumeur',
  OUTSIDE_ONLY: 'Fumeur exterieur',
};

const petsMap = {
  NO: 'Pas d\'animaux',
  YES: 'Animaux acceptes',
  OK_WITH_PETS: 'Ok avec animaux',
};

const noiseMap = {
  CALM: 'Calme',
  NORMAL: 'Normal',
  FESTIVE: 'Festif',
};

const guestsMap = {
  NO: 'Pas d\'invites',
  OCCASIONAL: 'Invites occasionnels',
  OK: 'Invites bienvenus',
};

const statusMap = {
  ACTIVE: 'Actif',
  SUSPENDED: 'Suspendu',
  DELETED: 'Supprime',
};

const formatEnum = (value, map) => {
  if (!value) {
    return 'Non renseigne';
  }
  return map?.[value] || value;
};

const formatDate = (value) => {
  if (!value) {
    return 'Non renseigne';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Non renseigne';
  }
  return parsed.toLocaleDateString('fr-FR');
};

const formatBudget = (min, max) => {
  if (min != null && max != null) {
    return `${min} - ${max} €`;
  }
  if (min != null) {
    return `A partir de ${min} €`;
  }
  if (max != null) {
    return `Jusqu'a ${max} €`;
  }
  return 'Non renseigne';
};

const getCompletion = (profile, preferences) => {
  const fields = [
    profile?.birth_date,
    profile?.gender,
    profile?.occupation_status,
    profile?.bio,
    preferences?.budget_min ?? null,
    preferences?.budget_max ?? null,
    preferences?.location,
    preferences?.smoking,
    preferences?.pets,
    preferences?.noise_level,
    preferences?.guests_policy,
    preferences?.lifestyle_notes,
  ];

  const filled = fields.filter((value) => value !== null && value !== undefined && value !== '').length;
  return Math.round((filled / fields.length) * 100);
};

const OwnerProfileOverview = ({ user, profile, preferences }) => {
  const completion = getCompletion(profile, preferences);
  const completionNote = completion >= 80
    ? 'Votre profil est bien detaille. Vous etes prets a attirer des colocataires.'
    : 'Ajoutez quelques informations pour rendre votre annonce plus attractive.';

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6">
        <div className="rounded-[32px] bg-card p-6 shadow-lift ring-1 ring-border">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Profil owner</p>
              <h2 className="mt-2 font-display text-3xl text-ink">
                {user?.username || 'Votre espace owner'}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Pilotez votre profil et mettez en avant votre colocation pour rassurer vos futurs colocataires.
              </p>
            </div>
            <div className="rounded-3xl bg-accent/15 px-4 py-3 text-sm font-semibold text-accent">
              Role : OWNER
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoTile label="Email" value={user?.email || 'Non renseigne'} tone="surface" />
            <InfoTile label="Statut" value={formatEnum(user?.status, statusMap)} tone="surface" />
            <InfoTile label="Occupation" value={formatEnum(profile?.occupation_status, occupationMap)} tone="secondary" />
            <InfoTile label="Genre" value={formatEnum(profile?.gender, genderMap)} tone="secondary" />
            <InfoTile label="Naissance" value={formatDate(profile?.birth_date)} tone="secondary" />
            <InfoTile label="Membre depuis" value={formatDate(user?.created_at)} tone="surface" />
          </div>
        </div>

        <div className="rounded-[32px] bg-card p-6 shadow-soft ring-1 ring-border">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Presentation</p>
          <h3 className="mt-2 text-lg font-semibold text-ink">Votre bio</h3>
          <p className="mt-3 text-sm text-muted">
            {profile?.bio || 'Ajoutez une bio pour presenter votre logement et votre style de vie.'}
          </p>
        </div>

        <div className="rounded-[32px] bg-card p-6 shadow-soft ring-1 ring-border">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Preferences</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">Ce que vous proposez</h3>
            </div>
            <p className="text-xs text-muted">Base sur les preferences enregistrees.</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoTile
              label="Budget"
              value={formatBudget(preferences?.budget_min, preferences?.budget_max)}
              tone="surface"
            />
            <InfoTile
              label="Localisation"
              value={preferences?.location || 'Non renseigne'}
              tone="surface"
            />
            <InfoTile
              label="Tabac"
              value={formatEnum(preferences?.smoking, smokingMap)}
              tone="surface"
            />
            <InfoTile
              label="Animaux"
              value={formatEnum(preferences?.pets, petsMap)}
              tone="surface"
            />
            <InfoTile
              label="Ambiance"
              value={formatEnum(preferences?.noise_level, noiseMap)}
              tone="surface"
            />
            <InfoTile
              label="Invites"
              value={formatEnum(preferences?.guests_policy, guestsMap)}
              tone="surface"
            />
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[32px] bg-card p-6 shadow-soft ring-1 ring-border">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Progression</p>
          <h3 className="mt-2 text-lg font-semibold text-ink">Profil complete a {completion}%</h3>
          <div className="mt-4 h-2 rounded-full bg-border">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${completion}%` }} />
          </div>
          <p className="mt-3 text-xs text-muted">{completionNote}</p>
        </div>

        <div className="rounded-[32px] bg-ink p-6 text-white shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Conseils owner</p>
          <h3 className="mt-2 text-lg font-semibold">Renforcez la confiance</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>Partagez vos attentes de vie commune.</li>
            <li>Precisez les regles de la maison.</li>
            <li>Indiquez votre disponibilite pour les visites.</li>
          </ul>
        </div>

        <div className="rounded-[32px] bg-card p-6 shadow-soft ring-1 ring-border">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Notes de vie</p>
          <h3 className="mt-2 text-lg font-semibold text-ink">Habitudes et preferences</h3>
          <p className="mt-3 text-sm text-muted">
            {preferences?.lifestyle_notes || 'Partagez vos habitudes pour attirer des profils compatibles.'}
          </p>
        </div>
      </aside>
    </div>
  );
};

export default OwnerProfileOverview;
