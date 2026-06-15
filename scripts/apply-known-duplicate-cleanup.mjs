import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const RESEARCH = path.join(ROOT, 'research');

const duplicateGroups = [
  { candidate_id: 'mag_candidate_000021', duplicate_marketplace_id: 'mag_nfm_real_000361', canonical_marketplace_id: 'mag_nfm_real_000134', event_id: 'mag_ev_real_000364', evidence_ids: ['mag_src_real_000728','mag_src_real_000729'], name: 'NFTb' },
  { candidate_id: 'mag_candidate_000022', duplicate_marketplace_id: 'mag_nfm_real_000362', canonical_marketplace_id: 'mag_nfm_real_000136', event_id: 'mag_ev_real_000365', evidence_ids: ['mag_src_real_000730','mag_src_real_000731'], name: 'Treasureland' },
  { candidate_id: 'mag_candidate_000023', duplicate_marketplace_id: 'mag_nfm_real_000363', canonical_marketplace_id: 'mag_nfm_real_000135', event_id: 'mag_ev_real_000366', evidence_ids: ['mag_src_real_000732','mag_src_real_000733'], name: 'Refinable' },
  { candidate_id: 'mag_candidate_000024', duplicate_marketplace_id: 'mag_nfm_real_000364', canonical_marketplace_id: 'mag_nfm_real_000099', event_id: 'mag_ev_real_000367', evidence_ids: ['mag_src_real_000734','mag_src_real_000735'], name: 'Artano' },
  { candidate_id: 'mag_candidate_000025', duplicate_marketplace_id: 'mag_nfm_real_000365', canonical_marketplace_id: 'mag_nfm_real_000062', event_id: 'mag_ev_real_000368', evidence_ids: ['mag_src_real_000736','mag_src_real_000737'], name: 'Tokhun' },
  { candidate_id: 'mag_candidate_000026', duplicate_marketplace_id: 'mag_nfm_real_000366', canonical_marketplace_id: 'mag_nfm_real_000033', event_id: 'mag_ev_real_000369', evidence_ids: ['mag_src_real_000738','mag_src_real_000739'], name: 'Blockparty' },
  { candidate_id: 'mag_candidate_000027', duplicate_marketplace_id: 'mag_nfm_real_000367', canonical_marketplace_id: 'mag_nfm_real_000034', event_id: 'mag_ev_real_000370', evidence_ids: ['mag_src_real_000740','mag_src_real_000741'], name: 'Portion' },
  { candidate_id: 'mag_candidate_000030', duplicate_marketplace_id: 'mag_nfm_real_000370', canonical_marketplace_id: 'mag_nfm_real_000129', event_id: 'mag_ev_real_000373', evidence_ids: ['mag_src_real_000746','mag_src_real_000747'], name: 'NiftyKit' },
  { candidate_id: 'mag_candidate_000048', duplicate_marketplace_id: 'mag_nfm_real_000380', canonical_marketplace_id: 'mag_nfm_real_000097', event_id: 'mag_ev_real_000383', evidence_ids: ['mag_src_real_000766','mag_src_real_000767'], name: 'LaCollection' },
  { candidate_id: 'mag_candidate_000051', duplicate_marketplace_id: 'mag_nfm_real_000383', canonical_marketplace_id: 'mag_nfm_real_000094', event_id: 'mag_ev_real_000386', evidence_ids: ['mag_src_real_000772','mag_src_real_000773'], name: 'Quantum Art' },
  { candidate_id: 'mag_candidate_000052', duplicate_marketplace_id: 'mag_nfm_real_000384', canonical_marketplace_id: 'mag_nfm_real_000268', event_id: 'mag_ev_real_000387', evidence_ids: ['mag_src_real_000774','mag_src_real_000775'], name: 'Transient Labs' },
  { candidate_id: 'mag_candidate_000057', duplicate_marketplace_id: 'mag_nfm_real_000389', canonical_marketplace_id: 'mag_nfm_real_000131', event_id: 'mag_ev_real_000392', evidence_ids: ['mag_src_real_000784','mag_src_real_000785'], name: 'VIV3' },
  { candidate_id: 'mag_candidate_000064', duplicate_marketplace_id: 'mag_nfm_real_000392', canonical_marketplace_id: 'mag_nfm_real_000040', event_id: 'mag_ev_real_000395', evidence_ids: ['mag_src_real_000790','mag_src_real_000791'], name: 'Hicdex' },
  { candidate_id: 'mag_candidate_000067', duplicate_marketplace_id: 'mag_nfm_real_000395', canonical_marketplace_id: 'mag_nfm_real_000245', event_id: 'mag_ev_real_000398', evidence_ids: ['mag_src_real_000796','mag_src_real_000797'], name: 'Nina Protocol' },
  { candidate_id: 'mag_candidate_000069', duplicate_marketplace_id: 'mag_nfm_real_000397', canonical_marketplace_id: 'mag_nfm_real_000247', event_id: 'mag_ev_real_000400', evidence_ids: ['mag_src_real_000800','mag_src_real_000801'], name: 'Glass Protocol' },
  { candidate_id: 'mag_candidate_000070', duplicate_marketplace_id: 'mag_nfm_real_000398', canonical_marketplace_id: 'mag_nfm_real_000240', event_id: 'mag_ev_real_000401', evidence_ids: ['mag_src_real_000802','mag_src_real_000803'], name: 'Pianity' },
  { candidate_id: 'mag_candidate_000071', duplicate_marketplace_id: 'mag_nfm_real_000399', canonical_marketplace_id: 'mag_nfm_real_000145', event_id: 'mag_ev_real_000402', evidence_ids: ['mag_src_real_000804','mag_src_real_000805'], name: 'Starly' }
];

const duplicateMarketplaceIds = new Set(duplicateGroups.map((item) => item.duplicate_marketplace_id));
const duplicateEventIds = new Set(duplicateGroups.map((item) => item.event_id));
const duplicateEvidenceIds = new Set(duplicateGroups.flatMap((item) => item.evidence_ids));

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeArray = (file, records) => fs.writeFileSync(file, `\n`.startsWith('x') ? '' : '[\n' + records.map((record) => `  ${JSON.stringify(record)}`).join(',\n') + '\n]\n');

for (const batch of [38, 39, 40, 41]) {
  const marketplaceFile = path.join(DATA, `marketplaces-batch-${batch}.json`);
  const eventFile = path.join(DATA, `events-batch-${batch}.json`);
  const evidenceFile = path.join(DATA, `evidence-batch-${batch}.json`);

  writeArray(marketplaceFile, readJson(marketplaceFile).filter((record) => !duplicateMarketplaceIds.has(record.id)));
  writeArray(eventFile, readJson(eventFile).filter((record) => !duplicateEventIds.has(record.id)));
  writeArray(evidenceFile, readJson(evidenceFile).filter((record) => !duplicateEvidenceIds.has(record.id)));
}

const logFile = path.join(RESEARCH, 'mag-candidate-consumption-log.json');
const log = readJson(logFile);
const byCandidate = new Map(duplicateGroups.map((item) => [item.candidate_id, item]));
log.entries = log.entries.map((entry) => {
  const duplicate = byCandidate.get(entry.candidate_id);
  if (!duplicate) return entry;
  return {
    candidate_id: entry.candidate_id,
    action: 'duplicate',
    batch: null,
    marketplace_id: duplicate.canonical_marketplace_id,
    event_id: null,
    evidence_ids: [],
    processed_at: '2026-06-15',
    notes: `${duplicate.name} was already present as ${duplicate.canonical_marketplace_id}; the later promotion ${duplicate.duplicate_marketplace_id} and its supporting records were removed.`
  };
});
fs.writeFileSync(logFile, JSON.stringify(log, null, 2) + '\n');

const audit = {
  version: 1,
  applied_at: '2026-06-15',
  reason: 'Repository-wide scan found later batch promotions duplicating earlier canonical marketplace records.',
  policy: 'Keep the earliest canonical marketplace record; remove the later duplicate entity and its directly linked event and evidence records; preserve candidate history as duplicate.',
  removed_marketplace_count: duplicateMarketplaceIds.size,
  removed_event_count: duplicateEventIds.size,
  removed_evidence_count: duplicateEvidenceIds.size,
  mappings: duplicateGroups
};
fs.writeFileSync(path.join(RESEARCH, 'duplicate-cleanup-2026-06-15.json'), JSON.stringify(audit, null, 2) + '\n');

console.log(`Prepared cleanup for ${duplicateMarketplaceIds.size} duplicate marketplaces.`);
