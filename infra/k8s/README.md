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

## 적용 예시

```bash
kubectl apply -k infra/k8s/base
```
