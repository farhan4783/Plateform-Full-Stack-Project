import { Router } from 'express';
import { getStore } from '../store.js';

const router = Router();

router.get('/', (req, res) => {
    const store = getStore();
    res.json(store.orders);
});

router.post('/', (req, res) => {
    const store = getStore();
    const { customer, email, items, total } = req.body;
    
    const newOrder = {
        id: `ORD-${String(store.orders.length + 1).padStart(4, '0')}`,
        customer: customer || 'Guest',
        email: email || '',
        items: items || [],
        total: total || 0,
        status: 'preparing', // newly placed orders start as preparing
        timestamp: new Date().toISOString(),
    };
    
    store.orders.unshift(newOrder); // Add to beginning of array so it appears recent
    res.status(201).json(newOrder);
});

export default router;
