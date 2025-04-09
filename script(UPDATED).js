document.getElementById("addProductBtn").addEventListener("click", function () {
    document.getElementById("modal").style.display = "block";
    document.getElementById("saveProduct").textContent = "Add Product";
    document.getElementById("saveProduct").setAttribute("data-editing", "false");
  });

  document.querySelector(".close").addEventListener("click", function () {
    document.getElementById("modal").style.display = "none";
    clearModalInputs();
  });

  document.getElementById("saveProduct").addEventListener("click", function () {
    let name = document.getElementById("productName").value;
    let quantity = document.getElementById("quantity").value;
    let price = document.getElementById("price").value;
    let imageUrl = document.getElementById("imageUrl").value; 
    let productImage = document.getElementById("productImage").files[0];
    let isEditing = this.getAttribute("data-editing") === "true";
    let editingRow = document.getElementById("modal").getAttribute("data-row");
  
    if (name && quantity && price) {
      let tableBody = document.getElementById("productTable").querySelector("tbody");
      let currentDate = new Date().toLocaleDateString();
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
        row.cells[3].innerText = currentDate;
        row.cells[4].innerHTML = imageSrc ? `<img src="${imageSrc}" alt="Product Image" class="product-img" />` : ""; 
      } else {
        let row = tableBody.insertRow();
        let rowId = Date.now();
        row.setAttribute("data-row-id", rowId);
  
        row.innerHTML = `
          <td>${name}</td>
          <td>${quantity}</td>
          <td>${price}</td>
          <td>${currentDate}</td>
          <td>${imageSrc ? `<img src="${imageSrc}" alt="Product Image" class="product-img" />` : ""}</td> <!-- Add image here -->
          <td>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          </td>
        `;
      }
  
      document.getElementById("modal").style.display = "none";
      clearModalInputs();
    } else {
      alert("Please fill in all fields");
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

      document.getElementById("productName").value = name;
      document.getElementById("quantity").value = quantity;
      document.getElementById("price").value = price;

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
    document.getElementById("modal").removeAttribute("data-row");
  }