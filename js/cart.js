// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            
            addToCart(id, name, price);
        });
    });
    
    // Initialize cart display if on cart page
    if (document.querySelector('.cart-page')) {
        updateCartDisplay();
    }
    
    // Checkout modal
    const checkoutBtn = document.getElementById('checkout-btn');
    const modal = document.getElementById('checkout-modal');
    const closeModal = document.querySelector('.close-modal');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            modal.style.display = 'flex';
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processOrder();
        });
    }
});

// Add item to cart
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show confirmation
    alert(`${name} has been added to your cart!`);
}

// Update cart display on cart page
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartSummary.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    cartSummary.style.display = 'block';
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    // Clear existing items
    cartItemsContainer.innerHTML = '';
    
    // Add cart items
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="images/bottle${item.id}.jpg" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">UGX ${item.price.toLocaleString()}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <p class="remove-item" data-id="${item.id}">Remove</p>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Add event listeners for quantity changes
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(this.getAttribute('data-id'), -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(this.getAttribute('data-id'), 1);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const newQuantity = parseInt(this.value);
            if (newQuantity >= 1) {
                updateQuantity(this.getAttribute('data-id'), newQuantity, true);
            } else {
                this.value = 1;
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            removeItem(this.getAttribute('data-id'));
        });
    });
    
    // Update summary
    updateSummary();
}

// Update item quantity
function updateQuantity(id, change, setExact = false) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === id);
    
    if (item) {
        if (setExact) {
            item.quantity = change;
        } else {
            item.quantity += change;
        }
        
        if (item.quantity < 1) {
            item.quantity = 1;
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

// Remove item from cart
function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

// Update cart summary
function updateSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotalElement = document.getElementById('subtotal');
    const deliveryElement = document.getElementById('delivery');
    const totalElement = document.getElementById('total');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal > 0 ? 10000 : 0; // UGX 10,000 delivery fee
    const total = subtotal + delivery;
    
    subtotalElement.textContent = `UGX ${subtotal.toLocaleString()}`;
    deliveryElement.textContent = `UGX ${delivery.toLocaleString()}`;
    totalElement.textContent = `UGX ${total.toLocaleString()}`;
}

// Process order
function processOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return;
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const notes = document.getElementById('notes').value;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 10000; // UGX 10,000 delivery fee
    const total = subtotal + delivery;
    
    // Create order message
    let message = `New Order from ${name}\n\n`;
    message += `Phone: ${phone}\n`;
    message += `Address: ${address}\n\n`;
    message += `Order Items:\n`;
    
    cart.forEach(item => {
        message += `${item.name} - ${item.quantity} x UGX ${item.price.toLocaleString()} = UGX ${(item.quantity * item.price).toLocaleString()}\n`;
    });
    
    message += `\nSubtotal: UGX ${subtotal.toLocaleString()}\n`;
    message += `Delivery: UGX ${delivery.toLocaleString()}\n`;
    message += `Total: UGX ${total.toLocaleString()}\n\n`;
    message += `Additional Notes: ${notes || 'None'}`;
    
    // Encode for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/256783468608?text=${encodedMessage}`;
    
    // Clear cart
    localStorage.removeItem('cart');
    updateCartCount();
    
    // Close modal and redirect
    document.getElementById('checkout-modal').style.display = 'none';
    window.location.href = whatsappUrl;
      }
