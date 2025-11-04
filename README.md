<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

---

# ViaLuxe Travel Backend

### *“Effortless luxury. Seamless journeys.”*

ViaLuxe is a **comprehensive travel management backend** designed to power a world-class luxury travel platform.
It enables travelers to explore curated tour packages, book exclusive destinations, request visa assistance, and access personalized travel services — all through a unified system.

---

## Overview

The **ViaLuxe Backend** is built using **Node.js**, **TypeScript**, **Express**, and **Prisma**, following a modular architecture designed for scalability and future microservice migration.

It serves as the core engine for managing:

* **Tour Packages**
* **Destination Travels**
* **Visa Checklists**
* **Blogs and Highlights**

Manageing Requests Such as 
* **Private Jet Charters**
* **Executive Shuttles**
* **Flight Booking**
* **Hotel Reservations**
* **Visa Assistance**
* **Travel Insurance**
* **Travel Loan Services**
* **Email Subscriptions & Notifications**

ViaLuxe brings together every aspect of travel planning, from discovery to booking into a seamless digital experience.

---

## Key Features

* **Tour & Destination Management:**
  Create, publish, and highlight curated travel experiences.

* **Visa Assistance System:**
  Manage visa checklists, pricing options, and travel requirements by country.

* **Customer Requests:**
  Handle all types of travel requests including hotel, flight, and jet bookings.

* **Blog & Content Publishing:**
  Share travel insights, guides, and brand stories through the ViaLuxe blog system.

* **Email Subscription Service:**
  Engage your audience through updates, newsletters, and special offers.

* **Role-Based Data Control:**
  (Future-ready) Supports admin and user privileges for content and request management.

* **Modular Architecture:**
  Each domain (e.g., Blog, Visa, Tour) is isolated and ready for microservice deployment.

---

## Tech Stack
* Language: **TypeScript**
* Framework: **NestJS**
* Database: **MySQL Database**
* ORM: **Prisma ORM**
* API Layer: **GraphQL + Apollo Server**       
---


## Vision

> “Travel beautifully.”

ViaLuxe’s goal is to redefine digital travel experiences, combining the **precision of technology** with the **grace of luxury hospitality**.
From a single API, the entire customer journey can be powered: explore, plan, book, and experience.

---

---


## Project Setup

```bash
# Install dependencies
$ npm install
```

## Running the App

```bash
# development
$ npm run start
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start the server in watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
---

## License

© 2025 **ViaLuxe Travel** — All rights reserved.
Designed with care and precision to bring luxury travel to life. ✈️
