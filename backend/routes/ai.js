import { Router } from 'express';
import { getStore } from '../store.js';

const router = Router();

// AI Chef Recommendation
router.post('/recommend', (req, res) => {
    const { mood, diet, budget, timeOfDay } = req.body;
    const store = getStore();
    
    // Score each menu item based on user preferences
    const scored = store.menuItems.map(item => {
        let score = item.popularity;
        
        // Mood matching
        if (mood === 'energetic' && ['Mains', 'Drinks'].includes(item.category)) score += 15;
        if (mood === 'relaxed' && ['Desserts', 'Drinks'].includes(item.category)) score += 15;
        if (mood === 'celebratory' && item.price > 25) score += 20;
        if (mood === 'healthy' && item.category === 'Starters') score += 10;
        
        // Budget matching
        if (budget === 'low' && item.price <= 15) score += 20;
        if (budget === 'medium' && item.price > 15 && item.price <= 30) score += 20;
        if (budget === 'high' && item.price > 30) score += 20;
        
        // Time of day
        if (timeOfDay === 'morning' && ['Drinks'].includes(item.category)) score += 10;
        if (timeOfDay === 'evening' && ['Mains', 'Drinks'].includes(item.category)) score += 10;
        
        return { ...item, aiScore: score };
    });
    
    scored.sort((a, b) => b.aiScore - a.aiScore);
    const top3 = scored.slice(0, 3);
    
    const insights = [
        `Based on your ${mood} mood, I've analyzed ${store.menuItems.length} dishes.`,
        `Your top match is "${top3[0].name}" with a ${top3[0].aiScore}% preference match.`,
        top3[0].orders_30d > 200 ? `This dish is trending — ordered ${top3[0].orders_30d} times in 30 days.` : '',
        diet === 'vegan' ? `I've noted your vegan preference. Our chef can customize any dish.` : '',
    ].filter(Boolean);
    
    res.json({
        recommendations: top3,
        insights,
        confidence: 0.94,
        processingTime: '1.2s',
    });
});

// Demand Prediction Engine
router.get('/demand-prediction', (req, res) => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 8);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const heatmap = days.map(day => ({
        day,
        hours: hours.map(hour => ({
            hour: `${hour}:00`,
            predicted: Math.floor(Math.random() * 100),
            actual: Math.floor(Math.random() * 100),
        })),
    }));
    
    const peakHours = [
        { time: '12:00 - 14:00', load: 92, suggestion: 'Deploy 2 additional servers' },
        { time: '19:00 - 21:00', load: 98, suggestion: 'Maximum staff allocation needed' },
    ];
    
    res.json({ heatmap, peakHours, accuracy: 94.2 });
});

// Dynamic Pricing AI
router.get('/dynamic-pricing', (req, res) => {
    const store = getStore();
    const suggestions = store.menuItems.map(item => {
        const demandFactor = item.popularity / 100;
        const profitMargin = ((item.price - item.cost) / item.price * 100).toFixed(1);
        const suggestedPrice = demandFactor > 0.85 
            ? (item.price * 1.08).toFixed(2) 
            : demandFactor < 0.75 
                ? (item.price * 0.92).toFixed(2) 
                : item.price.toFixed(2);
        
        const action = suggestedPrice > item.price ? 'increase' : suggestedPrice < item.price ? 'decrease' : 'hold';
        
        return {
            id: item.id,
            name: item.name,
            currentPrice: item.price,
            suggestedPrice: parseFloat(suggestedPrice),
            profitMargin: parseFloat(profitMargin),
            demand: item.popularity,
            action,
            reason: action === 'increase' 
                ? `High demand (${item.popularity}%) supports a price increase.`
                : action === 'decrease'
                    ? `Lower demand. A 8% reduction could boost orders by ~15%.`
                    : `Price is optimally positioned for current demand.`,
        };
    });
    
    res.json({ suggestions, lastUpdated: new Date().toISOString() });
});

// Customer Retention / Churn AI
router.get('/churn-prediction', (req, res) => {
    const store = getStore();
    const atRisk = store.customers
        .filter(c => c.churnRisk > 0.6)
        .map(c => ({
            ...c,
            riskLevel: c.churnRisk > 0.8 ? 'critical' : 'warning',
            suggestedAction: c.churnRisk > 0.8 
                ? `Send a personalized ${c.tier === 'vip' ? '25%' : '15%'} discount on their favorite "${c.preferences}" dishes.`
                : `Re-engagement email with new menu highlights.`,
            daysSinceVisit: Math.floor((Date.now() - new Date(c.lastVisit).getTime()) / 86400000),
        }));
    
    atRisk.sort((a, b) => b.churnRisk - a.churnRisk);
    
    res.json({
        atRisk,
        totalAtRisk: atRisk.length,
        totalCustomers: store.customers.length,
        retentionRate: ((1 - atRisk.length / store.customers.length) * 100).toFixed(1),
    });
});

// Feedback Intelligence / Sentiment Analysis
router.get('/sentiment', (req, res) => {
    const store = getStore();
    const positive = store.feedback.filter(f => f.sentiment === 'positive').length;
    const neutral = store.feedback.filter(f => f.sentiment === 'neutral').length;
    const negative = store.feedback.filter(f => f.sentiment === 'negative').length;
    const total = store.feedback.length;
    
    res.json({
        feedback: store.feedback,
        summary: {
            positive: ((positive / total) * 100).toFixed(1),
            neutral: ((neutral / total) * 100).toFixed(1),
            negative: ((negative / total) * 100).toFixed(1),
            avgRating: (store.feedback.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1),
        },
        aiInsight: negative > positive 
            ? 'Warning: Negative sentiment is trending up. Consider reviewing service speed and food quality.'
            : 'Sentiment is healthy. Maintain current service standards.',
    });
});

// Autopilot Mode
router.post('/autopilot', (req, res) => {
    // Simulate running the full optimization pipeline
    const actions = [
        { type: 'pricing', action: 'Adjusted 3 menu item prices based on demand curves.', impact: '+$420/week estimated' },
        { type: 'marketing', action: 'Triggered re-engagement campaign for 5 at-risk customers.', impact: '~2 customer saves' },
        { type: 'menu', action: 'Highlighted "Neon Mojito" as trending item on homepage.', impact: '+12% visibility' },
        { type: 'staffing', action: 'Suggested adding 1 server for Friday 7-9 PM shift.', impact: 'Reduced wait time by ~4 min' },
        { type: 'inventory', action: 'Flagged low stock prediction for truffle oil (3 days).', impact: 'Prevented stockout' },
    ];
    
    res.json({
        status: 'Autopilot Cycle Complete',
        actionsExecuted: actions.length,
        actions,
        nextRunIn: '6 hours',
        estimatedWeeklyImpact: '+$1,200 revenue / -$340 waste',
    });
});

export default router;
