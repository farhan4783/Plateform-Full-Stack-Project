# Project Plateform - V2 Premium Upgrade

Welcome to the newly upgraded Project Plateform! We've completed a full migration from the legacy PHP application to a modern, architecture.

## 🚀 Architecture Changes

1. **Frontend (`/client`)**: 
   - Converted to pure HTML5, CSS3, and Vanilla JavaScript.
   - Designed with an ultra-premium "Glassmorphism" aesthetic.
   - Features dynamic aurora backgrounds, hover animations, and smooth scrolling.

2. **Backend (`/server`)**:
   - Converted from PHP/MySQL to Node.js / Express.
   - Implemented an embedded SQLite database (`taaza.db`) for lightweight, zero-configuration local data storage.
   - Exposes clean RESTful APIs for the frontend.

## 🤖 New AI Feature: The "AI Chef"
We have added a dedicated section where users can consult our **AI Chef**.
- **How it works:** Users input their current mood (e.g., "Energetic", "Relaxed") and any dietary restrictions (e.g., "Vegan").
- **Backend Processing:** The backend simulates an advanced AI model (with artificial delay) to recommend the absolute best dish from the database, matching the user's emotional and physical profile.
- **UI:** A beautiful chat-like interface that mimics a conversation with an AI agent.

## ✨ New Unique Feature: Interactive Table Map
Instead of a boring form, users can now book tables through a visual **Interactive Digital Layout**.
- Visual representation of the VIP Lounge and Main Dining areas.
- Clickable nodes that highlight and automatically populate the reservation form.
- Direct integration with the new Node.js backend to securely save reservations.

## 🛠️ How to run the new project

1. **Start the Backend:**
   ```bash
   cd server
   npm install
   npm start
   ```
   *The server will run on http://localhost:5000 and auto-initialize the SQLite database with sample menu items.*

2. **Start the Frontend:**
   - Simply open the `client/index.html` file in any modern web browser.
   - Alternatively, use an extension like **Live Server** in VS Code to run it dynamically.

Enjoy the new, highly interactive, and futuristic experience!
