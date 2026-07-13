export const verificationDate = '2026-07-12';

export const site = Object.freeze({
  name: 'Vishal Chakravarty',
  origin: 'https://vishal.novapharmhealthcare.com',
  language: 'en-GB',
  locale: 'en_GB',
  description:
    'The founder platform of Vishal Chakravarty: regulated healthcare markets, company building and long-form thinking.',
  email: 'vishal@novapharmhealthcare.com',
  correctionEmail: 'vishal@novapharmhealthcare.com',
  linkedIn: 'https://www.linkedin.com/in/vishal-chakravarty',
});

export const person = Object.freeze({
  id: `${site.origin}/#person`,
  name: 'Vishal Chakravarty',
  role: 'Founder & CEO, NovaPharm Healthcare Ltd',
  proposition:
    'Founder and operator working on more resilient access, licensing and supply systems for regulated healthcare markets.',
  shortBio:
    'Vishal Chakravarty is the Founder & CEO of NovaPharm Healthcare Ltd. He works on access, licensing and supply questions in regulated healthcare markets, and writes about the operating systems required to build responsibly in complex sectors, with evidence before assertion.',
  mediumBio:
    'Vishal Chakravarty is the Founder & CEO of NovaPharm Healthcare Ltd, an active UK-registered company incorporated in September 2025. His pharmaceutical experience predates NovaPharm, including work with SyriMed between 2020 and 2025. Today, he is developing a compliance-led operating model focused on access, licensing and supply in regulated healthcare markets. NovaPharm’s regulated operating capabilities remain under development and are not presented as licensed or operational on this site. Vishal also contributes analysis to Yakuji Nippo on UK–EU pharmaceutical market access and compliance. His work emphasises clear status boundaries, primary evidence and responsible operating decisions before regulated activity begins or scales.',
  image: {
    id: `${site.origin}/about/#portrait`,
    alt: 'Portrait of Vishal Chakravarty, Founder and CEO of NovaPharm Healthcare Ltd',
    width: 1440,
    height: 1402,
  },
  sameAs: [site.linkedIn],
  knowsAbout: [
    'Regulated healthcare markets',
    'Pharmaceutical market access',
    'UK–EU pharmaceutical regulation',
    'Parallel import licensing',
    'Supply-chain resilience',
    'Founder operations',
  ],
});

export const company = Object.freeze({
  id: `${site.origin}/ventures/#novapharm-healthcare`,
  name: 'NovaPharm Healthcare Ltd',
  legalName: 'NOVAPHARM HEALTHCARE LTD',
  companyNumber: '16716501',
  incorporationDate: '2025-09-15',
  sicCodes: ['21100', '46460'],
  status: 'Active',
  legalForm: 'Private limited company',
  officialUrl: 'https://novapharmhealthcare.com/',
  companiesHouseUrl:
    'https://find-and-update.company-information.service.gov.uk/company/16716501',
  description:
    'An active UK-registered company developing a compliance-led pharmaceutical sourcing and distribution model.',
  currentFocus:
    'The current plan focuses on access and supply resilience in specialist medicines, including oncology.',
  regulatoryStatus:
    'The company does not present itself on this site as holding an MHRA wholesale authorisation. Regulated activity depends on the required permissions and qualified operating partners.',
  roadmap: [
    'A digital B2B workflow for controlled commercial operations',
    'Decision support for demand and supply planning',
    'Traceability research for accountable product movement',
  ],
});

export const publications = Object.freeze([
  {
    number: 1,
    date: '2026-02-06',
    title: 'UK and EU Pharmaceutical Market Access Pathways After Brexit',
    english: 'https://www.yakuji.co.jp/entry129529.html',
    japanese: 'https://www.yakuji.co.jp/entry129530.html',
  },
  {
    number: 2,
    date: '2026-03-12',
    title: 'Regulatory and Compliance Considerations Post-Brexit',
    english: 'https://www.yakuji.co.jp/entry131265.html',
    japanese: 'https://www.yakuji.co.jp/entry131266.html',
  },
  {
    number: 3,
    date: '2026-05-12',
    title: 'Parallel Import Frameworks and Risk Considerations',
    english: 'https://www.yakuji.co.jp/entry133526.html',
    japanese: 'https://www.yakuji.co.jp/entry133527.html',
  },
]);

export const publicFacts = Object.freeze([
  {
    id: 'P-002',
    label: 'Current role',
    value: person.role,
    status: 'VERIFIED_CURRENT',
    source: 'Companies House and Yakuji Nippo',
    sourceDate: '2026-02-06',
    lastVerified: verificationDate,
    publicSafe: true,
    approvedWording: person.role,
    pages: ['/about/', '/facts/'],
  },
  {
    id: 'C-002',
    label: 'Company number',
    value: company.companyNumber,
    status: 'VERIFIED_CURRENT',
    source: 'Companies House',
    sourceDate: '2026-07-12',
    lastVerified: verificationDate,
    publicSafe: true,
    approvedWording: `Company number ${company.companyNumber}`,
    pages: ['/ventures/', '/facts/'],
  },
  {
    id: 'C-004',
    label: 'Incorporated',
    value: '15 September 2025',
    status: 'VERIFIED_CURRENT',
    source: 'Companies House',
    sourceDate: '2026-07-12',
    lastVerified: verificationDate,
    publicSafe: true,
    approvedWording: 'Incorporated on 15 September 2025.',
    pages: ['/ventures/', '/facts/'],
  },
  {
    id: 'P-008',
    label: 'Earlier pharmaceutical work',
    value: 'Work with SyriMed, 2020–2025',
    status: 'VERIFIED_HISTORICAL',
    source: 'Owner-verified professional record',
    sourceDate: 'withheld',
    lastVerified: verificationDate,
    publicSafe: true,
    approvedWording: 'His pharmaceutical experience predates NovaPharm, including work with SyriMed between 2020 and 2025.',
    pages: ['/about/', '/facts/'],
  },
  {
    id: 'M-002',
    label: 'Yakuji Nippo series',
    value: 'Three instalments published in English and Japanese',
    status: 'IN_PROGRESS',
    source: 'Yakuji Nippo',
    sourceDate: '2026-05-12',
    lastVerified: verificationDate,
    publicSafe: true,
    approvedWording: 'Three instalments of a planned four-part series are published in English and Japanese.',
    pages: ['/media/', '/facts/'],
  },
]);

export const statusLabels = Object.freeze({
  VERIFIED_CURRENT: 'Current · verified',
  VERIFIED_HISTORICAL: 'Historical · verified',
  IN_PROGRESS: 'In progress',
  PLANNED: 'Roadmap',
});
