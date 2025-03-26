# Step 1: Build with all dependencies
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 프론트엔드 빌드
RUN npm run build

# Step 2: Serve with only production dependencies
FROM node:18-alpine

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install --omit=dev

# 앱 파일 복사
COPY --from=builder /app ./

CMD ["npm", "start"]
