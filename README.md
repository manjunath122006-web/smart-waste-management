# EcoRoute AI: A Scalable Cloud-Based Smart Waste Management and Collection Optimization System

[![Assignment](https://img.shields.io/badge/Assignment-ABA%20for%20Cloud-blue.svg)](https://aws.amazon.com)
[![Cloud Platform](https://img.shields.io/badge/Cloud-Amazon%20Web%20Services-orange.svg)](https://aws.amazon.com)
[![SDG Target](https://img.shields.io/badge/SDG%2011.6-Sustainable%20Cities-green.svg)](https://sdgs.un.org/goals/goal11)
[![Backend](https://img.shields.io/badge/Backend-Python%20FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb.svg)](https://react.dev)
[![Optimization](https://img.shields.io/badge/Routing-Google%20OR--Tools-4285F4.svg)](https://developers.google.com/optimization)

---

## 1. Project Overview

**EcoRoute AI** is a cloud-native web application designed to improve urban solid waste reporting, incident triage, and collection logistics for municipal corporations.

### Key Capabilities
1. **Citizen Complaint Portal:** Allows residents to report overflowing bins and debris with photo uploads, text descriptions, and automatic GPS browser geolocation.
2. **AI Waste Image Classification:** Incorporates transfer learning (MobileNetV2) and visual feature analysis to classify waste into four operational categories (`overflowing_bin`, `mixed_waste`, `recyclable_waste`, `other`) with human-in-the-loop verification.
3. **Multi-Factor Priority Engine:** Computes a normalized 0–100 Priority Score for each complaint factoring in severity, elapsed waiting time, and localized 200m spatial clustering (hotspots).
4. **Collection Route Optimization (Google OR-Tools):** Solves the Traveling Salesperson Problem (TSP) to minimize vehicle mileage, comparing the optimized sequence against a baseline arrival order and calculating fuel and carbon emission reductions.
5. **Elastic Cloud Architecture on AWS:** Designed for deployment across an Application Load Balancer (ALB), EC2 Auto Scaling Group, Amazon RDS for PostgreSQL, Amazon S3 for photographic storage, and Amazon CloudWatch for telemetry and alarms.

---

## 2. UN Sustainable Development Goal (SDG) Alignment

* **Primary Alignment — SDG Target 11.6:**  
  *“By 2030, reduce the adverse per capita environmental impact of cities, including by paying special attention to air quality and municipal and other waste management.”*  
  EcoRoute AI minimizes waste overflow duration and drastically reduces collection vehicle travel distance, cutting diesel consumption and vehicle exhaust emissions ($CO_2, NO_x$).
* **Secondary Alignment — SDG Target 11.3:**  
  *“Enhance inclusive and sustainable urbanization and capacity for participatory, integrated human settlement management.”*  
  Empowers citizens to participate actively in urban environmental governance.

---

## 3. Technology Stack

* **Frontend:** React 18, Vite, Vanilla CSS (Glassmorphism design system), Leaflet.js, Lucide Icons.
* **Backend API:** Python 3.10+, FastAPI, Uvicorn, SQLAlchemy, Pydantic v2.
* **Database:** Amazon RDS for PostgreSQL (production) / SQLite (local zero-configuration dev mode).
* **Storage:** Amazon S3 (production) / Local file storage with static mount (local dev mode).
* **AI Engine:** MobileNetV2 Transfer Learning Pipeline with visual heuristic fallback.
* **Route Optimizer:** Google OR-Tools (Constraint Programming with Guided Local Search).
* **Cloud Infrastructure:** AWS VPC, Application Load Balancer, EC2 Auto Scaling Group, CloudWatch, SNS.

---

## 4. Project Directory Structure

```
smart waste prj/
├── EcoRoute_AI_Project_Documentation.md  # 36-section academic engineering documentation
├── README.md                             # Setup, operation, and demonstration guide
├── .env.example                          # Environment variables template
├── requirements.txt                      # Python dependencies
├── backend/
│   ├── app/
│   │   ├── main.py                       # FastAPI entrypoint & router aggregation
│   │   ├── config.py                     # Environment settings (Local vs AWS)
│   │   ├── database.py                   # SQLAlchemy engine & sessionmaker
│   │   ├── models.py                     # Database tables (Users, Complaints, Routes)
│   │   ├── schemas.py                    # Pydantic validation schemas
│   │   ├── auth.py                       # JWT token authentication & bcrypt hashing
│   │   ├── storage.py                    # Local filesystem & Amazon S3 storage provider
│   │   ├── ai_service.py                 # AI classification engine (MobileNetV2 / Heuristic)
│   │   ├── priority.py                   # Multi-factor priority scoring formula
│   │   ├── optimizer.py                  # Google OR-Tools TSP route solver
│   │   ├── seed_data.py                  # Pre-seeds categories, admin, & demo complaints
│   │   └── routers/
│   │       ├── health.py                 # ALB health check endpoint (/health)
│   │       ├── auth.py                   # Registration & JWT login
│   │       ├── complaints.py             # Citizen reporting & tracking endpoints
│   │       ├── routes.py                 # Route optimization endpoint
│   │       └── admin.py                  # Analytics summary & hotspot clustering
│   └── tests/                            # Automated pytest suite (100% pass rate)
├── frontend/
│   ├── src/
│   │   ├── index.css                     # Glassmorphism design system
│   │   ├── App.jsx                       # Navigation & tab manager
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Header, tabs, and SDG chip
│   │   │   ├── CitizenPortal.jsx         # Report submission & camera upload
│   │   │   ├── TrackComplaint.jsx        # Status tracker & progress timeline
│   │   │   ├── AdminDashboard.jsx        # Telemetry cards, table & triage controls
│   │   │   ├── RouteOptimizerView.jsx    # OR-Tools solver & route comparisons
│   │   │   ├── MapView.jsx               # Leaflet map with depot, stops & polylines
│   │   │   └── LoginModal.jsx            # Admin credentials modal
│   │   └── services/api.js               # REST client
└── aws/
    ├── user_data.sh                      # EC2 bootstrap script
    ├── ecoroute.service                  # Systemd service unit
    ├── nginx.conf                        # Reverse proxy configuration
    ├── cloudwatch-agent-config.json      # CloudWatch telemetry configuration
    └── deploy_checklist.md               # Step-by-step AWS deployment checklist
```

---

## 5. Local Quickstart Guide (Step-by-Step)

The application includes an automated **Local Development Mode** that uses SQLite and local file uploads, allowing complete execution and testing on any machine without requiring an AWS account or active cloud billing.

### Step 1: Clone or Open Project
Open the project folder in your terminal:
```bash
cd "c:\Users\Manjunath\OneDrive\Desktop\smart waste prj"
```

### Step 2: Install Backend Dependencies
Ensure Python 3.10+ is installed:
```bash
pip install -r requirements.txt
```

### Step 3: Run the Automated Test Suite
Verify that all AI classifiers, route optimizers, auth endpoints, and complaint pipelines pass:
```bash
python -m pytest backend/tests -v
```

### Step 4: Start the FastAPI Backend Server
```bash
python -m uvicorn backend.app.main:app --reload --port 8000
```
* **API Documentation (Swagger UI):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **ALB Health Check:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

*(Note: On initial startup, the database `ecoroute.db` is created automatically with seed categories, default administrator `admin@ecoroute.local`, and sample active complaints).*

### Step 5: Start the React Frontend
In a second terminal window:
```bash
cd frontend
npm.cmd install
npm.cmd run dev
```
Open your browser at: **[http://localhost:5173](http://localhost:5173)**.

---

## 6. How to Demonstrate the Application (Viva & Review Guide)

### 1. Citizen Waste Reporting & AI Classification
1. Navigate to the **Report Waste** tab.
2. Upload any sample image (or photo of a bin/rubbish).
3. Click **"Use My GPS Location"** or leave default coordinates.
4. Enter an incident description (e.g., *"Overflowing dumpster blocking pedestrian sidewalk"*).
5. Click **"Submit Incident for AI Verification"**.
6. Observe the immediate response displaying:
   * Unique Tracking ID (e.g. `CMP-20261026-XXXX`)
   * AI Predicted Category (e.g., `OVERFLOWING_BIN`) and confidence score
   * Initial calculated Priority Score.

### 2. Live Complaint Tracking
1. Switch to the **Track Complaint** tab.
2. Enter the generated Tracking ID (or use a seeded sample like `CMP-20261026-A101`).
3. Observe the progress timeline (`Report Ingested` $\rightarrow$ `AI Verified` $\rightarrow$ `Route Assigned` $\rightarrow$ `Resolved`), photo preview, and priority badge.

### 3. Municipal Operations Dashboard & Triage
1. Navigate to **Admin Dashboard**.
2. Click **Admin Login** in the navbar:
   * **Email:** `admin@ecoroute.local`
   * **Password:** `AdminSecurePass123!`
3. Review the KPI cards: Total Complaints, Pending, Resolved, and Active Hotspot Zones.
4. Review the high-density Hotspot Clusters (complaints within 250m proximity).
5. Change a complaint status dropdown (e.g., `PENDING` $\rightarrow$ `ASSIGNED` or `RESOLVED`).
6. Click the pencil icon next to an AI category to demonstrate the **Human-in-the-Loop Override** mechanism.

### 4. Collection Route Optimization (Google OR-Tools)
1. In the Admin Dashboard or directly in the **Route Optimizer** tab:
2. Select 4 to 6 active waste waypoints.
3. Click **"Execute OR-Tools Route Solver"**.
4. Observe the results:
   * **Baseline (Unoptimized) Distance** vs. **Optimized (OR-Tools) Distance** in kilometers.
   * **Total Route Reduction Percentage** badge:
     $$\text{Route Reduction (\%)} = \left(\frac{\text{Baseline} - \text{Optimized}}{\text{Baseline}}\right) \times 100$$
   * **Estimated Diesel Savings (L)**.
   * Interactive **Leaflet Map** rendering the Central Depot marker, numbered stop sequence markers, and the optimal polyline loop.
   * **Turn-by-Turn Manifest Table** for collection vehicle drivers.

---

## 7. AWS Cloud Deployment Procedure

When preparing for cloud deployment on Amazon Web Services:
1. Review the complete deployment guide in [EcoRoute_AI_Project_Documentation.md](file:///c:/Users/Manjunath/OneDrive/Desktop/smart%20waste%20prj/EcoRoute_AI_Project_Documentation.md) (Section 25).
2. Follow the interactive checklist in [aws/deploy_checklist.md](file:///c:/Users/Manjunath/OneDrive/Desktop/smart%20waste%20prj/aws/deploy_checklist.md).
3. In AWS, set `STORAGE_BACKEND=s3` and `DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/ecoroutedb` in your `.env` configuration.
4. Auto-scale compute capacity using the provided Launch Template bootstrap script in [aws/user_data.sh](file:///c:/Users/Manjunath/OneDrive/Desktop/smart%20waste%20prj/aws/user_data.sh).
5. Stream metrics to CloudWatch using [aws/cloudwatch-agent-config.json](file:///c:/Users/Manjunath/OneDrive/Desktop/smart%20waste%20prj/aws/cloudwatch-agent-config.json).

---

## 8. License & Academic Attribution
Developed for the **ABA for Cloud** assignment. Aligned with the United Nations Sustainable Development Goals (SDG 11).
