# Campus Intelligence Dashboard (Problem SW-01-P)

An intelligent, cross-domain decision-support layer over 6 siloed campus operational datasets (**Classrooms**, **Events**, **Maintenance**, **Transportation**, **Energy**, **Attendance**).

This application surfaces cross-domain anomalies, forecasts capacity problems, and answers natural-language queries by combining **Groq** (`groq-sdk`) for lightning-fast Text-to-SQL translation with **Gemini API** (`@google/genai`) for multi-factor reasoning and evidence-cited recommendations.

---

## 🏗️ Tech Stack & Architecture

- **Database:** Supabase (PostgreSQL)
- **Backend:** Node.js (Express) with `@supabase/supabase-js`
- **AI Orchestration Engines:**
  - **Groq (`groq-sdk`):** Text-to-SQL parsing model (`llama-3.3-70b-versatile`)
  - **Gemini API (`@google/genai`):** Multi-factor reasoning & grounded answer synthesis (`gemini-2.5-flash`)
- **Frontend:** React (Vite), Tailwind CSS, Recharts, Lucide-react (strictly vector assets; 0 logos/photos)

---

## 📁 Directory Structure

```
CampusOrbit/
├── schema.sql              # Supabase PostgreSQL DDL (6 tables + views + indexes)
├── backend/
│   ├── index.js            # Express API Orchestration Layer
│   ├── seed.js             # Supabase Data Seeding script with seeded anomalies
│   ├── db.js               # Supabase Client & Mock Fallback Layer
│   ├── mockData.js         # 2-3 months synthetic multi-domain dataset store
│   ├── services/
│   │   ├── groqService.js     # Groq groq-sdk Text-to-SQL translation engine
│   │   ├── geminiService.js   # Gemini @google/genai reasoning & synthesis engine
│   │   └── anomalyEngine.js   # Hybrid rule-based + z-score statistical anomaly detector
│   ├── .env.example        # Environment variable template
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx            # Executive Dashboard main container
    │   ├── components/
    │   │   ├── Header.jsx           # System status & dual-AI indicators
    │   │   ├── KpiOverview.jsx      # 6-domain stat cards
    │   │   ├── AnomaliesPanel.jsx   # Severity-badged alerts + Gemini "Why this rec?" accordion
    │   │   ├── ChatWidget.jsx       # Groq -> Gemini NL chat bar & quick prompts
    │   │   ├── Visualizers.jsx      # Recharts (Capacity, Energy, Transit, Maintenance)
    │   │   └── DomainDataTables.jsx # Raw dataset inspector per domain
    │   └── index.css          # Tailwind CSS & Glassmorphism design tokens
    ├── package.json
    └── vite.config.js
```

---

## ⚡ Quick Start & Execution

### 1. Database Setup (Supabase)
Run the SQL DDL in `schema.sql` inside your Supabase SQL Editor.

### 2. Environment Setup
Copy `backend/.env.example` to `backend/.env` and enter your credentials:
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
GROQ_API_KEY=gsk_your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install & Seed
```bash
# Install backend dependencies
cd backend
npm install

# Seed Supabase database with 2-3 months synthetic data + anomalies
npm run seed

# Start Express Backend
npm run dev
```

### 4. Install & Run Frontend
```bash
# In a new terminal tab:
cd frontend
npm install

# Start Vite React Dashboard
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 💡 Key Seeded Anomalies Included

1. **Critical HVAC Maintenance + Scheduled Large Event:** Event *Annual CS AI & Cloud Summit* (185 attendees) in Room `CS-301` while an `Open` ticket with severity `Critical` is logged for *HVAC Compressor Failure*.
2. **Ghost Energy Consumption:** Room `LIB-102` consuming 48.7 kWh peak at 2:30 AM with 0 registered occupants.
3. **Attendance Overflow Fire Code Breach:** Event *Quantum Physics 101* with 105 actual scanned attendees in Room `SCI-104` (Max capacity: 60 - 175% occupancy!).
4. **Transit Overcrowding:** Route `Campus Express Shuttle 2` operating at 145% passenger capacity during class dismissal peak.
