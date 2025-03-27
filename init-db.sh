#!/bin/sh

# MariaDB 데이터 디렉토리 초기화
mysql_install_db --user=mysql --datadir=/var/lib/mysql

# 백그라운드로 MariaDB 서버 실행
mysqld_safe --datadir=/var/lib/mysql &
sleep 5

# root 비밀번호 설정
mysqladmin -u root password '123456'

# db.sql 실행 (비밀번호 적용됨)
mysql -u root -p123456 < /docker-entrypoint-initdb.d/db.sql

# 서버 종료 대기
sleep 5
