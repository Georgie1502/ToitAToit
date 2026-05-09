# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).
Versionnage sémantique selon [SemVer](https://semver.org/lang/fr/).

Les nouvelles entrées sont insérées automatiquement par GitHub Actions à chaque merge sur `main`.

<!-- entrées automatiques -->

## [0.2.0] - 2026-05-09

### Ajouté
- ajouter un workflow GitHub Actions pour la mise à jour automatique du CHANGELOG
- ajouter les package-lock.json pour gérer les dépendances et garantir des installations cohérentes

### Corrigé
- corriger le filtrage des tags pour la version sémantique dans le workflow CHANGELOG
- mettre à jour les métriques et rapports de couverture de code
- Mettre à jour la navigation et améliorer la gestion des candidatures dans l'administration
- Refonte de la page d'accueil


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
