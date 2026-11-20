#!/usr/bin/env python3
"""ZYRA budget scenario simulator — deterministic, no double counting.
Given a daily budget per routine and a CPM band, estimate reach, clicks,
orders and Placed CPP ranges under CTR/CVR scenario bands, and compare
against the hero gates: target CPP 150-160, scale ceiling 180, break-even 275.
Economics per delivered order come from cod_cohort_calc assumptions
(contribution/delivered before ads = 381 EGP at 72% net delivery)."""
import json, sys

GATES = {"target_cpp": 160, "scale_ceiling": 180, "break_even_cpp": 275, "contribution_per_delivered": 381, "net_delivery": 0.72}
SCENARIOS = {  # (CTR, landing CVR) bands for Egyptian beauty e-commerce statics/UGC
    "ضعيف": (0.008, 0.020),
    "متوسط": (0.014, 0.030),
    "قوي": (0.020, 0.038),
}

def simulate(daily_budget, days, cpm):
    out = {"daily_budget": daily_budget, "days": days, "cpm": cpm, "scenarios": {}}
    impressions_day = daily_budget / cpm * 1000
    for name, (ctr, cvr) in SCENARIOS.items():
        orders_day = impressions_day * ctr * cvr
        cpp = daily_budget / orders_day if orders_day else float("inf")
        total_orders = orders_day * days
        delivered = total_orders * GATES["net_delivery"]
        contribution = delivered * GATES["contribution_per_delivered"] - daily_budget * days
        verdict = "SCALE ZONE" if cpp <= GATES["scale_ceiling"] else ("ABOVE CEILING, BELOW BREAK-EVEN" if cpp <= GATES["break_even_cpp"] else "LOSS ZONE")
        out["scenarios"][name] = {
            "impressions_per_day": round(impressions_day),
            "orders_per_day": round(orders_day, 1),
            "placed_cpp": round(cpp),
            "orders_in_period": round(total_orders),
            "net_contribution_after_ads": round(contribution),
            "verdict": verdict,
        }
    return out

if __name__ == "__main__":
    # Relaunch test scenarios: per-routine daily budgets x CPM bands (normal / White Friday peak / December ease)
    runs = []
    for budget in (500, 1000, 2000):
        for label, cpm in (("CPM عادي ~110", 110), ("CPM ذروة وايت فرايداي ~170", 170), ("CPM ديسمبر ~90", 90)):
            r = simulate(budget, 7, cpm)
            r["cpm_band"] = label
            runs.append(r)
    print(json.dumps({"gates": GATES, "runs": runs}, ensure_ascii=False, indent=1))
