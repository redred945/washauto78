// ============================================================================
//  FICHE CLIENT — source de vérité d'un site généré par studio-master.
//
//  1. Copier ce fichier dans le dossier du site : C:\Users\Reda\Code\<slug>\site.config.mjs
//     (ou : node scripts/new.mjs <slug> --preset racing   qui le fait pour toi)
//  2. Remplir uniquement des informations VÉRIFIÉES (site d'origine, fiche Google, échange client).
//  3. node ../studio-master/generator/build.mjs site.config.mjs     (ou : npm run regen)
//
//  Chaque section reçoit `props` ; ce qui est omis reste vide (jamais de faux texte de remplissage).
//  Le catalogue (index.html de studio-master → « Sections ») liste toutes les sections et leurs props.
// ============================================================================

export default {
  slug: 'wash-auto-78',                       // dossier + nom du projet (ASCII, tirets)
  name: 'Wash Auto 78',                       // nom affiché
  lang: 'fr',
  domain: '',                                 // inconnu — pas de canonical ni de sitemap tant qu'il n'y en a pas
  preset: 'ecume-nuit',
  favicon: 'assets/img/logo.png',
  ogImage: 'assets/img/porsche-911-gt3rs.jpg',
  splash: { logo: 'assets/img/logo.png' },
  css: `
    /* logo détouré (fond transparent) : le reflet est masqué par sa propre silhouette au lieu d'un bloc rectangulaire */
    .bar__badge, .foot__brand-mark .bar__badge, .splash__mark { position: relative; overflow: visible; }
    .bar__badge::after, .foot__brand-mark .bar__badge::after, .splash__mark::after {
      content: ""; position: absolute; inset: 0;
      background: linear-gradient(115deg, transparent, color-mix(in srgb, var(--accent-2) 90%, white) 45%, color-mix(in srgb, var(--accent-b) 90%, white) 55%, transparent);
      background-size: 260% 260%; background-position: -80% 0;
      -webkit-mask-image: url('img/logo.png'); mask-image: url('img/logo.png');
      -webkit-mask-size: contain; mask-size: contain;
      -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
      -webkit-mask-position: center; mask-position: center;
      animation: shineSweepBg 2.6s ease-in-out infinite; animation-delay: 1.4s;
    }
    @keyframes shineSweepBg { 0%, 15% { background-position: -80% 0; } 55%, 100% { background-position: 180% 0; } }
    @media (prefers-reduced-motion: reduce) { .bar__badge::after, .foot__brand-mark .bar__badge::after, .splash__mark::after { animation: none; display: none; } }

    /* header : le logo (avec son propre lettrage) remplace l'icône + le nom en texte */
    .bar__brand .bar__badge { width: auto; height: 44px; background: none; border: none; box-shadow: none; border-radius: 0; }
    .bar__brand .bar__badge img { width: auto; height: 100%; object-fit: contain; }
    .bar__brand .bar__brand-word { display: none; }
  `,
  web3formsKey: 'A_COMPLETER_WEB3FORMS_KEY',

  business: {
    phone: '',                                // non public sur Instagram — à demander au client
    tel: '',
    email: '',                                // non public sur Instagram — à demander au client
    address: { street: '', zip: '', city: '', region: 'Yvelines' },   // zone déduite du compte (partenaire @auto.sqy.lavage) ; adresse précise à confirmer
    social: { facebook: '', instagram: 'https://www.instagram.com/wash_auto_78/' },
    hours: [],                                // aucun horaire public : activité sur rendez-vous uniquement
    // rating: { value: '4,8', count: '120', url: 'https://…', verified: true, checkedOn: '2026-09-26' },
  },

  legal: { owner: '', form: '', siret: '', tva: '', publisher: '' },   // alimente legal/mentions

  schema: { type: 'LocalBusiness', areaServed: 'Yvelines (78)' },

  pages: [
    {
      file: 'index.html',
      title: 'Wash Auto 78 — Lavage auto 100 % à la main dans les Yvelines',
      description: 'Wash Auto 78 : lavage automobile entièrement à la main dans les Yvelines (78). Extérieur, intérieur, céramique hybride. Sur rendez-vous.',
      sections: [
        ['header/pill', {
          brand: { name: 'WASH AUTO 78', sub: 'Lavage & Detailing · Yvelines (78)', logo: 'assets/img/logo.png' },
          nav: [{ label: 'Offre', href: '#services' }, { label: 'Tarifs', href: '#tarifs' }, { label: 'Galerie', href: '#galerie' }, { label: 'FAQ', href: '#faq' }, { label: 'Contact', href: 'contact.html' }],
          cta: { label: 'Nous écrire', href: 'contact.html' },
        }],
        ['hero/media', {
          image: 'assets/img/porsche-911-gt3rs.jpg',
          imageAlt: 'Porsche 911 GT3 RS après un lavage complet à la main par wash_auto_78',
          label: 'Lavage à la main · Yvelines (78)',
          title: 'Redonnez de l’éclat *à votre véhicule*',
          sub: 'Lavage extérieur, intérieur et finition céramique, réalisés entièrement à la main. Aucun portique, aucun rouleau : juste du soin, sur rendez-vous.',
          actions: [{ label: 'Nous écrire', href: 'contact.html', size: 'lg' }, { label: 'Voir les tarifs', href: '#tarifs', variant: 'ghost', size: 'lg' }],
          chips: ['100 % à la main', 'Sans micro-rayure', 'Sur rendez-vous'],
        }],
        ['stats/strip', { items: [{ value: '400', unit: '+', label: 'abonnés Instagram' }, { value: '100', unit: '%', label: 'lavage à la main' }, { value: '78', label: 'Yvelines' }] }],
        ['services/bento', {
          label: 'Notre offre', title: 'Ce que *nous faisons*', intro: 'Un lavage complet, à la main, pensé pour préserver la carrosserie.',
          cards: [
            { title: 'Lavage extérieur à la main', text: 'Prélavage, mousse active, décontamination des jantes, cire protectrice et finition anti-traces.', href: '#tarifs', size: 'lg', more: 'Voir le détail' },
            { title: 'Lavage intérieur complet', text: 'Aspiration complète, tapis et moquette, désinfection du volant et du tableau de bord, entretien cuirs et tissus.', href: '#tarifs', size: 'wide', tone: 'b' },
            { title: 'Céramique hybride', text: 'Protection longue durée en option : brillance et effet hydrophobe qui durent.', href: '#tarifs' },
            { title: 'Compartiment moteur', text: 'Nettoyage en option, pour un moteur aussi net que la carrosserie.', href: '#tarifs', tone: 'b' },
          ],
        }],
        ['compare/before-after', {
          id: 'avant-apres', label: 'Résultat', title: 'Le résultat, *sans filtre*', intro: 'Glissez le curseur : même véhicule, même emplacement, avant et après le lavage.',
          points: ['Photos réelles de nos passages', 'Même cadrage avant / après'],
          examples: [{ tab: 'Audi Q3', before: 'assets/img/ba-audi-q3-avant.jpg', after: 'assets/img/ba-audi-q3-apres.jpg', alt: 'Audi Q3 — lavage complet à la main' }],
        }],
        ['features/grid', { label: 'Pourquoi nous', title: 'Ce qui fait *la différence*', items: [
          { icon: 'shield', title: '100 % à la main', text: 'Aucun portique, aucun rouleau : chaque véhicule est lavé main pour préserver la peinture.' },
          { icon: 'clock', title: 'Sur rendez-vous', text: 'Un créneau qui vous convient, réponse rapide par message ou téléphone.' },
          { icon: 'spark', title: 'Finition céramique', text: 'Protection hydrophobe longue durée en option, pour une brillance qui dure.' },
          { icon: 'bag', title: 'Toutes les voitures', text: 'De la citadine à la sportive, la même exigence sur chaque lavage.' },
        ] }],
        ['gallery/grid', {
          id: 'galerie', label: 'Galerie', title: 'Nos derniers *passages*', intro: 'Un aperçu des véhicules confiés récemment.',
          images: [
            { src: 'assets/img/bmw-x5-50e.jpg', alt: 'BMW X5 50e après lavage complet' },
            { src: 'assets/img/renault-austral-alpine.jpg', alt: 'Renault Austral Esprit Alpine après lavage extérieur' },
            { src: 'assets/img/golf8-gti.jpg', alt: 'Golf 8 GTI après lavage complet' },
            { src: 'assets/img/tiguan-7places.jpg', alt: 'Volkswagen Tiguan 7 places après lavage complet' },
            { src: 'assets/img/audi-a4.jpg', alt: 'Audi A4 après lavage complet' },
            { src: 'assets/img/citroen-c3.jpg', alt: 'Citroën C3 après lavage complet' },
            { src: 'assets/img/ds3.jpg', alt: 'DS3 après lavage complet' },
            { src: 'assets/img/amarok.jpg', alt: 'Volkswagen Amarok après lavage complet' },
            { src: 'assets/img/bmw-x4-m40d-showroom.jpg', alt: 'BMW X4 M40d préparé pour un showroom' },
          ],
        }],
        ['pricing/lists', { label: 'Tarifs', title: 'Des prix *lisibles*', lists: [
          { title: 'Extérieur', rows: [{ label: 'Lavage complet à la main', sub: 'Prélavage, mousse active, jantes, vitres, cire, finition anti-traces, brillant pneus', price: '50€' }] },
          { title: 'Intérieur', rows: [{ label: 'Nettoyage complet de l’habitacle', sub: 'Aspiration, tapis et moquette, volant, tableau de bord, cuirs/tissus/alcantara', price: '50€' }] },
          { title: 'Extérieur + Intérieur', rows: [{ label: 'Formule complète', sub: 'Le forfait extérieur et intérieur réunis', price: '90€' }] },
          { title: 'Options', rows: [
            { label: 'Shampouinage sièges & moquette complet', price: '30€' },
            { label: 'Nettoyage compartiment moteur', price: '20€' },
            { label: 'Céramique hybride longue durée', price: '30€' },
          ] },
        ], notes: ['Tarifs communiqués par wash_auto_78, à confirmer selon le véhicule. Prestations réalisées sur rendez-vous.'] }],
        ['faq/accordion', { label: 'FAQ', title: 'Questions *fréquentes*', items: [
          { q: 'Faut-il prendre rendez-vous ?', a: 'Oui, les lavages se font uniquement sur rendez-vous, par message Instagram ou par téléphone.' },
          { q: 'Le lavage est-il vraiment fait à la main ?', a: 'Oui, chaque véhicule est lavé entièrement à la main, sans portique ni rouleau, pour préserver la carrosserie.' },
          { q: 'Proposez-vous une protection céramique ?', a: 'Oui, en option : une céramique hybride longue durée pour une brillance et une protection prolongées.' },
          { q: 'Où intervenez-vous ?', a: 'Dans les Yvelines (78). L’adresse exacte est communiquée lors de la prise de rendez-vous.' },
        ] }],
        ['cta/band', { title: 'Redonnez de l’éclat *à votre véhicule*', text: 'Réservez votre créneau par message ou par téléphone.', actions: [{ label: 'Nous écrire', href: 'contact.html', size: 'lg' }, { label: 'Instagram', href: 'https://www.instagram.com/wash_auto_78/', variant: 'ghost', size: 'lg' }] }],
        ['footer/columns', { logo: 'assets/img/logo.png', text: 'wash_auto_78 — lavage automobile 100 % à la main dans les Yvelines (78), sur rendez-vous.', cols: [
          { title: 'Le site', links: [{ label: 'Offre', href: '#services' }, { label: 'Tarifs', href: '#tarifs' }, { label: 'FAQ', href: '#faq' }] },
          { title: 'Infos', links: [{ label: 'Contact', href: 'contact.html' }, { label: 'Mentions légales', href: 'mentions-legales.html' }] },
        ] }],
        ['fab/call', {}],
      ],
    },
    {
      file: 'contact.html',
      title: 'Contact — Wash Auto 78, lavage auto dans les Yvelines',
      description: 'Contactez Wash Auto 78 pour réserver votre lavage à la main dans les Yvelines (78) : formulaire ou message Instagram, réponse rapide.',
      sections: [
        ['header/pill', { brand: { name: 'WASH AUTO 78', sub: 'Lavage & Detailing · Yvelines (78)' }, nav: [{ label: 'Accueil', href: 'index.html' }, { label: 'Contact', href: 'contact.html' }], cta: { label: 'Instagram', href: 'https://www.instagram.com/wash_auto_78/' } }],
        ['page/hero', { crumbs: [{ label: 'Accueil', href: 'index.html' }, { label: 'Contact' }], title: 'Nous *contacter*', lead: 'Un message ici ou sur Instagram : on vous répond vite pour caler votre créneau.' }],
        ['contact/form', { subjects: ['Prise de rendez-vous', 'Devis', 'Autre'] }],
        ['footer/columns', { cols: [{ title: 'Infos', links: [{ label: 'Accueil', href: 'index.html' }, { label: 'Mentions légales', href: 'mentions-legales.html' }] }] }],
      ],
    },
    {
      file: 'mentions-legales.html',
      title: 'Mentions légales — Wash Auto 78',
      description: 'Mentions légales du site Wash Auto 78 : éditeur, hébergeur, données personnelles et propriété intellectuelle.',
      sections: [
        ['header/pill', { brand: { name: 'WASH AUTO 78', sub: 'Lavage & Detailing · Yvelines (78)' }, nav: [{ label: 'Accueil', href: 'index.html' }] }],
        ['page/hero', { crumbs: [{ label: 'Accueil', href: 'index.html' }, { label: 'Mentions légales' }], title: 'Mentions *légales*' }],
        ['legal/mentions', {}],
        ['footer/columns', { cols: [] }],
      ],
    },
  ],
};
