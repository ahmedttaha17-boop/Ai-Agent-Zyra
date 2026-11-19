#!/usr/bin/env python3
"""Meta Marketing API helper for Zyra Care (read-only usage).

Auth: the System User access token lives in Muse's secure connection
`custom.meta-marketing-api`. This helper only ever handles a surrogate;
the real token is swapped in on approved requests to graph.facebook.com.
Never print, log, or store the token here.

Usage:
  meta_api.py me
  meta_api.py adaccounts
  meta_api.py insights <act_id> [--days N]
"""
import json
import sys
import urllib.parse
import urllib.request

sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request, read_json_response

PROVIDER = "custom.meta-marketing-api"
HOST = "graph.facebook.com"
API_VERSION = "v22.0"
BASE = f"https://{HOST}/{API_VERSION}"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused, verify the endpoint")


def get(path, params=None):
    url = BASE + path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    request = urllib.request.Request(url)
    add_surrogate_to_request(request, PROVIDER, allowed_hosts=[HOST])
    opener = urllib.request.build_opener(NoRedirect())
    try:
        with opener.open(request, timeout=90) as response:
            return read_json_response(response)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace")
        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            payload = {"raw": body}
        return {"http_status": exc.code, "error_body": payload}


def cmd_me():
    return get("/me", {"fields": "id,name"})


def cmd_adaccounts():
    return get(
        "/me/adaccounts",
        {
            "fields": "id,account_id,name,account_status,currency,timezone_name,amount_spent,balance",
            "limit": 100,
        },
    )


def cmd_insights(act_id, days=30):
    return get(
        f"/{act_id}/insights",
        {
            "fields": "campaign_name,impressions,reach,clicks,spend,actions,cost_per_action_type",
            "date_preset": f"last_{days}d",
            "level": "campaign",
            "limit": 100,
        },
    )


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    command = argv[1]
    if command == "me":
        result = cmd_me()
    elif command == "adaccounts":
        result = cmd_adaccounts()
    elif command == "insights":
        if len(argv) < 3:
            print("usage: meta_api.py insights <act_id> [--days N]")
            return 2
        days = 30
        if "--days" in argv:
            days = int(argv[argv.index("--days") + 1])
        result = cmd_insights(argv[2], days)
    else:
        print(f"unknown command: {command}")
        return 2
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
