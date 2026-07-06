# Structure du dossier lib/

Ce dossier suit un patron de "prises", comme des prises électriques. Chaque sous-dossier de `lib/` est un module branchable. L'application se branche sur un contrat, jamais sur une implémentation précise. On peut donc changer de fournisseur, ou n'en avoir aucun, sans toucher au code de l'app.

Un module a deux états possibles :
- non installé : on utilise un bouchon (stub) qui ne fait rien.
- installé : on utilise l'implémentation réelle d'un fournisseur.

## Modules branchables

`auth`, `database`, `payment`, `email`, `analytics`, `events`.

Chaque module a deux côtés séparés : `client` pour le navigateur, `server` pour le serveur. Un module peut n'avoir qu'un seul côté.

Pour un côté donné, les fichiers portent des noms fixes :

- `<côté>-type.ts` : le contrat. Uniquement des interfaces TypeScript. Exemple : `server-type.ts` définit `AuthAdapter`.
- `<côté>-stub.ts` : le bouchon. Implémentation neutre, utilisée quand le module n'est pas installé.
- `<côté>-<fournisseur>.ts` : l'implémentation réelle d'un fournisseur. Exemple : `server-better-auth.ts`, `server-supabase.ts`, `client-better-auth.ts`.
- `<côté>.ts` : le barrel, c'est-à-dire le point d'entrée unique. Il ré-exporte l'implémentation active. C'est le seul fichier que l'app a le droit d'importer.

## Règle du barrel

Le barrel pointe vers le bouchon par défaut, et vers le fournisseur seulement si le module est installé.

Exemple, `lib/auth/server.ts` quand auth est installé :

```ts
export * from "./server-better-auth"
```

S'il n'y avait pas de fournisseur, il ferait `export * from "./server-stub"`.

Le bloc ré-exporté est encadré par des marqueurs `@prise:<module>-<côté>`, pour qu'un générateur puisse le réécrire à l'installation.

## Noms d'export stables

Le bouchon et le fournisseur d'un même module exportent le même nom. Côté serveur c'est `authAdapter`, `databaseAdapter`, et ainsi de suite. Côté client ce sont les mêmes fonctions, comme `useSession` ou `signInEmail`. Grâce à ça, changer d'implémentation ne modifie jamais les imports de l'app.

## Ce que l'app importe

Toujours depuis le barrel, jamais depuis un fichier `-stub`, `-type` ou `-<fournisseur>`.

```ts
// correct
import { authAdapter } from "@/lib/auth/server"
import { signInEmail } from "@/lib/auth/client"

// à éviter
import { authAdapter } from "@/lib/auth/server-better-auth"
```

## Cas particuliers

- `events` : bus d'évènements. Variante plus légère, avec un contrat partagé `types.ts` que les deux côtés utilisent, plus `client.ts` (bus navigateur) et `server.ts` (bus mémoire côté serveur).
- `dashboard` : pas un module branchable. Juste des données d'interface, `nav.ts` et `breadcrumb.ts`.

## Fichiers à la racine de lib/

- `installed-modules.ts` : liste des modules installés, remplie par le générateur.
- `bootstrap.ts` : initialise les modules installés au démarrage.
- `utils.ts` : utilitaires génériques.

## Ajouter un fournisseur

1. Créer `lib/<module>/server-<fournisseur>.ts` qui implémente le contrat de `server-type.ts` et exporte le nom canonique, par exemple `authAdapter`.
2. Faire pointer le bloc `@prise` de `lib/<module>/server.ts` vers ce fichier.
3. Faire de même côté client si le module a une partie navigateur.

## Prise payment (Stripe)

Le module payment utilise Stripe pour gérer les abonnements.

Variables d'environnement requises :
- STRIPE_SECRET_KEY : la clé secrète de votre compte Stripe.
- STRIPE_WEBHOOK_SECRET : le secret du webhook fourni par Stripe.
- STRIPE_PRICE_PRO : l'ID du prix Pro dans votre compte Stripe.

URL du webhook : /api/payment/webhook. Doit être enregistrée dans votre dashboard Stripe.
