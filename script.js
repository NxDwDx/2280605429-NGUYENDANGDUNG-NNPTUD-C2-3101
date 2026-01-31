const API_URL = "https://api.escuelajs.co/api/v1/products";

let products = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 5;
let sortTitleAsc = true;
let sortPriceAsc = true;

async function getAllProducts() {
  const res = await fetch(API_URL);
  products = await res.json();
  filteredProducts = products;
  render();
}

function render() {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filteredProducts.slice(start, end);

  const body = document.getElementById("productBody");
  body.innerHTML = "";

  pageData.forEach(p => {
    body.innerHTML += `
      <tr>
        <td>
          <img 
            src="${p.images && p.images.length ? p.images[0] : ''}"
            class="product-img"
            onerror="this.src='https://via.placeholder.com/120x160?text=No+Image'"
          >
        </td>
        <td>${p.title}</td>
        <td>$${p.price}</td>
        <td>
          Hover
          <div class="description">${p.description}</div>
        </td>
      </tr>
    `;
  });

  document.getElementById("pageInfo").innerText =
    `Page ${currentPage} / ${Math.ceil(filteredProducts.length / pageSize)}`;
}

/* SEARCH */
document.getElementById("search").addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(value)
  );
  currentPage = 1;
  render();
});

/* PAGE SIZE */
document.getElementById("pageSize").addEventListener("change", e => {
  pageSize = Number(e.target.value);
  currentPage = 1;
  render();
});

/* SORT */
function sortByTitle() {
  filteredProducts.sort((a, b) =>
    sortTitleAsc
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );
  sortTitleAsc = !sortTitleAsc;
  render();
}

function sortByPrice() {
  filteredProducts.sort((a, b) =>
    sortPriceAsc ? a.price - b.price : b.price - a.price
  );
  sortPriceAsc = !sortPriceAsc;
  render();
}

/* PAGINATION */
function nextPage() {
  if (currentPage * pageSize < filteredProducts.length) {
    currentPage++;
    render();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
}

getAllProducts();
