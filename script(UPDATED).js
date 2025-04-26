document.getElementById("addProductBtn").addEventListener("click", function () {
  document.getElementById("modal").style.display = "block";
  document.getElementById("saveProduct").textContent = "Add Product";
  document.getElementById("saveProduct").setAttribute("data-editing", "false");

  const today = new Date().toISOString().split('T')[0];
  document.getElementById("date").value = today;
});

document.querySelector(".close").addEventListener("click", function () {
  document.getElementById("modal").style.display = "none";
  clearModalInputs();
});

document.getElementById("saveProduct").addEventListener("click", function () {
  let name = document.getElementById("productName").value;
  let quantity = document.getElementById("quantity").value;
  let price = document.getElementById("price").value;
  let productType = document.getElementById("productType").value;
  let imageUrl = document.getElementById("imageUrl").value;
  let productImage = document.getElementById("productImage").files[0];
  let productDate = document.getElementById("date").value;
  let isEditing = this.getAttribute("data-editing") === "true";
  let editingRow = document.getElementById("modal").getAttribute("data-row");

  if (!productDate) {
    productDate = new Date().toISOString().split('T')[0];
  }

  if (name && quantity && price && productType) {
    let tableBody = document.getElementById("productTable").querySelector("tbody");
    let imageSrc = "";

    if (imageUrl) {
      imageSrc = imageUrl;
    } else if (productImage) {
      imageSrc = URL.createObjectURL(productImage);
    }

    if (isEditing && editingRow) {
      let row = document.querySelector(`[data-row-id="${editingRow}"]`);
      row.cells[0].innerText = name;
      row.cells[1].innerText = quantity;
      row.cells[2].innerText = price;
      row.cells[3].innerText = productType;
      row.cells[4].innerText = productDate;
      row.cells[5].innerHTML = imageSrc ? `<img src="${imageSrc}" alt="Product Image" class="product-img" />` : "";
    } else {
      let row = tableBody.insertRow();
      let rowId = Date.now();
      row.setAttribute("data-row-id", rowId);

      row.innerHTML = `
        <td>${name}</td>
        <td>${quantity}</td>
        <td>${price}</td>
        <td>${productType}</td>
        <td>${productDate}</td>
        <td>${imageSrc ? `<img src="${imageSrc}" alt="Product Image" class="product-img" />` : ""}</td>
        <td>
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </td>
      `;
    }

    document.getElementById("modal").style.display = "none";
    clearModalInputs();
  } else {
    alert("Please fill in all fields (including Type)");
  }
});

document.getElementById("productTable").addEventListener("click", function (event) {
  let target = event.target;
  let row = target.closest("tr");

  if (target.classList.contains("delete")) {
    row.remove();
  }

  if (target.classList.contains("edit")) {
    let name = row.cells[0].innerText;
    let quantity = row.cells[1].innerText;
    let price = row.cells[2].innerText;
    let type = row.cells[3].innerText;
    let date = row.cells[4].innerText;

    document.getElementById("productName").value = name;
    document.getElementById("quantity").value = quantity;
    document.getElementById("price").value = price;
    document.getElementById("productType").value = type;
    document.getElementById("date").value = date;

    document.getElementById("modal").style.display = "block";
    let saveButton = document.getElementById("saveProduct");
    saveButton.textContent = "Update Product";
    saveButton.setAttribute("data-editing", "true");

    document.getElementById("modal").setAttribute("data-row", row.getAttribute("data-row-id"));
  }
});

document.getElementById("search").addEventListener("input", function () {
  let filter = this.value.toLowerCase();
  let rows = document.querySelectorAll("#productTable tbody tr");

  rows.forEach(row => {
    let productName = row.cells[0]?.innerText.toLowerCase() || "";
    row.style.display = productName.includes(filter) ? "" : "none";
  });
});

document.getElementById("filterOption").addEventListener("change", function () {
  let tableBody = document.querySelector("#productTable tbody");
  let rows = Array.from(tableBody.querySelectorAll("tr"));
  let type = this.value;

  if (!type) return;

  let columnIndex = type === "name" ? 0 : type === "quantity" ? 1 : 2;

  rows.sort((a, b) => {
    let valA = a.cells[columnIndex].innerText.toLowerCase();
    let valB = b.cells[columnIndex].innerText.toLowerCase();

    return type === "name" ? valA.localeCompare(valB) : parseFloat(valA) - parseFloat(valB);
  });

  rows.forEach(row => tableBody.appendChild(row));
});

function clearModalInputs() {
  document.getElementById("productName").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("price").value = "";
  document.getElementById("productType").value = "";
  document.getElementById("date").value = "";
  document.getElementById("imageUrl").value = "";
  document.getElementById("productImage").value = "";
  document.getElementById("modal").removeAttribute("data-row");
}

const typeFilters = document.querySelectorAll('.type-filter');
typeFilters.forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    applyTypeFilters();
  });
});

function applyTypeFilters() {
  const checkedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);
  const rows = document.querySelectorAll('#productTable tbody tr');

  rows.forEach(row => {
    const itemType = row.cells[3]?.innerText || ""; 
    if (checkedTypes.length === 0 || checkedTypes.includes(itemType)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}