export const verificationDate = '2026-07-12';
export const profileModifiedDate = '2026-07-15';

export const site = Object.freeze({
  id: 'https://vishal.novapharmhealthcare.com/#website',
  name: 'Vishal Chakravarty',
  origin: 'https://vishal.novapharmhealthcare.com',
  language: 'en-GB',
  locale: 'en_GB',
  description:
    'The founder platform of Vishal Chakravarty: pharmaceutical entrepreneurship, market access, specialist medicines and cross-border company building.',
  email: 'vishal@novapharmhealthcare.com',
  correctionEmail: 'vishal@novapharmhealthcare.com',
  linkedIn: 'https://www.linkedin.com/in/vishal-chakravarty',
});

export const person = Object.freeze({
  id: `${site.origin}/#person`,
  profileId: `${site.origin}/about/#profile`,
  name: 'Vishal Chakravarty',
  role: 'Founder & CEO, NovaPharm Healthcare Ltd',
  jobTitle: 'Chief Executive Officer',
  proposition:
    'Building a UK-led pharmaceutical company around market access, specialist medicines and resilient cross-border supply.',
  shortBio:
    'Vishal Chakravarty is the Founder & CEO of NovaPharm Healthcare Ltd. He is building across pharmaceutical market access, product strategy, manufacturing partnerships, licensing pathways and supply, with a focus on the United Kingdom and international regulated markets.',
  mediumBio:
    'Vishal Chakravarty is the Founder & CEO of NovaPharm Healthcare Ltd, a UK-registered pharmaceutical company established in 2025. His pharmaceutical experience includes work with SyriMed between 2020 and 2025. Through NovaPharm, he is developing a business focused on specialist medicines, market access, manufacturing partnerships, licensing pathways and resilient supply across the United Kingdom and international regulated markets. He also contributes analysis to Yakuji Nippo on UK–EU pharmaceutical market access and writes independently about product strategy, technology transfer, pharmaceutical commercialisation and founder execution.',
  image: {
    id: `${site.origin}/about/#portrait`,
    alt: 'Portrait of Vishal Chakravarty, Founder and CEO of NovaPharm Healthcare Ltd',
    width: 1440,
    height: 1402,
  },
  sameAs: [site.linkedIn],
  knowsAbout: [
    'Pharmaceutical entrepreneurship',
    'Pharmaceutical market access',
    'UK–EU pharmaceutical strategy',
    'Product and portfolio strategy',
    'CMO and CDMO selection',
    'Pharmaceutical technology transfer',
    'Parallel import licensing',
    'Pharmaceutical supply chains',
    'Cross-border market entry',
  ],
});

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
  description:
    'A UK pharmaceutical company building market-access, licensing, manufacturing-partnership and supply capabilities for specialist medicines across regulated markets.',
  currentFocus:
    'NovaPharm’s current work centres on product and portfolio strategy, market entry, manufacturing partnerships, licensing pathways, channel development and resilient supply.',
  regulatoryStatus:
    'NovaPharm is developing the permissions, partnerships and operating infrastructure required for its pharmaceutical strategy.',
  roadmap: [
    'Market access and product strategy for specialist medicines',
    'Manufacturing and technology-transfer partnerships',
    'Sourcing, supply and commercialisation architecture',
    'Digital operating infrastructure for controlled B2B workflows',
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
    approvedWording: 'His pharmaceutical experience includes work with SyriMed between 2020 and 2025.',
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
    approvedWording: 'Three instalments are published in English and Japanese.',
    pages: ['/media/', '/facts/'],
  },
]);

export const statusLabels = Object.freeze({
  VERIFIED_CURRENT: 'Current',
  VERIFIED_HISTORICAL: 'Professional history',
  IN_PROGRESS: 'In development',
  PLANNED: 'Direction',
});
