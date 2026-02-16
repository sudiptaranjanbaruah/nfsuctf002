/**
 * cart.js — localStorage-based cart system
 * 
 * Manages product data, cart state, and UI rendering.
 * Uses real product images from the internet.
 */

// ========== Product Catalog ==========
const products = [
    {
        id: 1,
        name: 'Apple AirPods Pro',
        desc: 'Active noise cancellation, transparency mode, and personalized spatial audio with dynamic head tracking.',
        price: 249.00,
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95',
        badge: 'Popular'
    },
    {
        id: 2,
        name: 'Sony WH-1000XM5',
        desc: 'Industry-leading noise canceling wireless headphones with exceptional sound quality and 30-hour battery.',
        price: 348.00,
        image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SL1500_.jpg',
        badge: null
    },
    {
        id: 3,
        name: 'Logitech MX Master 3S',
        desc: 'Advanced wireless mouse with ultra-fast scrolling, 8K DPI tracking, and quiet clicks for any surface.',
        price: 99.99,
        image: 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg',
        badge: 'Best Seller'
    },
    {
        id: 4,
        name: 'Keychron K2 Keyboard',
        desc: 'Compact 75% wireless mechanical keyboard with Gateron switches, RGB backlight, and Mac/Windows layout.',
        price: 89.99,
        image: 'https://m.media-amazon.com/images/I/71V2v8CXZML._AC_SL1500_.jpg',
        badge: null
    },
    {
        id: 5,
        name: 'Samsung 27" 4K Monitor',
        desc: 'Ultra-sharp 4K UHD display with IPS panel, HDR10 support, and USB-C connectivity for pro workflows.',
        price: 449.99,
        image: 'https://m.media-amazon.com/images/I/81oMSsSiZBL._AC_SL1500_.jpg',
        badge: 'Hot'
    },
    {
        id: 6,
        name: 'Apple MacBook Air M2',
        desc: 'Supercharged by M2 chip with 8-core GPU, 13.6" Liquid Retina display, and 18-hour battery life.',
        price: 1199.00,
        image: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg',
        badge: 'New'
    },
    {
        id: 7,
        name: 'JBL Charge 5 Speaker',
        desc: 'Portable Bluetooth speaker with powerful JBL Pro Sound, built-in powerbank, and IP67 waterproof rating.',
        price: 179.95,
        image: 'https://m.media-amazon.com/images/I/71FHJ56yMbL._AC_SL1500_.jpg',
        badge: null
    },
    {
        id: 8,
        name: 'Anker 65W USB-C Charger',
        desc: 'Ultra-compact GaN charger with 3 ports, fast charging for laptops and phones simultaneously.',
        price: 35.99,
        image: 'https://m.media-amazon.com/images/I/617oDbNeJBL._AC_SL1500_.jpg',
        badge: 'Sale'
    }
];

// ========== Cart State ==========

/**
 * Get the current cart from localStorage
 * @returns {Array}
 */
function getCart() {
    try {
        const data = localStorage.getItem('cart');
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

/**
 * Save cart to localStorage
 * @param {Array} cart 
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Add a product to the cart
 * @param {number} productId 
 */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart();
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
    }

    saveCart(cart);
    updateCartCount();
    renderCartItems();
    showToast(`${product.name} added to cart!`);

    // Pop animation on cart icon
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.classList.remove('cart-pop');
        void cartBtn.offsetWidth; // reflow
        cartBtn.classList.add('cart-pop');
    }
}

/**
 * Remove an item from the cart
 * @param {number} productId 
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    renderCartItems();
}

/**
 * Update the cart count badge in the navbar
 */
function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
}

// ========== UI Rendering ==========

/**
 * Render the product grid on the home page
 */
function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
    <div class="product-card" onclick="openProductModal(${product.id})">
      ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
      <div class="card-img">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="card-body">
        <h3>${product.name}</h3>
        <p class="card-desc">${product.desc}</p>
        <div class="card-footer">
          <span class="price">$${product.price.toFixed(2)}</span>
          <button class="add-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
            🛒 Add
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Render cart items in the sidebar
 */
function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty</p>
      </div>
    `;
        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.textContent = '$0.00';
        return;
    }

    container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="ci-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="ci-info">
        <h4>${item.name} × ${item.qty}</h4>
        <span class="ci-price">$${(item.price * item.qty).toFixed(2)}</span>
      </div>
      <button class="ci-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// ========== Product Modal ==========

/**
 * Open the product detail modal
 * @param {number} productId 
 */
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const overlay = document.getElementById('product-modal');
    if (!overlay) return;

    document.getElementById('modal-img').innerHTML = `<img src="${product.image}" alt="${product.name}">`;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-desc').textContent = product.desc;
    document.getElementById('modal-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modal-add-btn').onclick = () => {
        addToCart(product.id);
        closeProductModal();
    };

    overlay.classList.add('active');
}

/**
 * Close the product detail modal
 */
function closeProductModal() {
    const overlay = document.getElementById('product-modal');
    if (overlay) overlay.classList.remove('active');
}

// ========== Cart Sidebar ==========

function openCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    renderCartItems();
}

function closeCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

// ========== Toast ==========

/**
 * Show a brief toast notification
 * @param {string} message 
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ========== Checkout (dummy) ==========
function checkout() {
    const cart = getCart();
    if (cart.length === 0) return;
    saveCart([]);
    updateCartCount();
    renderCartItems();
    closeCart();
    showToast('🎉 Order placed successfully! (Just kidding, this is a demo)');
}

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
});
