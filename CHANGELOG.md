# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).
Versionnage sémantique selon [SemVer](https://semver.org/lang/fr/).

Les nouvelles entrées sont insérées automatiquement par GitHub Actions à chaque merge sur `main`.

<!-- entrées automatiques -->

## [0.1.0] - 2026-05-09

### Ajouté
- Architecture microservices : Gateway, Users, Colocations, Messages
- Authentification JWT avec inscription, connexion et déconnexion
- Gestion des profils utilisateurs avec champ téléphone
- Annonces de colocation avec upload de photos
- Système de candidatures avec rôle ASSOCIATION
- Messagerie entre utilisateurs
- Interface React avec Tailwind CSS et Material UI
- Pipeline CI (tests + lint) et CD (images Docker sur ghcr.io)
- Configuration ESLint et Prettier
- Fichiers .env.example pour chaque service
