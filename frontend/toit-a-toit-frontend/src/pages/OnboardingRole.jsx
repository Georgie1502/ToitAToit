import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import PageShell from '../components/templates/PageShell';
import { upsertMyProfile } from '../services/profile';

const roles = [
  {
    id: 'OWNER',
    title: 'Je propose une colocation',
    description: 'Tu as une chambre ou un logement et tu veux trouver des colocataires.',
  },
  {
    id: 'SEEKER',
    title: 'Je cherche une colocation',
    description: 'Tu veux rejoindre un logement et rencontrer des colocataires.',
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
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || "Impossible d'enregistrer le role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl rounded-[32px] bg-white/90 p-8 shadow-lift ring-1 ring-ink/5">
        <h2 className="font-display text-3xl text-ink">Onboarding</h2>
        <p className="mt-3 text-sm text-ink/70">
          Choisis ton intention principale pour personaliser ton experience.
        </p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} aria-busy={loading}>
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((item) => (
              <label
                key={item.id}
                className={`cursor-pointer rounded-3xl border px-5 py-6 transition ${
                  role === item.id
                    ? 'border-ink bg-sky/50 shadow-soft'
                    : 'border-ink/10 bg-white/70 hover:border-ink/30'
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
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">{item.id}</p>
                <p className="mt-3 text-lg font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-sm text-ink/70">{item.description}</p>
              </label>
            ))}
          </div>
          {error ? (
            <div role="alert" aria-live="assertive" className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
              {error}
            </div>
          ) : null}
          <Button type="submit" size="lg" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Continuer'}
          </Button>
        </form>
      </div>
    </PageShell>
  );
};

export default OnboardingRole;
