#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-ap-northeast-2}"
PROJECT_NAME="${PROJECT_NAME:-admin-vanilla}"
STAGE_NAME="${STAGE_NAME:-prod}"
DEPLOY_BUCKET="${DEPLOY_BUCKET:-${PROJECT_NAME}-sam-artifacts-${REGION}}"
FRONTEND_BUCKET="${FRONTEND_BUCKET:-${PROJECT_NAME}-frontend-${STAGE_NAME}}"

require() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "[ERROR] Missing required command: $1" >&2
    exit 1
  }
}

require aws

echo "[INFO] AWS account"
aws sts get-caller-identity

echo "[INFO] Ensuring SAM artifact bucket: ${DEPLOY_BUCKET}"
if ! aws s3api head-bucket --bucket "${DEPLOY_BUCKET}" 2>/dev/null; then
  aws s3 mb "s3://${DEPLOY_BUCKET}" --region "${REGION}"
fi
aws s3api put-bucket-versioning \
  --bucket "${DEPLOY_BUCKET}" \
  --versioning-configuration Status=Enabled

echo "[INFO] Ensuring frontend bucket: ${FRONTEND_BUCKET}"
if ! aws s3api head-bucket --bucket "${FRONTEND_BUCKET}" 2>/dev/null; then
  aws s3 mb "s3://${FRONTEND_BUCKET}" --region "${REGION}"
fi
aws s3api put-public-access-block \
  --bucket "${FRONTEND_BUCKET}" \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

cat <<EOF
[NEXT]
1. export STACK_NAME=${PROJECT_NAME}-platform
2. ./scripts/aws/02-deploy-serverless-stack.sh
3. ./scripts/aws/03-sync-frontend.sh
EOF
