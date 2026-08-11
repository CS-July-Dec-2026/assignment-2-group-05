const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory user state
let userBalance = 100; // Starting balance

// The new product catalog
const products = [
    { id: 'p1', name: 'Premium Widget', description: 'The ultimate widget for all your cyber needs. High performance, sleek design.', price: 50 },
    { id: 'p2', name: 'Cyber Deck', description: 'Portable hacking terminal. Connect to any mainframe securely.', price: 150 },
    { id: 'p3', name: 'Neural Link', description: 'Direct brain-to-computer interface. Stream data at the speed of thought.', price: 300 },
    { id: 'p4', name: 'Data Crystal', description: 'High-density encrypted storage matrix. Virtually indestructible.', price: 75 }
];

// Route to get current user state and product catalog
app.get('/api/state', (req, res) => {
    res.json({
        balance: userBalance,
        products: products
    });
});

// Route to handle purchase (FLAW REMOVED)
app.post('/api/purchase', (req, res) => {
    const quantity = parseInt(req.body.quantity, 10);
    const productId = req.body.productId;

    // Validate that quantity is a number
    if (isNaN(quantity)) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    if (quantity < 0) {
        return res.status(400).json({ error: 'Quantity must be greater than zero.' });
    }

    // Find the product being purchased
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(400).json({ error: 'Invalid product.' });
    }

    const totalCost = quantity * product.price;

    if (userBalance >= totalCost) {
        userBalance -= totalCost;
        return res.json({ 
            success: true, 
            message: `Purchase successful! Bought ${quantity} ${product.name}(s).`,
            newBalance: userBalance
        });
    } else {
        return res.status(400).json({ 
            error: 'Insufficient funds.',
            newBalance: userBalance
        });
    }
});

// Route to reset state (for easy testing)
app.post('/api/reset', (req, res) => {
    userBalance = 100;
    res.json({ success: true, newBalance: userBalance });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});