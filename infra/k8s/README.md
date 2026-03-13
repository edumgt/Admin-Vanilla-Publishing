# On Prem Kubernetes

사내 Kubernetes 클러스터에서 사용할 기본 리소스 템플릿입니다.

## 포함 항목

- `base/kustomization.yaml`
- `base/namespace.yaml`
- `base/configmap.yaml`
- `base/secret.example.yaml`
- `base/postgres-statefulset.yaml`
- `base/backend-deployment.yaml`
- `base/frontend-deployment.yaml`
- `base/ingress.yaml`
- `overlays/dev/kustomization.yaml`

## 적용 예시

```bash
kubectl apply -k infra/k8s/base
```

개발환경 overlay:

```bash
kubectl apply -k infra/k8s/overlays/dev
```

`overlays/dev` 는 다음을 분리합니다.

- namespace: `admin-vanilla-dev`
- ingress host: `dev.app.example.com`, `dev-api.example.com`
- replica: backend/frontend `1`
- `APP_ENV=development`
- PostgreSQL PVC: `5Gi`
