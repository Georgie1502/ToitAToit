import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/atoms';
import { ListingCard } from '../components/molecules';
import { PageShell } from '../components/templates';
import { getCurrentUser } from '../services/auth';
import { deleteListing, listListings, updateListing } from '../services/colocations';

const fieldClassName =
  'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25';

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
    return listings.filter((listing) => listing.owner_user_id === user.id);
  }, [listings, user]);

  useEffect(() => {
    let isMounted = true;
    const loadListings = async () => {
      setLoading(true);
      setError('');
      try {
        const results = await Promise.all(
          STATUSES.map((status) => listListings({ status, limit: 200 })),
        );
        const merged = results.flat();
        const unique = Array.from(new Map(merged.map((item) => [item.id, item])).values());
        if (isMounted) {
          setListings(unique);
        }
      } catch (err) {
        if (isMounted) {
          setError("Impossible de charger vos annonces.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadListings();
    return () => {
      isMounted = false;
    };
  }, []);

  const startEdit = (listing) => {
    setEditingId(listing.id);
    setEditForm({
      title: listing.title || '',
      description: listing.description || '',
      rent_amount: listing.rent_amount ?? '',
      charges_included: Boolean(listing.charges_included),
      surface_m2: listing.surface_m2 ?? '',
      housing_type: listing.housing_type || '',
      available_from: listing.available_from ? listing.available_from.slice(0, 10) : '',
      available_to: listing.available_to ? listing.available_to.slice(0, 10) : '',
      min_duration_months: listing.min_duration_months ?? '',
      status: listing.status || 'DRAFT',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async (listingId) => {
    if (!editForm.title || !editForm.description || !editForm.rent_amount || !editForm.available_from) {
      setError('Merci de completer les champs requis avant de sauvegarder.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: editForm.title,
        description: editForm.description,
        rent_amount: editForm.rent_amount,
        charges_included: editForm.charges_included,
        surface_m2: editForm.surface_m2 || null,
        housing_type: editForm.housing_type,
        available_from: editForm.available_from,
        available_to: editForm.available_to || '',
        min_duration_months: editForm.min_duration_months || null,
        status: editForm.status,
      };
      const updated = await updateListing(listingId, payload);
      setListings((prev) => prev.map((item) => (item.id === listingId ? { ...item, ...updated } : item)));
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de modifier cette annonce.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (listingId) => {
    const confirmed = window.confirm('Supprimer cette annonce ?');
    if (!confirmed) return;
    setSaving(true);
    setError('');
    try {
      await deleteListing(listingId);
      setListings((prev) => prev.filter((item) => item.id !== listingId));
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de supprimer cette annonce.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[32px] bg-card p-8 shadow-lift ring-1 ring-border">
          <h2 className="font-display text-3xl text-ink">Mes annonces</h2>
          <p className="mt-3 text-sm text-muted">
            Consultez, modifiez ou supprimez vos annonces de colocation.
          </p>
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

        {loading ? <p className="text-sm text-muted">Chargement de vos annonces...</p> : null}

        {!loading && myListings.length === 0 ? (
          <div className="rounded-[32px] bg-card p-6 text-sm text-muted shadow-soft ring-1 ring-border">
            Vous n'avez pas encore d'annonce. Créez-en une depuis l'onboarding owner.
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          {myListings.map((listing) => (
            <div key={listing.id} className="space-y-4">
              <ListingCard
                listing={listing}
                actions={
                  <>
                    <Button as={Link} to={`/annonces/${listing.id}`} size="sm" variant="ghost">
                      Voir
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={() => startEdit(listing)}
                    >
                      Modifier
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(listing.id)}
                      disabled={saving}
                    >
                      Supprimer
                    </Button>
                  </>
                }
              />

              {editingId === listing.id ? (
                <div className="rounded-[32px] bg-card p-6 shadow-soft ring-1 ring-border">
                  <h3 className="text-lg font-semibold text-ink">Modifier l'annonce</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm font-semibold text-ink sm:col-span-2">
                      Titre
                      <input
                        name="title"
                        value={editForm.title || ''}
                        onChange={handleEditChange}
                        className={fieldClassName}
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-ink sm:col-span-2">
                      Description
                      <textarea
                        name="description"
                        value={editForm.description || ''}
                        onChange={handleEditChange}
                        rows={4}
                        className={fieldClassName}
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                      Loyer (EUR)
                      <input
                        type="number"
                        name="rent_amount"
                        value={editForm.rent_amount}
                        onChange={handleEditChange}
                        className={fieldClassName}
                        min="0"
                        required
                      />
                    </label>
                    <label className="flex items-center gap-3 text-sm font-semibold text-ink">
                      <input
                        type="checkbox"
                        name="charges_included"
                        checked={Boolean(editForm.charges_included)}
                        onChange={handleEditChange}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      Charges incluses
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                      Surface (m2)
                      <input
                        type="number"
                        name="surface_m2"
                        value={editForm.surface_m2}
                        onChange={handleEditChange}
                        className={fieldClassName}
                        min="0"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                      Type de logement
                      <select
                        name="housing_type"
                        value={editForm.housing_type}
                        onChange={handleEditChange}
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
                        value={editForm.available_from}
                        onChange={handleEditChange}
                        className={fieldClassName}
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                      Disponible jusqu'au
                      <input
                        type="date"
                        name="available_to"
                        value={editForm.available_to}
                        onChange={handleEditChange}
                        className={fieldClassName}
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                      Duree minimale (mois)
                      <input
                        type="number"
                        name="min_duration_months"
                        value={editForm.min_duration_months}
                        onChange={handleEditChange}
                        className={fieldClassName}
                        min="0"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                      Statut
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        className={fieldClassName}
                      >
                        <option value="DRAFT">Brouillon</option>
                        <option value="PUBLISHED">Publie</option>
                        <option value="PAUSED">En pause</option>
                        <option value="CLOSED">Ferme</option>
                      </select>
                    </label>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="primary" onClick={() => handleUpdate(listing.id)} disabled={saving}>
                      {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={cancelEdit}>
                      Annuler
                    </Button>
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
