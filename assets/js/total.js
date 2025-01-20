const menuLinks = document.querySelectorAll(".gnb-item");

const menuLinks2 = document.querySelectorAll(".menu-item");

menuLinks2.forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    menuLinks.forEach((link) => {
      if (link.getAttribute("href") === "orgni.html") {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/mock/total.json")
        .then(response => response.json())
        .then(data => setupGrid(data.teams))
        .catch(error => console.error("Error loading data:", error));
});

function setupGrid(teams) {
    const rowData = [];
    const summaryRow = {
        team: "총 합계",
        name: "",
    };
    
    // ✅ summary 값을 직접 계산할 배열
    const totalSummary = Array(12).fill(0);

    teams.forEach(team => {
        let teamTotals = Array(12).fill(0); // 팀별 합계 저장

        team.members.forEach(member => {
            const memberData = {
                team: team.name,
                name: member.name
            };

            member.sales.forEach((monthSales, idx) => {
                memberData[`month${idx + 1}`] = monthSales;
                teamTotals[idx] += monthSales;
                totalSummary[idx] += monthSales; // ✅ 전체 총합 계산
            });

            rowData.push(memberData);
        });

        // ✅ "팀별 합계" 행 추가 (summary에 포함되지 않음)
        const teamSummaryRow = {
            team: `${team.name} 합계`,
            name: "합계",
            ...Object.fromEntries(teamTotals.map((total, idx) => [`month${idx + 1}`, total]))
        };
        rowData.push(teamSummaryRow);
    });

    // ✅ "총 합계" 행을 summaryRow로 생성 (별도 추가)
    Object.assign(summaryRow, Object.fromEntries(totalSummary.map((total, idx) => [`month${idx + 1}`, total])));

    const grid = new tui.Grid({
        el: document.getElementById("grid"),
        data: rowData,
        scrollX: true,
        scrollY: true,
        // bodyHeight: 'fitToParent', 
        columnOptions: {
            resizable: true // ✅ 셀 너비 조정 가능하도록 설정
        },
        summary: {
            height: 50, // ✅ summary 행 크기 조정
            position: "bottom",
            columnContent: {
                team: {
                    template() {
                        return "<strong>총 합계</strong>"; // ✅ Summary 행에 타이틀 추가
                    }
                },
                month1: { sum: true, template: summaryFormatter },
                month2: { sum: true, template: summaryFormatter },
                month3: { sum: true, template: summaryFormatter },
                month4: { sum: true, template: summaryFormatter },
                month5: { sum: true, template: summaryFormatter },
                month6: { sum: true, template: summaryFormatter },
                month7: { sum: true, template: summaryFormatter },
                month8: { sum: true, template: summaryFormatter },
                month9: { sum: true, template: summaryFormatter },
                month10: { sum: true, template: summaryFormatter },
                month11: { sum: true, template: summaryFormatter },
                month12: { sum: true, template: summaryFormatter }
            }
        },
        columns: [
            { header: "팀", name: "team", align: "center", rowSpan: true },
            { header: "팀원", name: "name", align: "center" },
            { header: "1월", name: "month1", formatter: formatCurrency },
            { header: "2월", name: "month2", formatter: formatCurrency },
            { header: "3월", name: "month3", formatter: formatCurrency },
            { header: "4월", name: "month4", formatter: formatCurrency },
            { header: "5월", name: "month5", formatter: formatCurrency },
            { header: "6월", name: "month6", formatter: formatCurrency },
            { header: "7월", name: "month7", formatter: formatCurrency },
            { header: "8월", name: "month8", formatter: formatCurrency },
            { header: "9월", name: "month9", formatter: formatCurrency },
            { header: "10월", name: "month10", formatter: formatCurrency },
            { header: "11월", name: "month11", formatter: formatCurrency },
            { header: "12월", name: "month12", formatter: formatCurrency }
        ],
        rowHeaders: ["rowNum"]
    });

    // ✅ "팀별 합계" 행을 스타일링 (굵게 표시)
    grid.on("onGridMounted", () => {
        grid.getData().forEach((row, index) => {
            if (row.name === "합계") {
                grid.addRowClassName(index, "summary-row"); // CSS 클래스로 스타일 적용
            }
        });
    });

    // ✅ summary 행이 스크롤에 따라 고정되도록 처리
    fixSummaryRow(grid);
}

// ✅ summary 행이 스크롤 시 고정되도록 조정하는 함수
function fixSummaryRow(grid) {
    const gridContainer = document.getElementById("grid").querySelector(".tui-grid-container");
    const summaryContainer = document.querySelector(".tui-grid-summary-area");

    if (gridContainer && summaryContainer) {
        gridContainer.addEventListener("scroll", () => {
            summaryContainer.style.left = `-${gridContainer.scrollLeft}px`;
        });
    }
}

// ✅ 금액 포맷 함수 (천 단위 쉼표 추가)
function formatCurrency({ value }) {
    return value ? value.toLocaleString() + " 원" : "-";
}

// ✅ Summary 값 포맷 함수 (천 단위 쉼표 추가)
function summaryFormatter( summary ) {
    const total = Number(summary?.sum || 0); // ✅ sum이 NaN일 경우 0 처리
    return `<strong>${total.toLocaleString()} 원</strong>`;
}
