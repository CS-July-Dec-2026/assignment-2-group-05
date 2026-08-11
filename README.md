# CS Lab 2 — Business Logic Flaw

**Group:** Group 05  
**Assignment:** Assignment 2 — Business Logic Flaw  

## Vulnerability: Business Logic Flaw (Negative Quantity Exploit)

This web application deliberately contains a **Business Logic Flaw** where the server does not validate that a purchase quantity is a positive number. An attacker can send a negative quantity value directly to the API endpoint, bypassing the frontend UI, causing the server to add money to the user's wallet instead of deducting it.

## Demonstration Video

📹 **Video Link:** [Add your Google Drive video link here]

## Application Setup

### Prerequisites
- Node.js installed

### Install Dependencies
```bash
npm install
```

### Run the Application
```bash
node server.js
```

Open your browser at: `http://localhost:3000`

## Application Features

- 4 products available for purchase (Premium Widget, Cyber Deck, Neural Link, Data Crystal)
- User wallet starts at **$100**
- Set a quantity and click **Purchase** to buy items
- Click **Reset Account State** to restore wallet to $100

## How to Demonstrate the Flaw

1. Start the server with the validation check **commented out** in `server.js` (lines 41–43).
2. Open the browser at `http://localhost:3000`.
3. Open DevTools Console (`F12`) and type `allow pasting`, then press Enter.
4. Run the following command:
```javascript
fetch('/api/purchase', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ productId: 'p1', quantity: -5 })
})
.then(r => r.json())
.then(data => console.log(data))
```
5. The wallet balance will jump from **$100 to $350** — the attacker gained $250 for free.

## The Fix

Uncomment lines 41–43 in `server.js`:
```javascript
if (quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be greater than zero.' });
}
```

This single validation check completely prevents the attack.
