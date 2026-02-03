import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/atoms/Button';
import AuthField from '../components/molecules/AuthField';
import AuthLayout from '../components/templates/AuthLayout';
import { signup } from '../services/auth';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const message = await signup({ username, email, password });
      setSuccess(message || 'Compte cree. Vous pouvez maintenant vous connecter.');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Inscription impossible. Reessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Creer un compte"
      subtitle="Rejoins la communaute et trouve ta colocation."
      footer={
        <>
          Deja un compte ? <Link className="font-semibold text-ink" to="/login">Se connecter</Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField
          label="Pseudo"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          autoComplete="name"
          placeholder="Camille"
        />
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
          autoComplete="new-password"
          placeholder="Minimum 8 caracteres"
        />
        {error ? <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">{error}</div> : null}
        {success ? <div className="rounded-2xl border border-teal/40 bg-teal/20 px-4 py-3 text-sm text-ink">{success}</div> : null}
        <Button type="submit" size="lg" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Creation...' : 'Creer mon compte'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
