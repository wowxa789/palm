// ฟังก์ชันสำหรับจัดการตะกร้าสินค้า
let cart = [];

// ดึงข้อมูลตะกร้าจาก localStorage
function loadCart() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartCount();
    }
}

// บันทึกตะกร้าสินค้าไปยัง localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// เพิ่มสินค้าในตะกร้า
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    alert(`${name} ถูกเพิ่มในตะกร้าแล้ว!`);
}

// อัปเดตจำนวนสินค้าที่อยู่ในตะกร้าในเมนู
function updateCartCount() {
    const cartButton = document.querySelector(".cart-button a");
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    cartButton.textContent = `ตะกร้า (${totalQuantity})`;
}

// แสดงสินค้าในตะกร้าในหน้าตะกร้า
function displayCartItems() {
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalContainer = document.getElementById("subtotal-amount");
    const totalContainer = document.getElementById("total-amount");
    cartItemsContainer.innerHTML = "";

    let subtotal = 0;
    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div class="item-details">
                    <img src="shirt${item.id}.jpg" alt="${item.name}">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        <p>ราคา: ฿${item.price}</p>
                    </div>
                </div>
                <div class="item-controls">
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <input type="number" class="quantity" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                    <button onclick="increaseQuantity(${index})">+</button>
                    <button class="delete" onclick="removeFromCart(${index})">ลบ</button>
                </div>
            </div>
        `;
    });

    // คำนวณยอดรวม
    const shippingCost = 50;
    const total = subtotal + shippingCost;
    subtotalContainer.textContent = `฿${subtotal}`;
    totalContainer.textContent = `฿${total}`;
}

// เพิ่มจำนวนสินค้า
function increaseQuantity(index) {
    cart[index].quantity++;
    saveCart();
    displayCartItems();
}

// ลดจำนวนสินค้า
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    displayCartItems();
    updateCartCount();
}

// อัปเดตจำนวนสินค้าด้วย input แบบ number
function updateQuantity(index, quantity) {
    cart[index].quantity = parseInt(quantity);
    saveCart();
    displayCartItems();
}

// ลบสินค้าออกจากตะกร้า
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    displayCartItems();
    updateCartCount();
}

// เมื่อโหลดหน้าให้แสดงข้อมูลตะกร้าทันที
window.onload = function() {
    loadCart();
    displayCartItems();
};

// ฟังก์ชันสำหรับเพิ่มสินค้าในหน้า products (เพิ่มในปุ่มใน HTML ด้วย)
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        addToCart(id, name, price);
    });
});