export const ORIGIN = 'https://mag.badjoke-lab.com';
export const ROUTES = {
  home: '/',
  encyclopedia: '/encyclopedia/',
  marketplace_detail: '/encyclopedia/{slug}/',
  stats: '/stats/',
  guides: '/guides/',
  glossary: '/glossary/',
  updates: '/updates/',
  methodology: '/methodology/',
  about: '/about/',
  corrections: '/submit/',
  contact: '/contact/',
  support: '/support/',
};
export const COMMON = {
  schema_version: '1.0.0',
  project_id: 'minted-and-gone',
  registry_family: 'badjoke-lab-ledger-series',
  registry_type: 'historical_nft_market_registry',
  canonical_origin: ORIGIN,
  design_generation: 'field_guide_registry',
};
export const SAFETY = {
  canonical_only: true,
  includes_unreviewed_candidates: false,
  includes_internal_monitoring: false,
  includes_private_notes: false,
};
