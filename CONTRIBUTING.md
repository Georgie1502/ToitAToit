# Contribuer à Toit à Toit

Merci de contribuer à la plateforme Toit à Toit ! Bug, idée ou feature : toute aide est la bienvenue. Ce guide explique comment signaler un problème, ouvrir une branche et soumettre une pull request.

## Création d'une issue

### Format du titre

Le titre de l'issue **doit** commencer par un identifiant au format `TOIT-XXXX` suivi d'une description courte :

```
TOIT-XXXX Description courte et claire
```

Exemples :

```
TOIT-1105 Ajout de la page recherche
TOIT-2001 Correction du bug de déconnexion
TOIT-7001 Mise à jour du README gateway
```

> Si le titre ne respecte pas ce format, la création automatique de branche échouera. Le workflow commentera l'issue pour vous en informer.

### Types d'issues

| Type | Quand l'utiliser |
|---|---|
| feat | Nouvelle fonctionnalité ou amélioration |
| fix | Comportement inattendu ou erreur |
| docs | Documentation manquante ou incorrecte |
| refactor | Restructuration du code sans changement de comportement |
| test | Ajout ou correction de tests |

### Contenu

- Décrire le problème ou la fonctionnalité clairement et concisément.
- Pour un bug : fournir les étapes de reproduction, le comportement attendu et le comportement observé.
- Ajouter des captures d'écran si utile.
- Préciser le contexte (version, navigateur/OS ou environnement).

## Branches

À chaque ouverture d'issue avec un titre au bon format, GitHub Actions crée automatiquement une branche et commente sur l'issue :

```
Titre de l'issue : TOIT-1105 Ajout de la page recherche
→ Branche créée  : feat/TOIT-1105
```

Pour les branches créées **manuellement**, ajouter une description courte :

```
feat/TOIT-1105-page-recherche
fix/TOIT-2001-bug-deconnexion
docs/TOIT-7001-readme-gateway
refactor/TOIT-3001-simplify-auth
test/TOIT-4001-integration-gateway
```

### Format

| Préfixe | Usage |
|---|---|
| `feat/TOIT-XXXX` | Nouvelle fonctionnalité (créée automatiquement depuis une issue) |
| `feat/TOIT-XXXX-description` | Nouvelle fonctionnalité (créée manuellement) |
| `fix/TOIT-XXXX-description` | Correctif |
| `docs/TOIT-XXXX-description` | Documentation |
| `refactor/TOIT-XXXX-description` | Refactorisation |
| `test/TOIT-XXXX-description` | Tests |

### Règles

- Un seul sujet par branche.
- Toujours partir de `main` comme base.
- Ouvrir la PR en **Draft** dès le premier commit pour signaler le travail en cours.
- Cibler moins de 400 lignes modifiées par PR.

## Installation locale

Depuis la racine du projet, installer les dépendances (dont husky pour les hooks git) :

```bash
npm install
```

> Cette commande installe automatiquement les hooks git via husky. Toute tentative de commit avec un message invalide sera bloquée localement.

## Gestion des dépendances

### Surveillance des versions

Les mises à jour de dépendances sont surveillées automatiquement par **Dependabot** :

| Écosystème | Périmètre | Fréquence |
|---|---|---|
| npm | racine, frontend, gateway, users-service, colocations-service, messages-service | hebdomadaire (lundi) |
| Docker | tous les services | mensuelle |
| GitHub Actions | workflows CI/CD | mensuelle |

Dependabot ouvre une PR distincte par dépendance mise à jour, avec le label `dependencies`.

### Process de mise à jour

Toute mise à jour de dépendance - qu'elle vienne de Dependabot ou d'une initiative manuelle - suit ce processus :

```
Détection → Évaluation de l'impact → Validation CI → Merge
```

**1. Détection**

Dependabot ouvre automatiquement une PR. Pour vérifier manuellement l'état des dépendances :

```bash
# Lister les dépendances obsolètes d'un service
(cd backend/users-service && npm outdated)
(cd backend/colocations-service && npm outdated)
(cd backend/messages-service && npm outdated)
(cd backend/gateway && npm outdated)
(cd frontend/toit-a-toit-frontend && npm outdated)
```

**2. Évaluation de l'impact**

Avant d'approuver ou d'ouvrir une PR de mise à jour, évaluer :

- **Type de version** - patch (`1.0.x`) : risque faible ; minor (`1.x.0`) : vérifier le changelog ; major (`x.0.0`) : revue approfondie obligatoire.
- **Audit de sécurité** - consulter le rapport d'audit généré par le CI ou le lancer manuellement :

```bash
(cd backend/users-service && npm audit)
(cd frontend/toit-a-toit-frontend && npm audit)
```

- **Changelog de la bibliothèque** - identifier les breaking changes ou dépréciations.
- **Tests impactés** - relancer la suite de tests du service concerné (voir section [Tests](#tests)).

**3. Validation CI**

Le CI vérifie automatiquement chaque PR de dépendance :

- `npm audit --audit-level=high` (backends) / `--audit-level=critical` (frontend)
- Lint + suite de tests complète du service concerné
- Build Docker de validation

Une PR de mise à jour ne peut être mergée que si **le CI est entièrement vert**.

**4. Merge**

Appliquer les mêmes règles qu'une PR standard :
- Titre au format Conventional Commits : `chore(deps): update express to v5.1.0`
- Minimum 1 approbation.
- Squash merge uniquement.

### Critères d'acceptation / refus

| Situation | Décision |
|---|---|
| Patch ou minor, CI vert, pas de breaking change | Accepter |
| Major avec breaking changes documentés et tests adaptés | Accepter après revue |
| Vulnérabilité critique non corrigée par la mise à jour | Bloquer, ouvrir une issue |
| CI rouge après mise à jour | Refuser, investiguer avant merge |

## Messages de commit

Le projet suit la convention **[Conventional Commits](https://www.conventionalcommits.org/)**, vérifiée automatiquement par commitlint et husky à chaque commit.

### Format

```
type(scope): description courte
```

- **type** - obligatoire, voir tableau ci-dessous
- **scope** - optionnel, nom du service ou du module concerné
- **description** - courte, en minuscules, sans point final

### Types disponibles

| Type | Usage | Impact version |
|---|---|---|
| `feat` | Nouvelle fonctionnalité | MINEUR `0.8.9 → 0.9.0` |
| `fix` | Correction de bug | PATCH `0.8.9 → 0.8.10` |
| `docs` | Documentation | PATCH |
| `refactor` | Refactorisation interne | PATCH |
| `test` | Ajout ou correction de tests | PATCH |
| `perf` | Amélioration de performance | PATCH |
| `style` | Mise en forme, CSS | PATCH |
| `chore` | Maintenance (dépendances, config) | aucun |
| `build` | Système de build, Docker | aucun |
| `ci` | Pipelines CI/CD | aucun |
| `feat!` ou `fix!` | Changement non rétrocompatible | MAJEUR `0.8.9 → 1.0.0` |

### Exemples valides

```bash
git commit -m "feat(frontend): add mobile navigation menu"
git commit -m "fix(gateway): resolve JWT timeout on long requests"
git commit -m "refactor(users): simplify password validation logic"
git commit -m "test(gateway): add integration tests for auth routes"
git commit -m "docs(readme): update setup instructions"
git commit -m "feat!: rename colocations-service to annonces-service"
```

### Exemples invalides (bloqués par husky)

```bash
git commit -m "fix typo"          # pas de type Conventional Commits
git commit -m "WIP"               # pas de type
git commit -m "Update stuff"      # pas de type, majuscule
git commit -m "[ADD] new feature" # ancien format, non reconnu
```

### Règle de priorité pour le versionnage

Si une PR contient plusieurs commits, le plus impactant l'emporte.
Exemple : 1 `feat` + 3 `fix` → version **MINEUR** incrémentée.

### CHANGELOG automatique

À chaque merge sur `main`, GitHub Actions lit les commits, les catégorise et met à jour `CHANGELOG.md` automatiquement :

| Type | Section dans le CHANGELOG |
|---|---|
| `feat` | Ajouté |
| `fix`, `perf` | Corrigé |
| `style` | Modifié |
| `refactor` | Refactorisé |
| `docs` | Documentation |
| `test` | Tests |
| `feat!`, `fix!` | Changements majeurs |
| `chore`, `build`, `ci` | non tracés dans le CHANGELOG |

## Titre de Pull Request

Le titre de la PR **doit** suivre le même format Conventional Commits - il deviendra le message du commit squash sur `main` :

```
feat(frontend): add mobile navigation menu
fix(gateway): resolve JWT timeout
refactor(users): simplify validation
```

Le CI valide automatiquement le titre avant tout merge.

## Tests

Avant toute PR, s'assurer que tous les tests passent :

```bash
(cd backend/gateway && npm test)
(cd backend/users-service && npm test)
(cd backend/colocations-service && npm test)
(cd backend/messages-service && npm test)
(cd frontend/toit-a-toit-frontend && npm test -- --watchAll=false)
```

La couverture minimale exigée est de **70 %** par service backend. Ajouter ou mettre à jour les tests pertinents avant d'ouvrir une PR.

## Pull Request

1. Ouvrir la PR en **Draft** dès le premier commit.
2. Passer en **Ready for review** uniquement quand le travail est terminé.
3. Décrire clairement les changements et lier l'issue (`Closes #123`).
4. Attendre que le CI soit vert avant de demander une revue.
5. Minimum **1 approbation** requise avant merge.
6. Merger en **Squash merge** uniquement.
7. Le CHANGELOG sera mis à jour automatiquement après le merge.

Merci de votre contribution !
