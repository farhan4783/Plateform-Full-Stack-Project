# 🚀 How to Run the "Project-Taaza" Website Locally

Welcome to **Project-Taaza**! This guide will help you set up and run the restaurant website on your local machine using a local web server environment (like XAMPP, WAMP, or MAMP).

## 🛠 Prerequisites

Before starting, ensure you have the following installed on your system:
1. **XAMPP, WAMP, or MAMP**: A local server environment that includes Apache (web server), MySQL (database), and PHP. You can download XAMPP from [Apache Friends](https://www.apachefriends.org/).
2. **A Web Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, etc.
3. **A Code Editor (Optional)**: VS Code, Sublime Text, or Notepad++ to view/edit the code.

---

## 🏃‍♂️ Step-by-Step Setup Guide

### Step 1: Start your Local Server
1. Open your **XAMPP Control Panel** (or WAMP/MAMP).
2. Start the **Apache** and **MySQL** modules. Both should show a green status/background indicating they are running.

### Step 2: Place the Project in the Correct Directory
1. If you haven't already, clone or extract the downloaded project folder.
2. Move the entire `Project-Taaza-main` folder into the main directory of your local server:
   - For **XAMPP**: Move to `C:\xampp\htdocs\`
   - For **WAMP**: Move to `C:\wamp\www\`
   - For **MAMP**: Move to `C:\MAMP\htdocs\` (on Windows) or `/Applications/MAMP/htdocs/` (on Mac)

### Step 3: Setup the Database
The project requires a MySQL database to function properly.

1. Open your browser and go to `http://localhost/phpmyadmin/`.
2. Click on the **Databases** tab at the top.
3. Under "Create database", enter the name: `taaza_db`.
4. Click **Create**.
5. Select `taaza_db` from the left sidebar to open it.
6. Now, you need to execute the SQL queries to create the necessary tables. You have two options:
   
   **Option A: Run Queries manually**  
   Copy the `CREATE TABLE` queries provided in the `README.md` file under the `"Database Structure & creating queries [Table By Table]"` section. Paste them into the **SQL** tab in phpMyAdmin and click **Go**.
   
   **Option B: Execute all at once**
   Here is the complete SQL query to create all the tables. Copy the below block, paste it into the **SQL** tab in phpMyAdmin, and click **Go**:

```sql
CREATE TABLE admin (
    id INT NOT NULL,
    email VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(190) NOT NULL,
    resettoken VARCHAR(190) NOT NULL,
    resettokenexpire DATE DEFAULT NULL,
    enable_table_booking TINYINT NOT NULL,
    enable_menu_page TINYINT NOT NULL
);

CREATE TABLE admin_message (
    id INT NOT NULL,
    message VARCHAR(5000) NOT NULL,
    enable_message TINYINT NOT NULL
);

CREATE TABLE contact (
    id INT NOT NULL,
    email VARCHAR(90) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE feedback (
    feedback_id INT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    feedback_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lend_hand (
    id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(90) NOT NULL,
    amount INT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    show_detail TINYINT NOT NULL
);

CREATE TABLE menu_items (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    description text,
    category varchar(50),
    price decimal(10,2) NOT NULL,
    quantity int NOT NULL DEFAULT 0,
    available tinyint(1) NOT NULL DEFAULT 1,
    image_path varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE orders (
    order_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    item VARCHAR(30) NOT NULL,
    quantity VARCHAR(30) NOT NULL,
    total_price VARCHAR(30) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registered_users (
    name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(100) NOT NULL,
    gender VARCHAR(18) NOT NULL,
    state VARCHAR(30) NOT NULL,
    district VARCHAR(30) NOT NULL,
    verification_code VARCHAR(225) NOT NULL,
    is_verified INT NOT NULL DEFAULT 0,
    resettoken VARCHAR(255) DEFAULT NULL,
    resettokenexpire DATE DEFAULT NULL,
    is_vip TINYINT NOT NULL
);

CREATE TABLE table_booking_ground (
    id INT NOT NULL,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    section VARCHAR(30) NOT NULL,
    seat VARCHAR(30) DEFAULT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    payment TINYINT NOT NULL
);

CREATE TABLE table_booking_vip (
    id INT NOT NULL,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    section VARCHAR(30) NOT NULL,
    seat VARCHAR(30) NOT NULL,
    decor VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    payment TINYINT NOT NULL
);
```

### Step 4: Verify Database Connection Configuration
By default, the project assumes your local MySQL database has the username `root` and an empty password `""`. 
If you have configured a different setup, you'll need to update it:

1. Open `includes/connection.php` using a text editor.
2. Update the credentials inside:
   ```php
   $servername = "localhost";
   $username = "root";  // Change if your MySQL username is different
   $password = "";      // Enter your MySQL password here if you have one
   $dbname = "taaza_db";
   ```

### Step 5: Run the Project
1. Open your web browser.
2. In the address bar, depending on your folder's name, type `http://localhost/Project-Taaza-main`
3. Hit Enter! The "Taaza" website home page will load successfully.

---

## 🌟 Bonus: Email Configuration
If you wish to test all features like Email Registration Verification, password resets, and receipt generations, ensure that PHP is setup to send emails. For local testing, you might need a local SMTP server like `MailHog` or you must configure your `php.ini` to use a real SMTP server like Gmail's SMTP.

Check out different panels! The project has a user interface with Table Bookings, Food ordering, and also an Admin Panel to manage everything inside.
