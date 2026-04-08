import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { createListing } from '../services/colocations';

const VALEURS_OPTIONS = [
  { value: 'RESPECT_ESPACE', label: "Respect de l'espace de chacun" },
  { value: 'SOLIDARITE', label: 'Solidarité et entraide' },
  { value: 'BONNE_HUMEUR', label: 'Bonne humeur' },
  { value: 'HONNETETE', label: 'Honnêteté / transparence' },
  { value: 'ECO', label: 'Éco-responsabilité' },
  { value: 'MIXITE', label: 'Mixité / ouverture aux autres' },
];

const OUVERTURE_OPTIONS = [
  { value: 'PERIODE_DIFFICILE', label: "Quelqu'un qui traverse une période difficile" },
  { value: 'PLUS_AGE', label: 'Une personne plus âgée' },
  { value: 'AUTRE_CULTURE', label: "Une personne d'une autre culture" },
  { value: 'HANDICAP', label: 'Une personne en situation de handicap' },
  { value: 'LANGUE', label: 'Quelqu\'un qui parle peu français' },
];

const GENDER_OPTIONS = [
  { value: '', label: 'Peu importe' },
  { value: 'F', label: 'Femme' },
  { value: 'M', label: 'Homme' },
  { value: 'NON_BINARY', label: 'Non-binaire' },
];

const SMOKING_OPTIONS = [
  { value: 'NO', label: 'Non' },
  { value: 'OUTSIDE_ONLY', label: 'En extérieur' },
  { value: 'YES', label: 'Oui' },
];

const PETS_OPTIONS = [
  { value: 'NO', label: 'Non' },
  { value: 'YES', label: 'Oui' },
];

const COLLOC_LIFE_OPTIONS = [
  { value: 'COMMUNAUTE', label: 'Dîners partagés' },
  { value: 'FONCTIONNEL', label: 'Indépendance totale' },
  { value: 'LIEN', label: 'Sorties le weekend' },
  { value: 'AUTRE', label: 'Cinéma & Jeux' },
];

const chipClass = (active) =>
  `rounded-full px-5 py-3 text-sm font-medium transition-all duration-200 ${
    active
      ? 'bg-primary text-inverse shadow-soft'
      : 'bg-surfaceContainer text-ink hover:bg-primaryContainer/10'
  }`;

const choiceClass = (active) =>
  `flex-1 rounded-full px-4 py-3 text-sm font-medium transition-all duration-200 ${
    active ? 'bg-white text-ink shadow-soft' : 'text-muted hover:text-ink'
  }`;

const PublierAnnonce = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', rent_amount: '', charges_included: false,
    surface_m2: '', housing_type: '', available_from: '', available_to: '',
    min_duration_months: '', status: 'PUBLISHED',
    city: '', postal_code: '', address: '',
    coloc_type: '', atmosphere: '', smoking: '', pets: '', noise_level: '',
    guests_policy: '', preferred_gender: '', photo_urls: '',
  });
  const [photoFiles, setPhotoFiles] = useState([]);
  const [valeurs, setValeurs] = useState([]);
  const [ouverture, setOuverture] = useState([]);
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

  const toggle = (setter, value) => {
    setter((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };

  const submitListing = async (targetStatus) => {
    setError('');
    if (!formData.title || !formData.description || !formData.rent_amount || !formData.available_from)
      return setError('Merci de compléter les champs obligatoires : titre, description, loyer et disponibilité.');
    if (!formData.city || !formData.postal_code)
      return setError('Merci de renseigner la ville et le code postal.');
    if (!formData.housing_type)
      return setError('Merci de sélectionner un type de logement.');
    setLoading(true);
    try {
      const status = targetStatus || formData.status;
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
        ['status', status],
        ['city', formData.city],
        ['postal_code', formData.postal_code],
        ['address', formData.address || ''],
        ['photo_urls', formData.photo_urls],
      ].forEach(([key, value]) => payload.append(key, value));
      photoFiles.forEach((file) => payload.append('photos', file));

      await createListing(payload);
      navigate('/mes-annonces');
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de publier l'annonce.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="relative overflow-hidden bg-background">
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-secondaryContainer/45 via-background to-background pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:pt-12 lg:pb-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-surfaceContainer px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft">
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                Nouvelle annonce
              </div>
              <h1 className="font-display text-5xl font-extrabold tracking-tight text-ink md:text-6xl">
                Publier une annonce
              </h1>
              <p className="max-w-2xl font-body text-lg text-muted md:text-xl">
                Décrivez votre logement et le profil de colocataire que vous recherchez.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 rounded-full bg-surface/80 px-5 py-3 shadow-soft backdrop-blur-xl">
              <span className="text-sm font-medium text-ink">Mes annonces</span>
              <span className="h-8 w-8 rounded-full bg-primaryContainer" />
            </div>
          </div>

          <form className="grid grid-cols-1 gap-12 lg:grid-cols-12" onSubmit={(e) => { e.preventDefault(); submitListing(formData.status); }} aria-busy={loading}>
            <div className="lg:col-span-8 space-y-10">
              <section className="rounded-[2rem] bg-surface p-6 shadow-[0_40px_40px_rgba(38,48,53,0.05)] transition-all hover:shadow-[0_40px_60px_rgba(38,48,53,0.08)] md:p-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondaryContainer text-ink">
                    <span className="material-symbols-outlined text-[22px]">home</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Votre logement</p>
                    <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">Les informations clés</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2 space-y-2">
                    <label htmlFor="title" className="ml-2 text-sm font-semibold text-ink">Titre de l'annonce *</label>
                    <input id="title" type="text" name="title" value={formData.title} onChange={handleChange} className="w-full rounded-full border-none bg-surfaceContainer px-6 py-4 text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:ring-2 focus:ring-primaryContainer" placeholder="Ex: Belle chambre lumineuse en centre-ville" required />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label htmlFor="description" className="ml-2 text-sm font-semibold text-ink">Description *</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full rounded-[1.25rem] border-none bg-surfaceContainer px-6 py-4 text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:ring-2 focus:ring-primaryContainer" placeholder="Parlez-nous du logement, de l'ambiance..." required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="rent_amount" className="ml-2 text-sm font-semibold text-ink">Loyer mensuel (EUR) *</label>
                    <input id="rent_amount" type="number" name="rent_amount" value={formData.rent_amount} onChange={handleChange} className="w-full rounded-full border-none bg-surfaceContainer px-6 py-4 text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:ring-2 focus:ring-primaryContainer" placeholder="0.00" min="0" required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="surface_m2" className="ml-2 text-sm font-semibold text-ink">Surface (m²)</label>
                    <input id="surface_m2" type="number" name="surface_m2" value={formData.surface_m2} onChange={handleChange} className="w-full rounded-full border-none bg-surfaceContainer px-6 py-4 text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:ring-2 focus:ring-primaryContainer" placeholder="Ex: 15" min="0" />
                  </div>

                  <label className="flex items-center gap-4 rounded-full bg-surfaceContainer px-6 py-4 text-sm font-medium text-ink">
                    <input id="charges_included" type="checkbox" name="charges_included" checked={formData.charges_included} onChange={handleChange} className="h-6 w-6 rounded-md border-none bg-surfaceContainer focus:ring-primary" />
                    <span htmlFor="charges_included">Charges incluses</span>
                  </label>

                  <div className="space-y-2">
                    <label htmlFor="housing_type" className="ml-2 text-sm font-semibold text-ink">Type de logement *</label>
                    <div className="relative">
                      <select id="housing_type" name="housing_type" value={formData.housing_type} onChange={handleChange} className="w-full appearance-none rounded-full border-none bg-surfaceContainer px-6 py-4 pr-12 text-sm text-ink shadow-soft transition focus:ring-2 focus:ring-primaryContainer" required>
                        <option value="">Sélectionnez</option>
                        <option value="ROOM">Chambre</option>
                        <option value="STUDIO">Studio</option>
                        <option value="FLAT">Appartement entier</option>
                        <option value="HOUSE">Maison</option>
                        <option value="OTHER">Autre</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">expand_more</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="available_from" className="ml-2 text-sm font-semibold text-ink">Disponible à partir du *</label>
                    <input id="available_from" type="date" name="available_from" value={formData.available_from} onChange={handleChange} className="w-full rounded-full border-none bg-surfaceContainer px-6 py-4 text-sm text-ink shadow-soft transition focus:ring-2 focus:ring-primaryContainer" required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="available_to" className="ml-2 text-sm font-semibold text-ink">Disponible jusqu'au</label>
                    <input id="available_to" type="date" name="available_to" value={formData.available_to} onChange={handleChange} className="w-full rounded-full border-none bg-surfaceContainer px-6 py-4 text-sm text-ink shadow-soft transition focus:ring-2 focus:ring-primaryContainer" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="min_duration_months" className="ml-2 text-sm font-semibold text-ink">Durée minimale (mois)</label>
                    <input id="min_duration_months" type="number" name="min_duration_months" value={formData.min_duration_months} onChange={handleChange} className="w-full rounded-full border-none bg-surfaceContainer px-6 py-4 text-sm text-ink shadow-soft transition focus:ring-2 focus:ring-primaryContainer" min="1" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="status" className="ml-2 text-sm font-semibold text-ink">Statut</label>
                    <div className="relative">
                      <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full appearance-none rounded-full border-none bg-surfaceContainer px-6 py-4 pr-12 text-sm text-ink shadow-soft transition focus:ring-2 focus:ring-primaryContainer">
                        <option value="DRAFT">Brouillon</option>
                        <option value="PUBLISHED">Publiée</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">expand_more</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label htmlFor="photo_urls" className="ml-2 text-sm font-semibold text-ink">Photos par URL</label>
                    <textarea id="photo_urls" name="photo_urls" value={formData.photo_urls} onChange={handleChange} rows={3} className="w-full rounded-[1.25rem] border-none bg-surfaceContainer px-6 py-4 text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:ring-2 focus:ring-primaryContainer" placeholder="https://..." />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label htmlFor="photos" className="ml-2 text-sm font-semibold text-ink">Ou ajoutez des photos depuis votre ordinateur</label>
                    <input id="photos" type="file" name="photos" accept="image/*" multiple onChange={handleChange} className="block w-full rounded-full border border-dashed border-surfaceContainer bg-surfaceContainer px-6 py-4 text-sm text-muted shadow-soft file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-inverse hover:border-primaryContainer/60" />
                    {photoFiles.length > 0 ? (
                      <p className="ml-2 text-xs text-muted">
                        {photoFiles.length} fichier{photoFiles.length > 1 ? 's' : ''} sélectionné{photoFiles.length > 1 ? 's' : ''}.
                      </p>
                    ) : null}
                  </div>
                </div>
              </section>

              <section className="rounded-[2rem] bg-surface p-6 shadow-[0_40px_40px_rgba(38,48,53,0.05)] md:p-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primaryContainer text-ink">
                    <span className="material-symbols-outlined text-[22px]">group</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Profil recherché</p>
                    <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">Vos préférences</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="ml-2 text-sm font-semibold text-ink">Genre souhaité</p>
                    <div className="flex flex-wrap gap-3">
                      {GENDER_OPTIONS.map((option) => (
                        <button key={option.value || 'any'} type="button" onClick={() => setFormData((prev) => ({ ...prev, preferred_gender: option.value }))} className={chipClass(formData.preferred_gender === option.value)}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <p className="ml-2 text-sm font-semibold text-ink">Tabac accepté ?</p>
                      <div className="flex gap-2 rounded-full bg-surfaceContainer p-1">
                        {SMOKING_OPTIONS.map((option) => (
                          <button key={option.value} type="button" onClick={() => setFormData((prev) => ({ ...prev, smoking: option.value }))} className={choiceClass(formData.smoking === option.value)}>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="ml-2 text-sm font-semibold text-ink">Animaux acceptés ?</p>
                      <div className="flex gap-2 rounded-full bg-surfaceContainer p-1">
                        {PETS_OPTIONS.map((option) => (
                          <button key={option.value} type="button" onClick={() => setFormData((prev) => ({ ...prev, pets: option.value }))} className={choiceClass(formData.pets === option.value)}>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="ml-2 text-sm font-semibold text-ink">Ambiance</p>
                    <div className="flex flex-wrap gap-3">
                      {COLLOC_LIFE_OPTIONS.map((option) => (
                        <button key={option.value} type="button" onClick={() => setFormData((prev) => ({ ...prev, coloc_type: option.value }))} className={chipClass(formData.coloc_type === option.value)}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <textarea
                      name="atmosphere"
                      value={formData.atmosphere}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-[1.25rem] border-none bg-surfaceContainer px-6 py-4 text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:ring-2 focus:ring-primaryContainer"
                      placeholder="Plutôt studieux, calme, festif ?"
                    />
                  </div>

                  <div className="space-y-4">
                    <p className="ml-2 text-sm font-semibold text-ink">Nos valeurs en coloc</p>
                    <div className="flex flex-wrap gap-2">
                      {VALEURS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggle(setValeurs, opt.value)}
                          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
                            valeurs.includes(opt.value)
                              ? 'border-primary bg-primaryContainer/20 text-primary'
                              : 'border-primary/20 bg-surfaceContainer text-ink hover:bg-primaryContainer/10'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {valeurs.includes(opt.value) ? 'check_circle' : 'circle'}
                          </span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[2rem] bg-gradient-to-br from-[#EEF8FF] to-[#D6EFFC] p-6 shadow-[0_40px_40px_rgba(38,48,53,0.05)] md:p-10 border border-[#83DEFF]/30 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                      <span className="material-symbols-outlined text-primary">volunteer_activism</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Ouverture solidaire</p>
                      <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">Votre ouverture</h2>
                    </div>
                  </div>
                  <p className="mb-8 max-w-2xl font-body text-sm text-muted md:text-base">
                    Toit à Toit est né pour créer des ponts. Cochez les profils avec lesquels vous seriez ravis de cohabiter pour un impact positif.
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {OUVERTURE_OPTIONS.map((opt) => (
                      <label key={opt.value} className="flex cursor-pointer items-center gap-4 rounded-[1.25rem] bg-white/60 px-4 py-4 transition-colors hover:bg-white">
                        <input type="checkbox" checked={ouverture.includes(opt.value)} onChange={() => toggle(setOuverture, opt.value)} className="h-6 w-6 rounded-full border-none bg-surfaceContainer text-primary focus:ring-primary" />
                        <span className="text-sm font-medium text-ink">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-10">
                  <span className="material-symbols-outlined text-[200px]">diversity_1</span>
                </div>
              </section>

              <section className="rounded-[2rem] bg-surface p-6 shadow-[0_40px_40px_rgba(38,48,53,0.05)] md:p-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondaryContainer text-ink">
                    <span className="material-symbols-outlined text-[22px]">location_on</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Localisation</p>
                    <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">Où se trouve le logement ?</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2 space-y-2">
                    <label htmlFor="address" className="ml-2 text-sm font-semibold text-ink">Adresse exacte</label>
                    <input id="address" type="text" name="address" value={formData.address} onChange={handleChange} className="w-full rounded-full border-none bg-surfaceContainer px-6 py-4 text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:ring-2 focus:ring-primaryContainer" placeholder="123 rue de la Paix" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="city" className="ml-2 text-sm font-semibold text-ink">Ville *</label>
                    <input id="city" type="text" name="city" value={formData.city} onChange={handleChange} className="w-full rounded-full border-none bg-surfaceContainer px-6 py-4 text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:ring-2 focus:ring-primaryContainer" placeholder="Lyon" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="postal_code" className="ml-2 text-sm font-semibold text-ink">Code postal *</label>
                    <input id="postal_code" type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} className="w-full rounded-full border-none bg-surfaceContainer px-6 py-4 text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:ring-2 focus:ring-primaryContainer" placeholder="69000" required />
                  </div>
                </div>

                <div className="mt-8 rounded-[1.25rem] bg-surfaceContainer p-4 shadow-inner">
                  <div className="relative h-64 overflow-hidden rounded-[1rem] bg-surfaceContainer">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,112,159,0.12),transparent_0_35%),radial-gradient(circle_at_80%_30%,rgba(131,222,255,0.2),transparent_0_35%),linear-gradient(135deg,#eef8ff_0%,#ddeaf2_100%)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-primary p-4 text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined">push_pin</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {error ? (
                <div role="alert" aria-live="assertive" className="rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-4 pt-2 md:flex-row">
                <Button type="button" size="lg" variant="primary" disabled={loading} className="flex-1 py-5 text-lg font-bold" onClick={() => submitListing('PUBLISHED')}>
                  {loading ? 'Publication en cours…' : "Publier l'annonce"}
                </Button>
                <Button type="button" size="lg" variant="ghost" disabled={loading} className="flex-1 py-5 text-lg font-bold" onClick={() => submitListing('DRAFT')}>
                  Enregistrer en brouillon
                </Button>
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-28 space-y-8">
                <div className="rounded-[1.25rem] border border-primary/5 bg-primaryContainer/10 p-8 space-y-4 shadow-soft">
                  <div className="flex items-center gap-3 text-primary">
                    <span className="material-symbols-outlined">lightbulb</span>
                    <h3 className="font-display text-lg font-bold">Conseil: Soyez authentique</h3>
                  </div>
                  <p className="quote-style text-base italic leading-relaxed text-muted">
                    "Les annonces qui décrivent l'ambiance et les petits rituels du quotidien reçoivent en moyenne 3x plus de réponses."
                  </p>
                  <p className="text-sm leading-relaxed text-muted/80">
                    N'hésitez pas à mentionner votre passion pour le café du matin ou vos playlists du dimanche.
                  </p>
                </div>

                <div className="rounded-[1.25rem] border border-secondary/5 bg-secondaryContainer/20 p-8 space-y-4 shadow-soft">
                  <div className="flex items-center gap-3 text-secondary">
                    <span className="material-symbols-outlined">stars</span>
                    <h3 className="font-display text-lg font-bold">Côté solidaire</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">
                    Toit à Toit valorise l'ouverture. En cochant les options solidaires, votre annonce sera mise en avant auprès de profils qui cherchent plus qu'un simple toit : une vraie rencontre humaine.
                  </p>
                </div>

                <div className="rounded-[1.25rem] bg-surface p-8 space-y-6 shadow-[0_20px_30px_rgba(38,48,53,0.04)]">
                  <h3 className="font-display text-xl font-bold text-ink">Votre profil Toit à Toit</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full bg-surfaceContainer">
                      <div className="flex h-full w-full items-center justify-center bg-primaryContainer text-ink">
                        <span className="material-symbols-outlined text-[28px]">person</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-ink">Clara M.</p>
                      <p className="text-sm font-medium text-primary">Hôte Solidaire</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-[1rem] bg-surface p-4 text-center">
                      <p className="text-2xl font-bold text-primary">100%</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Confiance</p>
                    </div>
                    <div className="rounded-[1rem] bg-surface p-4 text-center">
                      <p className="text-2xl font-bold text-primary">24h</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Rép. Moyenne</p>
                    </div>
                  </div>
                  {photoFiles.length > 0 ? (
                    <div className="rounded-[1rem] bg-surfaceContainer p-4 text-sm text-ink">
                      {photoFiles.length} photo{photoFiles.length > 1 ? 's' : ''} ajoutée{photoFiles.length > 1 ? 's' : ''} depuis votre ordinateur.
                    </div>
                  ) : null}
                </div>
              </div>
            </aside>
          </form>
        </div>
      </div>
    </PageShell>
  );
};

export default PublierAnnonce;
