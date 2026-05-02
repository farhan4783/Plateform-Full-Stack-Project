// In-memory data store — simulates a database for demo purposes.
// In production, swap this for PostgreSQL / MongoDB.

let store = {};

export function initStore() {
    store = {
        restaurants: [
            { id: 'rest_001', name: 'Plateform AI Downtown', location: 'New York, NY', plan: 'enterprise', active: true },
            { id: 'rest_002', name: 'Plateform Bistro', location: 'San Francisco, CA', plan: 'pro', active: true },
        ],
        menuItems: [
            { id: 1, name: 'Truffle Wagyu Burger', description: 'A5 wagyu patty with black truffle aioli, aged cheddar, and caramelized onions.', category: 'Mains', price: 28.99, cost: 9.50, available: true, popularity: 92, orders_30d: 342 },
            { id: 2, name: 'Lobster Bisque', description: 'Creamy bisque with Maine lobster, cognac reduction, and chive oil.', category: 'Starters', price: 16.50, cost: 5.20, available: true, popularity: 88, orders_30d: 287 },
            { id: 3, name: 'Quantum Pasta Alfredo', description: 'Fresh tagliatelle in truffle-infused Alfredo with sun-dried tomatoes.', category: 'Mains', price: 22.00, cost: 6.80, available: true, popularity: 76, orders_30d: 198 },
            { id: 4, name: 'Neon Mojito', description: 'Butterfly pea flower infused mojito with color-changing citrus.', category: 'Drinks', price: 12.00, cost: 2.50, available: true, popularity: 95, orders_30d: 456 },
            { id: 5, name: 'Galaxy Cheesecake', description: 'Mirror-glazed cheesecake with edible gold dust and berry compote.', category: 'Desserts', price: 14.00, cost: 3.80, available: true, popularity: 90, orders_30d: 312 },
            { id: 6, name: 'Smoked Salmon Tartare', description: 'Cold-smoked Atlantic salmon with capers, dill, and lemon crème.', category: 'Starters', price: 18.00, cost: 6.00, available: true, popularity: 72, orders_30d: 156 },
            { id: 7, name: 'Matcha Latte Supreme', description: 'Ceremonial grade matcha with oat milk and vanilla foam.', category: 'Drinks', price: 8.50, cost: 2.00, available: true, popularity: 84, orders_30d: 398 },
            { id: 8, name: 'Filet Mignon', description: 'Center-cut filet with truffle mash, asparagus, and red wine jus.', category: 'Mains', price: 42.00, cost: 14.50, available: true, popularity: 96, orders_30d: 267 },
        ],
        orders: generateOrders(),
        bookings: generateBookings(),
        customers: generateCustomers(),
        feedback: generateFeedback(),
        tables: [
            { id: 'V1', section: 'VIP', seats: 4, status: 'available' },
            { id: 'V2', section: 'VIP', seats: 6, status: 'occupied' },
            { id: 'V3', section: 'VIP', seats: 2, status: 'available' },
            { id: 'M1', section: 'Main', seats: 4, status: 'available' },
            { id: 'M2', section: 'Main', seats: 2, status: 'reserved' },
            { id: 'M3', section: 'Main', seats: 6, status: 'available' },
            { id: 'M4', section: 'Main', seats: 4, status: 'available' },
            { id: 'M5', section: 'Main', seats: 8, status: 'occupied' },
            { id: 'M6', section: 'Main', seats: 2, status: 'available' },
            { id: 'P1', section: 'Patio', seats: 4, status: 'available' },
            { id: 'P2', section: 'Patio', seats: 2, status: 'available' },
            { id: 'P3', section: 'Patio', seats: 4, status: 'reserved' },
        ],
    };
    console.log('📦 Data store initialized with sample data.');
}

function generateOrders() {
    const items = ['Truffle Wagyu Burger', 'Lobster Bisque', 'Quantum Pasta Alfredo', 'Neon Mojito', 'Galaxy Cheesecake', 'Filet Mignon', 'Matcha Latte Supreme'];
    const statuses = ['completed', 'preparing', 'delivered', 'cancelled'];
    const orders = [];
    for (let i = 1; i <= 50; i++) {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 30));
        d.setHours(Math.floor(Math.random() * 14) + 8);
        orders.push({
            id: `ORD-${String(i).padStart(4, '0')}`,
            customer: `Customer ${i}`,
            email: `customer${i}@example.com`,
            items: [items[Math.floor(Math.random() * items.length)]],
            total: parseFloat((Math.random() * 80 + 10).toFixed(2)),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            timestamp: d.toISOString(),
        });
    }
    return orders;
}

function generateBookings() {
    const bookings = [];
    for (let i = 1; i <= 15; i++) {
        const d = new Date();
        d.setDate(d.getDate() + Math.floor(Math.random() * 7));
        bookings.push({
            id: `BK-${String(i).padStart(3, '0')}`,
            name: `Guest ${i}`,
            email: `guest${i}@example.com`,
            table_id: ['V1', 'V2', 'M1', 'M3', 'P1'][Math.floor(Math.random() * 5)],
            section: ['VIP', 'Main', 'Patio'][Math.floor(Math.random() * 3)],
            date: d.toISOString().split('T')[0],
            time: `${Math.floor(Math.random() * 4) + 18}:00`,
            guests: Math.floor(Math.random() * 5) + 1,
            status: ['confirmed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)],
        });
    }
    return bookings;
}

function generateCustomers() {
    const customers = [];
    const tiers = ['regular', 'silver', 'gold', 'vip'];
    for (let i = 1; i <= 30; i++) {
        customers.push({
            id: `CUS-${String(i).padStart(4, '0')}`,
            name: `Customer ${i}`,
            email: `customer${i}@example.com`,
            tier: tiers[Math.floor(Math.random() * tiers.length)],
            totalSpent: parseFloat((Math.random() * 2000 + 50).toFixed(2)),
            visits: Math.floor(Math.random() * 50) + 1,
            lastVisit: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString().split('T')[0],
            churnRisk: parseFloat((Math.random()).toFixed(2)),
            preferences: ['spicy', 'sweet', 'savory', 'healthy'][Math.floor(Math.random() * 4)],
        });
    }
    return customers;
}

function generateFeedback() {
    const sentiments = ['positive', 'neutral', 'negative'];
    const texts = [
        'Amazing food and great ambiance!',
        'Service was a bit slow but food was excellent.',
        'The Wagyu Burger is out of this world.',
        'Not happy with the wait time today.',
        'Best restaurant experience I have ever had.',
        'Pasta was undercooked, disappointing.',
        'Love the new cocktail menu!',
        'The VIP section is worth every penny.',
    ];
    return texts.map((text, i) => ({
        id: i + 1,
        customer: `Customer ${i + 1}`,
        text,
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
        rating: Math.floor(Math.random() * 3) + 3,
        timestamp: new Date(Date.now() - Math.random() * 14 * 86400000).toISOString(),
    }));
}

export function getStore() {
    return store;
}
