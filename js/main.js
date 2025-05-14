// Product data
const products = [
    {
        id: 1,
        name: "Classic Clear Baby Bottle",
        price: 15000,
        image: "images/bottle-1.jpg",
        description: "Our classic clear baby bottle features a simple, timeless design with measurement markings for easy feeding.",
        features: ["BPA-free", "4oz capacity", "Anti-colic valve", "Easy-grip design"],
        rating: 4.5,
        reviews: 24,
        size: "4oz",
        color: "clear"
    },
    {
        id: 2,
        name: "Pink Floral Baby Bottle",
        price: 18000,
        image: "images/bottle-2.jpg",
        description: "Beautiful pink floral design with a soft silicone nipple that mimics breastfeeding.",
        features: ["BPA-free", "8oz capacity", "Heat-sensitive", "Wide neck"],
        rating: 4.8,
        reviews: 32,
        size: "8oz",
        color: "pink"
    },
    {
        id: 3,
        name: "Blue Geometric Baby Bottle",
        price: 18000,
        image: "images/bottle-3.jpg",
        description: "Modern blue geometric pattern with an ergonomic shape for comfortable holding.",
        features: ["BPA-free", "8oz capacity", "Leak-proof", "Dishwasher safe"],
        rating: 4.7,
        reviews: 18,
        size: "8oz",
        color: "blue"
    },
    {
        id: 4,
        name: "Green Nature Baby Bottle",
        price: 20000,
        image: "images/bottle-4.jpg",
        description: "Eco-friendly green bottle with nature-inspired design and extra-durable construction.",
        features: ["BPA-free", "10oz capacity", "Anti-colic", "Vented"],
        rating: 4.9,
        reviews: 41,
        size: "10oz",
        color: "green"
    },
    {
        id: 5,
        name: "Premium Glass Baby Bottle",
        price: 25000,
        image: "images/bottle-5.jpg",
        description: "High-quality glass bottle with protective silicone sleeve for safety and insulation.",
        features: ["Glass construction", "8oz capacity", "Non-toxic", "Easy to clean"],
        rating: 4.6,
        reviews: 27,
        size: "8oz",
        color: "clear"
    },
    {
        id: 6,
        name: "Travel Baby Bottle Set",
        price: 35000,
        image: "images/bottle-6.jpg",
        description: "Complete travel set with 3 bottles in different sizes and a carrying case.",
        features: ["3 bottles (4oz, 8oz, 10oz)", "Carrying case", "BPA-free", "All colors"],
        rating: 5.0,
        reviews: 15,
        size: "all",
        color: "all"
    }
];

// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');
const productGrid = document.querySelector('.product-grid');
const sizeFilter = document.getElementById('size-filter');
const colorFilter = document.getElementById('color-filter');

// Mobile menu toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// Display products
function displayProducts(productsToDisplay) {
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productGrid.innerHTML = '<p class="no-products">No products match your filters.</p>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">UGX ${product.price.toLocaleString()}</div>
                <div class="product-rating" title="${product.rating} stars">
                    ${stars} (${product.reviews})
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <a href="products.html?id=${product.id}" class="btn btn-secondary">View Details</a>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            addToCart(product);
            updateCartCount();
        });
    });
}

// Filter products
function filterProducts() {
    if (!sizeFilter || !colorFilter) return;
    
    const sizeValue = sizeFilter.value;
    const colorValue = colorFilter.value;
    
    let filteredProducts = [...products];
    
    if (sizeValue !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.size === sizeValue);
    }
    
    if (colorValue !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.color === colorValue);
    }
    
    displayProducts(filteredProducts);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Display featured products on homepage
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const featuredProducts = products.slice(0, 4);
        displayProducts(featuredProducts);
    }
    
    // Display all products on products page
    if (window.location.pathname.includes('products.html')) {
        displayProducts(products);
        
        // Add event listeners to filters
        if (sizeFilter && colorFilter) {
            sizeFilter.addEventListener('change', filterProducts);
            colorFilter.addEventListener('change', filterProducts);
        }
    }
    
    // Update cart count
    updateCartCount();
});

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
                    }
