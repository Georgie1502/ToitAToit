import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button, Logo } from '../atoms';
import { getCurrentUser, logout } from '../../services/auth';

const linkBase =
  'text-sm font-semibold text-muted transition duration-150 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primaryContainer rounded-full px-3 py-1.5';

const NavBar = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAssociation = user?.role === 'ASSOCIATION';
  const isOwner = user?.role === 'OWNER';
  const isSeeker = user?.role === 'SEEKER';

  const navLinks = isAssociation
    ? [
        { label: 'Tableau de bord', to: '/admin' },
        { label: 'Messages', to: '/messages' },
      ]
    : [
        { label: 'Rechercher', to: '/recherche' },
        { label: 'Comment ça marche', to: '/onboarding' },
        { label: 'Sécurité', to: '/securite' },
        ...(isOwner ? [{ label: 'Mes annonces', to: '/mes-annonces' }] : []),
        ...(isSeeker ? [{ label: 'Mes demandes', to: '/mes-demandes' }] : []),
        ...(user ? [{ label: 'Messages', to: '/messages' }] : []),
      ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-20 border-b border-ink/5 bg-background/70 backdrop-blur-xl">
      <div className="container flex w-full items-center justify-between px-4 py-4">
        <Logo />

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-1 md:flex">
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

        {/* Actions desktop */}
        <div className="hidden items-center gap-2 md:flex">
          {isOwner ? (
            <Button as={NavLink} size="sm" variant="secondary" to="/publier">
              Publier une annonce
            </Button>
          ) : !user ? (
            <Button as={NavLink} size="sm" variant="secondary" to="/login">
              Connexion
            </Button>
          ) : null}
          {user ? (
            <Button size="sm" variant="ghost" type="button" onClick={handleLogout}>
              Déconnexion
            </Button>
          ) : null}
        </div>

        {/* Bouton hamburger mobile */}
        <button
          type="button"
          className="rounded-full p-2 text-muted transition hover:bg-surfaceContainer hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primaryContainer md:hidden"
          aria-label={mobileOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-2xl leading-none">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Panneau de navigation mobile */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Menu principal"
          className="border-t border-ink/5 bg-background/95 backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink className={`${linkBase} block py-2`} to={link.to} onClick={closeMobile}>
                  {link.label}
                </NavLink>
              </li>
            ))}
            {user ? (
              <li>
                <NavLink className={`${linkBase} block py-2`} to="/profile" onClick={closeMobile}>
                  Mon profil
                </NavLink>
              </li>
            ) : null}
            <li className="pt-2">
              {isOwner ? (
                <Button as={NavLink} size="sm" variant="secondary" to="/publier" onClick={closeMobile}>
                  Publier une annonce
                </Button>
              ) : !user ? (
                <Button as={NavLink} size="sm" variant="primary" to="/login" onClick={closeMobile}>
                  Connexion
                </Button>
              ) : null}
            </li>
            {user ? (
              <li>
                <Button size="sm" variant="ghost" type="button" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </li>
            ) : null}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default NavBar;
