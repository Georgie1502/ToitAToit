# Contribuer a Toit a Toit

Merci de contribuer a la plateforme de colocation Toit a Toit ! Bug, idee ou feature : toute aide est la bienvenue. Ce guide explique comment signaler un probleme, ouvrir une branche et soumettre une pull request.

## Signalement d'anomalies

- Decrire le probleme clairement et concisemment.
- Fournir les etapes de reproduction.
- Indiquer le comportement attendu et le comportement observe.
- Ajouter captures d'ecran si utile.
- Preciser le contexte (version, horodatage, navigateur/OS ou environnement).

## Branches

1. Creer une issue (Kanban) decrivant le besoin.
2. Creer une branche depuis `main` : `feature/<id>-<sujet-court>` ou `fix/<id>-<sujet-court>` (ex. `feature/123-auth-jwt`).
3. Un seul sujet par branche.

Types de branches frequents :
- `feature` : nouvelle fonctionnalite
- `fix` : correctif
- `refactor` : amelioration sans changement fonctionnel
- `docs` : documentation

## Developpement

- Lire les READMEs locaux (gateway, services, frontend) pour les bonnes pratiques.
- Utiliser une syntaxe moderne (async/await, const/let) et garder le code lisible.
- Eviter de commit des secrets ; utiliser des `.env` et `.env.example`.

### Messages de commit

Suivre Conventional Commits :

- `feat`: nouvelle fonctionnalite
- `fix`: correctif
- `docs`: documentation
- `refactor`: refonte sans changement fonctionnel
- `test`: ajout/mise a jour de tests
- `chore`: taches annexes (deps, scripts)

Format recommande : `feat: description courte` ou `fix: corrige la validation JWT`.

## Tests

- Frontend : `npm test` (React Testing Library / Jest).
- Backend : ajouter des tests unitaires/integration par service (commandes a documenter dans chaque service).
- Ajouter/mettre a jour les tests pertinents avant la PR.

## Pull Request

1. Pousser la branche et ouvrir une PR vers `main`.
2. Decrire clairement les changements et l'issue liee (ex. "Closes #123").
3. Joindre, si possible, captures ou logs utiles.
4. Demander une revue. Corriger les retours avant fusion.

Merci de votre contribution : elle aide a faire evoluer Toit a Toit pour tous les colocataires !
