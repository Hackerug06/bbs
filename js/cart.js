document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.cart-page')) {
        loadCart();
        setupCheckout();
    }
});

// Load Cart Items
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContent = document.querySelector('.cart-content');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        checkoutBtn.disabled = true;
        updateCartSummary(0);
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    checkoutBtn.disabled = false;
    
    cartContent.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div>
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-color">${item.size} | ${item.color.charAt(0).toUpperCase() + item.color.slice(1)}</div>
                </div>
            </div>
            <div class="cart-item-price">UGX ${item.price.toLocaleString()}</div>
            <div class="quantity-control">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">UGX ${itemTotal.toLocaleString()}</div>
            <div class="remove-item" data-id="${item.id}">×</div>
        `;
        
        cartContent.appendChild(cartItem);
    });
    
    updateCartSummary(subtotal);
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(parseInt(this.getAttribute('data-id')), -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(parseInt(this.getAttribute('data-id')), 1);
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            removeItem(parseInt(this.getAttribute('data-id')));
        });
    });
}

// Update Quantity
function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) return;
    
    cart[itemIndex].quantity += change;
    
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Remove Item
function removeItem(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Update Cart Summary
function updateCartSummary(subtotal) {
    document.getElementById('subtotal').textContent = `UGX ${subtotal.toLocaleString()}`;
    document.getElementById('total').textContent = `UGX ${subtotal.toLocaleString()}`;
}

// Setup Checkout
function setupCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    
    checkoutBtn.addEventListener('click', function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) return;
        
        // Create WhatsApp message
        let message = "Hello Bespoke Babystore! I'd like to order the following items:\n\n";
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            message += `- ${item.name} (${item.size}, ${item.color}): ${item.quantity} × UGX ${item.price.toLocaleString()} = UGX ${itemTotal.toLocaleString()}\n`;
        });
        
        message += `\nTotal: UGX ${total.toLocaleString()}\n\nPlease let me know how to proceed with payment and delivery.`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp with the message
        window.open(`https://wa.me/256783468608?text=${encodedMessage}`, '_blank');
    });
}
