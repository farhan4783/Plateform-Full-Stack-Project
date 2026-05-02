import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

export const initDb = async () => {
    db = await open({
        filename: './taaza.db',
        driver: sqlite3.Database
    });

    // Create tables
    await db.exec(`
        CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            category TEXT,
            price REAL NOT NULL,
            available INTEGER DEFAULT 1,
            image_path TEXT
        );

        CREATE TABLE IF NOT EXISTS table_booking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            section TEXT NOT NULL,
            table_id TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL
        );
    `);

    // Insert dummy data if empty
    const items = await db.all('SELECT * FROM menu_items');
    if (items.length === 0) {
        await db.exec(`
            INSERT INTO menu_items (name, description, category, price, available, image_path) VALUES
            ('Taaza Signature Burger', 'Juicy beef patty with caramelized onions and our secret taaza sauce.', 'Mains', 14.99, 1, 'burger.jpg'),
            ('Truffle Fries', 'Crispy golden fries tossed in truffle oil and parmesan.', 'Sides', 8.99, 1, 'fries.jpg'),
            ('Quantum Pasta', 'Fresh linguine in a rich, creamy Alfredo-fusion sauce with sun-dried tomatoes.', 'Mains', 18.50, 1, 'pasta.jpg'),
            ('Neon Mojito', 'A glowing, refreshing blend of mint, lime, and curacao.', 'Drinks', 7.00, 1, 'mojito.jpg'),
            ('Galaxy Cheesecake', 'A mesmerizing starry glaze over rich New York style cheesecake.', 'Desserts', 9.50, 1, 'cheesecake.jpg')
        `);
    }

    console.log('Database initialized successfully.');
    return db;
};

export const getDb = () => db;
