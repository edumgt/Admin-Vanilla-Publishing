document.addEventListener("DOMContentLoaded", async () => {
  const orgContainer = document.getElementById("org-chart");
  const permissionsContainer = document.getElementById("permissions");
  const permissionsTitle = document.createElement("h1");
  permissionsTitle.id = "permissions-title";
  permissionsTitle.style.fontSize = "1.5rem";
  permissionsTitle.style.marginBottom = "1rem";
  permissionsContainer.appendChild(permissionsTitle);

  async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return await response.json();
  }

  function createTreeNode(name, children = [], depth = 0) {
    const container = document.createElement("div");
    container.style.marginLeft = `${depth * 20}px`;
    container.style.padding = "5px";
    container.style.border = "1px solid #ddd";
    container.style.marginBottom = "5px";
    container.style.cursor = "pointer";
    container.style.display = "flex";
    container.style.alignItems = "center";

    const toggleButton = document.createElement("span");
    toggleButton.textContent = children.length > 0 ? "+" : "";
    toggleButton.style.marginRight = "10px";
    toggleButton.style.cursor = "pointer";

    const label = document.createElement("span");
    label.textContent = name;

    const childrenContainer = document.createElement("div");
    childrenContainer.style.display = "none";
    childrenContainer.style.marginLeft = "20px";

    toggleButton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (childrenContainer.style.display === "none") {
        childrenContainer.style.display = "block";
        toggleButton.textContent = "-";
      } else {
        childrenContainer.style.display = "none";
        toggleButton.textContent = "+";
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
      updatePermissionsTitle(name);
    });

    return container;
  }

  function renderOrgChart(data) {
    orgContainer.innerHTML = "";
    data.forEach((hq) => {
      const node = createTreeNode(hq.name, hq.departments.map((dept) => ({
        name: dept.name,
        children: dept.teams.map((team) => ({ name: team }))
      })));
      orgContainer.appendChild(node);
    });
  }

  function renderPermissions(data) {
    permissionsContainer.innerHTML = "";
    permissionsContainer.appendChild(permissionsTitle);

    const container = document.createElement("div");
    container.id = "permissions-container";

    data.forEach((unit) => {
      const unitDiv = document.createElement("div");
      unitDiv.style.marginBottom = "1rem";

      const unitTitle = document.createElement("h2");
      unitTitle.textContent = unit.name;
      unitTitle.style.fontSize = "1.25rem";
      unitTitle.style.marginBottom = "0.5rem";

      const actionsRow = document.createElement("div");
      actionsRow.style.display = "flex";
      actionsRow.style.gap = "1rem";

      unit.actions.forEach((action) => {
        const actionDiv = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
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

  function updatePermissionsTitle(name) {
    permissionsTitle.textContent = `권한 설정: ${name}`;
  }

  try {
    const organization = await fetchData("assets/mock/org.json");
    const permissions = await fetchData("assets/mock/per.json");

    renderOrgChart(organization);
    renderPermissions(permissions);
  } catch (error) {
    console.error("Error loading data:", error);
  }
});
