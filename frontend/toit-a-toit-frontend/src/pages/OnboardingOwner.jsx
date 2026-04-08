import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { createListing } from '../services/colocations';
import { upsertMyProfile } from '../services/profile';

const field =
  'w-full rounded-full border border-ink/10 bg-surface px-5 py-3 font-body text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';
const fieldArea =
  'w-full rounded-3xl border border-ink/10 bg-surface px-5 py-3 font-body text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

const OnboardingOwner = () => {
  const [formData, setFormData] = useState({
    birth_date: '', gender: '', occupation_status: '', bio: '',
    title: '', description: '', rent_amount: '', charges_included: false,
    surface_m2: '', housing_type: '', available_from: '', available_to: '',
    min_duration_months: '', status: 'DRAFT', city: '', postal_code: '', address: '',
    photo_urls: '/annonces/appartement.jpg\n/annonces/chambre.jpg\n/annonces/salon.jpg',
  });
  const [photoFiles, setPhotoFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'file') {
      setPhotoFiles(Array.from(e.target.files || []));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title || !formData.description || !formData.rent_amount || !formData.available_from)
      return setError('Merci de compléter les champs requis pour publier votre annonce.');
    if (!formData.city || !formData.postal_code)
      return setError('Merci de compléter la localisation (ville et code postal).');
    if (!formData.housing_type)
      return setError('Sélectionnez un type de logement.');
    setLoading(true);
    try {
      await upsertMyProfile({
        role: 'OWNER',
        birth_date: formData.birth_date || null,
        gender: formData.gender || null,
        occupation_status: formData.occupation_status || null,
        bio: formData.bio || null,
      });
      const payload = new FormData();
      [
        ['title', formData.title],
        ['description', formData.description],
        ['rent_amount', formData.rent_amount],
        ['charges_included', String(formData.charges_included)],
        ['surface_m2', formData.surface_m2 || ''],
        ['housing_type', formData.housing_type],
        ['available_from', formData.available_from],
        ['available_to', formData.available_to || ''],
        ['min_duration_months', formData.min_duration_months || ''],
        ['status', formData.status],
        ['city', formData.city],
        ['postal_code', formData.postal_code],
        ['address', formData.address || ''],
        ['photo_urls', formData.photo_urls],
      ].forEach(([key, value]) => payload.append(key, value));
      photoFiles.forEach((file) => payload.append('photos', file));

      await createListing(payload);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de créer votre annonce.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-3">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Onboarding propriétaire</p>
          <h2 className="font-display text-4xl text-ink">Renseignez votre profil<br />et votre annonce.</h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} aria-busy={loading}>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">

              {/* Profil */}
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
                      <option value="STUDENT">Étudiant</option>
                      <option value="PRO">Actif</option>
                      <option value="OTHER">Autre</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink sm:col-span-2">
                    Bio
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className={fieldArea} placeholder="Parlez de vous et de votre manière d'accueillir." />
                  </label>
                </div>
              </div>

              {/* Annonce */}
              <div className="rounded-3xl bg-surface p-7 shadow-soft">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Votre annonce</p>
                <h3 className="mt-1 font-display text-xl text-ink">Décrivez votre logement.</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink sm:col-span-2">
                    Titre *
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className={field} placeholder="Chambre lumineuse proche centre" required />
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink sm:col-span-2">
                    Description *
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={fieldArea} placeholder="Décrivez le logement, les pièces communes et l'ambiance." required />
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Loyer (EUR) *
                    <input type="number" name="rent_amount" value={formData.rent_amount} onChange={handleChange} className={field} min="0" required />
                  </label>
                  <label className="flex items-center gap-3 font-body text-sm font-semibold text-ink">
                    <input type="checkbox" name="charges_included" checked={formData.charges_included} onChange={handleChange} className="h-4 w-4 rounded-full border-ink/20 text-primary" />
                    Charges incluses
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Surface (m²)
                    <input type="number" name="surface_m2" value={formData.surface_m2} onChange={handleChange} className={field} min="0" />
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Type de logement *
                    <select name="housing_type" value={formData.housing_type} onChange={handleChange} className={field} required>
                      <option value="">Sélectionnez</option>
                      <option value="ROOM">Chambre</option>
                      <option value="STUDIO">Studio</option>
                      <option value="FLAT">Appartement</option>
                      <option value="HOUSE">Maison</option>
                      <option value="OTHER">Autre</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Disponible à partir du *
                    <input type="date" name="available_from" value={formData.available_from} onChange={handleChange} className={field} required />
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Disponible jusqu'au
                    <input type="date" name="available_to" value={formData.available_to} onChange={handleChange} className={field} />
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Durée minimale (mois)
                    <input type="number" name="min_duration_months" value={formData.min_duration_months} onChange={handleChange} className={field} min="0" />
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Statut
                    <select name="status" value={formData.status} onChange={handleChange} className={field}>
                      <option value="DRAFT">Brouillon</option>
                      <option value="PUBLISHED">Publié</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink sm:col-span-2">
                    Photos (1 URL par ligne)
                    <textarea name="photo_urls" value={formData.photo_urls} onChange={handleChange} rows={3} className={fieldArea} placeholder="https://..." />
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink sm:col-span-2">
                    Ou ajoutez des photos depuis votre ordinateur
                    <input type="file" name="photos" accept="image/*" multiple onChange={handleChange} className={field} />
                  </label>
                  {photoFiles.length > 0 ? (
                    <p className="sm:col-span-2 font-body text-xs text-muted">
                      {photoFiles.length} fichier{photoFiles.length > 1 ? 's' : ''} sélectionné{photoFiles.length > 1 ? 's' : ''}.
                    </p>
                  ) : null}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              {/* Localisation */}
              <div className="rounded-3xl bg-surface p-7 shadow-soft">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Localisation</p>
                <h3 className="mt-1 font-display text-xl text-ink">Où se trouve le logement ?</h3>
                <div className="mt-6 grid gap-4">
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Ville *
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className={field} required />
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Code postal *
                    <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} className={field} required />
                  </label>
                  <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                    Adresse
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className={field} placeholder="Rue et numéro" />
                  </label>
                </div>
              </div>

              {/* Conseil */}
              <div className="overflow-hidden rounded-3xl shadow-soft" style={{ background: 'linear-gradient(135deg, #A8275A 0%, #FF709F 100%)' }}>
                <div className="p-7">
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-white/70">Conseil</p>
                  <h3 className="mt-2 font-display text-xl text-white">Valorisez votre annonce</h3>
                  <p className="mt-3 font-body text-sm text-white/80">
                    Précisez la pièce proposée, les équipements et les règles pour rassurer vos futurs colocataires.
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
            <p className="font-body text-xs text-muted">Vous pourrez modifier votre annonce depuis votre profil.</p>
            <Button type="submit" size="lg" variant="primary" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Publier ma colocation →'}
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
};

export default OnboardingOwner;
