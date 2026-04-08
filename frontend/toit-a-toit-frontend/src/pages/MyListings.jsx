import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/atoms';
import { ListingCard } from '../components/molecules';
import { PageShell } from '../components/templates';
import { getCurrentUser } from '../services/auth';
import { deleteListing, listListings, updateListing } from '../services/colocations';

const field =
  'w-full rounded-full border border-ink/10 bg-surface px-5 py-3 font-body text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';
const fieldArea =
  'w-full rounded-3xl border border-ink/10 bg-surface px-5 py-3 font-body text-sm text-ink shadow-soft transition placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

const STATUSES = ['DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED'];

const MyListings = () => {
  const user = getCurrentUser();
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const myListings = useMemo(() => {
    if (!user) return [];
    return listings.filter((l) => l.owner_user_id === user.id);
  }, [listings, user]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const results = await Promise.all(STATUSES.map((s) => listListings({ status: s, limit: 200 })));
        const unique = Array.from(new Map(results.flat().map((i) => [i.id, i])).values());
        if (isMounted) setListings(unique);
      } catch {
        if (isMounted) setError('Impossible de charger vos annonces.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const startEdit = (listing) => {
    setEditingId(listing.id);
    setEditForm({
      title: listing.title || '', description: listing.description || '',
      rent_amount: listing.rent_amount ?? '', charges_included: Boolean(listing.charges_included),
      surface_m2: listing.surface_m2 ?? '', housing_type: listing.housing_type || '',
      available_from: listing.available_from ? listing.available_from.slice(0, 10) : '',
      available_to: listing.available_to ? listing.available_to.slice(0, 10) : '',
      min_duration_months: listing.min_duration_months ?? '', status: listing.status || 'DRAFT',
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUpdate = async (listingId) => {
    if (!editForm.title || !editForm.description || !editForm.rent_amount || !editForm.available_from) {
      setError('Merci de compléter les champs requis avant de sauvegarder.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const updated = await updateListing(listingId, {
        title: editForm.title, description: editForm.description,
        rent_amount: editForm.rent_amount, charges_included: editForm.charges_included,
        surface_m2: editForm.surface_m2 || null, housing_type: editForm.housing_type,
        available_from: editForm.available_from, available_to: editForm.available_to || '',
        min_duration_months: editForm.min_duration_months || null, status: editForm.status,
      });
      setListings((prev) => prev.map((i) => (i.id === listingId ? { ...i, ...updated } : i)));
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de modifier cette annonce.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    setSaving(true);
    setError('');
    try {
      await deleteListing(listingId);
      setListings((prev) => prev.filter((i) => i.id !== listingId));
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de supprimer cette annonce.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Mes annonces</p>
            <h2 className="font-display text-4xl text-ink">Vos colocations.</h2>
            <p className="font-body text-base text-muted">Consultez, modifiez ou supprimez vos annonces.</p>
          </div>
          <Button as={Link} to="/publier" size="md" variant="primary">+ Nouvelle annonce</Button>
        </div>

        {error ? (
          <div role="alert" aria-live="assertive" className="rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
            {error}
          </div>
        ) : null}

        {loading ? <p className="font-body text-sm text-muted">Chargement de vos annonces...</p> : null}

        {!loading && myListings.length === 0 ? (
          <div className="rounded-3xl bg-surface p-10 text-center shadow-soft">
            <p className="font-display text-xl text-ink">Aucune annonce</p>
            <p className="mt-2 font-body text-sm text-muted">Créez-en une depuis l'onboarding ou le bouton ci-dessus.</p>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          {myListings.map((listing) => (
            <div key={listing.id} className="space-y-4">
              <ListingCard
                listing={listing}
                actions={
                  <>
                    <Button as={Link} to={`/annonces/${listing.id}`} size="sm" variant="ghost">Voir</Button>
                    <Button as={Link} to={`/annonces/${listing.id}/demandes`} size="sm" variant="ghost">Candidatures</Button>
                    <Button type="button" size="sm" variant="primary" onClick={() => startEdit(listing)}>Modifier</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => handleDelete(listing.id)} disabled={saving}>Supprimer</Button>
                  </>
                }
              />

              {editingId === listing.id ? (
                <div className="rounded-3xl bg-surface p-7 shadow-soft">
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Modifier</p>
                  <h3 className="mt-1 font-display text-xl text-ink">Mettre à jour l'annonce</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink sm:col-span-2">
                      Titre
                      <input name="title" value={editForm.title || ''} onChange={handleEditChange} className={field} required />
                    </label>
                    <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink sm:col-span-2">
                      Description
                      <textarea name="description" value={editForm.description || ''} onChange={handleEditChange} rows={4} className={fieldArea} required />
                    </label>
                    <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                      Loyer (EUR)
                      <input type="number" name="rent_amount" value={editForm.rent_amount} onChange={handleEditChange} className={field} min="0" required />
                    </label>
                    <label className="flex items-center gap-3 font-body text-sm font-semibold text-ink">
                      <input type="checkbox" name="charges_included" checked={Boolean(editForm.charges_included)} onChange={handleEditChange} className="h-4 w-4 rounded text-primary" />
                      Charges incluses
                    </label>
                    <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                      Surface (m²)
                      <input type="number" name="surface_m2" value={editForm.surface_m2} onChange={handleEditChange} className={field} min="0" />
                    </label>
                    <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                      Type de logement
                      <select name="housing_type" value={editForm.housing_type} onChange={handleEditChange} className={field} required>
                        <option value="">Sélectionnez</option>
                        <option value="ROOM">Chambre</option>
                        <option value="STUDIO">Studio</option>
                        <option value="FLAT">Appartement</option>
                        <option value="HOUSE">Maison</option>
                        <option value="OTHER">Autre</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                      Disponible à partir du
                      <input type="date" name="available_from" value={editForm.available_from} onChange={handleEditChange} className={field} required />
                    </label>
                    <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                      Disponible jusqu'au
                      <input type="date" name="available_to" value={editForm.available_to} onChange={handleEditChange} className={field} />
                    </label>
                    <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                      Durée minimale (mois)
                      <input type="number" name="min_duration_months" value={editForm.min_duration_months} onChange={handleEditChange} className={field} min="0" />
                    </label>
                    <label className="flex flex-col gap-2 font-body text-sm font-semibold text-ink">
                      Statut
                      <select name="status" value={editForm.status} onChange={handleEditChange} className={field}>
                        <option value="DRAFT">Brouillon</option>
                        <option value="PUBLISHED">Publié</option>
                        <option value="PAUSED">En pause</option>
                        <option value="CLOSED">Fermé</option>
                      </select>
                    </label>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="primary" onClick={() => handleUpdate(listing.id)} disabled={saving}>
                      {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={cancelEdit}>Annuler</Button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

export default MyListings;
