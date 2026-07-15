import { company, person, publications, publicFacts, site, verificationDate } from './entity.mjs';

const publicationRecord = publications
  .map(
    (publication) =>
      `### ${publication.title}\n\n**${publication.subject} · ${new Date(`${publication.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}**\n\n${publication.abstract}\n\n- [Read in English](${publication.english})\n- [日本語で読む](${publication.japanese})`,
  )
  .join('\n\n');

const formatIsoDate = (value) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

export const contentVariables = Object.freeze({
  EMAIL: site.email,
  LINKEDIN_URL: site.linkedIn,
  PERSON_ROLE: person.role,
  PERSON_PROPOSITION: person.proposition,
  PERSON_SHORT_BIO: person.shortBio,
  PERSON_MEDIUM_BIO: person.mediumBio,
  COMPANY_NAME: company.name,
  COMPANY_LEGAL_NAME: company.legalName,
  COMPANY_NUMBER: company.companyNumber,
  COMPANY_URL: company.officialUrl,
  COMPANIES_HOUSE_URL: company.companiesHouseUrl,
  COMPANY_STATUS: company.status,
  COMPANY_LEGAL_FORM: company.legalForm,
  COMPANY_INCORPORATED: formatIsoDate(company.incorporationDate),
  COMPANY_SIC_CODES: company.sicCodes.join(' and '),
  COMPANY_CURRENT_FOCUS: company.currentFocus,
  COMPANY_REGULATORY_STATUS: company.regulatoryStatus,
  COMPANY_ROADMAP: company.roadmap.map((item) => `- ${item}`).join('\n'),
  PUBLISHED_INSTALLMENT_COUNT: publications.length,
  VERIFICATION_DATE: formatIsoDate(verificationDate),
  PUBLICATION_RECORD: publicationRecord,
  PUBLIC_FACT_RECORD: publicFacts.map((fact) => `- **${fact.label}:** ${fact.value} — ${fact.source}`).join('\n'),
});
