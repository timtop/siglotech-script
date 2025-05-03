alert("Script is workgin");
const cartState = JSON.parse(localStorage.getItem("sigloTech-cart")) || {};
const cartCountEls = document.querySelectorAll("#cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEls = document.querySelectorAll("#cartTotal");

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

  cartTotalEls.forEach((cartItemsEl) => {
    cartItemsEl.textContent = total.toFixed(2);
  });
  cartCountEls.forEach((cartCountEl) => {
    cartCountEl.textContent = count;
  });
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
const closeCarts = document.querySelectorAll("#closeCart");
const checkOutBtn = document.getElementById("checkOut");
const checkOutModal = document.getElementById("checkoutModal");

openCart.addEventListener("click", () => {
  backdrop.style.display = "block";
  gsap.to(modal, { right: 0, duration: 0.5, ease: "power2.out" });
});

//Open check out function
function openCheckOut() {
  // Closes the cart modal
  gsap.to(modal, { right: "-100%", duration: 0.5, ease: "power2.in" });
  // Opens the checkout modal
  gsap.to(checkOutModal, { right: 0, duration: 0.5, ease: "power2.in" });
}

//Function to close the modal
function closeModal() {
  gsap.to(modal, { right: "-100%", duration: 0.5, ease: "power2.in" });
  gsap.to(checkOutModal, { right: "-100%", duration: 0.5, ease: "power2.in" });
  backdrop.style.display = "none";
}

//Closes the cart modal and opens the checkout modal
checkOutBtn.addEventListener("click", openCheckOut);

closeCarts.forEach((closeCart) => {
  closeCart.addEventListener("click", closeModal);
});

// closeCart.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);

updateCartDisplay();
