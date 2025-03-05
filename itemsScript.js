/****************************************************
 * itemsScript.js
 ****************************************************/

let allItems = [];

// 1) FETCH data.json
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    // Assume we only have 1 big category "All Items" 
    // or you might loop multiple categories
    const cat = data.categories[0]; 
    allItems = cat.items;
    renderItemsTable(allItems);
  })
  .catch(error => console.error("Error loading data.json:", error));

// 2) RENDER TABLE
function renderItemsTable(itemArray) {
  const tableBody = document.querySelector("#itemsTable tbody");
  tableBody.innerHTML = "";

  itemArray.forEach(item => {
    const tr = document.createElement("tr");

    // highlight if built
    if (item.built) tr.classList.add("built-true");

    // Name cell
    const tdName = document.createElement("td");
    tdName.textContent = item.inGameName || item.itemID;
    // Clicking the name cell opens the modal
    tdName.addEventListener("click", () => openItemModal(item, tr));
    tr.appendChild(tdName);

    // Category cell
    const tdCategory = document.createElement("td");
    tdCategory.textContent = item.category || "Misc";
    tr.appendChild(tdCategory);

    // Farmable cell
    const tdFarmable = document.createElement("td");
    tdFarmable.textContent = item.farmable ? "Yes" : "No";
    tr.appendChild(tdFarmable);

    // Method cell
    const tdMethod = document.createElement("td");
    tdMethod.textContent = item.collectionMethod || item.method || "";
    tr.appendChild(tdMethod);

    // Built? cell => checkbox
    const tdBuilt = document.createElement("td");
    const builtCheck = document.createElement("input");
    builtCheck.type = "checkbox";
    builtCheck.checked = item.built || false;
    builtCheck.addEventListener("change", () => {
      item.built = builtCheck.checked;
      if (item.built) tr.classList.add("built-true");
      else tr.classList.remove("built-true");
      // Optional: store to localStorage or server
    });
    tdBuilt.appendChild(builtCheck);
    tr.appendChild(tdBuilt);

    tableBody.appendChild(tr);
  });
}

// 3) OPEN MODAL with extra fields
function openItemModal(item, rowElement) {
  document.getElementById("itemModal").classList.remove("hidden");
  document.getElementById("modalItemName").textContent = item.inGameName || item.itemID;

  // Show more fields
  document.getElementById("modalCategory").textContent = `Category: ${item.category || "N/A"}`;
  document.getElementById("modalFarmable").textContent = `Farmable: ${item.farmable ? "Yes" : "No"}`;
  document.getElementById("modalMethod").textContent = `Method: ${item.collectionMethod || item.method || "N/A"}`;
  document.getElementById("modalBiomeReq").textContent = `Biome Required: ${item.biomeRequired || "N/A"}`;
  document.getElementById("modalStructureReq").textContent = `Structure Required: ${item.structureRequired || "None"}`;
  document.getElementById("modalSpawnConditions").textContent = `Spawn Conditions: ${item.spawnConditions || "N/A"}`;
  document.getElementById("modalDependencies").textContent = `Dependencies: ${item.dependencies || "None"}`;
  document.getElementById("modalRarity").textContent = `Rarity: ${item.rarity || "Unknown"}`;
  document.getElementById("modalNotes").textContent = `Notes: ${item.notes || ""}`;
}

// 4) CLOSE MODAL
function closeModal() {
  document.getElementById("itemModal").classList.add("hidden");
}

// 5) SEARCH / FILTER
function filterItems() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  const rows = document.querySelectorAll("#itemsTable tbody tr");

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.classList.toggle("hidden", !text.includes(query));
  });
}