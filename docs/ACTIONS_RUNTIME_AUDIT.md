# GitHub Actions runtime audit

Reviewed: 15 July 2026

## Result

All GitHub-owned Actions used by the portfolio are pinned to immutable commit SHAs and current Node.js 24-compatible official releases.

| Action | Immutable pin | Release |
|---|---|---|
| `actions/checkout` | `9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0` | v7 |
| `actions/setup-node` | `820762786026740c76f36085b0efc47a31fe5020` | v7 |
| `actions/configure-pages` | `45bfe0192ca1faeb007ade9deae92b16b8254a0d` | v6 |
| `actions/upload-pages-artifact` | `fc324d3547104276b827a68afc52ff2a11cc49c9` | v5 |
| `actions/deploy-pages` | `cd2ce8fcbc39b97be8ca5fce6e763baed58fa128` | v5 |
| `actions/upload-artifact` | `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a` | v7.0.1 |

The browser and Lighthouse evidence workflows moved from `upload-artifact` v4.6.2 to v7.0.1 after reviewing the official release notes. Existing archive behaviour, artifact names, paths, retention and missing-file failure policy are unchanged. The hosted GitHub runner satisfies the documented runner requirement.

The production verifier records its durable result in the workflow job summary. It no longer writes every deployment result to a hard-coded historical pull request, allowing least-privilege `contents: read` permissions.

Lighthouse now records three mobile cold-cache passes per representative route and enforces a 95 performance median, while retaining an 85 floor for every individual run. This prevents one transient hosted-run outlier from hiding a genuine regression or incorrectly blocking an otherwise stable release.

## Change control

- Use official GitHub-owned repositories only.
- Pin complete immutable commit SHAs and retain readable release comments.
- Preserve least-privilege permissions, main-only production deployment, `dist` artifact behaviour and custom-domain verification.
- Treat a successful workflow test as evidence, not automatic authorisation for unrelated infrastructure changes.
