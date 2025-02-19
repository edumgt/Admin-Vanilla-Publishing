const workarea = document.getElementById("workarea");
workarea.classList.add("mt-4");

document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/mock/total.json")
        .then(response =>
            response.json()
        )
        .then(data => {
            setupGrid(data);
        }
        )
        .catch(error =>
            showToast('loading-error', 'error', lang)
        );
});

function setupGrid(teams) {
    const rowData = [];
    const summaryRow = {
        team: "총 합계",
        name: "",
    };

    const totalSummary = Array(12).fill(0);
    teams.forEach(team => {
        let teamTotals = Array(12).fill(0);

        team.members.forEach(member => {
            const memberData = {
                team: team.name,
                name: member.name,
                id: member.id
            };

            member.sales.forEach((monthSales, idx) => {
                memberData[`month${idx + 1}`] = monthSales;
                teamTotals[idx] += monthSales;
                totalSummary[idx] += monthSales;
            });

            rowData.push(memberData);
        });

        const teamSummaryRow = {
            team: `${team.name} 합계`,
            name: "합계",
            id: "",

            ...Object.fromEntries(teamTotals.map((total, idx) => [`month${idx + 1}`, total]))
        };
        rowData.push(teamSummaryRow);
    });


    Object.assign(summaryRow, Object.fromEntries(totalSummary.map((total, idx) => [`month${idx + 1}`, total])));

    const grid = new tui.Grid({
        el: document.getElementById("workarea"),
        data: rowData,
        scrollX: true,
        scrollY: true,

        columnOptions: {
            resizable: true
        },
        summary: {
            height: 50,
            position: "bottom",
            columnContent: {
                team: {
                    template() {
                        return "<strong>총 합계</strong>";
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
            {
                header: "Key", name: "id", align: "center",
                formatter: (cell) => cell.value !== "합계" ? `
                
                <a href='#' class='a-link open-modal' data-name='${cell.row.name}' data-id='${cell.value}'>${cell.value}</a>
                
                ` : cell.value
            },
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


    grid.on("onGridMounted", () => {
        grid.getData().forEach((row, index) => {
            if (row.name === "합계") {
                grid.addRowClassName(index, "summary-row");
            }
        });
    });

    grid.on('afterRender', () => {
        document.querySelectorAll('.custom-link').forEach(link => {
            link.style.color = 'blue';
            link.style.textDecoration = 'underline';
        });
    });




    fixSummaryRow(grid);
}

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("open-modal")) {
        e.preventDefault();
        const name = e.target.getAttribute("data-name");
        const id = e.target.getAttribute("data-id");
        openModal(name, id);
    }
});

function openModal(name, id) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div style='position: relative; display: flex; align-items: flex-start;'>
        <iframe src='account-pop.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}' width='1440' height='700' class='rounded'></iframe>
        <span class='close' style='margin-left: 10px; font-size: 30px; font-weight: 900; cursor: pointer;'>&times;</span></div>`;
    document.body.appendChild(modal);

    modal.querySelector(".close").addEventListener("click", function () {
        document.body.removeChild(modal);
    });
}

function fixSummaryRow(grid) {
    const gridContainer = document.getElementById("workarea").querySelector(".tui-grid-container");
    gridContainer.classList.add("w-full", "mt-4", "h-full");

    const summaryContainer = document.querySelector(".tui-grid-summary-area");

    if (gridContainer && summaryContainer) {
        gridContainer.addEventListener("scroll", () => {
            summaryContainer.style.left = `-${gridContainer.scrollLeft}px`;
        });
    }
}

function formatCurrency({ value }) {
    return value ? value.toLocaleString() + " 원" : "-";
}

function summaryFormatter(summary) {
    const total = Number(summary?.sum || 0);
    return `<strong>${total.toLocaleString()} 원</strong>`;
}
