// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart
function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    showNotification(`${product.name} added to cart`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
    updateCartCount();
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = newQuantity > 0 ? newQuantity : 1;
        saveCart();
        renderCartItems();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Render cart items
function renderCartItems() {
    const cartItemsList = document.querySelector('.cart-items-list');
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        document.querySelector('.cart-summary').style.display = 'none';
        return;
    }
    
    document.querySelector('.cart-summary').style.display = 'block';
    cartItemsList.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div>
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-color">Color: ${item.color || 'N/A'}</div>
                </div>
            </div>
            <div class="cart-item-price">UGX ${item.price.toLocaleString()}</div>
            <div class="cart-item-quantity">
                <div class="quantity-control">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-total">UGX ${itemTotal.toLocaleString()}</div>
            <div class="cart-item-remove">
                <span class="remove-item" data-id="${item.id}">×</span>
            </div>
        `;
        
        cartItemsList.appendChild(cartItem);
    });
    
    // Calculate delivery (10% of subtotal or 5000, whichever is smaller)
    const delivery = Math.min(subtotal * 0.1, 5000);
    const total = subtotal + delivery;
    
    // Update summary
    document.querySelector('.subtotal').textContent = `UGX ${subtotal.toLocaleString()}`;
    document.querySelector('.delivery').textContent = `UGX ${delivery.toLocaleString()}`;
    document.querySelector('.total-amount').textContent = `UGX ${total.toLocaleString()}`;
    
    // Add event listeners
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateQuantity(productId, item.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateQuantity(productId, item.quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    let message = "Hello Bespoke Babystore, I'd like to order the following items:\n\n";
    
    cart.forEach(item => {
        message += `${item.name} - ${item.quantity} x UGX ${item.price.toLocaleString()} = UGX ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const delivery = Math.min(subtotal * 0.1, 5000);
    const total = subtotal + delivery;
    
    message += `\nSubtotal: UGX ${subtotal.toLocaleString()}\n`;
    message += `Delivery: UGX ${delivery.toLocaleString()}\n`;
    message += `Total: UGX ${total.toLocaleString()}\n\n`;
    message += "Please let me know how to proceed with payment and delivery. Thank you!";
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/256783468608?text=${encodedMessage}`, '_blank');
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
        
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', checkout);
        }
    }
    
    // Add to cart from product details page
    const addToCartBtn = document.querySelector('.product-details-add');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            const quantity = parseInt(document.querySelector('.product-details-quantity').value) || 1;
            
            if (product) {
                addToCart(product, quantity);
                updateCartCount();
            }
        });
    }
});
