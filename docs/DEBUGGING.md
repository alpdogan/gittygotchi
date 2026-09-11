# Debugging

These commands are for local debugging against public GitHub pages. They are not used by CI.

## GitHub user

```bash
curl -s \
  -H "User-Agent: GittyGotchi/1.0 (+https://github.com/alpdogan/gittygotchi)" \
  "https://api.github.com/users/alpdogan" | jq
```

## Contribution HTML

```bash
curl -L -s \
  -H "User-Agent: GittyGotchi/1.0 (+https://github.com/alpdogan/gittygotchi)" \
  "https://github.com/users/alpdogan/contributions"
```

## Known date

```bash
curl -L -s \
  "https://github.com/users/alpdogan/contributions" \
  | grep 'data-date="2026-09-08"'
```

## Contribution cells

```bash
curl -L -s \
  "https://github.com/users/alpdogan/contributions" \
  | grep 'ContributionCalendar-day'
```

Phase 1 does not fetch these endpoints. They exist so later GitHub adapter work can be compared against captured fixtures.
