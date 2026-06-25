# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).
Versionnage sémantique selon [SemVer](https://semver.org/lang/fr/).

Les nouvelles entrées sont insérées automatiquement par GitHub Actions à chaque merge sur `main`.

<!-- entrées automatiques -->

## [0.11.2] - 2026-06-25

### Documentation
- **changelog**: update CHANGELOG for v0.11.1 (#140)


## [0.11.1] - 2026-06-23

### Corrigé
- **health-check**: augmenter le temps d'attente et gérer les erreurs de réponse (#139)

### Documentation
- **changelog**: update CHANGELOG for v0.11.0 (#132)


## [0.11.0] - 2026-06-22

### Ajouté
- **supervision**: ajouter les endpoints /health, Uptime Kuma et le workflow de surveillance automatique (#131)

### Documentation
- **changelog**: update CHANGELOG for v0.10.1 (#129)


## [0.10.1] - 2026-06-16

### Documentation
- **changelog**: update CHANGELOG for v0.10.0 (#110)


## [0.10.0] - 2026-06-16

### Ajouté
- **deps**: configurer dependabot et corriger les vulnérabilités de sécurité npm (#109)


## [0.9.1] - 2026-05-28

### Corrigé
- **preferences**: corriger l'erreur 400 lors de la sauvegarde avec budget_min > budget_max (#66)

### Documentation
- **changelog**: update CHANGELOG for v0.9.0 (#65)


## [0.9.0] - 2026-05-28

### Ajouté
- **listings**: supprimer le champ statut trompeur et ajouter un écran de confirmation (#64)

### Documentation
- **changelog**: update CHANGELOG for v0.8.0 (#61)


## [0.8.0] - 2026-05-28

### Ajouté
- **listings**: ajouter la récupération des annonces de l'utilisateur connecté (#60)

### Documentation
- **changelog**: update CHANGELOG for v0.7.2 (#57)


## [0.7.2] - 2026-05-22

### Documentation
- ajouter des modèles pour les rapports de bogues et les demandes de fonctionnalités, et mettre à jour le modèle de PR (#56)
- **changelog**: update CHANGELOG for v0.7.1 (#54)


## [0.7.1] - 2026-05-22

### Corrigé
- mettre à jour les workflows CI/CD pour inclure la construction Docker et restreindre les branches de déclenchement (#53)

### Documentation
- **changelog**: update CHANGELOG for v0.7.0 (#51)


## [0.7.0] - 2026-05-22

### Ajouté
- ajouter la validation des titres de PR et configurer commitlint (#50)


## [0.6.1] - 2026-05-22

### Corrigé
- Ignorer les modifications du fichier CHANGELOG.md lors des pushs

### Documentation
- CHANGELOG mis à jour pour v0.5.0 (#43)


## [0.5.0] - 2026-05-20

### Ajouté
- Ajout de tests pour les contrôleurs de colocations, favoris et matchs

### Corrigé
- Utilisation de l'option --force lors du push de la branche pour le CHANGELOG
- Mise à jour du workflow de génération du CHANGELOG pour créer une branche et une PR automatiquement

### Documentation
- Mise à jour du guide de contribution pour clarifier le format des titres d'issues et les types d'issues
## [0.6.0] - 2026-05-21

### Ajouté
- Menu de navigation mobile dans le composant NavBar
- Ajout d'un audit des dépendances

### Corrigé
- Correction vulnérabilités path-to-regexp/qs et ajustement seuil audit frontend CRA


## [0.4.5] - 2026-05-15

### Corrigé
- Mettre à jour les fichiers .env.example avec des valeurs par défaut génériques


## [0.4.4] - 2026-05-14

### Corrigé
- Mettre à jour la commande de lint pour ne pas autoriser d'avertissements


## [0.4.3] - 2026-05-14

### Corrigé
- Corriger l'affichage du message de succès CI et ajuster la commande de lint


## [0.4.2] - 2026-05-14

### Corrigé
- Réorganiser les exportations de couleurs et supprimer l'importation inutile du bouton dans Messages.jsx


## [0.4.1] - 2026-05-14

### Corrigé
- Corriger les messages et commentaires dans le code pour une meilleure lisibilité


## [0.4.0] - 2026-05-14

### Ajouté
- Ajouter le déploiement du gateway sur Render et ajuster les tests de santé


## [0.3.0] - 2026-05-13

### Ajouté
- ajouter un workflow GitHub Actions pour la mise à jour automatique du CHANGELOG
- ajouter les package-lock.json pour gérer les dépendances et garantir des installations cohérentes

### Corrigé
- corriger le filtrage des tags pour la version sémantique dans le workflow CHANGELOG
- mettre à jour les métriques et rapports de couverture de code
- : mettre à jour la navigation et améliorer la gestion des candidatures dans l'administration
- Refornt de la page d'accueil

### Refactorisé
- Mettre à jour les horodatages de génération de couverture dans les rapports de couverture

### Documentation
- CHANGELOG mis à jour pour v0.2.4
- Corriger la stratégie de branches pour qu'elle soit cohérente avec le workflow automatique
- CHANGELOG mis à jour pour v0.2.3
- Mettre à jour CONTRIBUTING avec la nouvelle convention de commits
- CHANGELOG mis à jour pour v0.2.2
- CHANGELOG mis à jour pour v0.2.1
- Corriger les entrées malformées dans le CHANGELOG v0.2.0
- CHANGELOG mis à jour pour v0.2.0


## [0.2.4] - 2026-05-11

### Documentation
- Corriger la stratégie de branches pour qu'elle soit cohérente avec le workflow automatique


## [0.2.3] - 2026-05-09

### Documentation
- Mettre à jour CONTRIBUTING avec la nouvelle convention de commits


## [0.2.2] - 2026-05-09

### Refactorisé
- Mettre à jour les horodatages de génération de couverture dans les rapports de couverture


## [0.2.1] - 2026-05-09

### Documentation
- Corriger les entrées malformées dans le CHANGELOG v0.2.0


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
