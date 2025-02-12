# docker start mysql-container
# docker exec -it mysql-container bash
# docker cp ./db.sql 83205902c571:/

# keep_alive.sh
# while true; do
#    echo "Keeping Codespace alive..."
#    sleep 300  # 5분마다 메시지 출력
# done

# common 처리대상 : modal, grid, button, calendar

# modal 을 js 하나로
# button 을 js 하나로
# grid, calendar 를 component 화
# javascript module 화 



# HTML 파일에서 <script type="module">을 사용하면, JavaScript가 모듈로 실행되며, 기본적으로 모듈 내부에서 정의된 
# 함수들은 전역 범위에 자동으로 추가되지 않습니다. 따라서 openModal과 같은 함수가 HTML에서 직접 호출될 때 
# 찾을 수 없다는 오류가 발생할 수 있습니다.
# export function openModal(.....
# window.openModal = openModal;