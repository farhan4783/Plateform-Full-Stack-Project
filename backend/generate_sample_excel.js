import xlsx from 'xlsx';
import fs from 'fs';

const sampleMenu = [
    { id: '101', name: 'Spicy Dragon Roll', description: 'Crab, cucumber, topped with spicy tuna and dragon sauce.', category: 'Sushi', price: 18.5, cost: 6.0, available: true, popularity: 95, orders_30d: 412 },
    { id: '102', name: 'Miso Glazed Black Cod', description: 'Broiled black cod marinated in sweet saikyo miso.', category: 'Mains', price: 34.0, cost: 12.0, available: true, popularity: 88, orders_30d: 215 },
    { id: '103', name: 'Matcha Tiramisu', description: 'Layers of matcha soaked ladyfingers and mascarpone.', category: 'Desserts', price: 12.0, cost: 3.5, available: true, popularity: 92, orders_30d: 340 }
];

const worksheet = xlsx.utils.json_to_sheet(sampleMenu);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Menu Items');

xlsx.writeFile(workbook, 'Sample_Menu_Data.xlsx');
console.log('Sample_Menu_Data.xlsx generated successfully!');
