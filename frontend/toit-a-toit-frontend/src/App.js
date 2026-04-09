import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { NavBar } from './components';
import DemandesAnnonce from './pages/DemandesAnnonce';
import Home from './pages/Home';
import ListingDetails from './pages/ListingDetails';
import Login from './pages/Login';
import MesDemandes from './pages/MesDemandes';
import MyListings from './pages/MyListings';
import NotFound from './pages/NotFound';
import OnboardingOwner from './pages/OnboardingOwner';
import OnboardingRole from './pages/OnboardingRole';
import OnboardingSeeker from './pages/OnboardingSeeker';
import Profile from './pages/Profile';
import PublierAnnonce from './pages/PublierAnnonce';
import Recherche from './pages/Recherche';
import Securite from './pages/Securite';
import Signup from './pages/Signup';
import { getCurrentUser } from './services/auth';

const RequireAuth = ({ children }) => {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main-content">Aller au contenu principal</a>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main id="main-content" tabIndex="-1" className="flex-1 px-4 pt-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recherche" element={<Recherche />} />
            <Route path="/search" element={<Navigate to="/recherche" replace />} />
            <Route
              path="/publier"
              element={
                <RequireAuth>
                  <PublierAnnonce />
                </RequireAuth>
              }
            />
            <Route path="/publish" element={<Navigate to="/publier" replace />} />
            <Route path="/comment-ca-marche" element={<Navigate to="/onboarding" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/onboarding"
              element={
                <RequireAuth>
                  <OnboardingRole />
                </RequireAuth>
              }
            />
            <Route
              path="/onboarding/owner"
              element={
                <RequireAuth>
                  <OnboardingOwner />
                </RequireAuth>
              }
            />
            <Route
              path="/onboarding/seeker"
              element={
                <RequireAuth>
                  <OnboardingSeeker />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/mes-annonces"
              element={
                <RequireAuth>
                  <MyListings />
                </RequireAuth>
              }
            />
            <Route
              path="/annonces/:id"
              element={
                <RequireAuth>
                  <ListingDetails />
                </RequireAuth>
              }
            />
            <Route
              path="/annonces/:id/demandes"
              element={
                <RequireAuth>
                  <DemandesAnnonce />
                </RequireAuth>
              }
            />
            <Route
              path="/mes-demandes"
              element={
                <RequireAuth>
                  <MesDemandes />
                </RequireAuth>
              }
            />
            <Route path="/securite" element={<Securite />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
