
# 📐 Solution Architecture (with Development Toolchain)

## 🧱 시스템 구성도

```
                        +-----------------------+
                        |   Client (Browser)    |
                        +-----------------------+
                                  |
                                  v
                        +-----------------------+
                        |   HTML Frontend      |
                        | (Vite, TUI Grid 등)   |
                        +-----------------------+
                                  |
                                  v
                        +-----------------------+
                        | Express API Server    |
                        |  - JWT 인증 처리       |
                        |  - Swagger 문서화      |
                        |  - API 프록시 역할     |
                        +-----------------------+
                                  |
                                  v
                        +------------------------------+
                        |  Spring Boot API Server      |
                        |------------------------------|
                        | - Spring MVC, JWT, Security  |
                        | - Swagger UI, Validation     |
                        | - JPA + MyBatis              |
                        +------------------------------+
                                  |
                                  v
                        +------------------------------+
                        |     Persistence Layer        |
                        |------------------------------|
                        | - MSSQL (JDBC 기반)          |
                        | - MyBatis Mapper, JPA Entity |
                        +------------------------------+
```

---

## ⚙️ 기술 스택 요약

| 구성 요소             | 사용 기술 |
|----------------------|-----------|
| **Frontend**         | Vanilla JS, Vite, TUI Grid, ApexCharts |
| **API Server (Node)**| Express.js, JWT, Swagger-jsdoc |
| **Backend**          | Spring Boot, MVC, Security, Swagger |
| **DB 접근**          | JPA, MyBatis, MSSQL |
| **빌드/배포**        | Vite, Maven, Jenkins |
| **문서화**           | Swagger UI, SpringDoc |

---

## 💻 개발 환경 도구 목록

| 도구                    | 설명                              | 파일명 |
|-------------------------|-----------------------------------|--------|
| **Java JDK 17**         | Spring Boot 개발용                | `OpenJDK17U-jdk_x64_windows_hotspot_17.0.14_7.msi` |
| **Node.js 22**          | Express / React 개발용            | `node-v22.14.0-x64.msi` |
| **NVM (Node 버전관리)**| Node 버전 스위칭용                | `nvm-setup.exe` |
| **MariaDB**             | 대안 DBMS 테스트용                | `mariadb-11.7.2-winx64.msi` |
| **MSSQL Express 2022**  | 메인 DB 테스트                    | `SQL2022-SSEI-Expr.exe` |
| **SSMS (SQL Mgmt Studio)** | MSSQL 관리 도구                  | `SSMS-Setup-ENU.exe` |
| **SQL JDBC Driver**     | Java에서 MSSQL 연동용 드라이버    | `sqljdbc_12.8.1.0_kor.zip` |
| **Python 3.13.2**       | 유틸 스크립트 개발 등              | `python-3.13.2-amd64.exe` |
| **Git**                 | 버전 관리                         | `Git-2.48.1-64-bit.exe` |
| **VS Code**             | 경량 IDE                          | `VSCodeUserSetup-x64-1.97.2.exe` |
| **Notepad++**           | 빠른 코드 보기                    | `npp.8.7.7.Installer.x64.exe` |
| **eXERD**               | ERD 설계 도구                     | `eXERD_Installer_v3.3.47.20250312-1028_x64.exe` |
| **DBeaver**             | DB 브라우저 (다중 DB 지원)        | `dbeaver-ce-24.3.5-x86_64-setup.exe` |
| **Docker Desktop**      | 개발환경 컨테이너화               | `Docker Desktop Installer.exe` |

---

## 🔄 요청 흐름 요약

1. **Browser**: Vanilla JS 기반 웹앱 실행
2. **Vanilla JS → Express**: JWT 포함 API 요청
3. **Express → Spring Boot**: 프록시 또는 직접 API 호출
4. **Spring Boot → DB**: 비즈니스 처리, 데이터 응답
5. **Express → Vanilla JS → 사용자 화면 출력**
