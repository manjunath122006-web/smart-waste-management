# EcoRoute AI: A Scalable Cloud-Based Smart Waste Management and Collection Optimization System

---

## Academic Engineering Project Documentation & Implementation Plan
**Course / Assignment:** ABA for Cloud — Design and Deployment of a Scalable Web Application on Cloud  
**Target Cloud Platform:** Amazon Web Services (AWS)  
**Sustainable Development Goal (SDG):** SDG 11 — Sustainable Cities and Communities  
**Primary SDG Target:** 11.6 — Reduce the adverse environmental impact of cities, including through improved municipal waste management  
**Secondary SDG Target:** 11.3 — Inclusive and sustainable urbanization and participatory, integrated planning  

---

## 1. Project Title
**EcoRoute AI: A Scalable Cloud-Based Smart Waste Management and Collection Optimization System**

---

## 2. Abstract
Rapid urban population growth has intensified municipal solid waste generation, overwhelming conventional waste collection routines that rely on fixed schedules and static routes. This operational mismatch leads to unattended overflowing dumpsters, public health hazards, excessive fuel consumption, and greenhouse gas emissions. 

**EcoRoute AI** addresses these challenges by delivering a scalable, cloud-native web application that bridges municipal authorities and citizens. Built on Amazon Web Services (AWS), the platform provides:
1. A responsive Citizen Complaint Portal where residents report waste issues with photos, descriptions, and geolocation.
2. An AI-assisted image classification pipeline utilizing transfer learning (MobileNetV2) to identify waste types (overflowing bin, mixed waste, recyclable waste, other) with human-in-the-loop verification.
3. A multi-factor dynamic prioritization engine ranking complaints by severity, waiting time, and spatial clustering.
4. An automated collection route optimization engine powered by Google OR-Tools that computes optimal pickup sequences to minimize travel distance and operational latency.
5. An enterprise-grade cloud architecture leveraging Amazon EC2 Auto Scaling, an Application Load Balancer (ALB), Amazon RDS for PostgreSQL, Amazon S3 for image persistence, and Amazon CloudWatch for telemetry and alerting.

This project delivers a resilient prototype aligning directly with United Nations Sustainable Development Goal 11 (Target 11.6 and Target 11.3), demonstrating cloud elasticity, high availability, cost efficiency, and automated municipal operations.

---

## 3. Keywords
Cloud Computing, Amazon Web Services (AWS), EC2 Auto Scaling, Application Load Balancer, Amazon RDS, Amazon S3, Amazon CloudWatch, Smart Waste Management, Route Optimization, Google OR-Tools, Transfer Learning, MobileNetV2, SDG 11, Sustainable Cities.

---

## 4. Introduction
Urban waste management is one of the most critical municipal infrastructure challenges in modern developing and industrialized economies. In traditional municipal workflows, collection trucks patrol predetermined routes irrespective of whether waste bins are empty, partially filled, or critically overflowing. Concurrently, citizens lack transparent mechanisms to report localized waste accumulation, while municipal managers lack real-time spatial intelligence to deploy resources dynamically.

Cloud computing provides the elastic compute, distributed storage, and automated operational monitoring required to transform this paradigm. By migrating municipal waste management workflows to Amazon Web Services (AWS), local governments can ingest irregular, bursty citizen traffic (e.g., following storms or public festivals) without paying for idle over-provisioned infrastructure during off-peak hours.

**EcoRoute AI** integrates computer vision, combinatorial mathematical optimization, and modern cloud architecture into a unified, accessible engineering prototype.

---

## 5. Background and Motivation
Municipal corporations dedicate up to 40–50% of their operational municipal budgets to solid waste management, with vehicular logistics (fuel, maintenance, crew hours) accounting for 70–80% of collection costs. Inefficient route planning squanders municipal budgets and contributes to urban carbon footprints and localized air pollution.

Moreover, unmanaged municipal waste accumulates toxic leachates, attracts disease vectors (rodents, mosquitoes), and clogs drainage networks, exacerbating urban flash floods. The motivation behind EcoRoute AI is threefold:
- **Citizen Empowerment:** Providing an accessible interface that democratizes urban environmental monitoring.
- **Resource Optimization:** Replacing heuristic-based truck dispatching with algorithmic routing that cuts mileage and carbon emissions.
- **Architectural Rigor:** Applying core cloud principles—elastic scalability, decoupled storage, managed relational persistence, automated health checks, and defense-in-depth security—within a realistic academic engineering project.

---

## 6. Problem Statement
Contemporary urban waste management ecosystems suffer from four core operational bottlenecks:
1. **Lack of Citizen Reporting Infrastructure:** Absence of a centralized, accessible platform for citizens to report localized waste crises with verifiable geographic and visual evidence.
2. **Subjective and Unverified Incident Categorization:** Manual triage of reports without automated classification, causing delays in identifying hazardous or overflowing waste.
3. **Static and Inefficient Collection Routing:** Waste trucks operate on static circular routes, leading to unnecessary travel past empty bins while overflowing bins remain unattended.
4. **Fragile and Inflexible Infrastructure:** On-premise or unmanaged single-server hosting solutions fail under variable load, lack automated scaling, and provide minimal operational observability.

---

## 7. Need for the Project
There is an urgent requirement for an integrated, cloud-native system that:
- Ingests citizen incident reports asynchronously without service degradation.
- Applies lightweight edge/cloud artificial intelligence to validate and triage image submissions.
- Formulates collection logistics as an algorithmic Traveling Salesperson Problem (TSP) / Vehicle Routing Problem (VRP) to optimize vehicle dispatching.
- Operates on a secure, elastic cloud infrastructure that dynamically scales compute capacity in response to incoming HTTP request spikes while tracking operational telemetry via CloudWatch.

---

## 8. Aim and Objectives
### Aim
To design, implement, deploy, and evaluate **EcoRoute AI**, a resilient, scalable, cloud-based smart waste management and collection optimization web application hosted on Amazon Web Services (AWS).

### Specific Objectives
1. **Citizen Portal:** Develop a responsive web interface allowing citizens to submit waste complaints with descriptions, geolocation tags, and photographic evidence.
2. **AI Classification:** Implement a deep learning transfer-learning model (MobileNetV2) using Python to classify uploaded waste images into discrete operational categories with confidence scoring and manual override capabilities.
3. **Dynamic Prioritization:** Implement a configurable multi-factor prioritization engine that ranks complaints based on reported severity, waiting duration, and localized geographic density (hotspots).
4. **Route Optimization:** Develop a route planning module using Google OR-Tools to solve the collection routing sequence, comparing optimized paths against baseline unoptimized routes.
5. **Cloud Infrastructure:** Architect and deploy the backend and frontend on AWS utilizing an elastic, decoupled architecture.
6. **Traffic Distribution and Scaling:** Configure an Application Load Balancer (ALB) and an EC2 Auto Scaling Group (ASG) with target tracking policies.
7. **Decoupled Data Persistence:** Implement Amazon RDS for PostgreSQL to store structured relational data and Amazon S3 for durable, secure object storage of images.
8. **Operational Telemetry:** Establish unified infrastructure monitoring, custom application logging, dashboards, and automated alarms using Amazon CloudWatch.
9. **Rigorous Evaluation:** Quantitatively evaluate functional performance, AI classification metrics (Precision, Recall, F1-Score), route distance reduction, and infrastructure response under load testing.
10. **Sustainable Impact:** Formulate and document the system's contribution toward UN Sustainable Development Goal 11 (Targets 11.6 and 11.3).

---

## 9. Scope of the Project
### In-Scope (Functional Deliverables)
- Citizen-facing responsive reporting interface with browser geolocation.
- Administrative dashboard with Leaflet map visualization, hotspot clustering, and triage controls.
- Server-side RESTful API built with Python FastAPI.
- Computer vision classification module supporting 4 distinct waste classes.
- Single-depot multi-stop route optimization using Google OR-Tools.
- Fully automated AWS deployment: VPC, Public/Private Subnets, ALB, EC2 Auto Scaling Group, RDS PostgreSQL, S3 Bucket, CloudWatch Alarms.
- Comprehensive load testing and elasticity demonstration using synthetic HTTP load generators.

### Out-of-Scope (Boundaries of Student Prototype)
- Real-time IoT ultrasonic fill-level sensor hardware deployment inside physical city bins.
- Multi-depot fleet management with real-time GPS hardware integration on moving municipal trucks.
- Native mobile applications (iOS/Android) published to app stores (the web portal is mobile-responsive).
- Commercial payment gateways or municipal fine-collection subsystems.
- Live traffic API licensing fees (distance calculation uses haversine matrices and standard algorithmic approximations).

---

## 10. Existing System and Its Limitations

| Dimension | Existing / Traditional System | EcoRoute AI (Proposed System) |
| :--- | :--- | :--- |
| **Reporting Channel** | Phone calls, physical municipal office visits, or paper registers | 24/7 Web portal with geolocation and photographic verification |
| **Verification** | Requires physical dispatch of an inspector to verify severity | Automated AI classification with immediate confidence score and supervisor preview |
| **Prioritization** | First-Come-First-Served (FCFS) or subjective manual triage | Algorithmic scoring based on waiting time, severity, and spatial hotspot density |
| **Route Planning** | Fixed static loops followed by truck drivers regardless of bin fullness | Dynamic route generation via Google OR-Tools minimizing total kilometers traveled |
| **Infrastructure** | Single on-premise server or shared virtual hosting without redundancy | AWS Multi-AZ architecture, ALB traffic distribution, and EC2 Auto Scaling |
| **Storage Architecture**| Local server disk storage for images and database (single point of failure) | Decoupled Amazon S3 for images and Amazon RDS PostgreSQL with automated backups |
| **System Observability**| Reactive logging checked only after application crashes | Amazon CloudWatch metrics, real-time log ingestion, dashboards, and automated alarms |

---

## 11. Proposed System
EcoRoute AI replaces static, disjointed municipal waste workflows with a reactive, closed-loop cloud platform:

```
[ Citizen ] ──(Submit Report with Photo & GPS)──> [ EcoRoute AI Web App ]
                                                         │
                                                         ▼
                                            [ FastAPI Backend Engine ]
                                            ├── AI Classification (MobileNetV2)
                                            ├── Dynamic Priority Scoring
                                            └── Route Optimization (OR-Tools)
                                                         │
                                                         ▼
                                            [ AWS Elastic Infrastructure ]
                                            ├── ALB + Auto Scaling EC2
                                            ├── RDS PostgreSQL + Amazon S3
                                            └── CloudWatch Observability
                                                         │
                                                         ▼
[ Municipal Dispatcher / Collection Crew ] <──(Optimized Route & Prioritized Dashboard)
```

The system ingests reports, validates images, stores metadata, computes priority indexes, and calculates optimized travel paths for municipal waste collection vehicles, while automatically scaling its cloud compute resources up and down based on network demand.

---

## 12. Literature Survey

1. **Al-Masri et al. (2020) — "A Cloud-Based Smart Waste Management System"**  
   *Contribution:* Proposed an IoT and cloud-integrated architecture for bin monitoring.  
   *Limitation Addressed by EcoRoute AI:* Relied solely on expensive hardware sensors in every container; EcoRoute AI incorporates crowd-sourced citizen reporting with AI visual verification to reduce capital expenditure.
2. **Gupta et al. (2021) — "Deep Learning for Waste Categorization in Urban Environments"**  
   *Contribution:* Evaluated deep convolutional neural networks (CNNs) for classifying municipal recyclables and mixed garbage.  
   *Application:* Guides EcoRoute AI’s transfer learning pipeline (MobileNetV2), which delivers high classification accuracy with low compute overhead suitable for cloud micro-instances.
3. **Braier et al. (2018) — "Electric Vehicle Routing Problem with Time Windows and Battery Swapping Stations" / Google OR-Tools Routing Library Documentation**  
   *Contribution:* Demonstrated combinatorial optimization algorithms (Guided Local Search and Tabu Search) for vehicle logistics.  
   *Application:* EcoRoute AI leverages Google OR-Tools’ constraint programming engine to solve the Traveling Salesperson Problem (TSP) across municipal waste collection waypoints.
4. **AWS Whitepapers (2022) — "Architecting for the Cloud: AWS Best Practices" & "Reliability Pillar — AWS Well-Architected Framework"**  
   *Contribution:* Details patterns for horizontal scaling, stateless compute tiers, database isolation, and distributed monitoring.  
   *Application:* Forms the architectural foundation for EcoRoute AI’s decoupled compute, storage, load-balancing, and auto-scaling tiers.

---

## 13. System Requirements

### User Characteristics
- **Citizens:** Non-technical urban residents seeking an intuitive, mobile-friendly interface to report waste issues quickly with minimal data entry.
- **Municipal Administrators & Supervisors:** Technical or semi-technical municipal staff monitoring dashboards, verifying triage flags, and reassigning priority weights.
- **Collection Vehicle Drivers / Crews:** Field operators receiving generated route sequences, turn-by-turn waypoint lists, and marking complaints as "Resolved."

### System Constraints
- Stateless backend compute instances to allow seamless horizontal scaling by AWS Auto Scaling.
- Image uploads capped at 5 MB to prevent buffer overflow and excessive network saturation.
- Client browser must support HTML5 Geolocation API.

---

## 14. Hardware and Software Requirements

### Development Environment
- **Local Machine:** Intel Core i5 / AMD Ryzen 5 processor or higher, 8 GB RAM minimum (16 GB recommended), 20 GB free disk space.
- **Operating System:** Windows 10/11, macOS, or Ubuntu Linux 22.04 LTS.
- **Local Runtime:** Node.js v18+, Python 3.10+, Git 2.38+.

### Cloud Production Infrastructure (AWS)
- **Compute:** Amazon EC2 `t3.micro` or `t3.small` instances (2 vCPU, 1–2 GiB RAM) running Ubuntu 22.04 LTS.
- **Load Balancer:** AWS Application Load Balancer (ALB), Internet-facing, dual-AZ.
- **Database:** Amazon RDS for PostgreSQL `db.t3.micro` (Single-AZ for student cost management, 20 GB GP2 SSD).
- **Storage:** Amazon S3 Standard for image assets.
- **Monitoring:** Amazon CloudWatch (Basic Metrics + CloudWatch Agent).

---

## 15. Technology Stack and Justification

```
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND TIER                         │
│   React (Single Page App)  •  Vanilla CSS  •  Leaflet.js    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / HTTPS (REST API)
┌──────────────────────────────▼──────────────────────────────┐
│                        BACKEND TIER                         │
│  FastAPI (Python 3.10)  •  Pydantic  •  Uvicorn (ASGI)     │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐┌──────────────▼──────────────┐
│         AI ENGINE           ││     OPTIMIZATION ENGINE     │
│  MobileNetV2 (PyTorch/TF)   ││       Google OR-Tools       │
└─────────────────────────────┘└─────────────────────────────┘
               │                              │
┌──────────────▼──────────────┐┌──────────────▼──────────────┐
│       IMAGE PERSISTENCE     ││      RELATIONAL DATA        │
│       Amazon S3 Object      ││   Amazon RDS (PostgreSQL)   │
└─────────────────────────────┘└─────────────────────────────┘
```

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | React (JavaScript, HTML5, Vanilla CSS) | Declarative component architecture; lightweight, fast virtual DOM rendering without bulky external component frameworks; high responsiveness on mobile browsers. |
| **Mapping** | Leaflet.js | Lightweight open-source mapping engine; zero-cost tile integration via OpenStreetMap; straightforward GeoJSON waypoint rendering. |
| **Backend API** | FastAPI (Python) | High-performance asynchronous REST API framework; built-in request validation using Pydantic; automatic OpenAPI (Swagger) documentation generation; native Python ecosystem integration for AI and optimization. |
| **AI Classifier** | MobileNetV2 (Transfer Learning) | Optimized depthwise separable convolutions offer low latency inference (~50–120ms on CPU) and compact parameter size (~14MB), ideal for execution inside standard EC2 instances. |
| **Route Optimizer**| Google OR-Tools | Industrial-grade combinatorial optimization library; robust native solver for Traveling Salesperson Problem (TSP) and Vehicle Routing Problem (VRP); fast convergence. |
| **Database** | Amazon RDS (PostgreSQL) | Managed ACID-compliant relational database; automated automated backups; native spatial point storage support; zero database maintenance overhead. |
| **Object Store** | Amazon S3 | Highly durable (99.999999999%), scalable object storage; decouples binary image blobs from relational tables; supports presigned URLs for secure access. |
| **Compute & Scale**| Amazon EC2 + Auto Scaling Group | Elastic horizontal scaling responding to traffic fluctuations; pay-as-you-go provisioning. |
| **Traffic Mgmt** | Application Load Balancer (ALB)| Layer-7 routing; automatic health-check probing; SSL termination capability; seamless integration with Auto Scaling target groups. |
| **Observability**| Amazon CloudWatch | Unified system telemetry (CPUUtilization, RequestCount, Latency); custom alarm thresholds and automated SNS alerting. |

---

## 16. System Architecture Diagram

```mermaid
flowchart TD
    subgraph Clients["Clients Tier"]
        C1["Citizen (Mobile / Desktop Web)"]
        C2["Municipal Officer (Admin Portal)"]
    end

    subgraph AWS_Cloud["Amazon Web Services (AWS) Cloud"]
        subgraph Edge_Security["Edge & Traffic Distribution Tier"]
            WAF["AWS WAF (Optional Web Shield)"]
            CF["Amazon CloudFront (Optional CDN)"]
            ALB["Application Load Balancer (Internet-Facing)"]
        end

        subgraph VPC["Custom Amazon VPC (10.0.0.0/16)"]
            subgraph Public_Subnets["Public Subnets (AZ-a / AZ-b)"]
                NAT["NAT Gateway (Optional for private egress)"]
                ALB_Nodes["ALB Public Endpoints"]
            end

            subgraph ASG_Compute["EC2 Auto Scaling Group (Stateless App Tier)"]
                EC2_1["EC2 Instance 1\n(FastAPI + MobileNetV2 + OR-Tools)"]
                EC2_2["EC2 Instance 2\n(FastAPI + MobileNetV2 + OR-Tools)"]
                EC2_N["EC2 Instance N\n(Auto-Scaled on Demand)"]
            end

            subgraph Private_Data["Isolated Private Database Subnets"]
                RDS[("Amazon RDS\nPostgreSQL\n(Master DB)")]
            end
        end

        subgraph Cloud_Managed_Services["Managed Cloud Storage & Observability"]
            S3[("Amazon S3 Bucket\n(Waste Complaint Photos)")]
            CW["Amazon CloudWatch\n(Metrics, Alarms, Logs, Dashboards)"]
            SNS["Amazon SNS\n(Admin Alert Topic)"]
        end
    end

    C1 -->|HTTPS POST Complaint| CF
    C2 -->|HTTPS GET Dashboard| CF
    CF --> WAF
    WAF --> ALB
    ALB -->|Round-Robin HTTP:8000| ASG_Compute
    
    ASG_Compute -->|PutObject / GetObject| S3
    ASG_Compute -->|TCP 5432 SQL Queries| RDS
    ASG_Compute -.->|Push Logs & Custom Metrics| CW
    
    CW -->|Threshold Breach Alarm| SNS
    CW -.->|Trigger Scale-Out / Scale-In| ASG_Compute
```

---

## 17. Explanation of Architecture Components

1. **Client Tier:**
   Citizens and administrative supervisors access the application via modern standards-compliant web browsers over HTTP/HTTPS. The single-page React application communicates with backend services exclusively through asynchronous JSON REST APIs.
2. **Edge & Traffic Distribution (ALB & Optional CloudFront/WAF):**
   - The Application Load Balancer (ALB) operates at Layer 7 of the OSI model across two Availability Zones (AZs) for high availability.
   - It performs active health checking (`GET /health`) against target instances at 15-second intervals. Unhealthy instances are automatically detached from the routing pool.
   - CloudFront and AWS WAF serve as optional perimeter security enhancements to cache static assets at edge locations and mitigate basic DDoS or SQL injection vulnerabilities.
3. **Compute Tier (EC2 Auto Scaling Group):**
   - Stateless compute instances running Ubuntu Linux with Python FastAPI and Uvicorn ASGI servers.
   - The Auto Scaling Group dynamically adjusts the running instance count between a configured minimum (e.g., 1 instance) and maximum (e.g., 4 instances) in response to real-time traffic demand (e.g., Target Tracking on ALB Request Count or average CPU utilization > 60%).
4. **Data Persistence Tier (Decoupled S3 and RDS):**
   - **Amazon S3:** Photographic evidence submitted by citizens is directly persisted in a dedicated S3 bucket with private ACLs. The database stores only the immutable S3 Object Key / URL.
   - **Amazon RDS for PostgreSQL:** Managed relational database hosted in isolated private subnets inaccessible from the public internet. Security group rules allow inbound traffic on port 5432 only from the EC2 security group.
5. **Observability and Management (Amazon CloudWatch & SNS):**
   - Monitors CPU utilization, memory consumption, disk I/O, network traffic, and HTTP target response latency.
   - CloudWatch Alarms notify administrators via Amazon SNS email topics when metrics exceed predetermined operational thresholds.

---

## 18. Data Flow and Application Workflow

### Complete Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Citizen
    participant Browser as React Web App
    participant ALB as Application Load Balancer
    participant EC2 as FastAPI (EC2 ASG)
    participant AI as MobileNetV2 Inference
    participant S3 as Amazon S3 Bucket
    participant RDS as Amazon RDS PostgreSQL
    actor Admin as Municipal Dispatcher
    participant OR as Google OR-Tools

    %% Citizen Submission Flow
    Citizen->>Browser: Fill description, capture photo, provide GPS
    Browser->>ALB: POST /api/v1/complaints (Multipart Form)
    ALB->>EC2: Route to healthy EC2 instance
    EC2->>AI: Predict category from image buffer
    AI-->>EC2: Return class ("overflowing_bin") & confidence (0.92)
    EC2->>S3: PutObject(photo_binary, key="complaints/{id}.jpg")
    S3-->>EC2: S3 Object URI confirmed
    EC2->>EC2: Calculate Initial Priority Score
    EC2->>RDS: INSERT INTO complaints (...) VALUES (...)
    RDS-->>EC2: Transaction committed (ID: "CMP-84920")
    EC2-->>Browser: 201 Created (ID, AI Prediction, Priority)
    Browser-->>Citizen: Display Confirmation & Tracking ID

    %% Admin & Route Optimization Flow
    Admin->>Browser: Access Admin Dashboard
    Browser->>ALB: GET /api/v1/complaints?status=PENDING
    ALB->>EC2: Forward request
    EC2->>RDS: SELECT * FROM complaints WHERE status='PENDING'
    RDS-->>EC2: Return complaint records
    EC2-->>Browser: JSON payload with geolocations
    Browser-->>Admin: Render Hotspot Map & Triage Table

    Admin->>Browser: Click "Optimize Collection Route"
    Browser->>ALB: POST /api/v1/routes/optimize (complaint_ids=[...])
    ALB->>EC2: Forward request
    EC2->>OR: Pass Waypoint Coordinates + Distance Matrix
    OR->>OR: Solve TSP using Guided Local Search
    OR-->>EC2: Return optimal waypoint sequence & total distance
    EC2->>RDS: INSERT INTO collection_routes (...)
    EC2-->>Browser: Return optimized route GeoJSON & route reduction %
    Browser-->>Admin: Display turn-by-turn map overlay & metric comparison
```

---

## 19. Database Schema and Relationships

### Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ COMPLAINTS : "reports / reviews"
    WASTE_CATEGORIES ||--o{ COMPLAINTS : "classifies"
    COLLECTION_ROUTES ||--|{ ROUTE_STOPS : "contains"
    COMPLAINTS ||--o{ ROUTE_STOPS : "included_in"

    USERS {
        uuid id PK
        varchar email
        varchar role
        varchar full_name
        timestamp created_at
    }

    WASTE_CATEGORIES {
        int id PK
        varchar code
        varchar display_name
        int default_severity
    }

    COMPLAINTS {
        uuid id PK
        varchar tracking_number UK
        varchar description
        decimal latitude
        decimal longitude
        varchar image_s3_key
        int category_id FK
        varchar predicted_category
        decimal confidence_score
        boolean is_user_overridden
        int severity_level
        decimal priority_score
        varchar status
        uuid reported_by FK
        timestamp created_at
        timestamp resolved_at
    }

    COLLECTION_ROUTES {
        uuid id PK
        varchar route_name
        varchar status
        decimal total_baseline_distance_km
        decimal total_optimized_distance_km
        decimal distance_reduction_percent
        uuid assigned_driver_id FK
        timestamp created_at
    }

    ROUTE_STOPS {
        uuid id PK
        uuid route_id FK
        uuid complaint_id FK
        int stop_sequence
        varchar stop_status
        timestamp completed_at
    }
```

### Relational Schema Definition (PostgreSQL DDL)

```sql
-- 1. Waste Categories Lookup Table
CREATE TABLE waste_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    default_severity INT NOT NULL CHECK (default_severity BETWEEN 1 AND 5)
);

INSERT INTO waste_categories (code, display_name, default_severity) VALUES
('overflowing_bin', 'Overflowing Garbage Bin', 5),
('mixed_waste', 'Mixed Unsorted Waste Pile', 4),
('recyclable_waste', 'Accumulated Recyclables (Plastic/Paper)', 2),
('other', 'General Waste / Debris', 1);

-- 2. Complaints Table
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_number VARCHAR(20) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    image_s3_key VARCHAR(512) NOT NULL,
    image_url TEXT NOT NULL,
    category_id INT REFERENCES waste_categories(id),
    predicted_category VARCHAR(50) NOT NULL,
    confidence_score NUMERIC(5, 4) NOT NULL,
    is_user_overridden BOOLEAN DEFAULT FALSE,
    severity_level INT NOT NULL CHECK (severity_level BETWEEN 1 AND 5),
    priority_score NUMERIC(7, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' 
        CHECK (status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 3. Collection Routes Table
CREATE TABLE collection_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_name VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'GENERATED' CHECK (status IN ('GENERATED', 'IN_TRANSIT', 'COMPLETED')),
    depot_latitude NUMERIC(9, 6) NOT NULL,
    depot_longitude NUMERIC(9, 6) NOT NULL,
    total_baseline_distance_km NUMERIC(8, 2) NOT NULL,
    total_optimized_distance_km NUMERIC(8, 2) NOT NULL,
    distance_reduction_percent NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Route Stops Mapping Table
CREATE TABLE route_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID NOT NULL REFERENCES collection_routes(id) ON DELETE CASCADE,
    complaint_id UUID NOT NULL REFERENCES complaints(id),
    stop_sequence INT NOT NULL,
    stop_status VARCHAR(20) DEFAULT 'PENDING' CHECK (stop_status IN ('PENDING', 'VISITED', 'SKIPPED')),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create spatial/operational indices
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_priority ON complaints(priority_score DESC);
CREATE INDEX idx_complaints_coords ON complaints(latitude, longitude);
```

---

## 20. Functional Requirements

- **FR-1 (Citizen Report Ingestion):** The system shall enable unauthenticated or authenticated citizens to submit a waste complaint with description, photograph, and GPS coordinates.
- **FR-2 (Tracking ID Generation):** The system shall generate a collision-free, human-readable complaint identifier (e.g., `CMP-YYYYMMDD-XXXX`) upon successful submission.
- **FR-3 (Status Query):** The system shall allow citizens to track complaint status (`PENDING`, `ASSIGNED`, `RESOLVED`) using their unique tracking ID.
- **FR-4 (AI Waste Categorization):** The system shall automatically process uploaded waste photos through a deep learning model to predict waste categories with confidence scores between 0.0 and 1.0.
- **FR-5 (Human-in-the-Loop Override):** The citizen or supervisor shall have the ability to override the AI-predicted category if misclassified.
- **FR-6 (Multi-Factor Priority Computation):** The system shall calculate a numeric Priority Index for each complaint based on severity, age, and localized hotspot clustering.
- **FR-7 (Spatial Hotspot Visualizer):** The admin portal shall display pending complaints on an interactive Leaflet map, visually clustering complaints within a 200-meter radius.
- **FR-8 (Distance Matrix Generation):** The system shall compute an all-pairs distance matrix among the depot and selected complaint locations using the Haversine spherical distance formula.
- **FR-9 (Route Optimization):** The system shall utilize Google OR-Tools to solve the Traveling Salesperson Problem (TSP) for selected complaints, returning the optimal visit sequence.
- **FR-10 (Route Comparison Metric):** The system shall compute and display the distance reduction percentage between the baseline (chronological submission order) and the optimized route.
- **FR-11 (Admin Dashboard Analytics):** The admin portal shall aggregate total reports, pending/resolved counts, average resolution turnaround, and category breakdown.
- **FR-12 (Health Check Endpoint):** The backend shall expose an unauthenticated `GET /health` endpoint returning HTTP 200 and database/S3 connectivity status for ALB health checks.

---

## 21. Non-Functional Requirements

- **NFR-1 (Availability):** The application shall maintain 99.5% uptime during evaluation by deploying instances across multiple Availability Zones behind an Application Load Balancer.
- **NFR-2 (Elastic Scalability):** The EC2 Auto Scaling Group shall automatically adjust instance capacity from 1 to 4 instances when sustained CPU load exceeds 60% or when request count surges.
- **NFR-3 (Response Latency):** The backend API shall process standard CRUD requests with a 95th percentile latency (p95) under 300 ms (excluding cold-start model initializations).
- **NFR-4 (Security & Data Isolation):** The PostgreSQL database shall reside in a private subnet with no public IPv4 address, accepting connections strictly on port 5432 from the EC2 security group.
- **NFR-5 (Storage Durability):** Photographic evidence shall be stored in Amazon S3, ensuring 99.999999999% (11 9s) object durability.
- **NFR-6 (Usability):** The citizen interface shall be fully responsive across mobile, tablet, and desktop screens with a maximum initial page bundle size under 2.5 MB.
- **NFR-7 (Observability):** Infrastructure metrics, access logs, and application exceptions shall be continuously streamed to Amazon CloudWatch with automated alarm triggers.

---

## 22. AI Image Classification Methodology

### Taxonomy & Target Classes
The computer vision subsystem classifies submitted photographs into four mutually exclusive operational categories:
1. `overflowing_bin`: Refuse spilling outside container onto pedestrian walkways (High Severity = 5).
2. `mixed_waste`: Open dumps or unsegregated municipal trash piles (Medium-High Severity = 4).
3. `recyclable_waste`: Segregated dry plastics, cardboard, or cans (Medium Severity = 2).
4. `other`: Obscure waste or irrelevant objects requiring manual review (Low Severity = 1).

### Model Selection & Transfer Learning
To balance classification performance with low computational overhead on standard cloud instances (e.g., `t3.micro`/`t3.small` without dedicated GPUs), **MobileNetV2** is selected.

```
[ Input: 224x224x3 Image ]
           │
           ▼
[ MobileNetV2 Base (Pretrained on ImageNet) ] ── (Inverted Residual Blocks, Frozen)
           │
           ▼
[ Global Average Pooling 2D ]
           │
           ▼
[ Dense Layer (128 units, ReLU, Dropout 0.3) ]
           │
           ▼
[ Dense Output Layer (4 units, Softmax) ] ──> [ Class Probabilities ]
```

### Preprocessing and Inference Pipeline
1. **Normalization:** Input images are resized to $224 \times 224$ pixels and normalized using ImageNet channel statistics:
   $$\mu = [0.485, 0.456, 0.406], \quad \sigma = [0.229, 0.224, 0.225]$$
2. **Inference Execution:** The forward pass computes logit outputs:
   $$z = \text{Model}(x)$$
3. **Softmax Output:** Class probabilities are obtained via:
   $$P(y = c \mid x) = \frac{e^{z_c}}{\sum_{j=1}^{4} e^{z_j}}$$
4. **Prediction Assignment:**
   $$\hat{c} = \arg\max_{c} P(y = c \mid x), \quad \text{Confidence} = \max_c P(y = c \mid x)$$
5. **Confidence Thresholding:** If $\text{Confidence} < 0.60$, the system flags the prediction as `UNSURE` and prompts the user for manual confirmation.

---

## 23. Complaint Prioritization Methodology

Complaints cannot be effectively addressed on a purely first-come-first-served (FCFS) basis. An overflowing bin attracting pests in a dense residential sector requires more immediate remediation than dry paper litter in a low-traffic park.

### Prioritization Formula
EcoRoute AI employs a normalized linear scoring algorithm:

$$\text{Priority Score } (P) = (w_1 \cdot S_{\text{norm}}) + (w_2 \cdot T_{\text{norm}}) + (w_3 \cdot H_{\text{norm}})$$

Where:
- $S_{\text{norm}} \in [0, 1]$: **Severity Factor**, derived from the verified waste category:
  $$S_{\text{norm}} = \frac{\text{Severity Level}}{5.0}$$
- $T_{\text{norm}} \in [0, 1]$: **Waiting Time Factor**, penalizing aging unattended complaints:
  $$T_{\text{norm}} = \min\left(1.0, \frac{\text{Hours Elapsed since Submission}}{72.0}\right)$$
- $H_{\text{norm}} \in [0, 1]$: **Hotspot Density Factor**, accounting for spatial clustering:
  $$H_{\text{norm}} = \min\left(1.0, \frac{\text{Count of Neighboring Complaints within } 200\text{m}}{5.0}\right)$$
- $w_1, w_2, w_3$: Configurable municipal weights satisfying:
  $$w_1 + w_2 + w_3 = 1.0 \quad (\text{Default: } w_1 = 0.50, w_2 = 0.30, w_3 = 0.20)$$

### Scaled Output
The composite score is multiplied by 100 to yield a clean scale:
$$P_{\text{final}} = P \times 100 \in [0, 100]$$

Complaints with $P_{\text{final}} \ge 75$ are highlighted in **Red (Critical)**, $50 \le P_{\text{final}} < 75$ in **Amber (Moderate)**, and $< 50$ in **Green (Standard)** on the municipal supervisor’s dashboard.

---

## 24. Route Optimization Methodology

### Problem Formulation
The waste collection logistics problem is formulated as a single-depot **Traveling Salesperson Problem (TSP)** with coordinates representing the municipal depot $D$ and a set of $n$ assigned complaint pickup locations $C = \{c_1, c_2, \dots, c_n\}$.

The objective is to find a permutation $\pi$ of stops that minimizes total round-trip distance starting and ending at depot $D$:

$$\min \sum_{i=0}^{n} d(\pi(i), \pi(i+1)) \quad \text{where } \pi(0) = \pi(n+1) = D$$

### Distance Matrix Calculation
For prototype implementation without requiring costly third-party commercial routing APIs, the pairwise distance $d(u, v)$ between two coordinates $(\text{lat}_1, \text{lon}_1)$ and $(\text{lat}_2, \text{lon}_2)$ is computed using the **Haversine Formula**:

$$\Delta\phi = \text{lat}_2 - \text{lat}_1, \quad \Delta\lambda = \text{lon}_2 - \text{lon}_1$$
$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
$$d(u, v) = R \cdot c \quad (\text{where } R = 6371.0 \text{ km})$$

### Solving with Google OR-Tools
Google OR-Tools provides a constraint solver using **Guided Local Search (GLS)**:
1. An index manager creates the node-to-index mapping: `RoutingIndexManager(num_nodes, num_vehicles=1, depot=0)`.
2. A transit callback registers distance evaluation: `routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)`.
3. Search parameters are configured:
   - First solution strategy: `PATH_CHEAPEST_ARC`.
   - Metaheuristic: `GUIDED_LOCAL_SEARCH`.
   - Time limit: 5 seconds.

### Route Reduction Evaluation Formula
To quantitatively evaluate algorithmic optimization against the baseline chronological sequence (visiting complaints in order of submission timestamp), the **Route Reduction Percentage** is calculated:

$$\text{Route Reduction (\%)} = \left(\frac{\text{Baseline Distance} - \text{Optimized Distance}}{\text{Baseline Distance}}\right) \times 100$$

---

## 25. AWS Deployment Procedure

```
                     VPC: 10.0.0.0/16
  ┌─────────────────────────────────────────────────────┐
  │ Public Subnet (10.0.1.0/24)  [AZ-a]                 │
  │  ├── Internet Gateway (IGW)                         │
  │  └── ALB Public Interface                           │
  ├─────────────────────────────────────────────────────┤
  │ Public Subnet (10.0.2.0/24)  [AZ-b]                 │
  │  └── ALB Public Interface                           │
  ├─────────────────────────────────────────────────────┤
  │ Compute Subnet (10.0.10.0/24) [AZ-a]                │
  │  └── EC2 Auto Scaling Instances (Port 8000)         │
  ├─────────────────────────────────────────────────────┤
  │ Compute Subnet (10.0.20.0/24) [AZ-b]                │
  │  └── EC2 Auto Scaling Instances (Port 8000)         │
  ├─────────────────────────────────────────────────────┤
  │ Private DB Subnet (10.0.100.0/24) [AZ-a]            │
  │  └── Amazon RDS PostgreSQL (Port 5432)              │
  ├─────────────────────────────────────────────────────┤
  │ Private DB Subnet (10.0.200.0/24) [AZ-b]            │
  │  └── RDS Subnet Group Secondary                     │
  └─────────────────────────────────────────────────────┘
```

### Step 1: Virtual Private Cloud (VPC) & Networking Setup
1. Create a VPC named `ecoroute-vpc` with IPv4 CIDR block `10.0.0.0/16`.
2. Create subnets across two Availability Zones (`us-east-1a` and `us-east-1b`):
   - `public-subnet-1a` (`10.0.1.0/24`) & `public-subnet-1b` (`10.0.2.0/24`).
   - `private-app-1a` (`10.0.10.0/24`) & `private-app-1b` (`10.0.20.0/24`).
   - `private-db-1a` (`10.0.100.0/24`) & `private-db-1b` (`10.0.200.0/24`).
3. Attach an Internet Gateway (`ecoroute-igw`) to `ecoroute-vpc`.
4. Configure public route table routing `0.0.0.0/0` to `ecoroute-igw`. Associate with public subnets.

### Step 2: Storage & Database Configuration
1. **Amazon S3:**
   - Create bucket `ecoroute-waste-photos-<unique-id>`.
   - Enable SSE-S3 encryption. Block public access. Enable CORS for frontend asset origin.
2. **Amazon RDS PostgreSQL:**
   - Create a DB Subnet Group containing `private-db-1a` and `private-db-1b`.
   - Provision an Amazon RDS for PostgreSQL instance (`db.t3.micro`, 20 GB GP2 storage).
   - In the database Security Group, allow inbound TCP port 5432 strictly from the App Security Group (`sg-ecoroute-app`).

### Step 3: IAM Role & Security Groups
1. Create IAM Role `EcoRoute-EC2-Role` with policies:
   - `AmazonS3FullAccess` (or restricted least-privilege bucket policy).
   - `CloudWatchAgentServerPolicy`.
2. Configure Security Groups:
   - `sg-ecoroute-alb`: Allow inbound TCP 80/443 from `0.0.0.0/0`.
   - `sg-ecoroute-app`: Allow inbound TCP 8000 only from `sg-ecoroute-alb`. Egress allowed to 0.0.0.0/0 for package downloads / S3 API calls.
   - `sg-ecoroute-db`: Allow inbound TCP 5432 only from `sg-ecoroute-app`.

### Step 4: EC2 Launch Template & User Data
Create an EC2 Launch Template `ecoroute-launch-template`:
- AMI: Ubuntu Server 22.04 LTS (HVM), SSD Volume Type.
- Instance Type: `t3.micro`.
- IAM Instance Profile: `EcoRoute-EC2-Role`.
- Security Group: `sg-ecoroute-app`.
- **User Data Script:**
  ```bash
  #!/bin/bash
  set -e
  apt-get update -y
  apt-get install -y python3-pip python3-venv git nginx awscli

  # Setup App Directory
  mkdir -p /opt/ecoroute
  cd /opt/ecoroute

  # Pull Project Code
  git clone https://github.com/YourRepo/ecoroute-ai.git .
  python3 -m venv venv
  source venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt

  # Inject Environment Variables
  cat << 'EOF' > /opt/ecoroute/.env
  DATABASE_URL=postgresql://postgres:YourSecurePassword@your-rds-endpoint.amazonaws.com:5432/ecoroutedb
  S3_BUCKET_NAME=ecoroute-waste-photos-bucket
  AWS_REGION=us-east-1
  EOF

  # Create Systemd Service for FastAPI
  cat << 'EOF' > /etc/systemd/system/ecoroute.service
  [Unit]
  Description=EcoRoute AI FastAPI Service
  After=network.target

  [Service]
  User=ubuntu
  WorkingDirectory=/opt/ecoroute
  ExecStart=/opt/ecoroute/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
  Restart=always

  [Install]
  WantedBy=multi-user.target
  EOF

  systemctl daemon-reload
  systemctl enable ecoroute.service
  systemctl start ecoroute.service
  ```

### Step 5: Target Group & Application Load Balancer
1. Create a Target Group `ecoroute-tg` (Target Type: Instance, Protocol: HTTP, Port: 8000).
   - Health check path: `/health`.
   - Healthy threshold: 2, Unhealthy threshold: 3, Interval: 15s.
2. Create an Internet-facing Application Load Balancer `ecoroute-alb` across the two public subnets.
3. Attach listener on HTTP port 80 routing traffic to `ecoroute-tg`.

---

## 26. Auto Scaling Configuration and Demonstration

### Auto Scaling Group (ASG) Setup
- **Name:** `ecoroute-asg`.
- **Launch Template:** `ecoroute-launch-template` (Version: Latest).
- **VPC Subnets:** Attached to `public-subnet-1a` and `public-subnet-1b` (or private app subnets if NAT is configured).
- **Load Balancing:** Attached to existing Target Group `ecoroute-tg`.
- **Capacity Sizing:**
  - Minimum Capacity: 1 instance.
  - Desired Capacity: 1 instance.
  - Maximum Capacity: 4 instances.
- **Scaling Policy:** Target Tracking Scaling Policy.
  - Metric type: `ASGAverageCPUUtilization`.
  - Target value: `60.0%`.
  - Warm-up period: `120 seconds`.

```
                    Target Tracking: Average CPU > 60%
                    
  1 Instance        Load Spike (>60% CPU)        2-4 Instances
  ┌──────────┐     ───────────────────────>     ┌──────────┐ ┌──────────┐
  │  EC2 #1  │                                  │  EC2 #1  │ │  EC2 #2  │
  └──────────┘     <───────────────────────     └──────────┘ └──────────┘
                    Load Subsides (<60% CPU)
```

### Load Testing and Scaling Demonstration Procedure
To empirically demonstrate elasticity without incurring excessive cloud costs:
1. Connect to an active EC2 instance via SSH or SSM Session Manager, or run from a local development machine.
2. Execute a synthetic load generation script using standard Linux tools (e.g., `stress-ng` or an HTTP benchmarking tool like `wrk` / Apache Benchmark `ab`):
   ```bash
   # Synthetic CPU load simulation directly on the EC2 host:
   sudo apt-get install -y stress-ng
   stress-ng --cpu 2 --timeout 300s --metrics-brief

   # Alternatively, generate HTTP concurrent load via Apache Benchmark against ALB:
   ab -n 50000 -c 100 http://ecoroute-alb-XXXXXXXXX.us-east-1.elb.amazonaws.com/health
   ```
3. Observe CloudWatch Metrics:
   - Notice CPUUtilization climbing past 60%.
   - Observe CloudWatch Alarm transitioning from `OK` to `ALARM`.
   - Verify in the EC2 Console that the Auto Scaling Group initiates a Scale-Out event, launching `EC2 Instance #2`.
   - Once load ceases and cool-down timer elapses, observe the Scale-In policy terminating redundant instances back to desired capacity 1.

---

## 27. CloudWatch Monitoring and Alarm Configuration

### Core Monitored Metrics
1. **ALB Metrics:**
   - `TargetResponseTime`: Latency of backend responses.
   - `HTTPCode_Target_5XX_Count`: Count of internal server errors.
   - `RequestCount`: Volume of HTTP requests processed.
2. **EC2 Metrics:**
   - `CPUUtilization`: Percentage of allocated compute utilized.
   - `NetworkIn` / `NetworkOut`: Throughput across interfaces.
   - `StatusCheckFailed`: Physical host or instance-level impairments.
3. **RDS Metrics:**
   - `CPUUtilization`: Database processor utilization.
   - `FreeStorageSpace`: Remaining relational disk storage.
   - `DatabaseConnections`: Number of active client database sessions.

### Alarm & Alert Configuration

| Alarm Name | Metric Evaluated | Threshold Condition | Evaluation Period | Action Triggered |
| :--- | :--- | :--- | :--- | :--- |
| `ecoroute-high-cpu-alarm` | `AWS/EC2 CPUUtilization` | $\ge 75\%$ for 2 consecutive periods | 1 Minute | Trigger ASG Scale-Out + Send SNS email to Admin |
| `ecoroute-alb-5xx-alarm` | `AWS/ApplicationELB HTTPCode_Target_5XX_Count` | $\ge 5$ errors | 1 Minute | Send high-priority SNS alert to dev/ops email |
| `ecoroute-rds-storage-alarm`| `AWS/RDS FreeStorageSpace` | $\le 5$ GB remaining | 5 Minutes | Send SNS alert to prevent database read-only lock |

### Custom CloudWatch Dashboard Setup
A consolidated CloudWatch Dashboard (`EcoRoute-Operational-Dashboard`) is constructed displaying:
- Widget 1 (Line Graph): ALB Request Count vs. Target Response Latency.
- Widget 2 (Stacked Area): EC2 Auto Scaling Group Average CPU Utilization across all active instances.
- Widget 3 (Number Display): Total complaint submissions processed per hour.
- Widget 4 (Log Stream): Tail of `/aws/ec2/ecoroute-backend` error logs via CloudWatch Logs Agent.

---

## 28. Security and Cost Management

### Security Best Practices
- **Network Isolation:** Multi-tier subnetting prevents direct internet routability to the database layer.
- **Least Privilege IAM Roles:** EC2 instances assume an IAM role granting access strictly to the project S3 bucket and CloudWatch namespaces; no hardcoded AWS Secret Keys exist in code repositories.
- **Controlled Ingestion:** FastAPI validates file MIME types (only `image/jpeg` and `image/png`) and restricts file size ($\le 5$ MB) to thwart denial-of-service attempts.
- **Secure Configuration Management:** Sensitive database credentials and secret keys are injected at runtime through environment variables rather than source control.
- **Controlled Object Access:** S3 bucket permissions remain strictly private; photos are rendered to authorized dashboards using short-lived S3 Pre-signed URLs or via a reverse proxy endpoint.

### Cloud Cost Management & Academic Budget Controls
- **AWS Free Tier Maximization:** Use `t3.micro` EC2 instances (750 hours/month free under AWS Free Tier) and `db.t3.micro` RDS (750 hours/month free).
- **AWS Budgets Configuration:** An automated AWS Budget is set with a threshold of **$10.00 USD**, configured to deliver email notifications at 50%, 80%, and 100% budget consumption.
- **Scheduled Teardown / Resource Deprovisioning:** To prevent unexpected billing after academic evaluation and project demonstrations:
  1. Set ASG Desired and Minimum capacity to 0.
  2. Terminate the RDS database instance (taking a final snapshot if necessary).
  3. Delete the Application Load Balancer.
  4. Empty and delete the S3 bucket.

---

## 29. Implementation Roadmap

```
Week 1: Foundations & UI Design
├── Day 1-2: System requirements, schema specification, UI wireframes
└── Day 3-5: React citizen portal, Leaflet map setup, mockup API

Week 2: Backend Services & Data Layer
├── Day 6-7: FastAPI REST endpoints, Pydantic data schemas
└── Day 8-10: PostgreSQL integration, S3 client implementation, photo upload flow

Week 3: AI Classification & Optimization Engine
├── Day 11-12: MobileNetV2 transfer learning setup, category inference endpoint
└── Day 13-15: Google OR-Tools TSP route solver, priority scoring formula implementation

Week 4: AWS Infrastructure & Cloud Deployment
├── Day 16-17: VPC, subnets, route tables, RDS provisioning, S3 bucket setup
└── Day 18-20: EC2 launch template, user-data automation, ALB setup, ASG configuration

Week 5: Monitoring, Load Testing & Academic Evaluation
├── Day 21-22: CloudWatch dashboard, metric alarms, and SNS notifications
├── Day 23-24: Stress testing with Apache Benchmark, auto-scaling demonstration, AI evaluation
└── Day 25: Documentation compilation, demonstration rehearsal, and final submission
```

---

## 30. Testing and Evaluation Methodology

### 1. Functional Verification Matrix

| Test ID | Module | Test Scenario | Expected Outcome | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-F01` | Citizen Portal | Submit valid report with JPG photo & GPS | 201 Created, tracking ID returned, image stored in S3 | `[Pending Implementation]` |
| `TC-F02` | Citizen Portal | Submit report with invalid file format (.exe/.pdf) | 400 Bad Request, descriptive error message | `[Pending Implementation]` |
| `TC-F03` | AI Classifier | Upload clear photo of overflowing dumpster | Predicted: `overflowing_bin`, Confidence $\ge 0.75$ | `[Pending Implementation]` |
| `TC-F04` | AI Classifier | User overrides AI prediction to `mixed_waste` | `is_user_overridden=True`, category updated in DB | `[Pending Implementation]` |
| `TC-F05` | Priority Engine | Compare 2-hour complaint vs 48-hour complaint | Older complaint receives higher $T_{\text{norm}}$ score | `[Pending Implementation]` |
| `TC-F06` | Route Optimizer| Run optimization on 10 scattered coordinates | Returned sequence has lower distance than baseline | `[Pending Implementation]` |
| `TC-F07` | Admin Portal | Mark complaint as "RESOLVED" | Status updated, removed from active dispatch list | `[Pending Implementation]` |

### 2. AI Model Evaluation Matrix
Evaluated on a held-out test split of annotated waste images across all 4 target classes:

| Class Label | Test Samples | Accuracy (%) | Precision | Recall | F1-Score |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `overflowing_bin` | `[To be recorded]` | `[To be measured]` | `[To be measured]` | `[To be measured]` | `[To be measured]` |
| `mixed_waste` | `[To be recorded]` | `[To be measured]` | `[To be measured]` | `[To be measured]` | `[To be measured]` |
| `recyclable_waste` | `[To be recorded]` | `[To be measured]` | `[To be measured]` | `[To be measured]` | `[To be measured]` |
| `other` | `[To be recorded]` | `[To be measured]` | `[To be measured]` | `[To be measured]` | `[To be measured]` |
| **Overall Macro Avg** | `[To be recorded]` | `[To be measured]` | `[To be measured]` | `[To be measured]` | `[To be measured]` |

### 3. Route Optimization Performance Comparison
Evaluated across varying numbers of assigned collection waypoints (starting from Municipal Depot):

| Waypoint Count ($N$) | Baseline Distance (km) | Optimized Distance (km) | Distance Reduction (%) | Solver Compute Time (ms) |
| :--- | :--- | :--- | :--- | :--- |
| **5 Locations** | `[To be measured]` | `[To be measured]` | `[To be calculated]` | `[To be measured]` |
| **10 Locations** | `[To be measured]` | `[To be measured]` | `[To be calculated]` | `[To be measured]` |
| **15 Locations** | `[To be measured]` | `[To be measured]` | `[To be calculated]` | `[To be measured]` |
| **25 Locations** | `[To be measured]` | `[To be measured]` | `[To be calculated]` | `[To be measured]` |

$$\text{Route reduction (\%)} = \left(\frac{\text{Baseline distance} - \text{Optimized distance}}{\text{Baseline distance}}\right) \times 100$$

### 4. Cloud Elasticity & Performance Load Test
Evaluated using Apache Benchmark (`ab`) or `k6` simulating concurrent HTTP traffic directed at the Application Load Balancer endpoint:

| Test Phase | Concurrent Users | Total Requests | Throughput (Req/Sec) | Error Rate (%) | p95 Latency (ms) | Active EC2 Instances | ASG Action Observed |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline (Idle)** | 1 | 500 | `[To record]` | 0.0% | `[To record]` | 1 | Steady State |
| **Moderate Surge** | 25 | 5,000 | `[To record]` | `[To record]` | `[To record]` | 1 $\rightarrow$ 2 | Target Tracking Alarm |
| **Peak Surge** | 100 | 25,000 | `[To record]` | `[To record]` | `[To record]` | 2 $\rightarrow$ 4 | Maximum Capacity Reached |
| **Cooldown Phase** | 0 | 0 | 0.0 | 0.0% | - | 4 $\rightarrow$ 1 | Scale-In Termination |

---

## 31. Expected Outcomes
Upon successful project execution, the expected deliverables and outcomes will encompass:
1. **Functional Prototype:** An accessible web portal allowing real-time citizen reporting and administrative triage.
2. **AI Visual Assistance:** An integrated inference service providing automatic waste categorization and confidence scoring.
3. **Measurable Logistics Efficiency:** An algorithmic route optimizer generating demonstrable distance savings compared to arbitrary pickup sequences.
4. **Demonstrable Cloud Architecture:** A live multi-AZ deployment on AWS demonstrating traffic distribution via ALB, automatic scaling under stress, decoupled database/object storage, and centralized CloudWatch logging.
5. **Academic Competence:** Demonstrated mastery of cloud systems architecture, capacity planning, security best practices, and operational monitoring suitable for academic engineering review.

---

## 32. Limitations
- **Prototype Scale:** The application is evaluated using synthetic stress testing and simulated complaint coordinates rather than city-wide live citizen deployments.
- **Distance Matrix Approximations:** Distance calculations rely on the Haversine formula (straight-line spherical geometry) rather than turn-by-turn road network topologies with dynamic traffic congestion delays.
- **Compute Constraints on Free Tier:** Model training and inference are constrained to CPU-based execution on `t3.micro` instances, limiting real-time concurrent computer vision throughput to moderate request rates.
- **Network Dependency:** Citizens require active mobile internet connectivity and GPS browser permissions to submit reports.

---

## 33. Future Enhancements
1. **IoT Sensor Integration:** Integrating LoRaWAN or NB-IoT ultrasonic fill-level sensors into public dumpsters for autonomous, telemetry-driven complaint generation.
2. **Capacitated Vehicle Routing (CVRP):** Expanding the OR-Tools optimization model to incorporate truck volumetric capacities, driver shift time windows, and multi-vehicle fleets.
3. **Native Mobile App with Edge Inference:** Exporting the MobileNetV2 model to TensorFlow Lite or ONNX Runtime to execute inference locally on the citizen's mobile device prior to upload.
4. **AWS Serverless Refactoring:** Exploring migration of the backend API tier to AWS Lambda and Amazon API Gateway to achieve granular scale-to-zero compute economics.
5. **Citizen Gamification:** Rewarding verified citizen reports with civic reward points to encourage sustained community participation.

---

## 34. SDG 11 Alignment

### Primary Target: SDG 11.6
> *"By 2030, reduce the adverse per capita environmental impact of cities, including by paying special attention to air quality and municipal and other waste management."*

EcoRoute AI directly targets the operational bottlenecks of municipal waste collection:
- **Reduces Waste Overflow Duration:** Dynamic prioritization ensures overflowing bins are identified and remediated before garbage spills into streets, drains, and water bodies.
- **Reduces Municipal Carbon Emissions:** Algorithmic route optimization with Google OR-Tools significantly reduces total kilometers traveled by municipal collection trucks, lowering fuel consumption and vehicle exhaust emissions ($CO_2, NO_x$, particulate matter).
- **Measurement Metrics for Future Citywide Impact:** To validate real-world SDG 11.6 impact in a full-scale deployment, municipalities would monitor:
  1. Average turnaround time from complaint submission to resolution (hours).
  2. Total fuel consumption (liters/month) of the municipal collection fleet.
  3. Metric tons of uncollected solid waste per municipal ward.

### Secondary Target: SDG 11.3
> *"By 2030, enhance inclusive and sustainable urbanization and capacity for participatory, integrated and sustainable human settlement planning and management in all countries."*

- **Citizen Co-Management:** The platform fosters participatory governance by empowering residents to act as real-time environmental monitors, bridging the transparency gap between urban communities and civic authorities.

*Note on Academic Scope:* As an academic prototype, EcoRoute AI demonstrates technological feasibility and logistical efficiency; it does not claim to have already achieved citywide environmental remediation in a live metropolitan area.

---

## 35. Conclusion
EcoRoute AI establishes a comprehensive, feasible, and academically rigorous blueprint for modernizing municipal solid waste management through cloud computing and applied artificial intelligence. By decoupling compute from storage, leveraging elastic auto-scaling on Amazon EC2, distributing network traffic through an Application Load Balancer, and persisting data securely across Amazon RDS and Amazon S3, the project satisfies the demanding architectural requirements of the ABA for Cloud curriculum.

Furthermore, integrating computer vision classification via MobileNetV2 and combinatorial route optimization via Google OR-Tools demonstrates how modern software engineering techniques solve tangible urban sustainability challenges aligned with UN Sustainable Development Goal 11. The modular architecture, clear testing protocols, and cost-controlled deployment strategy ensure that the project is completely achievable, scalable, and verifiable.

---

## 36. References
1. Amazon Web Services, "AWS Well-Architected Framework: Reliability Pillar," AWS Whitepapers, Oct. 2022. [Online]. Available: https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/
2. Amazon Web Services, "Elastic Load Balancing and Amazon EC2 Auto Scaling Best Practices," AWS Architecture Center, 2023. [Online]. Available: https://aws.amazon.com/autoscaling/
3. M. Sandler, A. Howard, M. Zhu, A. Zhmoginov, and L.-C. Chen, "MobileNetV2: Inverted Residuals and Linear Bottlenecks," in *Proc. IEEE/CVF Conf. Comput. Vis. Pattern Recognit. (CVPR)*, 2018, pp. 4510–4520.
4. L. Perron and V. Furnon, "OR-Tools," Google Developers, 2023. [Online]. Available: https://developers.google.com/optimization
5. S. Gupta, P. Sharma, and R. Kumar, "Deep Learning Techniques for Automated Municipal Solid Waste Segregation: A Comprehensive Review," *Journal of Cleaner Production*, vol. 293, p. 126234, 2021.
6. A. Al-Masri, M. Al-Ghamdi, and S. Al-Malki, "A Cloud-Based IoT Platform for Smart Municipal Waste Management," *IEEE Access*, vol. 8, pp. 195432–195444, 2020.
7. United Nations, "Sustainable Development Goal 11: Make cities and human settlements inclusive, safe, resilient and sustainable," UN Department of Economic and Social Affairs, 2023. [Online]. Available: https://sdgs.un.org/goals/goal11
8. FastAPI Documentation, "FastAPI framework, high performance, easy to learn, fast to code, ready for production," Tiangolo, 2023. [Online]. Available: https://fastapi.tiangolo.com/
