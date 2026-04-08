const genderMap = { F: 'Femme', M: 'Homme', NON_BINARY: 'Non binaire', OTHER: 'Autre' };
const occupationMap = { STUDENT: 'Étudiant', PRO: 'Actif', OTHER: 'Autre' };
const smokingMap = { NO: 'Non fumeur', YES: 'Fumeur', OUTSIDE_ONLY: 'Fumeur extérieur' };
const petsMap = { NO: "Pas d'animaux", YES: 'Animaux acceptés', OK_WITH_PETS: 'Ok avec animaux' };
const noiseMap = { CALM: 'Calme', NORMAL: 'Normal', FESTIVE: 'Festif' };
const guestsMap = { NO: "Pas d'invités", OCCASIONAL: 'Invités occasionnels', OK: 'Invités bienvenus' };
const statusMap = { ACTIVE: 'Actif', SUSPENDED: 'Suspendu', DELETED: 'Supprimé' };

const fmt = (value, map) => (value ? map?.[value] || value : 'Non renseigné');
const fmtDate = (value) => {
  if (!value) return 'Non renseigné';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? 'Non renseigné' : d.toLocaleDateString('fr-FR');
};
const fmtBudget = (min, max) => {
  if (min != null && max != null) return `${min} – ${max} €`;
  if (min != null) return `À partir de ${min} €`;
  if (max != null) return `Jusqu'à ${max} €`;
  return 'Non renseigné';
};

const getCompletion = (profile, preferences) => {
  const fields = [
    profile?.birth_date, profile?.gender, profile?.occupation_status, profile?.bio,
    preferences?.budget_min ?? null, preferences?.budget_max ?? null, preferences?.location,
    preferences?.smoking, preferences?.pets, preferences?.noise_level,
    preferences?.guests_policy, preferences?.lifestyle_notes,
  ];
  return Math.round((fields.filter((v) => v !== null && v !== undefined && v !== '').length / fields.length) * 100);
};

const Pill = ({ label, value }) => (
  <div className="rounded-3xl bg-surfaceContainer px-5 py-3">
    <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
    <p className="mt-1 font-body text-sm font-semibold text-ink">{value}</p>
  </div>
);

const OwnerProfileOverview = ({ user, profile, preferences }) => {
  const completion = getCompletion(profile, preferences);
  const completionNote = completion >= 80
    ? 'Votre profil est bien détaillé. Vous êtes prêt·e à attirer des colocataires.'
    : 'Ajoutez quelques informations pour rendre votre annonce plus attractive.';

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6">

        {/* Header */}
        <div className="rounded-3xl bg-surface p-8 shadow-lift">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Profil owner</p>
              <h2 className="mt-2 font-display text-4xl text-ink">{user?.username || 'Votre espace owner'}</h2>
              <p className="mt-2 max-w-md font-body text-base text-muted">
                Pilotez votre profil et mettez en avant votre colocation.
              </p>
            </div>
            <span className="rounded-full bg-primaryContainer/20 px-4 py-2 font-body text-sm font-semibold text-primary">
              OWNER
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Pill label="Email" value={user?.email || 'Non renseigné'} />
            <Pill label="Statut" value={fmt(user?.status, statusMap)} />
            <Pill label="Occupation" value={fmt(profile?.occupation_status, occupationMap)} />
            <Pill label="Genre" value={fmt(profile?.gender, genderMap)} />
            <Pill label="Naissance" value={fmtDate(profile?.birth_date)} />
            <Pill label="Membre depuis" value={fmtDate(user?.created_at)} />
          </div>
        </div>

        {/* Bio */}
        <div className="rounded-3xl bg-surface p-7 shadow-soft">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Présentation</p>
          <h3 className="mt-1 font-display text-xl text-ink">Votre bio</h3>
          <p className="mt-3 font-body text-sm text-muted">
            {profile?.bio || 'Ajoutez une bio pour présenter votre logement et votre style de vie.'}
          </p>
        </div>

        {/* Préférences */}
        <div className="rounded-3xl bg-surface p-7 shadow-soft">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Préférences</p>
          <h3 className="mt-1 font-display text-xl text-ink">Ce que vous proposez</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Pill label="Budget" value={fmtBudget(preferences?.budget_min, preferences?.budget_max)} />
            <Pill label="Localisation" value={preferences?.location || 'Non renseigné'} />
            <Pill label="Tabac" value={fmt(preferences?.smoking, smokingMap)} />
            <Pill label="Animaux" value={fmt(preferences?.pets, petsMap)} />
            <Pill label="Ambiance" value={fmt(preferences?.noise_level, noiseMap)} />
            <Pill label="Invités" value={fmt(preferences?.guests_policy, guestsMap)} />
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        {/* Complétion */}
        <div className="rounded-3xl bg-surface p-7 shadow-soft">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Progression</p>
          <h3 className="mt-1 font-display text-2xl text-ink">Profil complété à {completion}%</h3>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-surfaceContainer">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${completion}%`, background: 'linear-gradient(135deg, #A8275A 0%, #FF709F 100%)' }}
            />
          </div>
          <p className="mt-3 font-body text-xs text-muted">{completionNote}</p>
        </div>

        {/* Conseils */}
        <div className="overflow-hidden rounded-3xl shadow-soft" style={{ background: 'linear-gradient(135deg, #A8275A 0%, #FF709F 100%)' }}>
          <div className="p-7">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-white/70">Conseils owner</p>
            <h3 className="mt-2 font-display text-xl text-white">Renforcez la confiance</h3>
            <ul className="mt-4 space-y-2 font-body text-sm text-white/80">
              <li>Partagez vos attentes de vie commune.</li>
              <li>Précisez les règles de la maison.</li>
              <li>Indiquez votre disponibilité pour les visites.</li>
            </ul>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-3xl bg-surface p-7 shadow-soft">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Notes de vie</p>
          <h3 className="mt-1 font-display text-xl text-ink">Habitudes et préférences</h3>
          <p className="mt-3 font-body text-sm text-muted">
            {preferences?.lifestyle_notes || 'Partagez vos habitudes pour attirer des profils compatibles.'}
          </p>
        </div>
      </aside>
    </div>
  );
};

export default OwnerProfileOverview;
