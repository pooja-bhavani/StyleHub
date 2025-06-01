// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Load products from JSON
    loadFeaturedProducts();
    
    // Initialize countdown timer
    initCountdownTimer();
    
    // Initialize event listeners
    initEventListeners();
});

// Load featured products from JSON
function loadFeaturedProducts() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            const featuredProductsContainer = document.getElementById('featured-products');
            
            // Display first 4 products
            const productsToShow = data.products.slice(0, 4);
            
            productsToShow.forEach(product => {
                const productCard = createProductCard(product);
                featuredProductsContainer.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
}

// Create product card element
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // Create product image section
    const productImage = document.createElement('div');
    productImage.className = 'product-image';
    
    const img = document.createElement('img');
    img.src = product.images[0];
    img.alt = product.title;
    productImage.appendChild(img);
    
    // Add product tag if it's new or on sale
    if (product.isNew || product.isOnSale) {
        const productTag = document.createElement('span');
        productTag.className = product.isNew ? 'product-tag tag-new' : 'product-tag tag-sale';
        productTag.textContent = product.isNew ? 'New' : 'Sale';
        productImage.appendChild(productTag);
    }
    
    // Create product info section
    const productInfo = document.createElement('div');
    productInfo.className = 'product-info';
    
    // Product category
    const productCategory = document.createElement('div');
    productCategory.className = 'product-category';
    productCategory.textContent = product.category;
    productInfo.appendChild(productCategory);
    
    // Product title
    const productTitle = document.createElement('h3');
    productTitle.className = 'product-title';
    productTitle.textContent = product.title;
    productInfo.appendChild(productTitle);
    
    // Product price
    const productPrice = document.createElement('div');
    productPrice.className = 'product-price';
    
    const currentPrice = document.createElement('span');
    currentPrice.className = 'current-price';
    currentPrice.textContent = `$${product.isOnSale ? product.discountedPrice : product.price}`;
    productPrice.appendChild(currentPrice);
    
    if (product.isOnSale) {
        const originalPrice = document.createElement('span');
        originalPrice.className = 'original-price';
        originalPrice.textContent = `$${product.price}`;
        productPrice.appendChild(originalPrice);
    }
    
    productInfo.appendChild(productPrice);
    
    // Product rating
    const productRating = document.createElement('div');
    productRating.className = 'product-rating';
    
    const stars = document.createElement('div');
    stars.className = 'stars';
    
    // Create star icons based on rating
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        stars.appendChild(star);
    }
    
    if (hasHalfStar) {
        const halfStar = document.createElement('i');
        halfStar.className = 'fas fa-star-half-alt';
        stars.appendChild(halfStar);
    }
    
    productRating.appendChild(stars);
    
    const ratingCount = document.createElement('span');
    ratingCount.className = 'rating-count';
    ratingCount.textContent = `(${product.reviewCount})`;
    productRating.appendChild(ratingCount);
    
    productInfo.appendChild(productRating);
    
    // Product actions
    const productActions = document.createElement('div');
    productActions.className = 'product-actions';
    
    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'add-to-cart';
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.dataset.productId = product.id;
    productActions.appendChild(addToCartBtn);
    
    const wishlistBtn = document.createElement('button');
    wishlistBtn.className = 'wishlist-btn';
    wishlistBtn.dataset.productId = product.id;
    
    const wishlistIcon = document.createElement('i');
    wishlistIcon.className = 'far fa-heart';
    wishlistBtn.appendChild(wishlistIcon);
    
    productActions.appendChild(wishlistBtn);
    productInfo.appendChild(productActions);
    
    // Append all sections to product card
    productCard.appendChild(productImage);
    productCard.appendChild(productInfo);
    
    return productCard;
}

// Initialize countdown timer
function initCountdownTimer() {
    const countdownElement = document.getElementById('countdown');
    
    // Set the countdown to 48 hours from now
    let hours = 48;
    let minutes = 0;
    let seconds = 0;
    
    const countdownInterval = setInterval(() => {
        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    clearInterval(countdownInterval);
                }
            }
        }
        
        // Update the countdown display
        countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Initialize event listeners
function initEventListeners() {
    // Add to cart button click event
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.dataset.productId;
            addToCart(productId);
        }
    });
    
    // Wishlist button click event
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('wishlist-btn') || event.target.parentElement.classList.contains('wishlist-btn')) {
            const button = event.target.classList.contains('wishlist-btn') ? event.target : event.target.parentElement;
            const productId = button.dataset.productId;
            toggleWishlist(productId, button);
        }
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value) {
                alert(`Thank you for subscribing with ${emailInput.value}!`);
                emailInput.value = '';
            }
        });
    }
}

// Add product to cart
function addToCart(productId) {
    // Get current cart from localStorage or initialize empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in header
    updateCartCount();
    
    // Show confirmation message
    alert('Product added to cart!');
}

// Toggle product in wishlist
function toggleWishlist(productId, button) {
    // Get current wishlist from localStorage or initialize empty array
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if product is already in wishlist
    const productIndex = wishlist.indexOf(productId);
    
    if (productIndex === -1) {
        // Add to wishlist
        wishlist.push(productId);
        
        // Change icon to filled heart
        const icon = button.querySelector('i');
        icon.className = 'fas fa-heart';
        icon.style.color = '#ff6b6b';
    } else {
        // Remove from wishlist
        wishlist.splice(productIndex, 1);
        
        // Change icon back to outline heart
        const icon = button.querySelector('i');
        icon.className = 'far fa-heart';
        icon.style.color = '';
    }
    
    // Save updated wishlist to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Initialize cart count on page load
updateCartCount();
