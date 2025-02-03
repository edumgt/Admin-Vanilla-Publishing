document.addEventListener("DOMContentLoaded", async () => {

  const workarea = document.getElementById('workarea');
  workarea.classList.add('flex', 'h-screen', 'mt-4');

  const orgContainer = document.getElementById("org-chart");
  orgContainer.classList.add('w-1/3', 'bg-white', 'overflow-y-auto', 'mr-4', 'h-5\/6');

  const permissionsContainer = document.getElementById("permissions");
  permissionsContainer.classList.add('w-2/3', 'bg-gray-50', 'p-4', 'overflow-y-auto',
    'border-t', 'border-gray-300',
    'border-l', 'border-gray-300',
    'border-r', 'border-gray-300',
    'border-b', 'border-gray-300', 'h-5\/6'
  );

  const permissionsTitle = document.createElement("h1");
  permissionsTitle.id = "permissions-title";
  permissionsTitle.style.fontSize = "1.1rem";
  permissionsTitle.style.marginBottom = "1.1rem";
  permissionsContainer.appendChild(permissionsTitle);

  let selectedNode = null;
  let selectedName = "";
  let permissions = [];
  let organization = [];


  async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return await response.json();

  }

  function savePermissionsToStorage(data) {
    localStorage.setItem("permissionsData", JSON.stringify(data));
  }

  function loadPermissionsFromStorage() {
    const savedData = localStorage.getItem("permissionsData");
    return savedData ? JSON.parse(savedData) : {};
  }

  function createTreeNode(name, children = [], depth = 0) {
    const container = document.createElement("div");
    container.style.marginLeft = `${depth * 20}px`;
    container.style.padding = "5px";
    container.style.border = "1px solid #ccc";
    container.style.marginBottom = "8px";
    container.style.cursor = "pointer";
    container.style.display = "flex";
    container.style.alignItems = "center";

    const toggleButton = document.createElement("span");
    toggleButton.innerHTML = children.length > 0 ? "+" : "";
    toggleButton.style.fontSize = "38px";
    toggleButton.style.marginRight = "12px";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.color = "#555";
    toggleButton.style.fontWeight = "800";
    toggleButton.style.transform = "scaleX(1.2)";


    const label = document.createElement("span");
    label.textContent = name;

    const childrenContainer = document.createElement("div");
    childrenContainer.style.display = "none";
    childrenContainer.style.marginLeft = "20px";

    toggleButton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (childrenContainer.style.display === "none") {
        childrenContainer.style.display = "block";
        toggleButton.innerHTML = "-";
      } else {
        childrenContainer.style.display = "none";
        toggleButton.innerHTML = "+";
      }
    });

    container.appendChild(toggleButton);
    container.appendChild(label);
    container.appendChild(childrenContainer);

    children.forEach((child) => {
      const childNode = createTreeNode(child.name, child.children || [], depth + 1);
      childrenContainer.appendChild(childNode);
    });

    label.addEventListener("click", () => {
      if (selectedNode) {
        selectedNode.style.backgroundColor = "";
        selectedNode.style.color = "";
      }
      container.style.backgroundColor = "#0058a3";
      container.style.color = "#ffcc00";
      container.style.fontWeight = "600";

      selectedNode = container;
      selectedName = name;
      updatePermissionsTitle(name);
      renderPermissions(name);
    });

    return container;
  }

  function renderOrgChart(data) {
    orgContainer.innerHTML = "";

    const expandButton = document.createElement("button");
    expandButton.textContent = "전체 펼침";
    expandButton.style.marginBottom = "10px";
    expandButton.style.backgroundColor = "#0058a3";
    expandButton.style.color = "#fff";
    createTooltip(expandButton, "조직도를 전체 펼쳐서 볼 수 있습니다.");

    const editButton = document.createElement("button");
    editButton.textContent = "조직 수정";
    editButton.style.backgroundColor = "#333";
    editButton.style.color = "#fff";
    editButton.style.marginRight = "10px";
    editButton.addEventListener("click", openOrgEditorModal);
    createTooltip(editButton, "조직도를 팝업으로 수정할 수 있습니다.");


    let expanded = false;
    expandButton.addEventListener("click", () => {
      expandButton.disabled = true;
      expandButton.style.backgroundColor = "#999";
      expandButton.style.color = "#fff";

      expandButton.style.cursor = "not-allowed";

      document.querySelectorAll("#org-chart div div").forEach((childContainer) => {
        if (expanded) {
          childContainer.style.display = "none";
        } else {
          childContainer.style.display = "block";
        }
      });

      document.querySelectorAll("#org-chart span:first-child").forEach((toggleButton) => {
        toggleButton.innerHTML = expanded ? "+" : "-";
        toggleButton.style.fontSize = "35px";
        toggleButton.style.marginRight = "12px";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.color = "#333";
        toggleButton.style.fontWeight = "700";
        toggleButton.style.transform = "scaleX(1.2)";
        toggleButton.style.transform = "scaleY(1.2)";

      });

      expanded = !expanded;
    });

    orgContainer.appendChild(editButton);
    orgContainer.appendChild(expandButton);
    data.forEach((hq) => {
      const node = createTreeNode(hq.name, hq.departments.map((dept) => ({
        name: dept.name,
        children: dept.teams.map((team) => ({ name: team }))
      })));
      orgContainer.appendChild(node);
    });
  }

  function renderPermissions(name) {
    permissionsContainer.innerHTML = "";
    permissionsContainer.appendChild(permissionsTitle);

    const permissionsData = loadPermissionsFromStorage();
    const unitPermissions = permissionsData[name] || {};

    const container = document.createElement("div");
    container.id = "permissions-container";

    if (!permissions || permissions.length === 0) {
      console.error("Permissions data is empty or undefined.");
      return;
    }

    permissions.forEach((unit) => {
      const unitDiv = document.createElement("div");
      unitDiv.style.marginBottom = "1rem";

      const unitTitle = document.createElement("h2");
      unitTitle.textContent = unit.name;
      unitTitle.style.fontSize = "1.0rem";
      unitTitle.style.marginBottom = "0.5rem";

      const actionsRow = document.createElement("div");
      actionsRow.style.display = "flex";
      actionsRow.style.gap = "1rem";

      unit.actions.forEach((action) => {
        const actionDiv = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = unitPermissions[unit.name]?.includes(action) || false;
        checkbox.addEventListener("change", () => updatePermissions(name, unit.name, action, checkbox.checked));

        const label = document.createElement("label");
        label.textContent = action;

        actionDiv.appendChild(checkbox);
        actionDiv.appendChild(label);
        actionsRow.appendChild(actionDiv);
      });

      unitDiv.appendChild(unitTitle);
      unitDiv.appendChild(actionsRow);
      container.appendChild(unitDiv);
    });

    permissionsContainer.appendChild(container);
  }

  function updatePermissions(name, unit, action, isChecked) {
    let permissionsData = loadPermissionsFromStorage();

    if (!permissionsData[name]) {
      permissionsData[name] = {};
    }

    if (!permissionsData[name][unit]) {
      permissionsData[name][unit] = [];
    }

    if (isChecked) {
      if (!permissionsData[name][unit].includes(action)) {
        permissionsData[name][unit].push(action);
      }
    } else {
      permissionsData[name][unit] = permissionsData[name][unit].filter((a) => a !== action);
    }

    savePermissionsToStorage(permissionsData);
  }

  function updatePermissionsTitle(name) {
    permissionsTitle.textContent = `권한 설정: ${name}`;
  }

  function loadFromStorage(key) {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  }

  function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function openOrgEditorModal() {
    let modal = document.getElementById("org-editor-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "org-editor-modal";
      modal.style.position = "absolute";
      modal.style.top = "14%";
      modal.style.right = "2%";
      modal.style.width = "70%";
      modal.style.height = "60%";
      modal.style.backgroundColor = "#fff";
      modal.style.padding = "5px";
      modal.style.boxShadow = "2px 4px 6px rgba(0, 0, 0, 0.6)";
      modal.style.zIndex = "50";
      modal.style.overflow = "auto";

      const closeButton = document.createElement("button");
      closeButton.textContent = "X";
      closeButton.style.fontWeight = "900";
      closeButton.style.position = "absolute";
      closeButton.style.bottom = "10px";
      closeButton.style.right = "10px";


      closeButton.onclick = () => {
        saveToStorage("organizationData", organization);
        renderOrgChart(organization);
        modal.remove();
      };

      const gridDiv = document.createElement("div");
      gridDiv.style.height = "90%";
      gridDiv.style.width = "100%";
      gridDiv.id = "org-grid";

      modal.appendChild(closeButton);
      modal.appendChild(gridDiv);
      permissionsContainer.appendChild(modal);

      const columnDefs = [
        { field: "name", headerName: "본부", editable: true, width: '150' },
        {
          field: "departments", headerName: "부서", editable: true, width: '300',
          valueGetter: params => params.data.departments.map(d => d.name).join(","),
          valueSetter: params => {
            const updatedDepartments = params.newValue.split(",").map((name, i) => {
              return params.data.departments[i] ? { ...params.data.departments[i], name } : { name, teams: [] };
            });
            params.data.departments = updatedDepartments;
            return true;
          }
        },
        {
          field: "teams", headerName: "팀(부서구분 ; )", editable: true, width: '700',
          valueGetter: params => params.data.departments.map(d => d.teams.join(",")).join(";"),
          valueSetter: params => {
            params.data.departments.forEach((dept, i) => {
              if (params.newValue.split(";")[i]) {
                dept.teams = params.newValue.split(";")[i].split(",");
              }
            });
            return true;
          }
        }
      ];

      const gridOptions = {
        columnDefs: columnDefs,
        rowData: organization,
        defaultColDef: {
          editable: true,
          cellStyle: { fontSize: "1rem", fontFamily: "'Pretendard', sans-serif" }
        },
        domLayout: "autoHeight", 
        onCellValueChanged: params => {
          saveToStorage("organizationData", organization);
        }
      };

      new agGrid.createGrid(gridDiv, gridOptions);
    }
  }

  try {
    organization = loadFromStorage("organizationData") || await fetchData("assets/mock/org.json");
    saveToStorage("organizationData", organization);
    renderOrgChart(organization);

    permissions = await fetchData("assets/mock/per.json");

  } catch (error) {
    console.error("Error loading data:", error);
  }

}); 