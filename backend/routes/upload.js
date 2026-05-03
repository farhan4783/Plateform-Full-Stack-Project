import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import { getStore } from '../store.js';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/excel', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
        // Let's assume the excel has a column 'type' or we just infer it, 
        // but for simplicity, let's say the user uploads Menu Items.
        const menuItems = data.map((row, index) => ({
            id: row.id || `item_${Date.now()}_${index}`,
            name: row.name || 'Unnamed Item',
            description: row.description || '',
            category: row.category || 'Mains',
            price: parseFloat(row.price) || 0,
            cost: parseFloat(row.cost) || 0,
            available: row.available === undefined ? true : (row.available === true || String(row.available).toLowerCase() === 'true'),
            popularity: parseInt(row.popularity) || 80,
            orders_30d: parseInt(row.orders_30d) || 0
        }));

        const store = getStore();
        // Append or replace? We'll replace for simplicity, so they can manage the full list via excel.
        store.menuItems = menuItems;
        
        // Clean up temp file
        fs.unlinkSync(req.file.path);

        res.json({ message: 'Menu data updated successfully from Excel', count: menuItems.length });
    } catch (err) {
        console.error('Excel processing error:', err);
        res.status(500).json({ error: 'Failed to process Excel file' });
    }
});

export default router;
