import { login, signup, logout, getCurrentUser } from '../auth';
import api from '../api';

jest.mock('../api', () => ({
  post: jest.fn(),
}));

// ─────────────────────────────────────────────
// login
// ─────────────────────────────────────────────
describe('auth.login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('appelle POST /api/auth/login avec email et password', async () => {
    api.post.mockResolvedValue({ data: { user: { id: '1', username: 'john', email: 'a@b.com' } } });

    await login({ email: 'a@b.com', password: 'pass' });

    expect(api.post).toHaveBeenCalledWith('/api/auth/login', { email: 'a@b.com', password: 'pass' });
  });

  it('stocke l\'utilisateur dans localStorage après connexion', async () => {
    const user = { id: '1', username: 'john', email: 'a@b.com' };
    api.post.mockResolvedValue({ data: { user } });

    await login({ email: 'a@b.com', password: 'pass' });

    expect(JSON.parse(localStorage.getItem('user'))).toEqual(user);
  });

  it('retourne l\'utilisateur connecté', async () => {
    const user = { id: '1', username: 'john', email: 'a@b.com' };
    api.post.mockResolvedValue({ data: { user } });

    const result = await login({ email: 'a@b.com', password: 'pass' });

    expect(result).toEqual(user);
  });

  it('ne stocke rien si la réponse ne contient pas de user', async () => {
    api.post.mockResolvedValue({ data: {} });

    await login({ email: 'a@b.com', password: 'pass' });

    expect(localStorage.getItem('user')).toBeNull();
  });

  it('propage l\'erreur si l\'API échoue', async () => {
    api.post.mockRejectedValue(new Error('Unauthorized'));

    await expect(login({ email: 'bad@b.com', password: 'wrong' })).rejects.toThrow('Unauthorized');
  });
});

// ─────────────────────────────────────────────
// signup
// ─────────────────────────────────────────────
describe('auth.signup', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appelle POST /api/auth/signup avec username, email et password', async () => {
    api.post.mockResolvedValue({ data: { message: 'Utilisateur inscrit avec succes' } });

    await signup({ username: 'john', email: 'a@b.com', password: 'pass' });

    expect(api.post).toHaveBeenCalledWith('/api/auth/signup', {
      username: 'john',
      email: 'a@b.com',
      password: 'pass',
    });
  });

  it('retourne le message de succès', async () => {
    api.post.mockResolvedValue({ data: { message: 'Utilisateur inscrit avec succes' } });

    const result = await signup({ username: 'john', email: 'a@b.com', password: 'pass' });

    expect(result).toBe('Utilisateur inscrit avec succes');
  });

  it('propage l\'erreur si l\'API échoue (email déjà utilisé)', async () => {
    api.post.mockRejectedValue({ response: { status: 409, data: { message: 'Email deja utilise' } } });

    await expect(signup({ username: 'john', email: 'taken@b.com', password: 'pass' })).rejects.toBeDefined();
  });
});

// ─────────────────────────────────────────────
// logout
// ─────────────────────────────────────────────
describe('auth.logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('user', JSON.stringify({ id: '1' }));
  });

  it('appelle POST /api/auth/logout', async () => {
    api.post.mockResolvedValue({});

    await logout();

    expect(api.post).toHaveBeenCalledWith('/api/auth/logout');
  });

  it('supprime l\'utilisateur du localStorage', async () => {
    api.post.mockResolvedValue({});

    await logout();

    expect(localStorage.getItem('user')).toBeNull();
  });

  it('supprime quand même le localStorage si l\'API échoue', async () => {
    api.post.mockRejectedValue(new Error('Network error'));

    await logout();

    expect(localStorage.getItem('user')).toBeNull();
  });
});

// ─────────────────────────────────────────────
// getCurrentUser
// ─────────────────────────────────────────────
describe('auth.getCurrentUser', () => {
  beforeEach(() => localStorage.clear());

  it('retourne null si rien dans le localStorage', () => {
    expect(getCurrentUser()).toBeNull();
  });

  it('retourne l\'utilisateur parsé depuis le localStorage', () => {
    const user = { id: '1', username: 'john' };
    localStorage.setItem('user', JSON.stringify(user));

    expect(getCurrentUser()).toEqual(user);
  });

  it('retourne null si le localStorage contient du JSON invalide', () => {
    localStorage.setItem('user', 'invalid-json{{{');

    expect(getCurrentUser()).toBeNull();
  });
});
