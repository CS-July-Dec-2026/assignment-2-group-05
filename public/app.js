document.addEventListener('DOMContentLoaded', () => {
    const balanceDisplay = document.getElementById('balanceDisplay');
    const resetBtn = document.getElementById('resetBtn');
    const messageBox = document.getElementById('messageBox');
    const productGrid = document.getElementById('productGrid');

    fetchState();

    function fetchState() {
        fetch('/api/state')
            .then(res => res.json())
            .then(data => {
                updateBalance(data.balance);
                renderProducts(data.products);
            })
            .catch(() => showMessage('Error fetching state.', 'error'));
    }

    function updateBalance(balance) {
        balanceDisplay.textContent = `$${balance}`;
    }

    function showMessage(msg, type) {
        messageBox.textContent = msg;
        messageBox.className = `global-message-box ${type}`;
        messageBox.classList.remove('hidden');
        setTimeout(() => messageBox.classList.add('hidden'), 4000);
    }

    function renderProducts(products) {
        productGrid.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <div class="product-image">
                    <div class="product-icon icon-${product.id}"></div>
                </div>
                <div class="product-details">
                    <h2>${product.name}</h2>
                    <p class="description">${product.description}</p>
                    <div class="price-tag">$${product.price} <span class="per-unit">/ unit</span></div>
                    <div class="purchase-section">
                        <label>Quantity</label>
                        <div class="input-group">
                            <input type="number" id="qty-${product.id}" value="0" min="0">
                            <button id="buy-${product.id}" class="primary-btn">Purchase</button>
                        </div>
                    </div>
                </div>
            `;

            productGrid.appendChild(card);

            const buyBtn = document.getElementById(`buy-${product.id}`);
            const qtyInput = document.getElementById(`qty-${product.id}`);

            buyBtn.addEventListener('click', () => {
                const qty = parseInt(qtyInput.value) || 0;
                if (qty <= 0) {
                    showMessage('Please set a quantity greater than 0.', 'error');
                    return;
                }
                buyBtn.disabled = true;

                fetch('/api/purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: product.id, quantity: qty })
                })
                .then(async (res) => {
                    const data = await res.json();
                    if (res.ok) {
                        updateBalance(data.newBalance);
                        showMessage(`✅ Bought ${qty} × ${product.name} successfully!`, 'success');
                        qtyInput.value = 0; // reset quantity
                    } else {
                        if (data.newBalance !== undefined) updateBalance(data.newBalance);
                        showMessage(data.error, 'error');
                    }
                })
                .catch(() => showMessage('Network error occurred.', 'error'))
                .finally(() => buyBtn.disabled = false);
            });
        });
    }

    resetBtn.addEventListener('click', () => {
        fetch('/api/reset', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                updateBalance(data.newBalance);
                showMessage('Account state reset to $100.', 'success');
                document.querySelectorAll('input[type="number"]').forEach(input => input.value = 0);
            });
    });
});
