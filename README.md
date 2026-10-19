# 🛒 Amazon Clone - React Frontend

A responsive and feature-rich E-Commerce frontend web application replicating core Amazon functionalities. Built using **React.js (Vite)**, **React Router**, and **Axios** for smooth REST API integration.

## 🚀 Live Application
- **Live Website:** [https://amazon-ecommerce-clone-wine.vercel.app](https://amazon-ecommerce-clone-wine.vercel.app)
- **Hosted Platform:** Vercel

---

## ✨ Key Features
- **Product Discovery & Search:** Dynamic product filtering by categories (Electronics, Fashion, Books, etc.) and keyword search.
- **AI-Powered Visual Search:** Upload an image to find similar products in the catalog.
- **Cart & Wishlist Management:** Interactive shopping cart with real-time price calculation and wishlist tracking.
- **Razorpay Payment Gateway:** Integrated Razorpay checkout popup for digital payments (UPI, Cards, Netbanking) along with Cash on Delivery (COD).
- **Interactive AI Assistant:** Floating AI shopping chatbot for product recommendations and budget suggestions.
- **AI Customer Review Summarizer:** Automated breakdown of product pros, cons, and buyer sentiments inside product modals.
- **Seller Central (Admin Dashboard):** Dedicated admin management view to add, edit, or remove catalog items and manage registered users.
- **Order Tracking & Invoicing:** Real-time visual progress tracker (`PLACED`, `SHIPPED`, `OUT FOR DELIVERY`, `DELIVERED`) with downloadable/printable **Tax Invoices**.

---

## 🛠 Tech Stack
- **Library:** React.js (v18+) with Vite
- **Routing:** React Router DOM (v6)
- **HTTP Client:** Axios
- **Icons:** React Icons (`fa` suite)
- **Deployment:** Vercel (Configured with single-page application rewrites)

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory and add:

```env
VITE_API_BASE_URL=[https://amazon-backend-clone-x61b.onrender.com/api](https://amazon-backend-clone-x61b.onrender.com/api)
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
