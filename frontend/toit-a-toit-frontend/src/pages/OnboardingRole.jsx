import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms';
import { PageShell } from '../components/templates';
import { upsertMyProfile } from '../services/profile';

const roles = [
  {
    id: 'OWNER',
    title: 'Je propose une colocation',
    description: 'Tu as une chambre ou un logement et tu veux trouver des colocataires.',
    tag: 'Propriétaire',
  },
  {
    id: 'SEEKER',
    title: 'Je cherche une colocation',
    description: 'Tu veux rejoindre un logement et rencontrer des colocataires.',
    tag: 'Chercheur',
  },
];

const OnboardingRole = () => {
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!role) {
      setError('Choisis une option pour continuer.');
      return;
    }
    setLoading(true);
    try {
      await upsertMyProfile({ role });
      navigate(role === 'OWNER' ? '/onboarding/owner' : '/onboarding/seeker');
    } catch (err) {
      setError(err.response?.data?.message || "Impossible d'enregistrer le rôle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-3">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Onboarding</p>
          <h2 className="font-display text-4xl text-ink">Quelle est ton intention ?</h2>
          <p className="font-body text-base text-muted">
            Choisis ton rôle pour personnaliser ton expérience.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} aria-busy={loading}>
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((item) => (
              <label
                key={item.id}
                className={`cursor-pointer rounded-3xl p-7 shadow-soft transition duration-200 hover:scale-[1.01] ${
                  role === item.id
                    ? 'bg-primaryContainer/15 shadow-lift ring-2 ring-primary/40'
                    : 'bg-surface ring-1 ring-ink/8 hover:ring-primary/20'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={item.id}
                  checked={role === item.id}
                  onChange={() => setRole(item.id)}
                  className="sr-only"
                />
                <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-ink">
                  {item.tag}
                </span>
                <p className="mt-4 font-display text-xl text-ink">{item.title}</p>
                <p className="mt-2 font-body text-sm text-muted">{item.description}</p>
              </label>
            ))}
          </div>

          {error ? (
            <div role="alert" aria-live="assertive" className="rounded-3xl bg-danger/10 px-5 py-4 font-body text-sm text-danger">
              {error}
            </div>
          ) : null}

          <Button type="submit" size="lg" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Continuer →'}
          </Button>
        </form>
      </div>
    </PageShell>
  );
};

export default OnboardingRole;
