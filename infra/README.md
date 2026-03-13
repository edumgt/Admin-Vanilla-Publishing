# Deployment Scaffolds

업무용 소프트웨어 PaaS 스타일 설치를 위한 초기 배포 스캐폴드 모음입니다.

## 디렉터리

- `setup.profile.example.json`: 공통 초기 설정 프로파일
- `aws/`: Lambda + API Gateway + S3 + CloudFront 기준 서버리스 스캐폴드
- `docker/`: 온프레미스 Docker Compose 기준 스캐폴드
- `k8s/`: 온프레미스 Kubernetes 기준 스캐폴드

브라우저에서 `http://localhost:8000/infra/...` 경로로 각 파일을 열 수 있습니다.
