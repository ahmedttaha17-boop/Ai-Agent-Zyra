# Meta Marketing Api

- `custom.meta-marketing-api` connects Muse to the Meta Marketing API over the REST Graph API. It authenticates with the registered `api_key` credential and calls only `graph.facebook.com`.

- The credential is a Meta System User access token with the `ads_read` permission only, so every call through this connector is read-only by design.

- Helpers live in `~/workspace/custom-connectors/custom.meta-marketing-api/bin/`. The one helper is `meta_api.py`, which reads the signed-in system user, lists the ad accounts the token can reach, and pulls campaign-level insights for one ad account.

## Connect

- The connection was registered with `credentials.request_api_access` and these details. Reuse them to reconnect:

```json
{
  "provider": "meta-marketing-api",
  "auth_scheme": "api_key",
  "placement": "bearer_header",
  "api_hosts": ["graph.facebook.com"]
}
```

- The token was generated on 2026-11-18 in the user's own Chrome from the user's Meta Business (business_id 1308443520923864), using the user's existing app named "zyra os" (app id 3314825588725656), and pasted into the secure vault page by the browser task. It never passed through chat.

- Before the first use in a conversation, prove access with a harmless read:

```text
python3 ~/workspace/custom-connectors/custom.meta-marketing-api/bin/meta_api.py me
```

## Credentials

- The registered connection holds the credential. Helpers import `/opt/muse/skills/custom-connector-setup/bin/dynamic_credentials.py`, which returns an `hsurr:` surrogate and places it where the provider reads the key. Muse swaps in the real credential only on an approved request to a registered host.

- Never put a key, token, password or cookie in this doc, a helper, a command argument, an environment variable or a log. Never ask the user to paste one in chat.

- Keep redirects disabled on authenticated requests.

- On a 401 or 403, check the request first. Confirm that the helper attached the credential, that the host is registered and that the placement and scopes match.

- Only when a request that carried the credential is still rejected, call `credentials.request_api_access` with the details above and `"reconnect": true`.

## Read the system user

- Read the system user the token belongs to. Use it as the first harmless proof that the token works. This operation reads data and changes nothing. It is untested against Meta so far, for the egress reason recorded under Recover from errors.

```text
python3 ~/workspace/custom-connectors/custom.meta-marketing-api/bin/meta_api.py me
```

- The command calls `GET /v22.0/me` with fields `id,name` and prints the JSON response. Keep the returned `id` as the system user ID.

## List ad accounts

- List the ad accounts assigned to the system user. Use it to identify the user's main Zyra Care ad account before pulling any performance data. This operation reads data and changes nothing. It is untested against Meta so far, for the egress reason recorded under Recover from errors.

```text
python3 ~/workspace/custom-connectors/custom.meta-marketing-api/bin/meta_api.py adaccounts
```

- The command calls `GET /v22.0/me/adaccounts` with a limit of 100 and prints `id`, `account_id`, `name`, `account_status`, `currency`, `timezone_name`, `amount_spent` and `balance` for each account. Keep the chosen account `id`, which carries the `act_` prefix the insights command needs.

## Pull campaign insights

- Pull campaign-level insights for one ad account over a recent window. Use it for performance diagnosis after the account is confirmed. This operation reads data and changes nothing. It is untested against Meta so far, for the egress reason recorded under Recover from errors.

```text
python3 ~/workspace/custom-connectors/custom.meta-marketing-api/bin/meta_api.py insights <act_id> --days 30
```

- The command calls `GET /v22.0/<act_id>/insights` at campaign level with a `last_<days>d` date preset and prints `campaign_name`, `impressions`, `reach`, `clicks`, `spend`, `actions` and `cost_per_action_type`. The `--days` flag defaults to 30.

## Recover from errors

- As of 2026-11-18, authenticated helper calls are refused at the Muse egress layer with a generic proxy HTML 4xx page before the request reaches Meta. The same host answers an unauthenticated request with a normal Meta JSON error, and the surrogate check passes locally, so the token itself has not been judged by Meta yet. Do not reconnect the credential for this failure, because Meta never rejected it.

- When the egress refusal clears, run `me` first, then `adaccounts`, and only then treat the operations above as verified. Update this doc with what the calls actually returned.

- After a failed or timed-out change, check the current state with a read before trying again, because the first request may have completed. Every operation in this connector is a read, so retries are safe.

## Limits

- This connector is read-only. The token holds `ads_read` only, so it cannot create, edit, pause or delete any campaign, ad set, ad or budget, and it must never be used to try.

- Per the user's data policy, pull performance data only from the relaunch baseline onward once pulling works. Pre-relaunch performance is not a reference, and historical data counts as customer data only.

- No operation in this doc has returned live Meta data yet. Treat every operation as untested until the first successful pull is recorded here.

## Related skills

- [ZYRA Andromeda Ad System](~/workspace/custom-skills/zyra-andromeda-ad-system/SKILL.md)

- [Master Growth OS](~/workspace/custom-skills/master-growth-os/SKILL.md)

- Use `muse.skill_search` to find other skills and `muse.connector_search` to find other connectors.
