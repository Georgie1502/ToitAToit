import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import Logo from '../atoms/Logo';
import { getCurrentUser, logout } from '../../services/auth';

const linkBase =
  'text-sm font-semibold text-ink/70 transition hover:text-ink';

const NavBar = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Logo />
        <nav className="flex items-center gap-4">
          <NavLink className={linkBase} to="/">
            Accueil
          </NavLink>
          {user ? (
            <>
              <NavLink className={linkBase} to="/profile">
                Mon profil
              </NavLink>
              <Button size="sm" variant="ghost" type="button" onClick={handleLogout}>
                Deconnexion
              </Button>
            </>
          ) : (
            <>
              <NavLink className={linkBase} to="/login">
                Connexion
              </NavLink>
              <Button as={NavLink} size="sm" variant="primary" to="/signup">
                Creer un compte
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
