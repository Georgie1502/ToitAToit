import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { upsertMyPreferences } from '../services/preferences';
import { upsertMyProfile } from '../services/profile';

const field =
  'w-full rounded-full border border-ink/10 bg-surface px-5 py-3 font-body text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';
const fieldArea =
  'w-full rounded-3xl border border-ink/10 bg-surface px-5 py-3 font-body text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

const RAISON_OPTIONS = [
  { value: 'NOUVELLE_VILLE', label: 'Arrivée dans une nouvelle ville' },
  { value: 'SEPARATION', label: 'Séparation / rupture' },
  { value: 'DIFFICULTES_FINANCIERES', label: 'Difficultés financières' },
  { value: 'LIEN_SOCIAL', label: 'Envie de lien social' },
  { value: 'MOBILITE_ETUDES', label: 'Mobilité étudiante' },
  { value: 'RETOUR_EMPLOI', label: "Retour à l'emploi" },
  { value: 'AUTRE', label: 'Autre' },
];

const VALEURS_OPTIONS = [
  { value: 'RESPECT_ESPACE', label: "Respect de l'espace de chacun" },
  { value: 'SOLIDARITE', label: 'Solidarité et entraide' },
  { value: 'BONNE_HUMEUR', label: 'Bonne humeur' },
  { value: 'HONNETETE', label: 'Honnêteté / transparence' },
  { value: 'ECO', label: 'Éco-responsabilité' },
  { value: 'MIXITE', label: 'Mixité / ouverture aux autres' },
];

const OUVERTURE_OPTIONS = [
  { value: 'PERIODE_DIFFICILE', label: 'Quelqu\'un qui traverse une période difficile' },
  { value: 'PLUS_AGE', label: 'Une personne plus âgée' },
  { value: 'AUTRE_CULTURE', label: "Une personne d'une autre culture" },
  { value: 'HANDICAP', label: 'Une personne en situation de handicap' },
  { value: 'LANGUE', label: 'Quelqu\'un qui parle peu français' },
];

const OnboardingSeeker = () => {
  const [formData, setFormData] = useState({
    birth_date: '', gender: '', occupation_status: '', bio: '',
    budget_min: '', budget_max: '', location: '',
    smoking: '', pets: '', noise_level: '', guests_policy: '',
    coloc_reason: '', coloc_type: '', wakeup: '', schedule_return: '',
    work_location: '', ma_phrase: '',
  });
  const [valeurs, setValeurs] = useState([]);
  const [ouverture, setOuverture] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggle = (setter, value) => {
    setter((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await upsertMyProfile({
        role: 'SEEKER',
        birth_date: formData.birth_date || null,
        gender: formData.gender || null,
        occupation_status: formData.occupation_status || null,
        bio: formData.bio || null,
      });
      await upsertMyPreferences({
        budget_min: formData.budget_min || null,
        budget_max: formData.budget_max || null,
        location: formData.location || null,
        smoking: formData.smoking || null,
        pets: formData.pets || null,
        noise_level: formData.noise_level || null,
        guests_policy: formData.guests_policy || null,
        lifestyle_notes: JSON.stringify({
          reason: formData.coloc_reason, coloc_type: formData.coloc_type,
          wakeup: formData.wakeup, schedule_return: formData.schedule_return,
          work_location: formData.work_location, valeurs,
          ouverture_solidaire: ouverture, ma_phrase: formData.ma_phrase,
        }),
      });
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de sauvegarder vos préférences.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-3">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Onboarding colocataire</p>
          <h2 className="font-display text-4xl text-ink">Votre profil colocataire.</h2>
          <p className="max-w-xl font-body text-base text-muted">
            Ces informations nous permettent de vous proposer des annonces vraiment compatibles.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} aria-busy={loading}>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">

              {/* Profil de base */}
              <div className="rounded-3xl bg-surface p-7 shadow-soft">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Votre profil</p>
                <h3 className="mt-1 font-display text-xl text-ink">Qui êtes-vous ?</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Date de naissance
                    <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className={field} />
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Genre
                    <select name="gender" value={formData.gender} onChange={handleChange} className={field}>
                      <option value="">Non renseigné</option>
                      <option value="F">Femme</option>
                      <option value="M">Homme</option>
                      <option value="NON_BINARY">Non binaire</option>
                      <option value="OTHER">Autre</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Statut
                    <select name="occupation_status" value={formData.occupation_status} onChange={handleChange} className={field}>
                      <option value="">Non renseigné</option>
                      <option value="STUDENT">Étudiant·e</option>
                      <option value="PRO">En activité</option>
                      <option value="OTHER">Autre</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink sm:col-span-2">
                    Bio
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className={fieldArea} placeholder="Qui êtes-vous en quelques mots ?" />
                  </label>
                </div>
              </div>

              {/* Situation */}
              <div className="rounded-3xl bg-surface p-7 shadow-soft">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Votre situation</p>
                <h3 className="mt-1 font-display text-xl text-ink">Pourquoi une coloc ?</h3>
                <div className="mt-6 grid gap-4">
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Raison principale
                    <select name="coloc_reason" value={formData.coloc_reason} onChange={handleChange} className={field}>
                      <option value="">Non précisé</option>
                      {RAISON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Type de coloc recherché
                    <select name="coloc_type" value={formData.coloc_type} onChange={handleChange} className={field}>
                      <option value="">Non précisé</option>
                      <option value="FONCTIONNEL">Fonctionnelle — chacun sa vie</option>
                      <option value="LIEN">Un peu de lien — repas partagés parfois</option>
                      <option value="COMMUNAUTE">Vraie vie commune — sorties, entraide</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Rythme */}
              <div className="rounded-3xl bg-surface p-7 shadow-soft">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Rythme de vie</p>
                <h3 className="mt-1 font-display text-xl text-ink">Vos habitudes.</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Je me lève
                    <select name="wakeup" value={formData.wakeup} onChange={handleChange} className={field}>
                      <option value="">Non précisé</option>
                      <option value="TRES_TOT">Avant 7h</option>
                      <option value="MATIN">Entre 7h et 9h</option>
                      <option value="TARD">Après 9h</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Je rentre le soir
                    <select name="schedule_return" value={formData.schedule_return} onChange={handleChange} className={field}>
                      <option value="">Non précisé</option>
                      <option value="TOT">Avant 19h</option>
                      <option value="NORMAL">Entre 19h et 22h</option>
                      <option value="TARD">Après 22h</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink sm:col-span-2">
                    Je travaille / étudie
                    <select name="work_location" value={formData.work_location} onChange={handleChange} className={field}>
                      <option value="">Non précisé</option>
                      <option value="MAISON">Principalement à la maison</option>
                      <option value="DEHORS">Principalement dehors</option>
                      <option value="MIXTE">Les deux (mi-temps)</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Tabac
                    <select name="smoking" value={formData.smoking} onChange={handleChange} className={field}>
                      <option value="">Indifférent</option>
                      <option value="NO">Non fumeur·se</option>
                      <option value="YES">Fumeur·se</option>
                      <option value="OUTSIDE_ONLY">Fumeur·se (extérieur)</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Animaux
                    <select name="pets" value={formData.pets} onChange={handleChange} className={field}>
                      <option value="">Indifférent</option>
                      <option value="NO">Pas d'animaux</option>
                      <option value="YES">J'en ai</option>
                      <option value="OK_WITH_PETS">Ok avec animaux</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Ambiance
                    <select name="noise_level" value={formData.noise_level} onChange={handleChange} className={field}>
                      <option value="">Indifférent</option>
                      <option value="CALM">Calme</option>
                      <option value="NORMAL">Normal</option>
                      <option value="FESTIVE">Festif</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Invités
                    <select name="guests_policy" value={formData.guests_policy} onChange={handleChange} className={field}>
                      <option value="">Indifférent</option>
                      <option value="NO">Pas d'invités</option>
                      <option value="OCCASIONAL">Invités occasionnels</option>
                      <option value="OK">Invités bienvenus</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Valeurs */}
              <div className="rounded-3xl bg-surface p-7 shadow-soft">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Valeurs</p>
                <h3 className="mt-1 font-display text-xl text-ink">Ce qui compte pour vous.</h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {VALEURS_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex cursor-pointer items-center gap-3 rounded-full bg-surfaceContainer px-4 py-2.5 font-body text-sm text-ink transition hover:bg-primaryContainer/15">
                      <input type="checkbox" checked={valeurs.includes(opt.value)} onChange={() => toggle(setValeurs, opt.value)} className="h-4 w-4 rounded text-primary" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Ouverture solidaire */}
              <div className="rounded-3xl p-7 shadow-soft" style={{ background: 'linear-gradient(135deg, #DDEAF2 0%, #EEF8FF 100%)' }}>
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Ouverture solidaire</p>
                <h3 className="mt-1 font-display text-xl text-ink">Je suis ouvert·e à vivre avec…</h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {OUVERTURE_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex cursor-pointer items-center gap-3 rounded-full bg-surface/70 px-4 py-2.5 font-body text-sm text-ink transition hover:bg-surface">
                      <input type="checkbox" checked={ouverture.includes(opt.value)} onChange={() => toggle(setOuverture, opt.value)} className="h-4 w-4 rounded text-primary" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              {/* Critères */}
              <div className="rounded-3xl bg-surface p-7 shadow-soft">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Critères</p>
                <h3 className="mt-1 font-display text-xl text-ink">Budget & localisation.</h3>
                <div className="mt-6 grid gap-4">
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Budget min (EUR)
                    <input type="number" name="budget_min" value={formData.budget_min} onChange={handleChange} className={field} min="0" />
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Budget max (EUR)
                    <input type="number" name="budget_max" value={formData.budget_max} onChange={handleChange} className={field} min="0" />
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Localisation souhaitée
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className={field} placeholder="Ville ou quartier" />
                  </label>
                </div>
              </div>

              {/* Phrase libre */}
              <div className="rounded-3xl bg-surface p-7 shadow-soft">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">En une phrase</p>
                <h3 className="mt-1 font-display text-xl text-ink">Ma coloc idéale c'est…</h3>
                <textarea name="ma_phrase" value={formData.ma_phrase} onChange={handleChange} rows={4} className={`${fieldArea} mt-5`} placeholder="Un endroit où je me sens chez moi et où on s'entraide." maxLength={150} />
                <p className="mt-2 text-right font-body text-xs text-muted">{formData.ma_phrase.length}/150</p>
              </div>

              {/* Conseil */}
              <div className="overflow-hidden rounded-3xl shadow-soft" style={{ background: 'linear-gradient(135deg, #A8275A 0%, #FF709F 100%)' }}>
                <div className="p-7">
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-white/70">Pourquoi ces questions ?</p>
                  <h3 className="mt-2 font-display text-xl text-white">Un matching plus juste</h3>
                  <p className="mt-3 font-body text-sm text-white/80">
                    Les critères pratiques ne font pas tout. Vos valeurs et votre rythme de vie comptent autant.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {error ? (
            <div role="alert" aria-live="assertive" className="rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-xs text-muted">Vous pourrez mettre à jour ces informations depuis votre profil.</p>
            <Button type="submit" size="lg" variant="primary" disabled={loading}>
              {loading ? 'Enregistrement…' : 'Enregistrer mon profil →'}
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
};

export default OnboardingSeeker;
