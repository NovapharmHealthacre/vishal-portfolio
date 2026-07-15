# GitHub Actions runtime audit

Reviewed: 14 July 2026

## Finding

The production workflows use immutable SHAs for official GitHub-owned Actions, but the pinned major versions predate the current Node.js 24 action-runtime releases. GitHub has displayed deprecation warnings while the workflows continue to succeed.

## Current and recommended versions

| Action | Current pin / major | Current official release reviewed | Node runtime note |
|---|---|---|---|
| `actions/checkout` | `34e114876b0b11c390a56381ad16ebd13914f8d5` / v4 | `9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0` / v7 | Current immutable release; review security behaviour before merge |
| `actions/setup-node` | `49933ea5288caeca8642d1e84afbd3f7d6820020` / v4 | `820762786026740c76f36085b0efc47a31fe5020` / v7 | Current immutable release |
| `actions/configure-pages` | `983d7736d9b0ae728b81ab479565c72886d7745b` / v5 | `45bfe0192ca1faeb007ade9deae92b16b8254a0d` / v6 | Release notes state Node.js 24 upgrade |
| `actions/upload-pages-artifact` | `56afc609e74202658d3ffba0e8f6dda462b719fa` / v3 | `fc324d3547104276b827a68afc52ff2a11cc49c9` / v5 | Uses current artifact generation; hidden-file behaviour must be considered |
| `actions/deploy-pages` | `d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e` / v4 | `cd2ce8fcbc39b97be8ca5fce6e763baed58fa128` / v5 | Release notes state Node.js 24 upgrade |

## Separation decision

Workflow upgrades are not mixed into the SEO branch. A separate draft branch and PR must:

- change workflow pins only;
- preserve permissions, triggers, `dist` artifact path, environment and custom-domain behaviour;
- run `npm ci` and `npm run check`;
- confirm the generated site is byte-identical;
- remain unmerged until independently reviewed.

## Risk notes

- `checkout` major-version security behaviour should be reviewed for this pull-request workflow.
- `upload-pages-artifact` must continue including every required `dist` file; this site does not depend on hidden public files.
- A successful test workflow does not by itself authorise a production deployment.

Official GitHub release pages are the source for the listed versions and immutable SHAs.
