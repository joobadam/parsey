# 🧾 Parsey

> Smart Expense Tracking with AI Receipt Recognition

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
  - [Tech Stack](#-tech-stack)
  - [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#-prerequisites)
  - [Environment Variables](#-environment-variables)
  - [Installation](#-installation)
  - [Running the Application](#-running-the-application)
- [Features](#-features)
  - [Receipt Processing](#-receipt-processing)
  - [Dashboard Analytics](#-dashboard-analytics)
  - [Category Management](#-category-management)
- [API Routes](#-api-routes)
- [Project Structure](#-project-structure)
- [License](#-license)

---

## 🎯 About The Project

Parsey is an intelligent expense tracking application that uses AI-powered OCR and receipt parsing to automatically extract transaction data from uploaded receipts. The application combines Tesseract.js for text extraction with OpenAI's GPT models for intelligent data parsing and category suggestion.

**Key Features:**

- ✅ **AI-Powered OCR**: Automatic text extraction from receipt images using Tesseract.js
- ✅ **Intelligent Parsing**: GPT-5-nano extracts merchant, amount, currency, and items
- ✅ **Smart Categorization**: AI suggests appropriate expense categories based on receipt content
- ✅ **Real-time Analytics**: Interactive dashboards with charts and statistics
- ✅ **Category Management**: Custom categories with Lucide React icons
- ✅ **Transaction Tracking**: Full CRUD operations for income and expenses
- ✅ **Responsive Design**: Modern UI built with Shadcn/ui and Tailwind CSS

### 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| ⚛️ **Framework** | Next.js 15 (App Router) |
| 🎨 **UI Library** | React 19 |
| 🎯 **Styling** | Tailwind CSS 4.0 |
| 🗄️ **Database** | Supabase (PostgreSQL) |
| 🔐 **Authentication** | NextAuth.js + Supabase Adapter |
| 📊 **Data Fetching** | TanStack React Query |
| 🤖 **AI/ML** | Vercel AI SDK + OpenAI (GPT-5-nano) |
| 📄 **OCR** | Tesseract.js |
| 📈 **Charts** | Recharts |
| 🎨 **UI Components** | Shadcn/ui (Radix UI) |
| 🔤 **Icons** | Lucide React |

### 🏗️ Architecture

**Receipt Processing Pipeline:**

1. **Image Upload** → User uploads receipt (JPG, PNG, WEBP, max 5MB)
2. **OCR Extraction** → Tesseract.js extracts text with language detection (10-50% progress)
3. **Language Detection** → Automatic Hungarian/English detection
4. **AI Parsing** → GPT-5 Nano extracts + categorizes in one unified call:
   - Merchant name
   - Total amount
   - Currency
   - Item list
   - Suggested category
   - Confidence score
5. **Form Population** → Extracted data auto-fills transaction form
6. **Manual Review** → User can edit before saving

**Data Flow:**

```
Frontend (React) 
  ↓
API Routes (Next.js)
  ↓
Supabase (Database + Auth)
  ↓
OpenAI API (AI Processing)
```

---

## 🚀 Getting Started

### 📦 Prerequisites

- **Node.js** 18+ and npm
- **Supabase Account** (for database and authentication)
- **OpenAI API Key** (for receipt parsing)

### 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### 📥 Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up Supabase:**

   - Create a new Supabase project
   - Run the database migrations (if available)
   - Set up authentication providers

4. **Configure environment variables:**

   - Copy `.env.example` to `.env.local` (if available)
   - Fill in all required environment variables

### ▶️ Running the Application

**Development mode:**

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

**Production build:**

```bash
npm run build
npm start
```

---

## ✨ Features

### 📸 Receipt Processing

**Upload & Process:**
- Drag-and-drop or click to upload receipt images
- Supported formats: JPG, PNG, WEBP (max 5MB)
- Real-time progress tracking (OCR → AI Parsing)

**AI Extraction:**
- **Basic Parsing**: Extracts merchant, amount, currency, items
- **Category Suggestion**: AI analyzes receipt content and suggests category
- **Confidence Score**: Displays AI confidence level (0-100%)

**Manual Override:**
- Edit any extracted field before saving
- Change category if AI suggestion is incorrect
- Add custom description or notes

### 📊 Dashboard Analytics

**Overview Cards:**
- Total Income (current month)
- Total Expenses (current month)
- Net Balance
- Transaction Count

**Charts:**
- **12-Month Trend**: Line chart showing income vs expenses over time
- **Weekly Income vs Expenses**: Bar chart comparing weekly totals
- **Expenses by Category**: Pie chart with category breakdown

**Recent Transactions:**
- Last 5 transactions with quick edit/delete actions

### 📁 Category Management

**Features:**
- Create custom income/expense categories
- Assign Lucide React icons to categories
- View all transactions per category
- Edit or delete categories
- Category detail pages with transaction lists

**Default Categories:**
- Food & Dining
- Entertainment
- Travel
- Shopping
- Health
- Personal Care
- Other

---

## 🔌 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/receipt/parse` | POST | AI-powered receipt parsing (OCR text → structured data) |
| `/api/transactions` | GET, POST | Fetch/create transactions |
| `/api/transactions/[id]` | PUT, DELETE | Update/delete transaction |
| `/api/categories` | GET, POST | Fetch/create categories |
| `/api/auth/register` | POST | User registration |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth.js authentication |

**Important Notes:**

- `/api/receipt/parse` requires authentication
- Uses `maxDuration = 60` for Vercel Pro (AI processing can take time)
- Handles OpenAI quota errors gracefully
- Fetches user's custom categories for better AI suggestions

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (landing)/          # Landing page & auth
│   │   ├── components/
│   │   │   └── SignIn/     # Sign in/up forms
│   │   └── page.jsx
│   ├── api/                # API routes
│   │   ├── receipt/        # Receipt parsing
│   │   ├── transactions/   # Transaction CRUD
│   │   └── categories/     # Category management
│   ├── dashboard/          # Dashboard pages
│   │   ├── components/     # Dashboard components
│   │   ├── categories/     # Category pages
│   │   └── transactions/   # Transaction pages
│   ├── globals.css         # Global styles
│   ├── layout.js           # Root layout
│   └── providers.jsx       # React Query provider
├── components/
│   └── ui/                 # Shadcn/ui components
├── lib/
│   ├── hooks/              # Custom React hooks
│   │   ├── use-receipt-ocr.js
│   │   ├── use-transactions.js
│   │   └── use-categories.js
│   ├── auth.js             # NextAuth configuration
│   ├── supabase.js         # Supabase client
│   └── supabase-server.js  # Server-side Supabase
└── public/                 # Static assets
```

---

## 🔧 Technical Details

### OCR Processing

- **Library**: Tesseract.js (client-side)
- **Language**: Auto-detection (Hungarian + English)
  - Automatically detects language from text
  - Uses `hun+eng` for Hungarian receipts
  - Uses `eng` for English receipts
- **Progress Tracking**: 10-50% (OCR), 50-70% (AI parsing)

### AI Integration

- **Model**: OpenAI GPT-5 Nano (via Vercel AI SDK)
- **Unified Process**: Single AI call for parsing + categorization
- **Languages**: Hungarian & English (auto-detected)
- **Cost**: ~$0.00009 per receipt (1 AI call, optimized)

### Receipt Processing Pipeline

1. **Image Upload** → User uploads receipt (JPG, PNG, WEBP, max 5MB)
2. **OCR Extraction** → Tesseract.js extracts text with language detection
3. **Language Detection** → Automatic Hungarian/English detection
4. **AI Parsing** → GPT-5 Nano extracts + categorizes in one call:
   - Merchant name
   - Total amount
   - Currency
   - Item list
   - Suggested category
   - Confidence score
5. **Form Population** → Auto-fill transaction form
6. **Manual Review** → User can edit before saving

### Database Schema

**Tables:**
- `users` - User accounts (Supabase Auth)
- `transactions` - Income/expense records
- `categories` - User-defined categories

**Relations:**
- `transactions.category_id` → `categories.id`
- `transactions.user_id` → `users.id`

### Authentication

- **Provider**: NextAuth.js with Supabase Adapter
- **Session Management**: Server-side sessions
- **Protected Routes**: Middleware-based route protection

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

<p align="right">(<a href="#-parsey">back to top</a>)</p>

