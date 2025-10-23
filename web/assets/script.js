diff --git a/web/assets/script.js b/web/assets/script.js
new file mode 100644
index 0000000000000000000000000000000000000000..33336516ebfcf85ab2b0252f186d922b53df0eb7
--- /dev/null
+++ b/web/assets/script.js
@@ -0,0 +1,219 @@
+const products = [
+  {
+    id: "orchard-basket",
+    name: "Fresh Orchard Basket",
+    vendor: "Greenfield Farms",
+    price: 42,
+    category: "produce",
+    badge: "Seasonal"
+  },
+  {
+    id: "herbal-tea",
+    name: "Herbal Wellness Tea Set",
+    vendor: "Bloom & Root",
+    price: 28,
+    category: "wellness",
+    badge: "Best Seller"
+  },
+  {
+    id: "ceramic-set",
+    name: "Handcrafted Ceramic Set",
+    vendor: "Clay & Co.",
+    price: 65,
+    category: "crafts",
+    badge: "Limited"
+  },
+  {
+    id: "linen-throws",
+    name: "Organic Linen Throw",
+    vendor: "Haven Home",
+    price: 54,
+    category: "home"
+  },
+  {
+    id: "artisan-jam",
+    name: "Artisan Berry Preserves",
+    vendor: "Sweet Grove Pantry",
+    price: 16,
+    category: "produce"
+  },
+  {
+    id: "essential-oils",
+    name: "Restorative Essential Oils",
+    vendor: "Aura Studio",
+    price: 36,
+    category: "wellness"
+  },
+  {
+    id: "market-bundle",
+    name: "Farmers Market Bundle",
+    vendor: "Bright Acre Collective",
+    price: 48,
+    category: "produce",
+    badge: "Bundle"
+  },
+  {
+    id: "woven-basket",
+    name: "Woven Storage Basket",
+    vendor: "Thread & Timber",
+    price: 32,
+    category: "home"
+  }
+];
+
+const state = {
+  filter: "all",
+  search: "",
+  cart: new Map()
+};
+
+const productGrid = document.getElementById("product-grid");
+const categorySelect = document.getElementById("category-filter");
+const searchInput = document.getElementById("search-input");
+const clearFiltersButton = document.getElementById("clear-filters");
+const cartItems = document.getElementById("cart-items");
+const cartTotal = document.getElementById("cart-total");
+const checkoutButton = document.getElementById("checkout-button");
+const yearDisplay = document.getElementById("year");
+
+function formatCurrency(amount) {
+  return new Intl.NumberFormat("en-US", {
+    style: "currency",
+    currency: "USD"
+  }).format(amount);
+}
+
+function filterProducts() {
+  return products.filter((product) => {
+    const matchesCategory =
+      state.filter === "all" ? true : product.category === state.filter;
+    const matchesSearch = `${product.name} ${product.vendor}`
+      .toLowerCase()
+      .includes(state.search.toLowerCase());
+    return matchesCategory && matchesSearch;
+  });
+}
+
+function renderProducts() {
+  const filtered = filterProducts();
+  productGrid.innerHTML = "";
+
+  if (!filtered.length) {
+    productGrid.innerHTML = `
+      <p class="empty">No products match your search. Try adjusting filters.</p>
+    `;
+    return;
+  }
+
+  const fragment = document.createDocumentFragment();
+
+  filtered.forEach((product) => {
+    const item = document.createElement("article");
+    item.className = "product-card";
+    item.setAttribute("role", "listitem");
+    item.innerHTML = `
+      ${
+        product.badge
+          ? `<span class="product-card__badge">${product.badge}</span>`
+          : ""
+      }
+      <div>
+        <h3 class="product-card__title">${product.name}</h3>
+        <p class="product-card__vendor">${product.vendor}</p>
+      </div>
+      <span class="product-card__price">${formatCurrency(product.price)}</span>
+      <button class="cta-button" data-product-id="${product.id}">Add to cart</button>
+    `;
+    fragment.appendChild(item);
+  });
+
+  productGrid.appendChild(fragment);
+}
+
+function renderCart() {
+  cartItems.innerHTML = "";
+  let total = 0;
+
+  if (!state.cart.size) {
+    cartItems.innerHTML = '<li class="empty">Your cart is empty.</li>';
+  }
+
+  state.cart.forEach((item) => {
+    total += item.price * item.quantity;
+    const li = document.createElement("li");
+    li.className = "cart__item";
+    li.innerHTML = `
+      <span>${item.name} × ${item.quantity}</span>
+      <button class="ghost-button" data-remove-id="${item.id}">Remove</button>
+    `;
+    cartItems.appendChild(li);
+  });
+
+  cartTotal.textContent = formatCurrency(total);
+  checkoutButton.disabled = total === 0;
+  checkoutButton.textContent = total === 0 ? "Browse to add items" : "Proceed to Checkout";
+}
+
+function addToCart(productId) {
+  const product = products.find((item) => item.id === productId);
+  if (!product) return;
+
+  const existing = state.cart.get(productId) || {
+    ...product,
+    quantity: 0
+  };
+
+  existing.quantity += 1;
+  state.cart.set(productId, existing);
+  renderCart();
+}
+
+function removeFromCart(productId) {
+  state.cart.delete(productId);
+  renderCart();
+}
+
+categorySelect.addEventListener("change", (event) => {
+  state.filter = event.target.value;
+  renderProducts();
+});
+
+searchInput.addEventListener("input", (event) => {
+  state.search = event.target.value.trim();
+  renderProducts();
+});
+
+clearFiltersButton.addEventListener("click", () => {
+  state.filter = "all";
+  state.search = "";
+  categorySelect.value = "all";
+  searchInput.value = "";
+  renderProducts();
+});
+
+productGrid.addEventListener("click", (event) => {
+  const button = event.target.closest("button[data-product-id]");
+  if (!button) return;
+  addToCart(button.dataset.productId);
+});
+
+cartItems.addEventListener("click", (event) => {
+  const button = event.target.closest("button[data-remove-id]");
+  if (!button) return;
+  removeFromCart(button.dataset.removeId);
+});
+
+checkoutButton.addEventListener("click", () => {
+  if (!state.cart.size) return;
+  const items = Array.from(state.cart.values())
+    .map((item) => `${item.name} × ${item.quantity}`)
+    .join("\n");
+  alert(`Checkout summary:\n${items}`);
+});
+
+if (yearDisplay) {
+  yearDisplay.textContent = new Date().getFullYear();
+}
+
+renderProducts();
+renderCart();
