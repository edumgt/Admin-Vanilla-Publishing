import base64
import hashlib
import hmac
import json
from datetime import UTC, datetime, timedelta
from typing import Any


class TokenError(Exception):
    pass


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _b64url_decode(raw: str) -> bytes:
    padding = "=" * (-len(raw) % 4)
    return base64.urlsafe_b64decode(raw + padding)


def _json_bytes(payload: dict[str, Any]) -> bytes:
    return json.dumps(payload, separators=(",", ":"), ensure_ascii=True).encode("utf-8")


def encode_token(payload: dict[str, Any], secret_key: str) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    encoded_header = _b64url_encode(_json_bytes(header))
    encoded_payload = _b64url_encode(_json_bytes(payload))
    signing_input = f"{encoded_header}.{encoded_payload}".encode("ascii")
    signature = hmac.new(secret_key.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{encoded_header}.{encoded_payload}.{_b64url_encode(signature)}"


def decode_token(token: str, secret_key: str, expected_type: str | None = None) -> dict[str, Any]:
    try:
        encoded_header, encoded_payload, encoded_signature = token.split(".")
    except ValueError as exc:
        raise TokenError("Malformed token") from exc

    signing_input = f"{encoded_header}.{encoded_payload}".encode("ascii")
    expected_signature = hmac.new(
        secret_key.encode("utf-8"),
        signing_input,
        hashlib.sha256,
    ).digest()

    if not hmac.compare_digest(_b64url_decode(encoded_signature), expected_signature):
        raise TokenError("Invalid signature")

    try:
        payload = json.loads(_b64url_decode(encoded_payload))
    except (json.JSONDecodeError, ValueError) as exc:
        raise TokenError("Invalid payload") from exc

    exp = payload.get("exp")
    if not isinstance(exp, int) or exp < int(datetime.now(UTC).timestamp()):
        raise TokenError("Token expired")

    token_type = payload.get("type")
    if expected_type and token_type != expected_type:
        raise TokenError("Unexpected token type")

    return payload


def issue_token_pair(
    *,
    secret_key: str,
    username: str,
    member_id: str,
    extra_claims: dict[str, Any] | None,
    access_ttl_minutes: int,
    refresh_ttl_minutes: int,
) -> dict[str, Any]:
    now = datetime.now(UTC)
    access_expires_at = now + timedelta(minutes=access_ttl_minutes)
    refresh_expires_at = now + timedelta(minutes=refresh_ttl_minutes)

    base_claims = {
        "sub": member_id,
        "username": username,
        "iat": int(now.timestamp()),
    }
    if extra_claims:
        base_claims.update(extra_claims)

    access_claims = {
        **base_claims,
        "type": "access",
        "exp": int(access_expires_at.timestamp()),
    }
    refresh_claims = {
        "sub": member_id,
        "username": username,
        "type": "refresh",
        "iat": int(now.timestamp()),
        "exp": int(refresh_expires_at.timestamp()),
    }

    access_token = encode_token(access_claims, secret_key)
    refresh_token = encode_token(refresh_claims, secret_key)
    return {
        "token": access_token,
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "expiresAt": access_expires_at.isoformat(),
        "refreshExpiresAt": refresh_expires_at.isoformat(),
    }
