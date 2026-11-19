#!/usr/bin/env python3
"""Independent Deterministic Compliance & Structure Validator for Zyra Care Outputs (Stage 6: VALIDATE)."""
import argparse
import json
import re
import sys

BANNED_MEDICAL_TERMS = ["علاج", "يعالج", "نهائي", "نهائياً", "يقضي للأبد", "مضمون 100%", "مرض"]
UNVERIFIED_EXTERNAL_CLAIMS = ["عيادات", "جلسات", "ضمان 14", "١٤ يوم", "10,000 عميلة", "+10000"]
PERSONAL_ATTRIBUTE_PATTERNS = [
    r"عندك\s+سيلوليت",
    r"دراعك\s+زي\s+الرملة",
    r"جسمك\s+في",
    r"بتطفي\s+النور",
]


def validate_creative_text(text: str, is_cellulite_or_retinol: bool = False, shopify_verified: bool = False):
    errors = []
    warnings = []

    for term in BANNED_MEDICAL_TERMS:
        if term in text:
            errors.append(f"BANNED_MEDICAL_TERM: '{term}' found in copy.")

    for claim in UNVERIFIED_EXTERNAL_CLAIMS:
        if claim in text:
            warnings.append(f"UNVERIFIED_CLAIM: '{claim}' requires verified policy/source before publishing.")

    for pat in PERSONAL_ATTRIBUTE_PATTERNS:
        if re.search(pat, text):
            warnings.append(f"PERSONAL_ATTRIBUTE_RISK: Pattern '{pat}' may trigger Meta Personal Attributes policy.")

    if is_cellulite_or_retinol:
        if "ريتينول" not in text or "الحمل" not in text:
            errors.append("MISSING_RETINOL_WARNING: Cellulite/Retinol copy must include pregnancy/lactation warning.")

    if not shopify_verified and ("Ready to Publish" in text or "جاهز للنشر" in text):
        errors.append("PREMATURE_PUBLISH_CLAIM: Cannot mark Ready to Publish while Shopify data is unverified.")

    status = "PASS" if not errors and not warnings else ("CONDITIONAL_REVIEW" if not errors else "FAIL")
    return {
        "validator_status": status,
        "errors": errors,
        "warnings": warnings,
        "passed_checks": [
            "medical_claims_scan",
            "unverified_claims_scan",
            "personal_attributes_scan",
            "retinol_disclaimer_check" if is_cellulite_or_retinol else "general_product_check",
            "shopify_readiness_gate",
        ],
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", type=str, required=True, help="Ad copy or creative text to validate")
    parser.add_argument("--retinol", action="store_true", help="Flag if product is Cellulite / contains Retinol")
    parser.add_argument("--shopify_verified", action="store_true", help="Flag if Shopify live data is verified")
    args = parser.parse_args()

    result = validate_creative_text(args.text, args.retinol, args.shopify_verified)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if result["errors"]:
        sys.exit(1)
