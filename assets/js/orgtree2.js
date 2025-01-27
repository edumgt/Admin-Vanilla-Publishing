document.addEventListener("DOMContentLoaded", async () => {
  const orgContainer = document.getElementById("org-chart");
  const permissionsContainer = document.getElementById("permissions");
  const permissionsTitle = document.createElement("h1");
  permissionsTitle.id = "permissions-title";
  permissionsTitle.style.fontSize = "1.0rem";
  permissionsTitle.style.marginBottom = "1rem";
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
    expandButton.style.padding = "5px 10px";
    expandButton.style.backgroundColor = "#0058a3";
    expandButton.style.color = "#fff";
    expandButton.style.border = "none";
    expandButton.style.cursor = "pointer";
    expandButton.style.borderRadius = "5px";

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
        toggleButton.style.fontSize = "38px";
        toggleButton.style.marginRight = "12px";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.color = "#555";
        toggleButton.style.fontWeight = "800";
        toggleButton.style.transform = "scaleX(1.2)";
        
      });

      expanded = !expanded;
    });

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

  try {
    let organization = loadFromStorage("organizationData");
    if (!organization) {
      organization = await fetchData("assets/mock/org.json");
      saveToStorage("organizationData", organization);
    }
    permissions = await fetchData("assets/mock/per.json");
    renderOrgChart(organization);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}); 