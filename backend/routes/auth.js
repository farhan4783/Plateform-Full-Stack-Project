import { Router } from 'express';
import { getStore } from '../store.js';

const router = Router();

router.post('/register', (req, res) => {
    const store = getStore();
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    const existing = store.customers.find(c => c.email === email);
    if (existing) {
        return res.status(400).json({ error: 'Email already exists' });
    }
    
    const newCustomer = {
        id: `CUS-${String(store.customers.length + 1).padStart(4, '0')}`,
        name,
        email,
        password, // Not hashing for demo simplicity
        tier: 'regular',
        totalSpent: 0,
        visits: 0,
        lastVisit: new Date().toISOString().split('T')[0],
        churnRisk: 0.1,
        preferences: 'none'
    };
    
    store.customers.push(newCustomer);
    
    // Return user without password
    const { password: _, ...user } = newCustomer;
    res.status(201).json(user);
});

router.post('/login', (req, res) => {
    const store = getStore();
    const { email, password } = req.body;
    
    const user = store.customers.find(c => c.email === email && c.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const { password: _, ...userData } = user;
    res.json(userData);
});

export default router;
