const STORAGE_KEY = "paasSetupProfile";

const defaultState = {
    environmentType: "aws-cloud",
    onPremMode: "docker-compose",
    profileName: "admin-vanilla-prod",
    allowedOrigin: "https://app.example.com",
    appDomain: "app.example.com",
    apiDomain: "api.example.com",
    awsRegion: "ap-northeast-2",
    awsStackName: "admin-vanilla-platform",
    frontendBucketName: "admin-vanilla-frontend-prod",
    dockerProjectName: "admin-vanilla",
    frontendPort: "8080",
    backendPort: "8000",
    postgresPort: "5432",
    k8sNamespace: "admin-vanilla",
    ingressHost: "app.example.com",
    apiIngressHost: "api.example.com",
    k8sReplicas: "2",
};

const environmentOptions = [
    {
        value: "aws-cloud",
        label: "AWS Cloud",
        badge: "Managed",
        cssClass: "is-aws",
        description: "백엔드는 Lambda + API Gateway, 프론트는 S3 + CloudFront 조합으로 배치합니다.",
    },
    {
        value: "onprem",
        label: "On Prem",
        badge: "Self-hosted",
        cssClass: "is-onprem",
        description: "사내 네트워크 기준으로 Docker Compose 또는 Kubernetes 중 하나로 운영합니다.",
    },
];

const onPremOptions = [
    {
        value: "docker-compose",
        label: "Docker Compose",
        badge: "Fast Start",
        cssClass: "is-docker",
        description: "DB, 백엔드, 프론트를 단일 서버 또는 소규모 노드에서 빠르게 기동합니다.",
    },
    {
        value: "kubernetes",
        label: "Kubernetes",
        badge: "Scale Out",
        cssClass: "is-kubernetes",
        description: "Ingress, ConfigMap, Secret, StatefulSet 기준으로 운영 환경을 분리합니다.",
    },
];

const fieldGroups = {
    common: [
        {
            name: "profileName",
            label: "프로파일 이름",
            type: "text",
            help: "설정 JSON과 배포 프리셋에 공통으로 들어가는 식별자입니다.",
        },
        {
            name: "allowedOrigin",
            label: "허용 Origin",
            type: "text",
            help: "백엔드 CORS 허용 도메인입니다.",
        },
    ],
    "aws-cloud": [
        {
            name: "appDomain",
            label: "CloudFront 도메인",
            type: "text",
            help: "최종 사용자 접속 도메인 또는 CNAME 입니다.",
        },
        {
            name: "apiDomain",
            label: "API Gateway 도메인",
            type: "text",
            help: "API Gateway 커스텀 도메인 또는 서브도메인입니다.",
        },
        {
            name: "awsRegion",
            label: "AWS Region",
            type: "select",
            options: ["ap-northeast-2", "ap-northeast-1", "us-east-1", "us-west-2"],
            help: "Lambda와 API Gateway를 배포할 리전입니다.",
        },
        {
            name: "awsStackName",
            label: "SAM/CloudFormation Stack",
            type: "text",
            help: "배포 스택 이름입니다.",
        },
        {
            name: "frontendBucketName",
            label: "S3 Frontend Bucket",
            type: "text",
            help: "정적 파일 업로드용 S3 버킷 이름입니다.",
        },
    ],
    "docker-compose": [
        {
            name: "dockerProjectName",
            label: "Docker Project",
            type: "text",
            help: "Compose 프로젝트 이름입니다.",
        },
        {
            name: "frontendPort",
            label: "Frontend Port",
            type: "number",
            help: "Nginx 정적 프론트 포트입니다.",
        },
        {
            name: "backendPort",
            label: "Backend Port",
            type: "number",
            help: "FastAPI 서비스 포트입니다.",
        },
        {
            name: "postgresPort",
            label: "PostgreSQL Port",
            type: "number",
            help: "DB 외부 노출 포트입니다.",
        },
    ],
    kubernetes: [
        {
            name: "k8sNamespace",
            label: "Namespace",
            type: "text",
            help: "Kubernetes 리소스를 분리할 네임스페이스입니다.",
        },
        {
            name: "ingressHost",
            label: "Frontend Ingress Host",
            type: "text",
            help: "업무 화면 진입용 호스트입니다.",
        },
        {
            name: "apiIngressHost",
            label: "Backend Ingress Host",
            type: "text",
            help: "API 진입용 호스트입니다.",
        },
        {
            name: "k8sReplicas",
            label: "Backend Replicas",
            type: "number",
            help: "백엔드 디플로이먼트의 기본 replica 수입니다.",
        },
    ],
};

const setupBlueprints = {
    "aws-cloud": {
        label: "AWS Cloud",
        tag: "Lambda + API Gateway / S3 + CloudFront",
        summaryPoints: [
            "서버리스 API 진입점과 정적 웹 배포를 분리합니다.",
            "SAM 템플릿과 Makefile 기반으로 초기 배포 구조를 제공합니다.",
            "공통 설정 JSON, 파라미터 예제, Lambda 어댑터를 같이 제공합니다.",
        ],
        diagram: {
            path: "/assets/img/architecture/aws-serverless-architecture.svg",
            alt: "AWS Cloud Serverless architecture with API Gateway, Lambda, S3, CloudFront and optional steering EKS cluster",
            caption: "AWS Cloud 기본 경로는 Lambda + API Gateway + S3 + CloudFront 이며, 하단에는 eksctl/kubectl 기반의 optional steering cluster 를 분리해 두었습니다.",
        },
        architecture: [
            {
                title: "Frontend Edge",
                description: "S3 버킷에 정적 산출물을 적재하고 CloudFront로 글로벌 캐시를 구성합니다.",
            },
            {
                title: "Backend API",
                description: "API Gateway가 `/api`, `/db`, `/auth`, `/upload`, `/health` 요청을 Lambda로 전달합니다.",
            },
            {
                title: "Deployment Build",
                description: "SAM Makefile 빌드가 FastAPI 앱과 Lambda 어댑터를 하나의 아티팩트로 패키징합니다.",
            },
            {
                title: "Config Control",
                description: "Region, Stack, Bucket, CORS 값은 파라미터 JSON과 공통 프로파일에서 시작합니다.",
            },
        ],
        timeline: [
            "공통 `setup.profile.example.json`에서 배포 프로파일과 허용 Origin을 확정합니다.",
            "AWS 파라미터 파일에서 Region, Stack, Frontend Bucket, Lambda 메모리를 조정합니다.",
            "SAM 빌드와 배포 후 정적 파일을 S3에 sync 하고 CloudFront invalidation 을 수행합니다.",
            "프론트의 `APP_API_BASE`를 API Gateway 도메인으로 고정해 운영 연결을 마무리합니다.",
        ],
        installs: [
            {
                title: "필수 도구",
                description: "AWS CLI, SAM CLI, Python 3.12가 필요합니다.",
                items: ["awscli", "sam cli", "python 3.12"],
            },
            {
                title: "배포 준비",
                description: "CloudFront와 S3 업로드 권한, Lambda 배포 권한을 가진 IAM 자격증명이 필요합니다.",
                items: ["iam deploy role", "cloudfront invalidation", "s3 sync permission"],
            },
        ],
        artifacts: [
            {
                title: "공통 초기 프로파일",
                path: "/infra/setup.profile.example.json",
                description: "환경 선택값과 공통 도메인/CORS 정책을 정의합니다.",
                tags: ["common", "json"],
            },
            {
                title: "AWS SAM 템플릿",
                path: "/infra/aws/template.yaml",
                description: "Lambda, API Gateway, S3, CloudFront 리소스 스캐폴드를 정의합니다.",
                tags: ["aws", "sam"],
            },
            {
                title: "AWS 파라미터 예제",
                path: "/infra/aws/parameters.aws-cloud.example.json",
                description: "스택명, 버킷명, Origin 등 환경별 값을 넣는 예제 파일입니다.",
                tags: ["aws", "params"],
            },
            {
                title: "Lambda 빌드 스크립트",
                path: "/infra/aws/Makefile",
                description: "FastAPI 앱을 Lambda 아티팩트로 조립하는 SAM Makefile 입니다.",
                tags: ["build", "aws"],
            },
            {
                title: "Lambda 어댑터",
                path: "/infra/aws/lambda_handler.py",
                description: "FastAPI 앱을 Mangum으로 래핑하는 진입점입니다.",
                tags: ["python", "lambda"],
            },
        ],
        commands: [
            {
                title: "SAM Build",
                body: "sam build --template-file infra/aws/template.yaml",
            },
            {
                title: "SAM Deploy",
                body: "sam deploy --guided --template-file infra/aws/template.yaml --parameter-overrides $(jq -r '.[] | \"\\(.ParameterKey)=\\(.ParameterValue)\"' infra/aws/parameters.aws-cloud.example.json)",
            },
            {
                title: "Frontend Sync",
                body: "aws s3 sync public/ s3://<frontend-bucket> --delete\naws cloudfront create-invalidation --distribution-id <distribution-id> --paths '/*'",
            },
        ],
    },
    "docker-compose": {
        label: "On Prem / Docker Compose",
        tag: "Nginx Frontend + FastAPI + PostgreSQL",
        summaryPoints: [
            "사내 단일 VM 또는 소규모 서버군에 빠르게 배치하기 좋은 조합입니다.",
            "프론트는 Nginx, 백엔드는 FastAPI, DB는 PostgreSQL 컨테이너로 분리합니다.",
            "포트, 프로젝트명, CORS 설정을 `.env` 예제로부터 시작합니다.",
        ],
        diagram: {
            path: "/assets/img/architecture/onprem-docker-architecture.svg",
            alt: "On Prem Docker architecture with Nginx, FastAPI and PostgreSQL",
            caption: "온프레미스 Docker Compose 경로는 프론트 정적 Nginx, FastAPI API, PostgreSQL DB를 한 호스트 또는 소규모 서버에 빠르게 올리는 구조입니다.",
        },
        architecture: [
            {
                title: "Frontend Runtime",
                description: "Nginx가 `public/` 정적 리소스를 서빙하고 API 경로는 백엔드로 프록시합니다.",
            },
            {
                title: "Backend Runtime",
                description: "Python 3.12 컨테이너가 `backend_fastapi`를 로드해 FastAPI 서비스를 실행합니다.",
            },
            {
                title: "Stateful Data",
                description: "PostgreSQL 컨테이너는 healthcheck 기반으로 선기동되고 백엔드가 여기에 종속됩니다.",
            },
            {
                title: "Config Control",
                description: "포트와 JWT/CORS 등 운영 기본값은 Compose `.env` 파일에서 관리합니다.",
            },
        ],
        timeline: [
            "공통 프로파일과 Docker `.env`에서 포트, Origin, 비밀값을 확정합니다.",
            "Compose 파일과 Nginx 설정을 적용해 프론트/백엔드 라우팅을 분리합니다.",
            "DB healthcheck 통과 후 백엔드를 기동하고 프론트에서 API 프록시를 검증합니다.",
            "운영 서버의 리버스 프록시 또는 방화벽 정책에 맞춰 외부 포트를 공개합니다.",
        ],
        installs: [
            {
                title: "필수 도구",
                description: "Docker Engine과 Docker Compose 플러그인이 필요합니다.",
                items: ["docker engine", "docker compose"],
            },
            {
                title: "운영 보강",
                description: "로그 수집, 백업, 사내 DNS 또는 리버스 프록시를 추가하는 구성이 일반적입니다.",
                items: ["reverse proxy", "backup job", "monitoring agent"],
            },
        ],
        artifacts: [
            {
                title: "공통 초기 프로파일",
                path: "/infra/setup.profile.example.json",
                description: "환경 유형, 도메인, CORS 기준을 저장합니다.",
                tags: ["common", "json"],
            },
            {
                title: "Docker Compose",
                path: "/infra/docker/docker-compose.onprem.yml",
                description: "DB, 백엔드, 프론트 컨테이너를 한 번에 기동하는 기본 파일입니다.",
                tags: ["docker", "compose"],
            },
            {
                title: "Docker 환경 변수 예제",
                path: "/infra/docker/.env.example",
                description: "포트, DB 계정, JWT 시크릿의 시작값입니다.",
                tags: ["docker", "env"],
            },
            {
                title: "Nginx Reverse Proxy",
                path: "/infra/docker/nginx/default.conf",
                description: "정적 자산과 API 프록시 경로를 분리하는 기본 설정입니다.",
                tags: ["nginx", "proxy"],
            },
        ],
        commands: [
            {
                title: "Compose Up",
                body: "docker compose --env-file infra/docker/.env -f infra/docker/docker-compose.onprem.yml up -d",
            },
            {
                title: "Health Check",
                body: "curl -sS http://127.0.0.1:8000/health\ncurl -sS http://127.0.0.1:8080/config.html",
            },
        ],
    },
    kubernetes: {
        label: "On Prem / Kubernetes",
        tag: "Ingress + Deployments + StatefulSet",
        summaryPoints: [
            "사내 쿠버네티스 클러스터에 맞춘 표준 리소스 구성을 제공합니다.",
            "ConfigMap, Secret, Deployment, StatefulSet, Ingress 를 기본 템플릿으로 나눴습니다.",
            "이미지 태그와 호스트명만 바꾸면 운영 GitOps 흐름에 바로 편입할 수 있습니다.",
        ],
        diagram: {
            path: "/assets/img/architecture/onprem-kubernetes-architecture.svg",
            alt: "On Prem Kubernetes architecture with ingress, frontend deployment, backend deployment and PostgreSQL statefulset",
            caption: "온프레미스 Kubernetes 경로는 Ingress를 진입점으로 두고, 프론트/백엔드 Deployment 와 PostgreSQL StatefulSet 을 분리합니다.",
        },
        architecture: [
            {
                title: "Ingress Layer",
                description: "프론트와 백엔드를 서로 다른 Host 기준으로 라우팅하며 TLS 종단을 맡습니다.",
            },
            {
                title: "Frontend Pod",
                description: "정적 프론트를 서빙하는 Nginx 기반 이미지를 별도 Deployment로 운영합니다.",
            },
            {
                title: "Backend Pod",
                description: "FastAPI 앱은 readiness/liveness probe 와 함께 Replica 기반으로 운영합니다.",
            },
            {
                title: "PostgreSQL Stateful",
                description: "DB는 StatefulSet과 PVC를 사용해 사내 스토리지에 영속화합니다.",
            },
        ],
        timeline: [
            "공통 프로파일과 Namespace/Host/Replica 값을 먼저 확정합니다.",
            "Secret 예제에 DB 자격증명과 JWT 비밀값을 채운 뒤 ConfigMap과 함께 적용합니다.",
            "StatefulSet, Backend, Frontend, Ingress 순서로 배포해 내부/외부 라우팅을 완성합니다.",
            "운영 이미지 레지스트리와 Ingress Controller 정책에 맞춰 태그와 annotation 을 조정합니다.",
        ],
        installs: [
            {
                title: "필수 도구",
                description: "kubectl 과 Helm, 사내 Ingress Controller 가 필요합니다.",
                items: ["kubectl", "helm", "ingress-nginx or equivalent"],
            },
            {
                title: "운영 보강",
                description: "레지스트리 pull secret, 스토리지 클래스, 로그 수집 체계가 일반적으로 추가됩니다.",
                items: ["image pull secret", "storage class", "logging sidecar or agent"],
            },
        ],
        artifacts: [
            {
                title: "공통 초기 프로파일",
                path: "/infra/setup.profile.example.json",
                description: "선택 환경과 공통 도메인/CORS 값을 담는 기준 파일입니다.",
                tags: ["common", "json"],
            },
            {
                title: "Kustomize Entry",
                path: "/infra/k8s/base/kustomization.yaml",
                description: "네임스페이스 이하 기본 리소스를 한 번에 묶는 기준 파일입니다.",
                tags: ["k8s", "kustomize"],
            },
            {
                title: "ConfigMap",
                path: "/infra/k8s/base/configmap.yaml",
                description: "운영 공통 설정과 CORS/포트 값을 보관합니다.",
                tags: ["k8s", "config"],
            },
            {
                title: "Secret 예제",
                path: "/infra/k8s/base/secret.example.yaml",
                description: "DB, JWT, 앱 시크릿의 시작 템플릿입니다.",
                tags: ["k8s", "secret"],
            },
            {
                title: "Backend Deployment",
                path: "/infra/k8s/base/backend-deployment.yaml",
                description: "FastAPI 백엔드와 서비스 리소스를 정의합니다.",
                tags: ["k8s", "backend"],
            },
            {
                title: "Frontend Deployment",
                path: "/infra/k8s/base/frontend-deployment.yaml",
                description: "정적 프론트 서비스와 내부 ClusterIP 서비스를 정의합니다.",
                tags: ["k8s", "frontend"],
            },
            {
                title: "Ingress",
                path: "/infra/k8s/base/ingress.yaml",
                description: "프론트와 API Host 라우팅을 분기합니다.",
                tags: ["k8s", "ingress"],
            },
        ],
        commands: [
            {
                title: "Apply Base",
                body: "kubectl apply -k infra/k8s/base",
            },
            {
                title: "Rollout Check",
                body: "kubectl -n admin-vanilla get pods,svc,ingress\nkubectl -n admin-vanilla rollout status deploy/admin-vanilla-backend",
            },
        ],
    },
};

const refs = {
    environmentSwitch: document.getElementById("environment-switch"),
    onpremSwitch: document.getElementById("onprem-switch"),
    form: document.getElementById("setup-form"),
    saveButton: document.getElementById("save-setup"),
    downloadButton: document.getElementById("download-setup"),
    resetButton: document.getElementById("reset-setup"),
    status: document.getElementById("setup-status"),
    summaryCard: document.getElementById("setup-summary-card"),
    architectureTitle: document.getElementById("architecture-title"),
    environmentChip: document.getElementById("environment-chip"),
    architectureGrid: document.getElementById("architecture-grid"),
    architectureVisual: document.getElementById("architecture-visual"),
    timelineGrid: document.getElementById("timeline-grid"),
    installGrid: document.getElementById("install-grid"),
    artifactList: document.getElementById("artifact-list"),
    commandList: document.getElementById("command-list"),
    jsonPreview: document.getElementById("json-preview"),
};

let state = loadState();

document.addEventListener("DOMContentLoaded", () => {
    document.title = "환경 셋업 | Admin Vanilla Publishing";
    const breadcrumb = document.querySelector(".breadcrumb");
    if (breadcrumb) {
        breadcrumb.textContent = "Settings / PaaS Setup";
    }

    bindEvents();
    render();
});

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        return { ...defaultState, ...saved };
    } catch (error) {
        console.warn("Failed to parse saved PaaS setup state.", error);
        return { ...defaultState };
    }
}

function bindEvents() {
    refs.environmentSwitch.addEventListener("click", handleEnvironmentSelection);
    refs.onpremSwitch.addEventListener("click", handleOnPremSelection);
    refs.form.addEventListener("input", handleFormInput);
    refs.form.addEventListener("change", handleFormInput);

    refs.saveButton.addEventListener("click", () => {
        persistState();
        setStatus("현재 환경 셋업 선택값을 브라우저에 저장했습니다.");
    });

    refs.downloadButton.addEventListener("click", downloadSetupJson);
    refs.resetButton.addEventListener("click", () => {
        state = { ...defaultState };
        persistState();
        render();
        setStatus("초기 기본값으로 되돌렸습니다.");
    });
}

function handleEnvironmentSelection(event) {
    const target = event.target.closest("[data-environment]");
    if (!target) {
        return;
    }

    state.environmentType = target.dataset.environment;
    persistState();
    render();
}

function handleOnPremSelection(event) {
    const target = event.target.closest("[data-onprem]");
    if (!target) {
        return;
    }

    state.onPremMode = target.dataset.onprem;
    persistState();
    render();
}

function handleFormInput(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
        return;
    }
    state[target.name] = target.value;
    persistState();
    renderPreview();
}

function persistState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
    renderEnvironmentChoices();
    renderOnPremChoices();
    renderForm();
    renderSummary();
    renderArchitecture();
    renderTimeline();
    renderInstallList();
    renderArtifacts();
    renderCommands();
    renderPreview();
}

function renderEnvironmentChoices() {
    refs.environmentSwitch.innerHTML = environmentOptions.map((option) => `
        <button
            type="button"
            class="choice-card ${option.cssClass} ${state.environmentType === option.value ? "is-active" : ""}"
            data-environment="${option.value}">
            <span class="choice-badge">${option.badge}</span>
            <strong>${option.label}</strong>
            <p>${option.description}</p>
        </button>
    `).join("");
}

function renderOnPremChoices() {
    if (state.environmentType !== "onprem") {
        refs.onpremSwitch.innerHTML = "";
        refs.onpremSwitch.style.display = "none";
        return;
    }

    refs.onpremSwitch.style.display = "grid";
    refs.onpremSwitch.innerHTML = onPremOptions.map((option) => `
        <button
            type="button"
            class="choice-card ${option.cssClass} ${state.onPremMode === option.value ? "is-active" : ""}"
            data-onprem="${option.value}">
            <span class="choice-badge">${option.badge}</span>
            <strong>${option.label}</strong>
            <p>${option.description}</p>
        </button>
    `).join("");
}

function renderForm() {
    const profileKey = getProfileKey();
    const fields = [...fieldGroups.common, ...(fieldGroups[profileKey] || [])];
    refs.form.innerHTML = fields.map(renderField).join("");
}

function renderField(field) {
    const value = state[field.name] ?? "";
    const control = field.type === "select"
        ? `
            <select name="${field.name}">
                ${field.options.map((option) => `
                    <option value="${option}" ${String(value) === option ? "selected" : ""}>${option}</option>
                `).join("")}
            </select>
        `
        : `<input type="${field.type}" name="${field.name}" value="${value}">`;

    return `
        <div class="setup-field">
            <label for="${field.name}">${field.label}</label>
            ${control}
            <small>${field.help}</small>
        </div>
    `;
}

function renderSummary() {
    const blueprint = getBlueprint();
    refs.summaryCard.innerHTML = `
        <p class="panel-kicker">Selected Track</p>
        <h2>${blueprint.label}</h2>
        <p>${blueprint.tag}</p>
        <div class="summary-meta">
            <span class="summary-pill">${state.profileName}</span>
            <span class="summary-pill">${state.environmentType === "aws-cloud" ? state.awsRegion : state.onPremMode}</span>
        </div>
        <ul class="summary-points">
            ${blueprint.summaryPoints.map((point) => `<li>${point}</li>`).join("")}
        </ul>
    `;
}

function renderArchitecture() {
    const blueprint = getBlueprint();
    refs.architectureTitle.textContent = blueprint.tag;
    refs.environmentChip.textContent = blueprint.label;
    refs.architectureVisual.innerHTML = `
        <figure>
            <img src="${blueprint.diagram.path}" alt="${blueprint.diagram.alt}">
            <figcaption class="architecture-caption">${blueprint.diagram.caption}</figcaption>
        </figure>
    `;
    refs.architectureGrid.innerHTML = blueprint.architecture.map((item) => `
        <article class="architecture-card">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        </article>
    `).join("");
}

function renderTimeline() {
    const blueprint = getBlueprint();
    refs.timelineGrid.innerHTML = blueprint.timeline.map((item, index) => `
        <article class="timeline-card">
            <span class="timeline-number">${index + 1}</span>
            <h3>Step ${index + 1}</h3>
            <p>${item}</p>
        </article>
    `).join("");
}

function renderInstallList() {
    const blueprint = getBlueprint();
    refs.installGrid.innerHTML = blueprint.installs.map((item) => `
        <article class="install-card">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <ul>
                ${item.items.map((tool) => `<li>${tool}</li>`).join("")}
            </ul>
        </article>
    `).join("");
}

function renderArtifacts() {
    const blueprint = getBlueprint();
    refs.artifactList.innerHTML = blueprint.artifacts.map((item) => `
        <article class="artifact-card">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <ul class="artifact-meta">
                <li><code>${item.path}</code></li>
                <li>${item.tags.join(" / ")}</li>
            </ul>
            <a href="${item.path}" target="_blank" rel="noreferrer">파일 열기</a>
        </article>
    `).join("");
}

function renderCommands() {
    const blueprint = getBlueprint();
    refs.commandList.innerHTML = blueprint.commands.map((item) => `
        <article class="command-card">
            <h3>${item.title}</h3>
            <p>${getCommandDescription(item.title)}</p>
            <pre>${item.body}</pre>
        </article>
    `).join("");
}

function renderPreview() {
    refs.jsonPreview.textContent = JSON.stringify(buildSetupPayload(), null, 2);
}

function getProfileKey() {
    return state.environmentType === "aws-cloud" ? "aws-cloud" : state.onPremMode;
}

function getBlueprint() {
    return setupBlueprints[getProfileKey()];
}

function buildSetupPayload() {
    return {
        profileName: state.profileName,
        environmentType: state.environmentType,
        onPremMode: state.environmentType === "onprem" ? state.onPremMode : null,
        frontend: {
            appDomain: state.appDomain,
            allowedOrigin: state.allowedOrigin,
        },
        backend: {
            apiDomain: state.apiDomain,
            apiBaseUrl: state.environmentType === "aws-cloud"
                ? `https://${state.apiDomain}`
                : `http://127.0.0.1:${state.backendPort}`,
        },
        aws: state.environmentType === "aws-cloud" ? {
            region: state.awsRegion,
            stackName: state.awsStackName,
            frontendBucketName: state.frontendBucketName,
        } : null,
        onPrem: state.environmentType === "onprem" ? {
            docker: {
                projectName: state.dockerProjectName,
                frontendPort: Number(state.frontendPort),
                backendPort: Number(state.backendPort),
                postgresPort: Number(state.postgresPort),
            },
            kubernetes: {
                namespace: state.k8sNamespace,
                ingressHost: state.ingressHost,
                apiIngressHost: state.apiIngressHost,
                replicas: Number(state.k8sReplicas),
            },
        } : null,
    };
}

function downloadSetupJson() {
    const payload = JSON.stringify(buildSetupPayload(), null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.profileName || "paas-setup"}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("현재 선택값 기준 초기 설정 JSON을 다운로드했습니다.");
}

function setStatus(message) {
    refs.status.textContent = message;
}

function getCommandDescription(title) {
    const descriptions = {
        "SAM Build": "FastAPI 앱과 Lambda 어댑터를 빌드 아티팩트로 묶습니다.",
        "SAM Deploy": "CloudFormation 스택 생성과 서버리스 리소스 배포를 수행합니다.",
        "Frontend Sync": "정적 프론트 파일을 S3와 CloudFront로 반영합니다.",
        "Compose Up": "사내 서버에서 프론트/백엔드/DB를 한 번에 기동합니다.",
        "Health Check": "백엔드 헬스체크와 설치 콘솔 진입 화면을 함께 검증합니다.",
        "Apply Base": "쿠버네티스 기본 리소스를 한 번에 적용합니다.",
        "Rollout Check": "서비스와 Ingress, Backend 롤아웃 상태를 점검합니다.",
    };

    return descriptions[title] || "선택한 배포 방식에 맞는 기본 실행 예시입니다.";
}
