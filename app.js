// API URL for fetching products data
const API_URL = "https://dummyjson.com/products";

// Fetch and display featured products on the homepage
function fetchFeaturedProducts() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const featuredProductsContainer =
        document.getElementById("featured-products");

      // Display the first 4 products
      data.products.slice(0, 4).forEach((product) => {
        const productCard = `
          <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <div class="card h-100 shadow-sm border-0">
              <img src="${product.thumbnail}" class="card-img-top rounded" alt="${product.title}" style="height: 250px; object-fit:contain;">
              <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">Price: <strong>$${product.price}</strong></p>
                <p class="card-text text-warning">
                  Rating: <strong>${product.rating}</strong> ⭐
                </p>
                <a href="product-details.html?id=${product.id}" class="btn btn-primary w-100">View Details</a>
              </div>
            </div>
          </div>
        `;
        featuredProductsContainer.innerHTML += productCard;
      });
    });
}

// Fetch and display all products with filtering and sorting
function fetchAndDisplayProducts() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const products = data.products;
      const categoryFilter = document.getElementById("categoryFilter");
      const sortFilter = document.getElementById("sortFilter");

      // Handle category filtering
      const selectedCategory = categoryFilter.value;

      // Handle sorting
      const selectedSort = sortFilter.value;

      // Filter products by category
      let filteredProducts = selectedCategory
        ? products.filter((product) => product.category === selectedCategory)
        : products;

      // Sort products based on selected option
      if (selectedSort === "price") {
        filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
      } else if (selectedSort === "popularity") {
        filteredProducts = filteredProducts.sort((a, b) => b.rating - a.rating);
      }

      // Render filtered and sorted products
      const productListContainer = document.getElementById("product-list");
      productListContainer.innerHTML = "";

      filteredProducts.forEach((product) => {
        const productCard = `
          <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <div class="card h-100 shadow-sm border-0">
              <img src="${product.thumbnail}" class="card-img-top rounded" alt="${product.title}" style="height: 250px; object-fit:contain;">
              <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">Price: <strong>$${product.price}</strong></p>
                <p class="card-text text-warning">
                  Rating: <strong>${product.rating}</strong> ⭐
                </p>
                <a href="product-details.html?id=${product.id}" class="btn btn-info w-100">View Details</a>
              </div>
            </div>
          </div>
        `;
        productListContainer.innerHTML += productCard;
      });
    });
}

// Fetch and display categories dynamically
function loadCategories() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const categories = new Set(
        data.products.map((product) => product.category)
      );
      const categoryFilter = document.getElementById("categoryFilter");

      // Populate the category dropdown
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });
    });
}

// Event listeners for filters
document.addEventListener("DOMContentLoaded", function () {
  // Load categories and display products
  loadCategories();
  fetchAndDisplayProducts();

  // Attach event listeners to category and sort filters
  document
    .getElementById("categoryFilter")
    .addEventListener("change", fetchAndDisplayProducts);
  document
    .getElementById("sortFilter")
    .addEventListener("change", fetchAndDisplayProducts);
});

// Fetch detailed information about a specific product
function fetchProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  fetch(`${API_URL}/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      const productDetailsContainer =
        document.getElementById("product-details");
      productDetailsContainer.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <img src="${product.thumbnail}" class="img-fluid rounded shadow" alt="${product.title}" style="height: 400px; object-fit:cover;">
          </div>
          <div class="col-md-6">
            <h3>${product.title}</h3>
            <p class="text-muted">${product.description}</p>
            <p>Category: <strong>${product.category}</strong></p>
            <p>Price: <strong>$${product.price}</strong></p>
            <p class="text-warning">Rating: <strong>${product.rating}</strong> ⭐</p>
            <button class="btn btn-success w-100 mt-3" id="addToCartBtn" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-image="${product.thumbnail}">Add to Cart</button>
          </div>
        </div>
      `;

      // Attach event listener to the 'Add to Cart' button
      document
        .getElementById("addToCartBtn")
        .addEventListener("click", function () {
          addToCart(product);
        });
    });
}

// Add a product to the shopping cart in localStorage
function addToCart(product) {
  // Retrieve current cart from localStorage or create an empty array if none exists
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the product already exists in the cart
  const existingProductIndex = cart.findIndex((item) => item.id === product.id);

  // If product does not exist, add it with quantity 1, else increment quantity
  if (existingProductIndex === -1) {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      quantity: 1,
    });
  } else {
    cart[existingProductIndex].quantity++;
  }

  // Save updated cart back to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Inform the user the product has been added to the cart
  alert("Product added to cart!");
}

// Fetch and display all cart items from localStorage
function fetchCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items");
  let totalAmount = 0;

  // If the cart has items, display them
  if (cartItems.length > 0) {
    cartItems.forEach((item) => {
      totalAmount += item.price * item.quantity; // Sum up the total amount

      cartContainer.innerHTML += `
        <div class="cart-item d-flex align-items-center mb-4 shadow-sm p-3 rounded col-6">
          <img src="${item.image}" alt="${
        item.title
      }" style="height: 80px; width: 80px; object-fit: cover; margin-right: 20px;">
          <div>
            <h5>${item.title}</h5>
            <p>Price: $${item.price} | Quantity: ${item.quantity}</p>
            <p>Total: <strong>$${item.price * item.quantity}</strong></p>
          </div>
        </div>
      `;
    });

    // Update the total price in the UI
    document.getElementById("total-price").textContent = totalAmount.toFixed(2); // Set the total price
  } else {
    // If the cart is empty, display a message
    cartContainer.innerHTML = `<p>Your cart is empty!</p>`;
    document.getElementById("total-price").textContent = "0"; // Display 0 if cart is empty
  }
}

// Clear all items from the cart in localStorage
function clearCart() {
  localStorage.removeItem("cart");
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = `<p>Your cart is empty!</p>`;
  alert("Cart has been cleared!");
}

// Event listener for DOMContentLoaded to ensure all elements are loaded
document.addEventListener("DOMContentLoaded", function () {
  // Fetch data for featured products, product list, and product details based on page
  if (document.getElementById("featured-products")) fetchFeaturedProducts();
  if (document.getElementById("product-list")) fetchAndDisplayProducts();
  if (document.getElementById("product-details")) fetchProductDetails();
  if (document.getElementById("cart-items")) fetchCart();
  if (document.getElementById("clearCartBtn")) {
    document
      .getElementById("clearCartBtn")
      .addEventListener("click", clearCart);
  }
});
// Update the footer to display the current year
document.getElementById("current-year").textContent = new Date().getFullYear();
