#!/usr/bin/env python3
"""Deterministic COD Cohort & Sensitivity Calculator for Zyra Care (Zero Double-Counting)."""
import argparse


def calculate_cohort(
    placed_orders: int,
    cancelled_before_ship: int,
    rto_orders: int,
    ad_spend: float,
    collected_rev_per_delivered: float,
    cogs_per_delivered: float,
    packaging_per_shipped: float,
    forward_ship_per_shipped: float,
    rto_return_fee: float,
    cod_fee_pct: float = 0.02,
):
    shipped_orders = placed_orders - cancelled_before_ship
    delivered_orders = shipped_orders - rto_orders
    if placed_orders <= 0 or shipped_orders <= 0 or delivered_orders <= 0:
        raise ValueError("Order counts must result in positive placed, shipped, and delivered orders.")

    net_delivery_rate = delivered_orders / placed_orders
    placed_cpp = ad_spend / placed_orders
    delivered_cpp = ad_spend / delivered_orders

    net_collected_revenue = delivered_orders * collected_rev_per_delivered
    total_cogs = delivered_orders * cogs_per_delivered
    total_packaging = shipped_orders * packaging_per_shipped
    total_forward_ship = shipped_orders * forward_ship_per_shipped
    total_rto_fees = rto_orders * rto_return_fee
    total_cod_fees = net_collected_revenue * cod_fee_pct

    total_ops_costs = total_cogs + total_packaging + total_forward_ship + total_rto_fees + total_cod_fees
    contrib_before_ads = net_collected_revenue - total_ops_costs
    cohort_contrib_profit = contrib_before_ads - ad_spend

    gross_profit = net_collected_revenue - total_cogs
    contrib_per_placed = cohort_contrib_profit / placed_orders
    cohort_contrib_per_delivered = cohort_contrib_profit / delivered_orders

    individual_delivered_contrib = (
        collected_rev_per_delivered
        - cogs_per_delivered
        - packaging_per_shipped
        - forward_ship_per_shipped
        - (collected_rev_per_delivered * cod_fee_pct)
        - delivered_cpp
    )

    breakeven_placed_cpp = contrib_before_ads / placed_orders
    breakeven_delivered_cpp = contrib_before_ads / delivered_orders

    return {
        "placed_orders": placed_orders,
        "shipped_orders": shipped_orders,
        "delivered_orders": delivered_orders,
        "rto_orders": rto_orders,
        "net_delivery_rate_pct": round(net_delivery_rate * 100, 2),
        "placed_cpp": round(placed_cpp, 2),
        "delivered_cpp": round(delivered_cpp, 2),
        "net_collected_revenue": round(net_collected_revenue, 2),
        "gross_profit": round(gross_profit, 2),
        "contrib_before_ads": round(contrib_before_ads, 2),
        "cohort_contrib_profit": round(cohort_contrib_profit, 2),
        "contrib_per_placed": round(contrib_per_placed, 2),
        "cohort_contrib_per_delivered": round(cohort_contrib_per_delivered, 2),
        "individual_delivered_contrib": round(individual_delivered_contrib, 2),
        "breakeven_placed_cpp": round(breakeven_placed_cpp, 2),
        "breakeven_delivered_cpp": round(breakeven_delivered_cpp, 2),
    }


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--placed", type=int, default=100)
    p.add_argument("--cancelled", type=int, default=10)
    p.add_argument("--rto", type=int, default=18)
    p.add_argument("--spend", type=float, default=16000.0)
    p.add_argument("--rev", type=float, default=850.0)
    p.add_argument("--cogs", type=float, default=240.0)
    p.add_argument("--pack", type=float, default=20.0)
    p.add_argument("--ship", type=float, default=70.0)
    p.add_argument("--rto_fee", type=float, default=50.0)
    p.add_argument("--cod_pct", type=float, default=0.02)
    args = p.parse_args()
    res = calculate_cohort(
        args.placed, args.cancelled, args.rto, args.spend, args.rev,
        args.cogs, args.pack, args.ship, args.rto_fee, args.cod_pct
    )
    for k, v in res.items():
        print(f"{k}: {v}")
