// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        updateCart();
        showAddToCartNotification(product.name);
    }
}

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update quantity function
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            removeFromCart(productId);
        }
        
        updateCart();
    }
}

// Update cart in localStorage and UI
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Update cart count in header
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Display cart items on cart page
function displayCartItems() {
    const cartContent = document.querySelector('.cart-content');
    const emptyCart = document.querySelector('.empty-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (cartContent) {
        if (cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is currently empty.</p>
                    <a href="products.html" class="btn primary">Continue Shopping</a>
                </div>
            `;
            checkoutBtn.disabled = true;
        } else {
            cartContent.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div>
                            <div class="cart-item-title">${item.name}</div>
                        </div>
                    </div>
                    <div class="cart-item-price">UGX ${item.price.toLocaleString()}</div>
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-total">UGX ${(item.price * item.quantity).toLocaleString()}</div>
                    <div class="remove-item" data-id="${item.id}"><i class="fas fa-times"></i></div>
                </div>
            `).join('');
            
            // Calculate subtotal
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            document.querySelector('.subtotal').textContent = `UGX ${subtotal.toLocaleString()}`;
            document.querySelector('.total-price').textContent = `UGX ${subtotal.toLocaleString()}`;
            
            checkoutBtn.disabled = false;
            
            // Add event listeners to quantity buttons
            document.querySelectorAll('.quantity-btn.minus').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    const item = cart.find(item => item.id === productId);
                    if (item) {
                        updateQuantity(productId, item.quantity - 1);
                    }
                });
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    const item = cart.find(item => item.id === productId);
                    if (item) {
                        updateQuantity(productId, item.quantity + 1);
                    }
                });
            });
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    removeFromCart(productId);
                });
            });
        }
    }
}

// Show add to cart notification
function showAddToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <p>${productName} has been added to your cart!</p>
    `;
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

// Checkout functionality
function setupCheckout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.querySelector('.checkout-modal');
    const closeModal = document.querySelector('.close-modal');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutBtn && checkoutModal) {
        checkoutBtn.addEventListener('click', function() {
            checkoutModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        closeModal.addEventListener('click', function() {
            checkoutModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        checkoutModal.addEventListener('click', function(e) {
            if (e.target === this.querySelector('.modal-overlay')) {
                checkoutModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const notes = document.getElementById('notes').value;
            
            // Prepare WhatsApp message
            let message = `Hello Bespoke Babystore! I'd like to place an order:\n\n`;
            message += `*Name:* ${name}\n`;
            message += `*Phone:* ${phone}\n`;
            message += `*Delivery Address:* ${address}\n\n`;
            message += `*Order Items:*\n`;
            
            cart.forEach(item => {
                message += `- ${item.name} (${item.quantity} x UGX ${item.price.toLocaleString()}) = UGX ${(item.quantity * item.price).toLocaleString()}\n`;
            });
            
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            message += `\n*Subtotal:* UGX ${subtotal.toLocaleString()}\n`;
            
            if (notes) {
                message += `\n*Additional Notes:* ${notes}\n`;
            }
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);
            
            // Open WhatsApp with the message
            window.open(`https://wa.me/256783468608?text=${encodedMessage}`, '_blank');
            
            // Close modal
            checkoutModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayCartItems();
    setupCheckout();
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--accent-color);
            color: white;
            padding: 15px 25px;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        }
        .notification.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});
