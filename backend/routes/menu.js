import { Router } from 'express';
import { getStore } from '../store.js';

const router = Router();

router.get('/', (req, res) => {
    const store = getStore();
    res.json(store.menuItems);
});

router.get('/:id', (req, res) => {
    const store = getStore();
    const item = store.menuItems.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
});

export default router;
