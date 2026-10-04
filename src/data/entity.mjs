export const verificationDate = '2026-10-04';
export const profileModifiedDate = '2026-10-04';

export const site = Object.freeze({
  id: 'https://vishal.novapharmhealthcare.com/#website',
  name: 'Vishal Chakravarty',
  origin: 'https://vishal.novapharmhealthcare.com',
  language: 'en-GB',
  locale: 'en_GB',
  description:
    'The professional platform of Vishal Chakravarty, covering pharmaceutical market access, manufacturing, supply and company building.',
  email: 'vishal@novapharmhealthcare.com',
  correctionEmail: 'vishal@novapharmhealthcare.com',
  linkedIn: 'https://www.linkedin.com/in/vishal-chakravarty',
  wikidata: 'https://www.wikidata.org/wiki/Q137660690',
  companiesHousePerson:
    'https://find-and-update.company-information.service.gov.uk/officers/GCJvCvEf20rHFbzF_T9LKAGEJic/appointments',
  companyProfile: 'https://novapharmhealthcare.com/leadership/vishal-chakravarty/',
});

export const person = Object.freeze({
  id: `${site.origin}/#person`,
  profileId: `${site.origin}/about/#profile`,
  name: 'Vishal Chakravarty',
  givenName: 'Vishal',
  familyName: 'Chakravarty',
  alternateName: 'Vishal Om Prakash Chakravarty',
  disambiguatingDescription:
    'Pharmaceutical executive and founder of NovaPharm Healthcare Ltd, a UK-registered pharmaceutical company.',
  role: 'Chief Executive Officer, NovaPharm Healthcare Ltd',
  founderRelationship: 'Founder of NovaPharm Healthcare Ltd',
  jobTitle: 'Chief Executive Officer',
  proposition:
    'Building a UK-led pharmaceutical company around market access, specialist medicines and resilient supply — designed as one operating system from product decision to patient access.',
  shortBio:
    'Vishal Chakravarty is Chief Executive Officer of NovaPharm Healthcare Ltd. He founded the UK-registered pharmaceutical company in 2025 and is building it around product strategy, market access, manufacturing partnerships and resilient supply across regulated markets, with operating infrastructure connecting those decisions.',
  mediumBio:
    'Vishal Chakravarty is Chief Executive Officer of NovaPharm Healthcare Ltd. He founded the UK-registered pharmaceutical company in 2025. His pharmaceutical experience predates NovaPharm, including work with SyriMed between 2020 and 2025. He is building the company around specialist medicines, product and market selection, licensing pathways, manufacturing partnerships, technology transfer, sourcing, supply and commercial market entry. Vishal contributes external analysis to Yakuji Nippo and Pharmaceutical Commerce and writes independently about the decisions that shape regulated pharmaceutical businesses.',
  image: {
    id: `${site.origin}/about/#portrait`,
    path: '/images/portrait/vishal-chakravarty-1440.webp',
    name: 'Official portrait of Vishal Chakravarty',
    alt: 'Portrait of Vishal Chakravarty',
    description: 'The principal professional portrait of Vishal Chakravarty.',
    width: 1440,
    height: 1440,
  },
  sameAs: [site.linkedIn, site.wikidata, site.companiesHousePerson, site.companyProfile],
  knowsAbout: [
    'Pharmaceutical entrepreneurship',
    'Pharmaceutical market access',
    'UK–EU pharmaceutical strategy',
    'Pharmaceutical manufacturing partnerships',
    'Technology transfer',
    'Parallel import licensing',
    'Pharmaceutical supply-chain resilience',
    'Specialist medicines',
    'Pharmaceutical company building',
  ],
});

export const publicAppearances = Object.freeze([
  {
    id: 'iphex-2026',
    name: 'iPHEX 2026',
    kind: 'Industry exhibition · hosted business delegate programme',
    status: 'attended',
    statusLabel: 'Attended · Official overseas delegate',
    startDate: '2026-09-07',
    endDate: '2026-09-09',
    displayDate: '7–9 September 2026',
    location: 'Bharat Mandapam · New Delhi, India',
    role: 'UK overseas business delegate',
    summary:
      'Three days of product, manufacturing, dossier, specialist-medicines and cross-border supply discussions, followed by partner due diligence and UK market-access work.',
    officialUrl: 'https://www.iphex-india.com/',
    verificationUrl: 'https://iphex-india.com/exhibition/overseasdelegates_participating_list_2026',
    organizer: 'Pharmaceuticals Export Promotion Council of India',
    organizerUrl: 'https://pharmexcil.com/',
    eventStatus: 'https://schema.org/EventCompleted',
    topics: ['Pharmaceutical manufacturing', 'Market access', 'Dossiers', 'Specialist medicines', 'Cross-border supply'],
    images: ['/images/media/vishal-chakravarty-iphex-2026-working.webp'],
  },
  {
    id: 'cphi-milan-2026',
    name: 'CPHI Milan 2026',
    kind: 'Global pharmaceutical industry event',
    status: 'confirmed',
    statusLabel: 'Registered · Upcoming',
    startDate: '2026-10-06',
    endDate: '2026-10-08',
    displayDate: '6–8 October 2026',
    location: 'Fiera Milano · Milan, Italy',
    role: 'Registered attendee',
    summary:
      'A working visit focused on pharmaceutical manufacturing, development partners, finished dosage, supply-chain capability and commercial discussions for regulated markets.',
    officialUrl: 'https://www.cphi.com/europe/',
    verificationUrl: 'https://www.cphi.com/europe/travel-hotel/',
    organizer: 'Informa Markets',
    organizerUrl: 'https://www.informamarkets.com/',
    eventStatus: 'https://schema.org/EventScheduled',
    topics: ['Manufacturing', 'Finished dosage', 'CDMO', 'Supply chain', 'Market access'],
    images: [],
  },
  {
    id: '2030-health-co-creation',
    name: '2030 Health Co-Creation',
    kind: 'Invitation-only parliamentary roundtable',
    status: 'confirmed',
    statusLabel: 'Confirmed in person · Invitation-only',
    startDate: '2026-10-14',
    endDate: '2026-10-14',
    displayDate: '14 October 2026',
    location: 'Room M, Portcullis House · UK Parliament, Westminster, London',
    role: 'Invited participant',
    summary:
      'A policy roundtable on bilateral healthcare innovation corridors, responsible AI, digital primary care, prevention, workforce development and international healthcare collaboration.',
    officialUrl: 'https://www.eventbrite.com/e/parliamentary-roundtable-2030-health-co-creation-tickets-2001419737311',
    verificationUrl: 'https://genevaaisummit.swiss/fr/pre-events',
    organizer: 'BioTech Sphere Research',
    organizerUrl: 'https://www.biotechsphereresearch.com/',
    eventStatus: 'https://schema.org/EventScheduled',
    topics: ['Healthcare innovation', 'Responsible AI', 'Digital health', 'Primary care', 'UK–India collaboration'],
    images: [],
  },
  {
    id: 'business-show-london-2026',
    name: 'The Business Show London 2026',
    kind: 'Business and entrepreneurship event',
    status: 'confirmed',
    statusLabel: 'Registered · Upcoming',
    startDate: '2026-11-11',
    endDate: '2026-11-12',
    displayDate: '11–12 November 2026',
    location: 'ExCeL London · London, United Kingdom',
    role: 'Registered attendee',
    summary:
      'A company-building visit spanning AI, technology, operations, finance, growth and the practical systems used to scale businesses.',
    officialUrl: 'https://www.greatbritishbusinessshow.co.uk/',
    verificationUrl: 'https://www.greatbritishbusinessshow.co.uk/visitor-information',
    organizer: 'Business Show Media',
    organizerUrl: 'https://www.greatbritishbusinessshow.co.uk/about',
    eventStatus: 'https://schema.org/EventScheduled',
    topics: ['Company building', 'AI', 'Technology', 'Operations', 'Growth'],
    images: [],
  },
]);

export const company = Object.freeze({
  id: 'https://novapharmhealthcare.com/#organization',
  websiteId: 'https://novapharmhealthcare.com/#website',
  name: 'NovaPharm Healthcare Ltd',
  brandName: 'NovaPharm Healthcare',
  legalName: 'NOVAPHARM HEALTHCARE LTD',
  companyNumber: '16716501',
  incorporationDate: '2025-09-15',
  sicCodes: ['21100', '46460'],
  status: 'Active',
  legalForm: 'Private limited company',
  officialUrl: 'https://novapharmhealthcare.com/',
  companiesHouseUrl:
    'https://find-and-update.company-information.service.gov.uk/company/16716501',
  linkedInUrl: 'https://www.linkedin.com/company/novapharm-healthcare/',
  wikidataUrl: 'https://www.wikidata.org/wiki/Q137660644',
  description:
    'A UK pharmaceutical company building an integrated route across market access, licensing, manufacturing and supply for specialist medicines in regulated markets.',
  currentFocus:
    'The company is developing a focused portfolio and operating system across product strategy, regulatory pathways, manufacturing partnerships, sourcing, supply, commercial market entry and decision infrastructure.',
  regulatoryStatus:
    'Regulated activities are developed and activated through the permissions, quality systems and qualified operating partners required for each product and market route.',
  roadmap: [
    'Market access and product strategy for specialist medicines',
    'Licensing, manufacturing and technology-transfer programmes',
    'Sourcing, supply and channel development across selected regulated markets',
    'Digital operating infrastructure for product, partner, inventory and decision visibility',
  ],
});

export const publications = Object.freeze([
  {
    number: 1,
    publisher: 'Yakuji Nippo',
    publisherUrl: 'https://www.yakuji.co.jp/',
    publicationType: 'External analysis',
    date: '2026-02-06',
    title: 'UK and EU Pharmaceutical Market Access Pathways After Brexit',
    subject: 'Market access after Brexit',
    abstract:
      'An analysis of the separate UK and EU pathways that pharmaceutical companies must connect through product, regulatory and commercial planning.',
    english: 'https://www.yakuji.co.jp/entry129529.html',
    japanese: 'https://www.yakuji.co.jp/entry129530.html',
  },
  {
    number: 2,
    publisher: 'Yakuji Nippo',
    publisherUrl: 'https://www.yakuji.co.jp/',
    publicationType: 'External analysis',
    date: '2026-03-12',
    title: 'Regulatory and Compliance Considerations Post-Brexit',
    subject: 'Regulatory and compliance strategy',
    abstract:
      'A practical review of the responsibilities, sequencing and compliance questions created by the post-Brexit pharmaceutical environment.',
    english: 'https://www.yakuji.co.jp/entry131265.html',
    japanese: 'https://www.yakuji.co.jp/entry131266.html',
  },
  {
    number: 3,
    publisher: 'Yakuji Nippo',
    publisherUrl: 'https://www.yakuji.co.jp/',
    publicationType: 'External analysis',
    date: '2026-05-12',
    title: 'Parallel Import Frameworks and Risk Considerations',
    subject: 'Parallel import and supply risk',
    abstract:
      'An explanation of the parallel-import framework and the licensing, quality, supply and commercial risks that sit behind the opportunity.',
    english: 'https://www.yakuji.co.jp/entry133526.html',
    japanese: 'https://www.yakuji.co.jp/entry133527.html',
  },
  {
    number: 4,
    publisher: 'Yakuji Nippo',
    publisherUrl: 'https://www.yakuji.co.jp/',
    publicationType: 'External analysis',
    date: '2026-07-23',
    title:
      'UK–EU Pharmaceutical Market Access and Compliance in the Post-Brexit Era — 4. Compliance-Driven Approaches to Cross-Border Market Entry',
    subject: 'Compliance-driven cross-border market entry',
    abstract:
      'A compliance-led view of cross-border pharmaceutical entry, connecting market choice with regulatory infrastructure, GDP responsibilities and quality-system readiness across the UK and EU.',
    english: 'https://www.yakuji.co.jp/entry136963.html',
    japanese: 'https://www.yakuji.co.jp/entry136964.html',
  },
  {
    publisher: 'Pharmaceutical Commerce',
    publisherUrl: 'https://www.pharmaceuticalcommerce.com/',
    publicationType: 'External commentary',
    date: '2026-07-31',
    title: 'Why Onshoring Alone Won’t Secure Pharma Supply Chains',
    subject: 'Pharmaceutical supply resilience beyond onshoring',
    abstract:
      'A supply-resilience argument for combining geographic strategy with qualified redundancy, quality maturity, concentration controls and commercially sustainable continuity planning.',
    english: 'https://www.pharmaceuticalcommerce.com/view/why-onshoring-alone-wont-secure-pharma-supply-chains',
  },
  {
    publisher: 'Pharmaceutical Commerce',
    publisherUrl: 'https://www.pharmaceuticalcommerce.com/',
    publicationType: 'External commentary',
    date: '2026-08-14',
    title: 'DSCSA Can Trace a Package. It Cannot Tell Whether the Next One Will Arrive.',
    subject: 'Pharmaceutical traceability and supply continuity',
    abstract:
      'An analysis of the boundary between package-level traceability and the upstream manufacturing, quality, capacity and sourcing signals needed for supply continuity.',
    english: 'https://www.pharmaceuticalcommerce.com/view/dscsa-can-trace-a-package-it-cannot-tell-you-whether-the-next-one-will-arrive-',
  },
]);

export const publicFacts = Object.freeze([
  {
    id: 'P-002', label: 'Current role', value: person.role, status: 'VERIFIED_CURRENT',
    source: 'Owner-approved executive designation and Companies House officer record', sourceDate: '2026-07-30', lastVerified: verificationDate,
    publicSafe: true, approvedWording: person.role, pages: ['/about/', '/facts/'],
  },
  {
    id: 'P-017', label: 'Founder relationship', value: person.founderRelationship, status: 'VERIFIED_CURRENT',
    source: 'Owner-attested corporate governance record', sourceDate: '2026-07-30', lastVerified: verificationDate,
    publicSafe: true, approvedWording: person.founderRelationship, pages: ['/about/', '/ventures/', '/facts/'],
  },
  {
    id: 'C-002', label: 'Company number', value: company.companyNumber, status: 'VERIFIED_CURRENT',
    source: 'Companies House', sourceDate: '2026-07-12', lastVerified: verificationDate,
    publicSafe: true, approvedWording: `Company number ${company.companyNumber}`, pages: ['/ventures/', '/facts/'],
  },
  {
    id: 'C-004', label: 'Incorporated', value: '15 September 2025', status: 'VERIFIED_CURRENT',
    source: 'Companies House', sourceDate: '2026-07-12', lastVerified: verificationDate,
    publicSafe: true, approvedWording: 'Incorporated on 15 September 2025.', pages: ['/ventures/', '/facts/'],
  },
  {
    id: 'P-008', label: 'Earlier pharmaceutical work', value: 'Work with SyriMed, 2020–2025', status: 'VERIFIED_HISTORICAL',
    source: 'Owner-verified professional record', sourceDate: 'withheld', lastVerified: verificationDate,
    publicSafe: true, approvedWording: 'His pharmaceutical experience predates NovaPharm, including work with SyriMed between 2020 and 2025.', pages: ['/about/', '/facts/'],
  },
  {
    id: 'M-002', label: 'Yakuji Nippo series', value: 'Four instalments published in English and Japanese', status: 'VERIFIED_CURRENT',
    source: 'Yakuji Nippo', sourceDate: '2026-07-23', lastVerified: verificationDate,
    publicSafe: true, approvedWording: 'Four instalments are published in English and Japanese.', pages: ['/media/', '/facts/'],
  },
  {
    id: 'M-004', label: 'External publication record', value: 'Six publisher-hosted contributions', status: 'VERIFIED_CURRENT',
    source: 'Yakuji Nippo and Pharmaceutical Commerce', sourceDate: '2026-08-14', lastVerified: verificationDate,
    publicSafe: true, approvedWording: 'Six publisher-hosted contributions are verified.', pages: ['/media/', '/facts/'],
  },
  {
    id: 'P-020',
    label: 'Official iPHEX 2026 overseas delegate record',
    value: 'iPHEX 2026 overseas delegate record',
    status: 'VERIFIED_CURRENT',
    source: 'Pharmexcil / iPHEX 2026 overseas delegates list',
    sourceUrl: 'https://iphex-india.com/exhibition/overseasdelegates_participating_list_2026',
    sourceDate: '2026-08-26',
    lastVerified: verificationDate,
    publicSafe: true,
    approvedWording:
      'The official iPHEX 2026 overseas delegates list identifies Vishal Om Prakash Chakravarty of NovaPharm Healthcare Ltd as Chief Executive Officer.',
    pages: ['/media/', '/facts/'],
  },
]);

export const statusLabels = Object.freeze({
  VERIFIED_CURRENT: 'Current · verified',
  VERIFIED_HISTORICAL: 'Historical · verified',
  IN_PROGRESS: 'In progress',
  PLANNED: 'Roadmap',
});
