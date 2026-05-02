import express from 'express';
import cors from 'cors';
import { initDb, getDb } from './database.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Initialize DB
await initDb();

// --- REST Endpoints ---

// Get Menu Items
app.get('/api/menu', async (req, res) => {
    try {
        const db = getDb();
        const items = await db.all('SELECT * FROM menu_items WHERE available = 1');
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

// Book a table (Interactive layout will use this)
app.post('/api/book', async (req, res) => {
    try {
        const { name, email, section, table_id, date, time } = req.body;
        const db = getDb();
        await db.run(
            'INSERT INTO table_booking (name, email, section, table_id, date, time) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, section, table_id, date, time]
        );
        res.status(201).json({ message: 'Table booked successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to book table' });
    }
});

// AI Chef Recommendation endpoint
app.post('/api/ai/recommend', async (req, res) => {
    const { mood, diet, timeOfDay } = req.body;
    
    // Simulating an advanced AI recommendation engine with a slight delay
    setTimeout(() => {
        let recommendation = "";
        let item = "";
        
        if (mood === 'energetic') {
            recommendation = "You seem full of energy! I recommend a high-protein, vibrant dish. How about our Quantum Pasta? It's rich, flavorful, and matches your vibe perfectly.";
            item = "Quantum Pasta";
        } else if (mood === 'relaxed') {
            recommendation = "Looking to chill? The Galaxy Cheesecake pairs beautifully with our Neon Mojito for a soothing, aesthetic experience.";
            item = "Galaxy Cheesecake";
        } else {
            recommendation = "Our Taaza Signature Burger is the ultimate comfort food. It's guaranteed to satisfy any craving and elevate your mood.";
            item = "Taaza Signature Burger";
        }

        if (diet === 'vegan') {
            recommendation += " Note: Our chef can prepare a specialized vegan version of this upon request!";
        }

        res.json({ 
            reply: recommendation,
            suggestedItem: item,
            confidence: 0.98
        });
    }, 1500); // 1.5s delay to simulate AI processing
});

app.listen(PORT, () => {
    console.log(`Taaza Server running on http://localhost:${PORT}`);
});
