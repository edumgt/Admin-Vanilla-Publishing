#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-ap-northeast-2}"
STACK_NAME="${STACK_NAME:-admin-vanilla-platform}"
PROJECT_NAME="${PROJECT_NAME:-admin-vanilla}"
STAGE_NAME="${STAGE_NAME:-prod}"
FRONTEND_BUCKET="${FRONTEND_BUCKET:-${PROJECT_NAME}-frontend-${STAGE_NAME}}"
ALLOWED_ORIGIN="${ALLOWED_ORIGIN:-https://app.example.com}"
DATABASE_URL="${DATABASE_URL:-sqlite:////tmp/admin-vanilla.db}"

require() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "[ERROR] Missing required command: $1" >&2
    exit 1
  }
}

require aws
require sam

sam build --template-file infra/aws/template.yaml

sam deploy \
  --stack-name "${STACK_NAME}" \
  --region "${REGION}" \
  --resolve-s3 \
  --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
  --template-file .aws-sam/build/template.yaml \
  --parameter-overrides \
    "ProjectName=${PROJECT_NAME}" \
    "StageName=${STAGE_NAME}" \
    "AllowedOrigin=${ALLOWED_ORIGIN}" \
    "FrontendBucketName=${FRONTEND_BUCKET}" \
    "DatabaseUrl=${DATABASE_URL}"

echo "[INFO] Stack outputs"
aws cloudformation describe-stacks \
  --stack-name "${STACK_NAME}" \
  --region "${REGION}" \
  --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
  --output table
