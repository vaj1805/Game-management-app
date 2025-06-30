# Player Finder – Game Rental & Management System

A full-stack, server-rendered web application for renting and scheduling physical and café-based games. Built with Node.js, Express, MongoDB, EJS and session-based authentication, with Razorpay integration for payments. Players browse, filter and book games; Owners manage listings and view bookings/earnings; Admin oversees the system.

---

## 📋 Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Environment Variables](#environment-variables)  
- [Project Structure](#project-structure)  
- [Routes & Views](#routes--views)  
- [Usage](#usage)  
- [License](#license)  

---

## 🔥 Features

- **Authentication & Authorization**  
  - Session-based login/registration with Express Session  
  - Role-based access: Player, Owner, Admin  
- **Player Dashboard**  
  - Browse & filter games by category, city, price  
  - View game details & availability  
  - Book time slots (prevent double-booking)  
  - View/cancel upcoming bookings & history  
- **Owner Dashboard**  
  - Create/Edit/Delete game listings  
  - Set price, location, category, quantity  
  - View all bookings on their games with player info & revenue  
- **Admin Panel**  
  - Separate login  
  - (Extendable for user management or analytics)  
- **Payments**  
  - Razorpay integration for secure transactions  
- **Flash Messages & Error Handling**  
  - Form-level validation feedback in EJS templates  

---

## 🧰 Tech Stack

- **Server**: Node.js, Express  
- **Templating**: EJS  
- **Database**: MongoDB (via Mongoose)  
- **Auth**: express-session  
- **Payments**: Razorpay Node SDK  
- **Styling**: Plain CSS (served from `/public/css`)  

---

## ⚙️ Prerequisites

- Node.js ≥ 16.x  
- npm ≥ 8.x  
- MongoDB instance (local or Atlas)  
- Razorpay account for API keys  

---

## 🚀 Installation

1. **Clone**  
   ```bash
   git clone https://github.com/yourusername/player-finder.git
   cd player-finder/backend
