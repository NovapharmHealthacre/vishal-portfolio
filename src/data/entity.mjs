export const verificationDate = '2026-07-15';
export const profileModifiedDate = '2026-07-15';

export const site = Object.freeze({
  id: 'https://vishal.novapharmhealthcare.com/#website',
  name: 'Vishal Chakravarty',
  origin: 'https://vishal.novapharmhealthcare.com',
  language: 'en-GB',
  locale: 'en_GB',
  description:
    'The founder platform of Vishal Chakravarty, Founder and CEO of NovaPharm Healthcare Ltd, covering pharmaceutical market access, manufacturing, supply and company building.',
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
    'Building a UK-led pharmaceutical company around market access, specialist medicines and resilient supply across regulated markets.',
  shortBio:
    'Vishal Chakravarty is the Founder & CEO of NovaPharm Healthcare Ltd. He is building a pharmaceutical company focused on product strategy, market access, manufacturing partnerships and resilient supply across regulated markets.',
  mediumBio:
    'Vishal Chakravarty is the Founder & CEO of NovaPharm Healthcare Ltd, a UK-registered pharmaceutical company established in 2025. His pharmaceutical experience predates NovaPharm, including work with SyriMed between 2020 and 2025. He is building the company around specialist medicines, product and market selection, licensing pathways, manufacturing partnerships, technology transfer, sourcing, supply and commercial market entry. Vishal also contributes analysis to Yakuji Nippo on UK–EU pharmaceutical market access and writes independently about the decisions that shape regulated pharmaceutical businesses.',
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
    'Pharmaceutical manufacturing partnerships',
    'Technology transfer',
    'Parallel import licensing',
    'Pharmaceutical supply-chain resilience',
    'Specialist medicines',
    'Founder operations',
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
    'A UK pharmaceutical company building market-access, licensing, manufacturing and supply capabilities for specialist medicines across regulated markets.',
  currentFocus:
    'The company is developing a focused portfolio and operating model across product strategy, regulatory pathways, manufacturing partnerships, sourcing, supply and commercial market entry.',
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
    date: '2026-05-12',
    title: 'Parallel Import Frameworks and Risk Considerations',
    subject: 'Parallel import and supply risk',
    abstract:
      'An explanation of the parallel-import framework and the licensing, quality, supply and commercial risks that sit behind the opportunity.',
    english: 'https://www.yakuji.co.jp/entry133526.html',
    japanese: 'https://www.yakuji.co.jp/entry133527.html',
  },
]);

export const publicFacts = Object.freeze([
  {
    id: 'P-002', label: 'Current role', value: person.role, status: 'VERIFIED_CURRENT',
    source: 'Companies House and Yakuji Nippo', sourceDate: '2026-02-06', lastVerified: verificationDate,
    publicSafe: true, approvedWording: person.role, pages: ['/about/', '/facts/'],
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
    id: 'M-002', label: 'Yakuji Nippo series', value: 'Three instalments published in English and Japanese', status: 'IN_PROGRESS',
    source: 'Yakuji Nippo', sourceDate: '2026-05-12', lastVerified: verificationDate,
    publicSafe: true, approvedWording: 'Three instalments are published in English and Japanese.', pages: ['/media/', '/facts/'],
  },
]);

export const statusLabels = Object.freeze({
  VERIFIED_CURRENT: 'Current · verified',
  VERIFIED_HISTORICAL: 'Historical · verified',
  IN_PROGRESS: 'In progress',
  PLANNED: 'Roadmap',
});
