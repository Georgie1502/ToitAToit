import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { upsertMyProfile } from '../services/profile';
import { upsertMyPreferences } from '../services/preferences';

const fieldClassName =
  'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25';

const OnboardingSeeker = () => {
  const [formData, setFormData] = useState({
    birth_date: '',
    gender: '',
    occupation_status: '',
    bio: '',
    budget_min: '',
    budget_max: '',
    location: '',
    smoking: '',
    pets: '',
    noise_level: '',
    guests_policy: '',
    lifestyle_notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        lifestyle_notes: formData.lifestyle_notes || null,
      });

      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de sauvegarder vos preferences.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[32px] bg-card p-8 shadow-lift ring-1 ring-border">
          <h2 className="font-display text-3xl text-ink">Profil seeker</h2>
          <p className="mt-3 text-sm text-muted">
            Dites-nous ce que vous recherchez pour obtenir des annonces compatibles.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} aria-busy={loading}>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">
              <div className="rounded-[32px] bg-card p-6 shadow-soft ring-1 ring-border">
                <h3 className="text-lg font-semibold text-ink">Votre profil</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Date de naissance
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleChange}
                      className={fieldClassName}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Genre
                    <select name="gender" value={formData.gender} onChange={handleChange} className={fieldClassName}>
                      <option value="">Non renseigne</option>
                      <option value="F">Femme</option>
                      <option value="M">Homme</option>
                      <option value="NON_BINARY">Non binaire</option>
                      <option value="OTHER">Autre</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Statut
                    <select
                      name="occupation_status"
                      value={formData.occupation_status}
                      onChange={handleChange}
                      className={fieldClassName}
                    >
                      <option value="">Non renseigne</option>
                      <option value="STUDENT">Etudiant</option>
                      <option value="PRO">Actif</option>
                      <option value="OTHER">Autre</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink sm:col-span-2">
                    Bio
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className={fieldClassName}
                      placeholder="Parlez de vos habitudes et de votre rythme."
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[32px] bg-card p-6 shadow-soft ring-1 ring-border">
                <h3 className="text-lg font-semibold text-ink">Vos criteres</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Budget min (EUR)
                    <input
                      type="number"
                      name="budget_min"
                      value={formData.budget_min}
                      onChange={handleChange}
                      className={fieldClassName}
                      min="0"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Budget max (EUR)
                    <input
                      type="number"
                      name="budget_max"
                      value={formData.budget_max}
                      onChange={handleChange}
                      className={fieldClassName}
                      min="0"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink sm:col-span-2">
                    Localisation souhaitee
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={fieldClassName}
                      placeholder="Ville ou quartier"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Tabac
                    <select name="smoking" value={formData.smoking} onChange={handleChange} className={fieldClassName}>
                      <option value="">Indifferent</option>
                      <option value="NO">Non fumeur</option>
                      <option value="YES">Fumeur</option>
                      <option value="OUTSIDE_ONLY">Fumeur exterieur</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Animaux
                    <select name="pets" value={formData.pets} onChange={handleChange} className={fieldClassName}>
                      <option value="">Indifferent</option>
                      <option value="NO">Pas d'animaux</option>
                      <option value="YES">Animaux acceptes</option>
                      <option value="OK_WITH_PETS">Ok avec animaux</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Ambiance
                    <select
                      name="noise_level"
                      value={formData.noise_level}
                      onChange={handleChange}
                      className={fieldClassName}
                    >
                      <option value="">Indifferent</option>
                      <option value="CALM">Calme</option>
                      <option value="NORMAL">Normal</option>
                      <option value="FESTIVE">Festif</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Invites
                    <select
                      name="guests_policy"
                      value={formData.guests_policy}
                      onChange={handleChange}
                      className={fieldClassName}
                    >
                      <option value="">Indifferent</option>
                      <option value="NO">Pas d'invites</option>
                      <option value="OCCASIONAL">Invites occasionnels</option>
                      <option value="OK">Invites bienvenus</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink sm:col-span-2">
                    Notes de vie
                    <textarea
                      name="lifestyle_notes"
                      value={formData.lifestyle_notes}
                      onChange={handleChange}
                      rows={4}
                      className={fieldClassName}
                      placeholder="Horaires, rythme, habitudes de vie."
                    />
                  </label>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[32px] bg-card p-6 shadow-soft ring-1 ring-border">
                <h3 className="text-lg font-semibold text-ink">Ce que vous attendez</h3>
                <p className="mt-3 text-sm text-muted">
                  Plus vos criteres sont clairs, plus les annonces proposees seront pertinentes.
                </p>
              </div>
              <div className="rounded-[32px] bg-ink p-6 text-white shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Conseil</p>
                <h3 className="mt-2 text-lg font-semibold">Gagnez du temps</h3>
                <p className="mt-3 text-sm text-white/80">
                  Indiquez vos contraintes de budget et de localisation pour eviter les faux matchs.
                </p>
              </div>
            </aside>
          </div>

          {error ? (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">Vous pourrez mettre a jour vos preferences depuis votre profil.</p>
            <Button type="submit" size="lg" variant="primary" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer mes criteres'}
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
};

export default OnboardingSeeker;
