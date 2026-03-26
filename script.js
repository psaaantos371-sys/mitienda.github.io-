const products = [
    { id: 1, name: "Tapetes de Auto Premium", price: 2500, description: "Tapetes de alta calidad con logo personalizado", image: "🛬", offer: false },
    { id: 2, name: "Protector de Asientos", price: 3800, description: "Protector resistente al agua y manchas", image: "🪑", offer: true, originalPrice: 5000 },
    { id: 3, name: "Funda de Volante", price: 1200, description: "Funda ergonómica de cuero sintético", image: "🎡", offer: false },
    { id: 4, name: "Portavasos Auto", price: 800, description: "Portavasos ajustable con soporte antideslizante", image: "☕", offer: true, originalPrice: 1200 },
    { id: 5, name: "Luz LED Interior", price: 1500, description: "Iluminación LED RGB de 12V para auto", image: "💡", offer: false },
    { id: 6, name: "Barras Portaequipaje", price: 5500, description: "Barras de aluminio resistente para techo", image: "🚗", offer: false },
    { id: 7, name: "Kit de Limpieza Auto", price: 2200, description: "Set completo de productos y herramientas de limpieza", image: "🧹", offer: true, originalPrice: 3500 },
    { id: 8, name: "Air Freshener Premium", price: 950, description: "Aromatizante de larga duración", image: "🌸", offer: false }
];

let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('autostore-cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('autostore-cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showNotification('✅ Producto agregado al carrito');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            displayCart();
        }
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function displayCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; color: #999;">El carrito está vacío</p>';
    } else {
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString('es-AR')}</div>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Quitar</button>
            `;
            cartItemsDiv.appendChild(cartItemDiv);
        });
    }

    const total = getCartTotal();
    document.getElementById('cartTotal').textContent = total.toLocaleString('es-AR');
}

function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    const regularProducts = products.filter(p => !p.offer);
    
    regularProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toLocaleString('es-AR')}</div>
                <div class="product-description">${product.description}</div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Agregar al Carrito</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

function displayOffers() {
    const offersGrid = document.getElementById('offersGrid');
    offersGrid.innerHTML = '';

    const offeredProducts = products.filter(p => p.offer);

    if (offeredProducts.length === 0) {
        offersGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No hay ofertas disponibles</p>';
        return;
    }

    offeredProducts.forEach(product => {
        const discount = Math.round((1 - product.price / product.originalPrice) * 100);
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div style="position: relative;">
                <div class="product-image">${product.image}</div>
                <span style="position: absolute; top: 10px; right: 10px; background: var(--secondary-color); color: white; padding: 8px 12px; border-radius: 5px; font-weight: bold; font-size: 0.9rem;">
                    -${discount}%
                </span>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                    <span style="text-decoration: line-through; color: #999;">$${product.originalPrice.toLocaleString('es-AR')}</span>
                    <div class="product-price">$${product.price.toLocaleString('es-AR')}</div>
                </div>
                <div class="product-description">${product.description}</div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Agregar al Carrito</button>
            </div>
        `;
        offersGrid.appendChild(productCard);
    });
}

function openCart() {
    document.getElementById('cartModal').style.display = 'block';
    displayCart();
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('⚠️ El carrito está vacío');
        return;
    }

    const total = getCartTotal();
    const whatsappMessage = `¡Hola! Quiero realizar una compra en AutoStore por $${total.toLocaleString('es-AR')}. ¿Podés enviarme el link de pago?`;
    const whatsappNumber = '541112345678';

    window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
        '_blank'
    );
    
    closeCart();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 2000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('✅ Mensaje enviado correctamente');
        contactForm.reset();
    });
}

window.addEventListener('click', (event) => {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    displayProducts();
    displayOffers();
});
