import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const failures = [];
const forbidden = [
  [/novapharmhealthcare\.co\.uk/gi, 'obsolete .co.uk domain'],
  [/en\.wikipedia\.org\/wiki\/Vishal_Chakravarty/gi, 'unsupported Wikipedia'],
  [/Q130325741|Q137660690/g, 'unapproved Wikidata'],
  [/github\.com\/vishalchakravarty/gi, 'unverified GitHub profile'],
  [/MHRA[- ]licensed wholesaler/gi, 'unsupported MHRA licence claim'],
  [/GDP[- ]certified supply chain/gi, 'unsupported GDP certification'],
  [/serving NHS Trusts/gi, 'unsupported NHS service claim'],
  [/nationality/gi, 'nationality should not be public'],
  [/passport|date of birth|residential address|\bvisa\b|\bimmigration\b|right to work|residence status/gi, 'private personal data'],
];

const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(location);
    else if (/\.docx$/i.test(entry.name) || /(?:annex|business.?plan|endorsement|recommendation|passport).*\.pdf$/i.test(entry.name)) {
      failures.push(`${path.relative(dist, location)}: confidential-source file type or name`);
    } else if (/\.(?:html|json|txt|xml)$/.test(entry.name)) {
      const content = fs.readFileSync(location, 'utf8');
      for (const [pattern, label] of forbidden) {
        pattern.lastIndex = 0;
        if (pattern.test(content)) failures.push(`${path.relative(dist, location)}: ${label}`);
      }
    }
  }
};
walk(dist);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Rendered-output claim and privacy denylist passed.');
