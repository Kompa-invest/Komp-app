# Générateur du Magazine Kompa

Le Magazine (`public/magazine/index.html`) est une page statique **générée** à partir de ces fichiers.
Ne modifiez pas `index.html` à la main : modifiez les sources ci-dessous, puis régénérez.

| Fichier | Rôle |
|---|---|
| `content.py` | Le contenu des éditions (N°1, N°2…) : textes, repères, mot de la semaine, sources |
| `charts.py` | Les graphiques de la semaine (style commun) |
| `glossary.py` | Les 30 notions du glossaire |
| `build.py` | Assemble le tout en une page |
| `style.css`, `app.js` | Le style et la navigation de la page |

## Régénérer

Depuis la racine du dépôt, avec Python 3 :

```
python3 outils/magazine/build.py public
```

Écrit `public/magazine/index.html`, qui utilise les photos de `public/magazine/img/`.
Sans l'argument `public`, produit un aperçu autonome `outils/magazine/apercu-magazine.html` (photos intégrées).

## Ajouter une édition

1. Ajouter `E[5]=dict(...)` dans `content.py`, sur le modèle des autres (même trame en 5 temps).
2. Si besoin, ajouter un graphique dans `charts.py` et sa photo dans `public/magazine/img/`.
3. Mettre à jour l'édition « à la une » et la date de l'en-tête dans `build.py` (recherche : `N°4`, `Lundi 28 septembre`).
4. Régénérer, vérifier l'aperçu, puis envoyer sur GitHub.
