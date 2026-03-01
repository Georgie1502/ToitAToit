import { NavLink, useNavigate } from 'react-router-dom';
import { Button, Logo } from '../atoms';
import { getCurrentUser, logout } from '../../services/auth';

const linkBase =
  'text-sm font-semibold text-muted transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primaryHover rounded-full px-2 py-1';

const NavBar = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Comment ça marche', to: '/onboarding' },
    { label: 'Sécurité & confiance', to: '/securite' },
    ...(user ? [{ label: 'Mes annonces', to: '/mes-annonces' }] : []),
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="container flex w-full items-center justify-between px-4 py-4">
        <Logo />
        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} className={linkBase} to={link.to}>
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <NavLink className={linkBase} to="/profile">
              Mon profil
            </NavLink>
          ) : null}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button as={NavLink} size="sm" variant="primary" to="/">
            Trouver une colocation
          </Button>
          {user ? (
            <Button as={NavLink} size="sm" variant="secondary" to="/mes-annonces">
              Mes annonces
            </Button>
          ) : (
            <Button as={NavLink} size="sm" variant="secondary" to="/login">
              Connexion
            </Button>
          )}
          {user ? (
            <Button size="sm" variant="ghost" type="button" onClick={handleLogout}>
              Déconnexion
            </Button>
          ) : null}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <>
              <NavLink className={linkBase} to="/mes-annonces">
                Mes annonces
              </NavLink>
              <Button size="sm" variant="ghost" type="button" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <Button as={NavLink} size="sm" variant="primary" to="/login">
              Connexion
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
