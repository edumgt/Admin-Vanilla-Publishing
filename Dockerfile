# Step 1: Node.js 22 환경 설정
FROM node:22-alpine

# mariadb-client와 mariadb-server 설치에 필요한 패키지 업데이트
RUN apk update && apk add --no-cache mariadb mariadb-client bash

# 작업 디렉토리 생성
WORKDIR /usr/src/app

# package.json, package-lock.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 전체 복사
COPY . .

# MariaDB 초기화 및 실행용 스크립트 복사
COPY db.sql /docker-entrypoint-initdb.d/db.sql
COPY init-db.sh /init-db.sh
RUN chmod +x /init-db.sh

# 포트 열기
EXPOSE 3000

# DB 초기화 후 Node.js 앱 실행
CMD ["sh", "-c", "/init-db.sh && node server.js"]
