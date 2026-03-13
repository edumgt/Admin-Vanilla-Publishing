# On Prem Docker Compose

사내 단일 서버 또는 소규모 VM 환경에서 빠르게 기동하기 위한 기본 구성입니다.

## 포함 항목

- `docker-compose.onprem.yml`
- `.env.example`
- `nginx/default.conf`

## 기본 구조

- Frontend: `nginx`
- Backend: `python:3.12-slim` + `backend_fastapi`
- Database: `postgres:16-alpine`

## 실행 예시

```bash
cp infra/docker/.env.example infra/docker/.env
docker compose --env-file infra/docker/.env -f infra/docker/docker-compose.onprem.yml up -d
```
