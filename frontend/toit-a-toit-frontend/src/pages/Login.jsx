import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import AuthField from '../components/molecules/AuthField';
import AuthLayout from '../components/templates/AuthLayout';
import { login } from '../services/auth';
import { getMyProfile } from '../services/profile';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      const data = await getMyProfile();
      const role = data?.profile?.role || null;
      if (!role) {
        navigate('/onboarding');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Retrouve tes conversations et tes favoris."
      footer={
        <>
          Pas encore de compte ? <Link className="font-semibold text-ink" to="/signup">Créer un compte</Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} aria-busy={loading}>
        <AuthField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          placeholder="vous@exemple.com"
        />
        <AuthField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          placeholder="********"
        />
        {error ? (
          <div role="alert" aria-live="assertive" className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
            {error}
          </div>
        ) : null}
        <Button type="submit" size="lg" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
