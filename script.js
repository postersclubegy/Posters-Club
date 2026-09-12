// Posters Club - Product Catalog
const products = [
    {
        id: 1,
        title: "Zidane - Legendary Champion",
        description: "Iconic vintage football legend poster - A4/30 EGP",
        price: 30,
        emoji: "⚽",
        category: "Football"
    },
    {
        id: 2,
        title: "Maradona - El Pibe de Oro",
        description: "Argentine football icon - Vintage art style - A4/30 EGP",
        price: 30,
        emoji: "🏆",
        category: "Football"
    },
    {
        id: 3,
        title: "Ronaldo - Trophy Winner",
        description: "Cristiano Ronaldo Champions League - A4/30 EGP",
        price: 30,
        emoji: "👑",
        category: "Football"
    },
    {
        id: 4,
        title: "Messi - World Champion",
        description: "Lionel Messi with World Cup Trophy - A4/30 EGP",
        price: 30,
        emoji: "🌟",
        category: "Football"
    },
    {
        id: 5,
        title: "Salah - The King",
        description: "Mohamed Salah Liverpool Legend - A4/30 EGP",
        price: 30,
        emoji: "🔴",
        category: "Football"
    },
    {
        id: 6,
        title: "Pelé - The King of Football",
        description: "Brazilian football legend - vintage style - A4/30 EGP",
        price: 30,
        emoji: "💛",
        category: "Football"
    },
    {
        id: 7,
        title: "Vintage Cinema",
        description: "Classic film poster design - A4/30 EGP",
        price: 30,
        emoji: "🎬",
        category: "Films"
    },
    {
        id: 8,
        title: "Music Legend",
        description: "Iconic music figure poster - A4/30 EGP",
        price: 30,
        emoji: "🎵",
        category: "Music"
    }
];

// Initialize EmailJS
(function() {
    emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); // Will be replaced with actual key
})();

// YOUR EMAIL CONFIGURATION
const OWNER_EMAIL = "your-email@gmail.com"; // Replace with your email
const OWNER_NAME = "Posters Club";
const WHATSAPP_NUMBER = "+201234567890"; // Your WhatsApp number

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    loadCartFromStorage();
    updateCartDisplay();
});

// Render Products Grid
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">Add</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add Product to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartDisplay();
    showAddedNotification();
}

// Remove Product from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
}

// Update Cart Display
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.title}</div>
                    <div class="cart-item-price">${(item.price * item.quantity).toFixed(0)} EGP (x${item.quantity})</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }
}

// Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');
}

// Checkout Function - Open Modal
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Generate order summary
    const summaryText = cart.map(item => 
        `• ${item.title} (${item.quantity}x) = ${item.price * item.quantity} EGP`
    ).join('<br>');
    
    document.getElementById('orderSummaryText').innerHTML = summaryText;
    document.getElementById('totalAmount').textContent = 
        cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Open modal
    openCheckoutModal();
}

// Open Checkout Modal
function openCheckoutModal() {
    document.getElementById('checkoutModal').classList.add('open');
    document.getElementById('checkoutOverlay').classList.add('open');
}

// Close Checkout Modal
function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('open');
    document.getElementById('checkoutOverlay').classList.remove('open');
}

// Submit Order and Send Emails
function submitOrder(event) {
    event.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerWhatsApp = document.getElementById('customerWhatsApp').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const posterSize = document.getElementById('posterSize').value;

    if (!customerName || !customerEmail || !customerWhatsApp || !customerAddress || !posterSize) {
        alert('Please fill in all fields');
        return;
    }

    // Prepare order details
    const orderItems = cart.map(item => `${item.title} (${item.quantity}x) - ${item.price * item.quantity} EGP`).join('\n');
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = 'PC-' + Date.now();

    // Show loading
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending confirmation email...';
    submitBtn.disabled = true;

    // Send customer confirmation email
    sendCustomerEmail(customerName, customerEmail, customerWhatsApp, customerAddress, posterSize, orderItems, totalPrice, orderId)
        .then(() => {
            // Send owner notification email
            return sendOwnerEmail(customerName, customerEmail, customerWhatsApp, customerAddress, posterSize, orderItems, totalPrice, orderId);
        })
        .then(() => {
            // Success
            alert(`✅ Order placed successfully!\n\nOrder ID: ${orderId}\n\nCheck your email (${customerEmail}) for confirmation.\n\nWe'll contact you on WhatsApp at ${customerWhatsApp} shortly.`);
            
            // Clear form and cart
            document.getElementById('checkoutForm').reset();
            cart = [];
            saveCartToStorage();
            updateCartDisplay();
            closeCheckoutModal();
            toggleCart();

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        })
        .catch((error) => {
            console.error('Email error:', error);
            alert('⚠️ Error sending email. Please try again.\n\nError: ' + error.message);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// Send Customer Confirmation Email
function sendCustomerEmail(name, email, whatsapp, address, size, items, total, orderId) {
    return new Promise((resolve, reject) => {
        const templateParams = {
            to_email: email,
            customer_name: name,
            order_id: orderId,
            order_items: items,
            total_price: total,
            poster_size: size,
            delivery_address: address,
            whatsapp_number: whatsapp,
            owner_name: OWNER_NAME,
            owner_whatsapp: WHATSAPP_NUMBER
        };

        emailjs.send("service_posters_club", "template_customer_order", templateParams)
            .then(response => {
                console.log('Customer email sent:', response);
                resolve(response);
            })
            .catch(error => {
                console.error('Failed to send customer email:', error);
                reject(error);
            });
    });
}

// Send Owner Notification Email
function sendOwnerEmail(name, email, whatsapp, address, size, items, total, orderId) {
    return new Promise((resolve, reject) => {
        const templateParams = {
            to_email: OWNER_EMAIL,
            customer_name: name,
            customer_email: email,
            customer_whatsapp: whatsapp,
            order_id: orderId,
            order_items: items,
            total_price: total,
            poster_size: size,
            delivery_address: address,
            owner_name: OWNER_NAME
        };

        emailjs.send("service_posters_club", "template_owner_notification", templateParams)
            .then(response => {
                console.log('Owner email sent:', response);
                resolve(response);
            })
            .catch(error => {
                console.error('Failed to send owner email:', error);
                reject(error);
            });
    });
}

// Send Order Confirmation (Owner calls this after WhatsApp conversation)
function sendOrderConfirmation(customerEmail, customerName, orderId) {
    const templateParams = {
        to_email: customerEmail,
        customer_name: customerName,
        order_id: orderId,
        confirmation_message: `Your order ${orderId} has been confirmed by Posters Club. We will print and ship your posters shortly. Thank you for your order!`,
        owner_name: OWNER_NAME
    };

    return new Promise((resolve, reject) => {
        emailjs.send("service_posters_club", "template_order_confirmation", templateParams)
            .then(response => {
                console.log('Confirmation email sent');
                alert('✅ Confirmation email sent to customer!');
                resolve(response);
            })
            .catch(error => {
                console.error('Failed to send confirmation email:', error);
                reject(error);
            });
    });
}

// Storage Functions (Save cart in browser)
function saveCartToStorage() {
    localStorage.setItem('posterCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('posterCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// Show Added Notification
function showAddedNotification() {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = '#28a745';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1500);
}
