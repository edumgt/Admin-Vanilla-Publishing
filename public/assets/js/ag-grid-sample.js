class CustomHeader {
	init(params) {
		this.params = params;
		this.eGui = document.createElement("div");
		this.eGui.classList.add("ag-custom-header");
		Object.assign(this.eGui.style, {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			boxSizing: "border-box",
			width: "100%",
			height: "100%",
			padding: "0 6px",
			overflow: "hidden",
			background: "#f9f9f9",
			fontSize: "13px",
			borderRight: "1px solid #ddd"
		});

		const label = document.createElement("span");
		label.textContent = params.displayName;
		Object.assign(label.style, {
			color: "#333",
			fontWeight: "500",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			flexGrow: "1",
			minWidth: "0"
		});

		const menuBtn = document.createElement("button");
		menuBtn.textContent = "⋮";
		Object.assign(menuBtn.style, {
			border: "none",
			background: "transparent",
			cursor: "pointer",
			fontSize: "16px",
			color: "#ff8800",
			padding: "0 4px",
			flexShrink: "0"
		});

		menuBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			this.showPopup(e);
		});

		this.eGui.appendChild(label);
		this.eGui.appendChild(menuBtn);
	}

	showPopup(event) {
		const existingPopup = document.querySelector(".global-header-popup");
		if (existingPopup) existingPopup.remove();

		const rect = event.target.getBoundingClientRect();
		const popup = document.createElement("div");
		popup.classList.add("global-header-popup");
		Object.assign(popup.style, {
			position: "absolute",
			top: `${rect.bottom + window.scrollY + 2}px`,
			left: `${rect.left}px`,
			background: "#fff",
			border: "1px solid #ccc",
			boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
			zIndex: "9999",
			whiteSpace: "nowrap",
			borderRadius: "6px",
			minWidth: "140px",
			fontSize: "13px",
			overflow: "hidden",
			padding: "4px 0"
		});

		const items = [
			{ text: "🔼 오름차순 정렬", action: () => this.sortColumn("asc") },
			{ text: "🔽 내림차순 정렬", action: () => this.sortColumn("desc") },
		];

		items.forEach(item => {
			const div = document.createElement("div");
			div.textContent = item.text;
			Object.assign(div.style, {
				padding: "6px 12px",
				cursor: "pointer",
				transition: "background 0.2s"
			});
			div.addEventListener("mouseenter", () => div.style.background = "#f0f0f0");
			div.addEventListener("mouseleave", () => div.style.background = "transparent");
			div.addEventListener("click", () => {
				item.action();
				popup.remove();
			});
			popup.appendChild(div);
		});

		// ▼ 컬럼 목록 하위 팝업
		const columnListItem = document.createElement("div");
		columnListItem.textContent = "📋 컬럼 목록 ▸";
		Object.assign(columnListItem.style, {
			padding: "6px 12px",
			cursor: "pointer",
			position: "relative",
			transition: "background 0.2s"
		});

		const subPopup = document.createElement("div");
		Object.assign(subPopup.style, {
			position: "absolute",
			top: "0",
			left: "100%",
			background: "#fff",
			border: "1px solid #ccc",
			boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
			whiteSpace: "nowrap",
			display: "none",
			borderRadius: "6px",
			padding: "4px 0",
			minWidth: "120px",
			zIndex: "10000"
		});

		document.body.appendChild(subPopup);

		columnListItem.addEventListener("mouseenter", () => {
			subPopup.style.display = "block";
			const rect = columnListItem.getBoundingClientRect();
			subPopup.style.top = `${rect.top + window.scrollY}px`;
			subPopup.style.left = `${rect.right + 2}px`;
		});

		columnListItem.addEventListener("mouseleave", (e) => {
			if (!subPopup.contains(e.relatedTarget)) {
				subPopup.style.display = "none";
			}
		});

		subPopup.addEventListener("mouseleave", (e) => {
			if (!columnListItem.contains(e.relatedTarget)) {
				subPopup.style.display = "none";
			}
		});

		// 컬럼 체크박스 생성
		const allColumns = gridApi.getAllGridColumns();
		const toggleStates = new Map();
		const checkboxes = new Map();

		allColumns.forEach(col => {
			const colId = col.getColId();
			toggleStates.set(colId, col.isVisible());
		});

		const updateColumnVisibility = () => {
			const keys = Array.from(toggleStates.keys());
			const visibilities = Array.from(toggleStates.values());
			const visibleCount = visibilities.filter(v => v).length;

			keys.forEach((key, i) => {
				const checkbox = checkboxes.get(key);
				const isLastVisible = (visibleCount === 1 && visibilities[i]);

				checkbox.disabled = isLastVisible;
				checkbox.style.opacity = isLastVisible ? "0.5" : "1";
				checkbox.style.cursor = isLastVisible ? "not-allowed" : "pointer";
				checkbox.style.backgroundColor = checkbox.checked
						? (isLastVisible ? "#ccc" : "#00A6ED")
						: "#fff";

				checkbox.innerHTML = "";
				if (checkbox.checked) {
					const checkMark = document.createElement("div");
					Object.assign(checkMark.style, {
						position: "absolute",
						top: "2px",
						left: "5px",
						width: "4px",
						height: "8px",
						border: "solid white",
						borderWidth: "0 2px 2px 0",
						transform: "rotate(45deg)",
						pointerEvents: "none"
					});
					checkbox.appendChild(checkMark);
				}
			});

			gridApi.setColumnsVisible(keys, true);
			gridApi.setColumnsVisible(
					keys.filter((_, i) => !visibilities[i]), false
			);
		};

		allColumns.forEach(col => {
			const colId = col.getColId();

			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.checked = toggleStates.get(colId);
			checkboxes.set(colId, checkbox);

			Object.assign(checkbox.style, {
				width: "16px",
				height: "16px",
				cursor: "pointer",
				appearance: "none",
				WebkitAppearance: "none",
				MozAppearance: "none",
				border: "1px solid #ccc",
				borderRadius: "4px",
				position: "relative",
				backgroundColor: checkbox.checked ? "#00A6ED" : "#fff"
			});

			if (checkbox.checked) {
				const checkMark = document.createElement("div");
				Object.assign(checkMark.style, {
					position: "absolute",
					top: "2px",
					left: "5px",
					width: "4px",
					height: "8px",
					border: "solid white",
					borderWidth: "0 2px 2px 0",
					transform: "rotate(45deg)",
					pointerEvents: "none"
				});
				checkbox.appendChild(checkMark);
			}

			checkbox.addEventListener("change", () => {
				toggleStates.set(colId, checkbox.checked);
				checkbox.style.backgroundColor = checkbox.checked ? "#00A6ED" : "#fff";
				checkbox.innerHTML = "";
				if (checkbox.checked) {
					const checkMark = document.createElement("div");
					Object.assign(checkMark.style, {
						position: "absolute",
						top: "2px",
						left: "5px",
						width: "4px",
						height: "8px",
						border: "solid white",
						borderWidth: "0 2px 2px 0",
						transform: "rotate(45deg)",
						pointerEvents: "none"
					});
					checkbox.appendChild(checkMark);
				}
				updateColumnVisibility();
			});

			const label = document.createElement("label");
			Object.assign(label.style, {
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: "10px",
				padding: "8px 16px",
				cursor: "pointer",
				fontSize: "13px",
				color: "#333",
				borderBottom: "1px solid #eee",
				transition: "background 0.2s, color 0.2s",
				borderRadius: "4px"
			});

			label.addEventListener("mouseenter", () => label.style.background = "#f0faff");
			label.addEventListener("mouseleave", () => label.style.background = "transparent");

			const textSpan = document.createElement("span");
			textSpan.textContent = colId;
			Object.assign(textSpan.style, {
				flexGrow: "1",
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap"
			});

			label.appendChild(textSpan);
			label.appendChild(checkbox);
			subPopup.appendChild(label);
		});

		updateColumnVisibility();
		popup.appendChild(columnListItem);
		document.body.appendChild(popup);

		const outsideClick = (e) => {
			if (!popup.contains(e.target) && !subPopup.contains(e.target)) {
				popup.remove();
				subPopup.remove();
				document.removeEventListener("click", outsideClick);
			}
		};
		setTimeout(() => document.addEventListener("click", outsideClick), 0);
	}

	sortColumn(direction) {
		const colId = this.params.column.getColId();
		this.params.api.applyColumnState({
			state: [{ colId, sort: direction }],
			defaultState: { sort: null }
		});
	}

	getGui() {
		return this.eGui;
	}
}

const columnDefs = [
	{ field: "group", headerComponent: CustomHeader },
	{ field: "name", headerComponent: CustomHeader },
	{ field: "age", headerComponent: CustomHeader },
	{ field: "salary", headerComponent: CustomHeader, valueFormatter: (params) => `$${params.value.toLocaleString()}` },
	{ field: "bonus", headerComponent: CustomHeader }
];

const rowData = [
	{ group: "A", name: "John", age: 25, salary: 50000, bonus: 1000 },
	{ group: "A", name: "Jane", age: 28, salary: 60000, bonus: 1200 },
	{ group: "B", name: "Tom", age: 35, salary: 80000, bonus: 1500 },
	{ group: "B", name: "Lucy", age: 32, salary: 72000, bonus: 1400 }
];

let gridApi = null;
let savedColumnState = null;

export const gridOptions = {
	columnDefs,
	rowData,
	domLayout: 'autoHeight',
	suppressHorizontalScroll: true,
	animateRows: true,
	clipboard: {
		suppressPasteSingleCellRanges: false
	},
	defaultColDef: {
		flex: 1,
		resizable: false,
		sortable: true
	},
	onGridReady: params => {
		gridApi = params.api;
		gridApi.sizeColumnsToFit(); // 전체 width 맞춤
	}
};

agGrid.createGrid(document.getElementById("gridContainer"), gridOptions);

// 이벤트 핸들러 정의
document.getElementById("btnSave").addEventListener("click", () => {
	let savedColumnState = gridApi.getColumnState();
	localStorage.setItem('savedColumnState', JSON.stringify(savedColumnState));
});

document.getElementById("btnRestore").addEventListener("click", () => {
	let savedColumnState = localStorage.getItem('savedColumnState');
	savedColumnState = JSON.parse(savedColumnState);

	if (savedColumnState) {
		let applyColumnState = {
			state: savedColumnState,
			applyOrder: true
		}
		gridApi.applyColumnState(applyColumnState);
	} else {
		alert("저장된 컬럼 순서가 없습니다.");
	}
});