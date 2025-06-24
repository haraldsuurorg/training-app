# 🎓 Training Booking App

A modern, full-stack training management and booking system built with Laravel 12 and React. This application enables organizations to manage trainings and allows users to book and manage their training registrations.

## ✨ Features

### 👨‍💼 Admin Features
- **Training Management**
  - Create, edit, and delete training sessions
  - Set maximum participants and location details
- **Registration Management**
  - View all user registrations across all trainings
  - Update registration statuses (pending, confirmed, cancelled)
  - Monitor training capacity and participant lists
- **Dashboard Overview**
  - Real-time view of all trainings with registration counts
  - Toggle between upcoming and past trainings
  - Advanced search and filtering capabilities

### 👥 Customer Features
- **Training Discovery**
  - Browse available training sessions
  - View detailed training information (date, location, description)
  - See real-time availability and participant counts
- **Registration Management**
  - Register for available trainings
  - View personal training history
  - Cancel registrations (before training start date)
- **Personal Dashboard**
  - "My Trainings" section with registration overview
  - Toggle between upcoming and past trainings
  - Search through personal training history

### 🔧 System Features
- **Authentication & Authorization**
  - Secure user authentication with email verification
  - Role-based access control (Admin/Customer)
  - Protected routes and middleware
- **Smart Filtering**
  - Automatic prevention of past training registrations
  - Capacity management with waitlist prevention
  - Duplicate registration prevention
- **Modern UI/UX**
  - Responsive design for all devices
  - Real-time search and filtering
  - Intuitive card-based training display
  - Clean, professional interface

## 🚀 Tech Stack

### Backend
- **Laravel 12** - PHP framework
- **Serverless Postgres** - Database
- **Inertia.js** - Server-side rendering
- **Middleware** - Authentication & authorization

### Frontend
- **React 18** - UI library
- **Shadcn** - Component library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **TanStack Table** - Data tables
- **Lucide Icons** - Icon system
- **Date-fns** - Date manipulation

