import { Router } from 'express';
import { getStore } from '../store.js';

const router = Router();

router.get('/', (req, res) => {
    const store = getStore();
    res.json(store.orders);
});

export default router;
