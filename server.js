const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const allItems = ['nai', 'bau', 'ga', 'ca', 'cua', 'tom'];
let predefinedItems = null; // Variable to store predefined results
let probabilities = {
    sameItemProb: 0.01,
    pairProb: 0.3
};

// Function to generate random items based on probabilities
const getRandomItems = () => {
    let chosenItems = [];

    if (Math.random() < probabilities.sameItemProb) {
        const sameItem = allItems[Math.floor(Math.random() * allItems.length)];
        chosenItems = [sameItem, sameItem, sameItem];
    } else if (Math.random() < probabilities.pairProb) {
        const sameItem = allItems[Math.floor(Math.random() * allItems.length)];
        let differentItem;
        do {
            differentItem = allItems[Math.floor(Math.random() * allItems.length)];
        } while (differentItem === sameItem);
        chosenItems = [sameItem, sameItem, differentItem];
    } else {
        const firstItem = allItems[Math.floor(Math.random() * allItems.length)];
        chosenItems.push(firstItem);

        let secondItem;
        do {
            secondItem = allItems[Math.floor(Math.random() * allItems.length)];
        } while (secondItem === firstItem);
        chosenItems.push(secondItem);

        let thirdItem;
        do {
            thirdItem = allItems[Math.floor(Math.random() * allItems.length)];
        } while (thirdItem === firstItem || thirdItem === secondItem);
        chosenItems.push(thirdItem);
    }

    return chosenItems;
};

// Endpoint to get random items or predefined items
app.get('/api/random-items', (req, res) => {
    console.log('Received request for random items');
    const items = predefinedItems || getRandomItems();
    // Reset predefined items for the next session
    predefinedItems = null;
    res.json({ items });
});

// Endpoint to set predefined items for the current session
app.post('/api/set-items', (req, res) => {
    console.log('Received request to set items');
    predefinedItems = req.body.items;
    res.json({ message: 'Items set successfully' });
});

// Endpoint to set probabilities
app.post('/api/set-probabilities', (req, res) => {
    console.log('Received request to set probabilities');
    const { sameItemProb, pairProb } = req.body;

    if (typeof sameItemProb !== 'number' || typeof pairProb !== 'number' ||
        sameItemProb < 0 || sameItemProb > 1 || pairProb < 0 || pairProb > 1) {
        return res.status(400).json({ message: 'Invalid probabilities' });
    }

    probabilities.sameItemProb = sameItemProb;
    probabilities.pairProb = pairProb;

    res.json({ message: 'Probabilities updated successfully' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
