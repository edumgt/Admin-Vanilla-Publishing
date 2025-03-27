# Step 1: Node.js 22 환경 설정
FROM node:22-alpine

# 작업 디렉토리 생성
WORKDIR /usr/src/app

# package.json, package-lock.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 전체 복사
COPY . .

# 포트 열기
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "server.js"]
