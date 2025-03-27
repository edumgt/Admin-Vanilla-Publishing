# Step 1: 빌드 (Node 22 + Vite + React 등)
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# Step 2: Nginx에 빌드 결과 복사
FROM nginx:stable-alpine

# Nginx 설정 파일 복사 (선택)
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 포트 80 노출
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
