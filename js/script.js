// Add this at the top of script.js
// Initialize cart if it doesn't exist
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Update the addToCart function to be more robust
function addToCart(productId) {
    try {
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found');
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: product.size,
                color: product.color,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show notification
        showNotification(`${product.name} added to cart!`);
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// Add this helper function
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

// Update the updateCartCount function
function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        document.querySelectorAll('#cart-count').forEach(element => {
            element.textContent = totalItems;
        });
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}
// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    mobileMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Update cart count on all pages
    updateCartCount();

    // Load featured products on homepage
    if (document.querySelector('.featured-products .products-grid')) {
        loadFeaturedProducts();
    }

    // Load all products on products page
    if (document.querySelector('.products-page .products-grid')) {
        loadAllProducts();
        setupFilters();
    }
});

// Product Data
const products = [
    {
        id: 1,
        name: "Premium Glass Baby Bottle",
        price: 25000,
        image: "images/bottle1.jpg",
        rating: 4.5,
        reviews: 24,
        size: "8oz",
        color: "clear",
        featured: true,
        description: "Our premium glass baby bottle is perfect for parents who prefer natural materials. Made from durable borosilicate glass with a silicone sleeve for protection."
    },
    {
        id: 2,
        name: "Anti-Colic Plastic Bottle",
        price: 18000,
        image: "images/bottle2.jpg",
        rating: 4.2,
        reviews: 18,
        size: "4oz",
        color: "pink",
        featured: true,
        description: "Designed with an innovative vent system to reduce colic, gas and spit-up. The angled design makes feeding more comfortable."
    },
    {
        id: 3,
        name: "Travel Baby Bottle Set",
        price: 35000,
        image: "images/bottle3.jpg",
        rating: 4.8,
        reviews: 32,
        size: "12oz",
        color: "blue",
        featured: true,
        description: "Complete travel set includes 3 bottles with leak-proof caps and a carrying case. Perfect for on-the-go parents."
    },
    {
        id: 4,
        name: "Eco-Friendly Bamboo Bottle",
        price: 30000,
        image: "images/bottle4.jpg",
        rating: 4.7,
        reviews: 15,
        size: "8oz",
        color: "green",
        featured: false,
        description: "Sustainable bamboo fiber bottle with a stainless steel inner liner. Lightweight yet durable for everyday use."
    },
    {
        id: 5,
        name: "Newborn Starter Bottle",
        price: 15000,
        image: "images/bottle5.jpg",
        rating: 4.0,
        reviews: 12,
        size: "4oz",
        color: "pink",
        featured: false,
        description: "Perfect for newborns with a slow-flow nipple. The compact size is ideal for small hands and small tummies."
    },
    {
        id: 6,
        name: "Insulated Stainless Bottle",
        price: 32000,
        image: "images/bottle6.jpg",
        rating: 4.9,
        reviews: 28,
        size: "12oz",
        color: "blue",
        featured: false,
        description: "Keeps liquids warm or cold for hours. The wide neck makes cleaning easy and the silicone sleeve provides a comfortable grip."
    }
];

// Load Featured Products
function loadFeaturedProducts() {
    const productsGrid = document.querySelector('.featured-products .products-grid');
    productsGrid.innerHTML = '';

    const featuredProducts = products.filter(product => product.featured);
    
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">UGX ${product.price.toLocaleString()}</div>
                <div class="product-rating">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))} (${product.reviews})</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Load All Products
function loadAllProducts(filteredProducts = null) {
    const productsGrid = document.querySelector('.products-page .products-grid');
    productsGrid.innerHTML = '';

    const productsToShow = filteredProducts || products;
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">UGX ${product.price.toLocaleString()}</div>
                <div class="product-rating">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))} (${product.reviews})</div>
                <div class="product-meta">${product.size} | ${product.color.charAt(0).toUpperCase() + product.color.slice(1)}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Setup Product Filters
function setupFilters() {
    const sizeFilter = document.getElementById('size-filter');
    const colorFilter = document.getElementById('color-filter');
    
    sizeFilter.addEventListener('change', filterProducts);
    colorFilter.addEventListener('change', filterProducts);
}

// Filter Products
function filterProducts() {
    const sizeFilter = document.getElementById('size-filter').value;
    const colorFilter = document.getElementById('color-filter').value;
    
    let filteredProducts = products;
    
    if (sizeFilter) {
        filteredProducts = filteredProducts.filter(product => product.size === sizeFilter);
    }
    
    if (colorFilter) {
        filteredProducts = filteredProducts.filter(product => product.color === colorFilter);
    }
    
    loadAllProducts(filteredProducts);
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: product.size,
            color: product.color,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = `${product.name} added to cart!`;
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

// Update Cart Count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('#cart-count').forEach(element => {
        element.textContent = totalItems;
    });
        }
