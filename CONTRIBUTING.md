# Contribuer à Toit à Toit

Merci de contribuer à la plateforme de colocation Toit à Toit ! Bug, idée ou feature : toute aide est la bienvenue. Ce guide explique comment signaler un problème, ouvrir une branche et soumettre une pull request.

## Signalement d'anomalies

- Décrire le problème clairement et concisément.
- Fournir les étapes de reproduction.
- Indiquer le comportement attendu et le comportement observé.
- Ajouter des captures d'écran si utile.
- Préciser le contexte (version, horodatage, navigateur/OS ou environnement).

## Branches

### Création automatique

À chaque ouverture d'issue sur GitHub, une branche est **créée automatiquement** par GitHub Actions si le titre de l'issue commence par un identifiant au format `TOIT-XXXX`.

```
Titre de l'issue : TOIT-1105 Ajout de la page recherche
→ Branche créée  : feat/TOIT-1105
```

Le workflow commente directement sur l'issue avec le nom de la branche créée.

### Format des branches

| Format | Exemple | Usage |
|---|---|---|
| `feat/TOIT-XXXX` | `feat/TOIT-1105` | Créée automatiquement depuis une issue |
| `fix/TOIT-XXXX` | `fix/TOIT-2001` | Correctif urgent créé manuellement |
| `docs/TOIT-XXXX` | `docs/TOIT-7001` | Documentation créée manuellement |

### Règles

1. Le titre de l'issue **doit** commencer par `TOIT-XXXX` pour déclencher la création automatique.
2. Un seul sujet par branche.
3. Toujours partir de `main` comme base.

## Développement

- Lire les READMEs locaux (gateway, services, frontend) pour les bonnes pratiques.
- Utiliser une syntaxe moderne (async/await, const/let) et garder le code lisible.
- Ne jamais committer de secrets ; utiliser des `.env` et `.env.example`.
- Respecter la configuration ESLint (`npm run lint`) et Prettier (`.prettierrc`).

## Messages de commit

Chaque message de commit **doit** commencer par un préfixe entre crochets. Ce préfixe détermine automatiquement le type de version incrémentée et la section générée dans le `CHANGELOG.md`.

### Format

```
[PRÉFIXE] Description courte et claire
```

### Préfixes disponibles

| Préfixe | Pour quoi | Impact sur la version |
|---|---|---|
| `[ADD]` | Nouvelle fonctionnalité | MINEUR `0.8.9 → 0.9.0` |
| `[FIX]` | Correction de bug | PATCH `0.8.9 → 0.8.10` |
| `[DESIGN]` | Interface / visuel | PATCH |
| `[REFACTOR]` | Refactorisation interne | PATCH |
| `[DOCS]` | Documentation | PATCH |
| `[TEST]` | Tests | PATCH |
| `[BREAKING]` | Changement non rétrocompatible | MAJEUR `0.8.9 → 1.0.0` |

### Règle de priorité

Si une PR contient plusieurs commits, le plus impactant l'emporte.
Exemple : 1 `[ADD]` + 3 `[FIX]` → version **MINEUR** incrémentée.

### Exemples

```bash
git commit -m "[ADD] Ajout de la page recherche avancée"
git commit -m "[FIX] Correction du bug de déconnexion automatique"
git commit -m "[DESIGN] Changement de couleur des badges de statut"
git commit -m "[REFACTOR] Centralisation du service d'appel API"
git commit -m "[TEST] Ajout des tests unitaires du contrôleur messages"
git commit -m "[DOCS] Mise à jour du README avec les nouvelles routes"
git commit -m "[BREAKING] Suppression de l'ancien endpoint /api/v1/users"
```

> **Règle d'or** : en lisant le message, on doit savoir exactement ce qui a changé.

> ⚠️ Un commit sans préfixe reconnu sera ignoré dans le CHANGELOG automatique.

### CHANGELOG automatique

À chaque merge sur `main`, GitHub Actions lit les messages de tous les commits, les catégorise et met à jour `CHANGELOG.md` automatiquement :

| Préfixe | Section dans le CHANGELOG |
|---|---|
| `[ADD]` | ### Ajouté |
| `[FIX]` | ### Corrigé |
| `[DESIGN]` | ### Modifié |
| `[REFACTOR]` | ### Refactorisé |
| `[DOCS]` | ### Documentation |
| `[TEST]` | ### Tests |
| `[BREAKING]` | ### Changements majeurs |

## Tests

Avant toute PR, s'assurer que tous les tests passent :

```bash
# Depuis la racine du projet
(cd backend/gateway && npm test)
(cd backend/users-service && npm test)
(cd backend/colocations-service && npm test)
(cd backend/messages-service && npm test)
(cd frontend/toit-a-toit-frontend && npm test -- --watchAll=false)
```

La couverture minimale exigée est de **70 %** par service backend. Ajouter ou mettre à jour les tests pertinents avant d'ouvrir une PR.

## Pull Request

1. Pousser la branche et ouvrir une PR vers `main`.
2. Décrire clairement les changements et l'issue liée (ex. `Closes #123`).
3. Joindre si possible captures ou logs utiles.
4. Demander une revue. Corriger les retours avant fusion.
5. Le CHANGELOG sera mis à jour automatiquement après le merge.

Merci de votre contribution : elle aide à faire évoluer Toit à Toit pour tous les colocataires !
