# Wash Auto 78 — site statique

Généré par **studio-master** — preset `ecume-nuit` (Écume de nuit), 15 sections, 3 page(s). HTML/CSS/JS purs, aucun build à l’exécution.

## Modifier

`site.config.mjs` est la source de vérité (identité, coordonnées, contenu de chaque section). Après modification :

```bash
npm run regen     # régénère les pages, assets/style.css et assets/app.js
npm start         # aperçu local sur http://localhost:4930
```

Les fichiers générés (`*.html`, `assets/style.css`, `assets/app.js`, `sitemap.xml`…) sont **écrasés** à chaque génération : ne pas les modifier à la main. Pour un ajustement propre à ce client, utiliser `css` dans la fiche ou `tokens` (surcharge de variables).

## À compléter avant la mise en ligne

- [ ] **Domaine** — `domain` absent de la fiche : canonical, Open Graph et `sitemap.xml` sont volontairement omis (une canonique fausse pénalise le SEO, son absence non).
- [ ] **Clé Web3Forms** — `web3formsKey` dans la fiche (https://web3forms.com). Tant qu’elle manque, le formulaire retombe sur `mailto:`.
- [ ] **E-mail de contact** — `business.email` vide : le repli `mailto:` n’a pas de destinataire.
- [ ] **Mentions légales** — champs « À compléter » sur : mentions-legales.html (page en `noindex` tant qu’il en reste). Compléter `legal` dans la fiche.
- [ ] **Avis** — aucune note affichée. N’en ajouter que si elle existe et est vérifiable (jamais d’avis inventé) ; sinon lier la fiche Google.
- [ ] **Avant / après** — n’utiliser que des photos réelles du client, même cadrage avant et après.
- [ ] **Adresse** — rue absente : la carte et le JSON-LD n’affichent pas d’adresse précise.
- [ ] **Contenu** — reprendre uniquement des informations vérifiées (site d’origine, fiche Google). Ne rien inventer : tarifs, avis, certifications, dates.
- [ ] **Ne pas ressembler à un site frère** — vérifier que palette + polices + motif diffèrent des autres sites clients du même secteur.

## Déploiement

Dossier statique tel quel sur Vercel (`vercel.json` désactive le build, active `cleanUrls`). Les images vont dans `assets/img/`.
