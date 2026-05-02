import { Router } from 'express';
import { getStore } from '../store.js';

const router = Router();

router.get('/overview', (req, res) => {
    const store = getStore();
    const orders = store.orders;
    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalRevenue / orders.filter(o => o.status !== 'cancelled').length;
    
    // Generate 30-day revenue trend
    const revenueTrend = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        const dayOrders = orders.filter(o => o.timestamp.startsWith(d.toISOString().split('T')[0]));
        return {
            date: d.toISOString().split('T')[0],
            revenue: dayOrders.reduce((s, o) => s + o.total, 0) || Math.floor(Math.random() * 800 + 400),
            orders: dayOrders.length || Math.floor(Math.random() * 20 + 5),
        };
    });
    
    // Category breakdown
    const categoryBreakdown = {};
    store.menuItems.forEach(item => {
        if (!categoryBreakdown[item.category]) categoryBreakdown[item.category] = 0;
        categoryBreakdown[item.category] += item.orders_30d;
    });
    
    const categories = Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value }));
    
    // Top dishes
    const topDishes = [...store.menuItems].sort((a, b) => b.orders_30d - a.orders_30d).slice(0, 5);
    
    res.json({
        kpis: {
            totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
            totalOrders: orders.length,
            activeCustomers: store.customers.length,
            satisfaction: 4.6,
        },
        revenueTrend,
        categoryBreakdown: categories,
        topDishes,
    });
});

// Hourly traffic
router.get('/traffic', (req, res) => {
    const hours = Array.from({ length: 16 }, (_, i) => {
        const h = i + 7;
        return {
            hour: `${h}:00`,
            guests: Math.floor(Math.random() * 40 + (h >= 11 && h <= 14 ? 30 : h >= 18 && h <= 21 ? 45 : 5)),
        };
    });
    res.json(hours);
});

export default router;
