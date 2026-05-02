import { Router } from 'express';
import { getStore } from '../store.js';

const router = Router();

router.get('/tables', (req, res) => {
    const store = getStore();
    res.json(store.tables);
});

router.get('/', (req, res) => {
    const store = getStore();
    res.json(store.bookings);
});

router.post('/', (req, res) => {
    const store = getStore();
    const { name, email, table_id, section, date, time, guests } = req.body;
    const booking = {
        id: `BK-${String(store.bookings.length + 1).padStart(3, '0')}`,
        name, email, table_id, section, date, time, guests,
        status: 'confirmed',
    };
    store.bookings.push(booking);
    
    // Update table status
    const table = store.tables.find(t => t.id === table_id);
    if (table) table.status = 'reserved';
    
    res.status(201).json(booking);
});

export default router;
