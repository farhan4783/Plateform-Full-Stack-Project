const API_BASE = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
    setupTableMap();
    setupBookingForm();
    setupAIChef();
});

// Fetch and render menu
async function fetchMenu() {
    const container = document.getElementById('menu-container');
    try {
        const res = await fetch(`${API_BASE}/menu`);
        const items = await res.json();
        
        container.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            
            // Generate a random image from unsplash food category if we want placeholders, 
            // but we'll use a cool icon or a color block for now to keep it neat if no image exists.
            const imageUrl = `https://source.unsplash.com/400x300/?food,${item.name.split(' ')[0]}`;

            card.innerHTML = `
                <div class="menu-img" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;">
                    ${!imageUrl ? '<i class="fa-solid fa-utensils"></i>' : ''}
                </div>
                <div class="menu-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="menu-meta">
                        <span class="price">$${item.price.toFixed(2)}</span>
                        <button class="btn outline-btn" style="padding: 5px 15px; font-size: 0.8rem;">Add</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = '<p style="color: red;">Failed to load menu. Is the backend running?</p>';
    }
}

// Table Map Interactivity
function setupTableMap() {
    const tables = document.querySelectorAll('.table-node');
    const tableDisplay = document.getElementById('table-display');
    const selectedTableInput = document.getElementById('selected-table');

    tables.forEach(table => {
        table.addEventListener('click', () => {
            // Remove selection from all
            tables.forEach(t => t.classList.remove('selected'));
            
            // Select current
            table.classList.add('selected');
            
            const id = table.dataset.id;
            const section = table.dataset.section;
            
            tableDisplay.value = `${section} Section - Table ${id}`;
            selectedTableInput.value = JSON.stringify({ id, section });
        });
    });
}

// Booking Form Submit
function setupBookingForm() {
    const form = document.getElementById('reservation-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const tableDataStr = document.getElementById('selected-table').value;
        if (!tableDataStr) {
            alert('Please select a table from the map first!');
            return;
        }

        const tableData = JSON.parse(tableDataStr);
        const booking = {
            name: document.getElementById('res-name').value,
            email: document.getElementById('res-email').value,
            date: document.getElementById('res-date').value,
            time: document.getElementById('res-time').value,
            section: tableData.section,
            table_id: tableData.id
        };

        try {
            const res = await fetch(`${API_BASE}/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking)
            });
            
            if (res.ok) {
                alert('Table booked successfully! Get ready for an amazing experience.');
                form.reset();
                document.querySelectorAll('.table-node').forEach(t => t.classList.remove('selected'));
                document.getElementById('table-display').value = '';
            } else {
                alert('Failed to book table. Try again.');
            }
        } catch (error) {
            alert('Error connecting to server.');
        }
    });
}

// AI Chef Interaction
function setupAIChef() {
    const askBtn = document.getElementById('ask-ai-btn');
    const moodSelect = document.getElementById('mood-select');
    const dietSelect = document.getElementById('diet-select');
    const chatOutput = document.getElementById('chat-output');

    askBtn.addEventListener('click', async () => {
        const mood = moodSelect.value;
        const diet = dietSelect.value;

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.innerHTML = `<i class="fa-solid fa-user"></i><p>I'm feeling ${mood} and have ${diet === 'none' ? 'no dietary restrictions' : diet + ' restrictions'}. What do you recommend?</p>`;
        chatOutput.appendChild(userMsg);
        
        // Scroll to bottom
        chatOutput.scrollTop = chatOutput.scrollHeight;

        // Loading state
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'message ai';
        loadingMsg.innerHTML = `<i class="fa-solid fa-robot"></i><p><i class="fa-solid fa-circle-notch fa-spin"></i> Analyzing culinary database...</p>`;
        chatOutput.appendChild(loadingMsg);
        chatOutput.scrollTop = chatOutput.scrollHeight;
        askBtn.disabled = true;

        try {
            const res = await fetch(`${API_BASE}/ai/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood, diet })
            });
            
            const data = await res.json();
            
            // Remove loading
            chatOutput.removeChild(loadingMsg);

            // Add AI response
            const aiMsg = document.createElement('div');
            aiMsg.className = 'message ai';
            aiMsg.innerHTML = `<i class="fa-solid fa-robot"></i><p>${data.reply}</p>`;
            chatOutput.appendChild(aiMsg);
            
        } catch (error) {
            chatOutput.removeChild(loadingMsg);
            const errorMsg = document.createElement('div');
            errorMsg.className = 'message ai';
            errorMsg.innerHTML = `<i class="fa-solid fa-robot" style="color:red;"></i><p>Sorry, my culinary circuits are temporarily offline.</p>`;
            chatOutput.appendChild(errorMsg);
        }

        askBtn.disabled = false;
        chatOutput.scrollTop = chatOutput.scrollHeight;
    });
}

// Smooth Scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
