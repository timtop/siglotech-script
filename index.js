const cartState = JSON.parse(localStorage.getItem("sigloTech-cart")) || {};
const cartCountEl = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");

function updateCartDisplay() {
  cartItemsEl.innerHTML = "";
  let total = 0;
  let count = 0;

  for (const id in cartState) {
    const item = cartState[id];
    const subtotal = item.price * item.quantity;
    total += subtotal;
    count += item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <span class="quantity-controls_item">${item.name} ($${item.price.toFixed(
      2
    )})</span>
      <div class="quantity-controls">
        <button onclick="changeQuantity('${id}', -1)">-</button>
        <span class="quantity-controls_item">${item.quantity}</span>
        <button onclick="changeQuantity('${id}', 1)">+</button>
      </div>
    `;
    cartItemsEl.appendChild(itemDiv);
  }

  cartTotalEl.textContent = total.toFixed(2);
  cartCountEl.textContent = count;
  localStorage.setItem("sigloTech-cart", JSON.stringify(cartState));
}

function changeQuantity(id, delta) {
  if (!cartState[id]) return;
  cartState[id].quantity += delta;
  if (cartState[id].quantity < 1) {
    delete cartState[id];
  }
  updateCartDisplay();
}

// Adding to cart
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", (e) => {
    const product = e.target.closest(".card");
    const id = product.dataset.id;
    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);

    if (cartState[id]) {
      cartState[id].quantity++;
    } else {
      cartState[id] = { name, price, quantity: 1 };
    }
    updateCartDisplay();
  });
});

// Taking care of modal
const modal = document.getElementById("cartModal");
const backdrop = document.getElementById("backdrop");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");

openCart.addEventListener("click", () => {
  backdrop.style.display = "block";
  gsap.to(modal, { right: 0, duration: 0.5, ease: "power2.out" });
});

function closeModal() {
  gsap.to(modal, { right: "-100%", duration: 0.5, ease: "power2.in" });
  backdrop.style.display = "none";
}

closeCart.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);

updateCartDisplay();
