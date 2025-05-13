// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
        });
    });
    
    // Highlight active page in navigation
    const currentPage = location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Initialize cart count
    updateCartCount();
});

// Product Data
const products = [
    {
        id: 1,
        name: "BBS Premium Glass Bottle",
        price: 25000,
        image: "images/product1.jpg",
        description: "Our premium glass baby bottle with natural silicone nipple. BPA-free and easy to clean.",
        size: "8oz",
        material: "glass",
        rating: 4.5,
        reviews: 24
    },
    {
        id: 2,
        name: "BBS Anti-Colic Bottle",
        price: 20000,
        image: "images/product2.jpg",
        description: "Anti-colic baby bottle with vent system to reduce air intake and prevent gas.",
        size: "4oz",
        material: "plastic",
        rating: 4.2,
        reviews: 18
    },
    {
        id: 3,
        name: "BBS Wide-Neck Silicone Bottle",
        price: 30000,
        image: "images/product3.jpg",
        description: "Soft silicone bottle with wide neck for easy filling and cleaning.",
        size: "12oz",
        material: "silicone",
        rating: 4.8,
        reviews: 32
    },
    {
        id: 4,
        name: "BBS Travel Bottle Set",
        price: 45000,
        image: "images/product4.jpg",
        description: "Set of 3 bottles with travel case. Perfect for on-the-go feeding.",
        size: "8oz",
        material: "plastic",
        rating: 4.6,
        reviews: 15
    },
    {
        id: 5,
        name: "BBS Glass Bottle with Sleeve",
        price: 28000,
        image: "images/product5.jpg",
        description: "Glass bottle with protective silicone sleeve for better grip and insulation.",
        size: "8oz",
        material: "glass",
        rating: 4.7,
        reviews: 21
    },
    {
        id: 6,
        name: "BBS Starter Kit",
        price: 60000,
        image: "images/product6.jpg",
        description: "Complete starter kit with bottles, brushes, and sterilizer.",
        size: "4oz",
        material: "plastic",
        rating: 4.9,
        reviews: 28
    }
];

// Display featured products on homepage
function displayFeaturedProducts() {
    const productsGrid = document.querySelector('.featured-products .products-grid');
    
    if (productsGrid) {
        // Get 4 random products
        const featuredProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
        
        productsGrid.innerHTML = featuredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">UGX ${product.price.toLocaleString()}</div>
                    <div class="product-rating">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        <span>(${product.reviews})</span>
                    </div>
                    <button class="btn primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to add-to-cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }
}

// Display all products on products page
function displayAllProducts() {
    const productsGrid = document.querySelector('.products-page .products-grid');
    
    if (productsGrid) {
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" data-size="${product.size}" data-material="${product.material}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">UGX ${product.price.toLocaleString()}</div>
                    <div class="product-rating">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        <span>(${product.reviews})</span>
                    </div>
                    <button class="btn primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to add-to-cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
        
        // Filter functionality
        const sizeFilter = document.getElementById('size-filter');
        const materialFilter = document.getElementById('material-filter');
        
        [sizeFilter, materialFilter].forEach(filter => {
            filter.addEventListener('change', function() {
                const selectedSize = sizeFilter.value;
                const selectedMaterial = materialFilter.value;
                
                document.querySelectorAll('.product-card').forEach(card => {
                    const cardSize = card.getAttribute('data-size');
                    const cardMaterial = card.getAttribute('data-material');
                    
                    const sizeMatch = !selectedSize || cardSize === selectedSize;
                    const materialMatch = !selectedMaterial || cardMaterial === selectedMaterial;
                    
                    if (sizeMatch && materialMatch) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Initialize page-specific functions
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedProducts();
    displayAllProducts();
});
