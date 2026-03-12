# AWS Cloud Serverless

Lambda + API Gateway 백엔드와 S3 + CloudFront 프론트를 기준으로 한 초기 스캐폴드입니다.

## 포함 항목

- `template.yaml`
- `parameters.aws-cloud.example.json`
- `Makefile`
- `lambda_handler.py`
- `requirements.lambda.txt`
- `steering/` optional ops cluster manifests

## 기본 흐름

```bash
sam build --template-file infra/aws/template.yaml
sam deploy --guided --template-file infra/aws/template.yaml
aws s3 sync public/ s3://<frontend-bucket> --delete
```

## Steering Cluster

운영용 steering plane 이 필요하면 `scripts/aws/11-create-steering-cluster.sh` 와
`scripts/aws/12-bootstrap-steering-addons.sh` 를 사용합니다.
