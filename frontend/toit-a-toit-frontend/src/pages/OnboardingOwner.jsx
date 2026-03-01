import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { createListing } from '../services/colocations';
import { upsertMyProfile } from '../services/profile';

const fieldClassName =
  'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25';

const OwnerOnboarding = () => {
  const [formData, setFormData] = useState({
    birth_date: '',
    gender: '',
    occupation_status: '',
    bio: '',
    title: '',
    description: '',
    rent_amount: '',
    charges_included: false,
    surface_m2: '',
    housing_type: '',
    available_from: '',
    available_to: '',
    min_duration_months: '',
    status: 'DRAFT',
    city: '',
    postal_code: '',
    address: '',
    photo_urls: '/annonces/appartement.jpg\n/annonces/chambre.jpg\n/annonces/salon.jpg',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.rent_amount || !formData.available_from) {
      setError('Merci de completer les champs requis pour publier votre annonce.');
      return;
    }
    if (!formData.city || !formData.postal_code) {
      setError('Merci de completer la localisation (ville et code postal).');
      return;
    }
    if (!formData.housing_type) {
      setError('Selectionnez un type de logement.');
      return;
    }

    setLoading(true);
    try {
      await upsertMyProfile({
        role: 'OWNER',
        birth_date: formData.birth_date || null,
        gender: formData.gender || null,
        occupation_status: formData.occupation_status || null,
        bio: formData.bio || null,
      });

      await createListing({
        title: formData.title,
        description: formData.description,
        rent_amount: formData.rent_amount,
        charges_included: formData.charges_included,
        surface_m2: formData.surface_m2 || null,
        housing_type: formData.housing_type,
        available_from: formData.available_from,
        available_to: formData.available_to || null,
        min_duration_months: formData.min_duration_months || null,
        status: formData.status,
        photos: formData.photo_urls
          .split('\n')
          .map((value) => value.trim())
          .filter((value) => value.length > 0),
        location: {
          city: formData.city,
          postal_code: formData.postal_code,
          address: formData.address || null,
        },
      });

      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de creer votre annonce.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[32px] bg-card p-8 shadow-lift ring-1 ring-border">
          <h2 className="font-display text-3xl text-ink">Profil owner</h2>
          <p className="mt-3 text-sm text-muted">
            Renseignez votre profil et les caracteristiques de votre colocation.
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
                      placeholder="Parlez de vous et de votre maniere d'accueillir."
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[32px] bg-white/90 p-6 shadow-soft ring-1 ring-ink/5">
                <h3 className="text-lg font-semibold text-ink">Votre annonce</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink sm:col-span-2">
                    Titre
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={fieldClassName}
                      placeholder="Chambre lumineuse proche centre"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink sm:col-span-2">
                    Description
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className={fieldClassName}
                      placeholder="Decrivez le logement, les pieces communes et l'ambiance."
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Loyer (EUR)
                    <input
                      type="number"
                      name="rent_amount"
                      value={formData.rent_amount}
                      onChange={handleChange}
                      className={fieldClassName}
                      min="0"
                      required
                    />
                  </label>
                  <label className="flex items-center gap-3 text-sm font-semibold text-ink">
                    <input
                      type="checkbox"
                      name="charges_included"
                      checked={formData.charges_included}
                      onChange={handleChange}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    Charges incluses
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Surface (m2)
                    <input
                      type="number"
                      name="surface_m2"
                      value={formData.surface_m2}
                      onChange={handleChange}
                      className={fieldClassName}
                      min="0"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Type de logement
                    <select
                      name="housing_type"
                      value={formData.housing_type}
                      onChange={handleChange}
                      className={fieldClassName}
                      required
                    >
                      <option value="">Selectionnez</option>
                      <option value="ROOM">Chambre</option>
                      <option value="STUDIO">Studio</option>
                      <option value="FLAT">Appartement</option>
                      <option value="HOUSE">Maison</option>
                      <option value="OTHER">Autre</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Disponible a partir du
                    <input
                      type="date"
                      name="available_from"
                      value={formData.available_from}
                      onChange={handleChange}
                      className={fieldClassName}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Disponible jusqu'au
                    <input
                      type="date"
                      name="available_to"
                      value={formData.available_to}
                      onChange={handleChange}
                      className={fieldClassName}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Duree minimale (mois)
                    <input
                      type="number"
                      name="min_duration_months"
                      value={formData.min_duration_months}
                      onChange={handleChange}
                      className={fieldClassName}
                      min="0"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Statut
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={fieldClassName}
                    >
                      <option value="DRAFT">Brouillon</option>
                      <option value="PUBLISHED">Publie</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink sm:col-span-2">
                    Photos (1 URL par ligne)
                    <textarea
                      name="photo_urls"
                      value={formData.photo_urls}
                      onChange={handleChange}
                      rows={4}
                      className={fieldClassName}
                      placeholder="https://..."
                    />
                  </label>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[32px] bg-white/90 p-6 shadow-soft ring-1 ring-ink/5">
                <h3 className="text-lg font-semibold text-ink">Localisation</h3>
                <div className="mt-5 grid gap-4">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Ville
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={fieldClassName}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Code postal
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className={fieldClassName}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                    Adresse
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={fieldClassName}
                      placeholder="Rue et numero"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[32px] bg-ink p-6 text-white shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Conseil</p>
                <h3 className="mt-2 text-lg font-semibold">Valorisez votre annonce</h3>
                <p className="mt-3 text-sm text-white/80">
                  Precisez la piece proposee, les equipements et les regles pour rassurer vos futurs colocataires.
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
            <p className="text-xs text-ink/60">Vous pourrez modifier votre annonce depuis votre profil.</p>
            <Button type="submit" size="lg" variant="primary" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Publier ma colocation'}
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
};

export default OwnerOnboarding;
